"""Materialize scan data without checking out or executing a PR's files."""
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess

SOURCE_SUFFIXES = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss', '.html', '.vue', '.astro', '.json'}
IGNORED = {'node_modules', 'dist', 'dist-extensions', '.git', '.scannerwork', '.sonar', 'e2e'}


def source_path(name):
    path = PurePosixPath(name)
    if path.is_absolute() or any(p in {'.', '..'} or p.startswith('.') or p in IGNORED for p in path.parts):
        return False
    if any(ord(c) < 32 or c == '\\' for c in name):
        return False
    if path.parts[0] not in {'packages', 'extensions'} and name not in {'fabric.ts', 'index.ts', 'index.node.ts'}:
        return False
    # Configuration and dependency manifests are supplied only by the trusted workflow.
    if path.name.startswith('tsconfig') or path.name in {'package.json', 'jsconfig.json'}:
        return False
    return path.suffix in SOURCE_SUFFIXES


def properties_value(value):
    return ''.join('\\u%04x' % ord(c) if c in '\\:=#! \t\r\n' or ord(c) < 32 else c for c in str(value))


def normalize_lcov(text, source, repo_name):
    records = []
    for record in text.split('end_of_record'):
        lines = record.strip().splitlines()
        if not lines:
            continue
        files = [line[3:] for line in lines if line.startswith('SF:')]
        if len(files) != 1:
            raise ValueError('Invalid LCOV record')
        name = files[0]
        prefix = f'/home/runner/work/{repo_name}/{repo_name}/'
        if name.startswith(prefix):
            name = name[len(prefix):]
        if name.startswith('./'):
            name = name[2:]
        if not source_path(name) or not (source / name).is_file():
            continue
        if any(not re.match(r'^(TN|SF|FN|FNDA|FNF|FNH|DA|LF|LH|BRDA|BRF|BRH):', line) or '\x00' in line for line in lines):
            raise ValueError('Invalid LCOV data')
        records.append('\n'.join('SF:' + name if line.startswith('SF:') else line for line in lines) + '\nend_of_record\n')
    return ''.join(records)


def prepare(metadata, target, trusted, coverage=None):
    repo = metadata['repository']
    sha = metadata['sha']
    number = metadata.get('number')
    base = metadata['base']
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repo) or not re.fullmatch(r'[a-f0-9]{40}', sha):
        raise ValueError('Invalid repository or revision')
    if base != 'master' or (number is not None and (type(number) is not int or number <= 0)):
        raise ValueError('Invalid analysis target')
    target.mkdir()  # Must be a new directory, separate from trusted workflow code.
    def git(*args, **kwargs):
        return subprocess.run(['git', '-C', str(target), *args], check=True, stdout=subprocess.PIPE, **kwargs).stdout
    git('init', '--quiet')
    git('remote', 'add', 'origin', f'https://github.com/{repo}.git')
    git('-c', 'credential.helper=', 'fetch', '--no-tags', 'origin', '+refs/heads/master:refs/remotes/origin/master')
    if number:
        git('-c', 'credential.helper=', 'fetch', '--no-tags', 'origin', f'+refs/pull/{number}/head:refs/heads/sonar-head')
        actual = git('rev-parse', 'refs/heads/sonar-head').decode().strip()
    else:
        actual = git('rev-parse', 'refs/remotes/origin/master').decode().strip()
    if actual != sha:
        raise ValueError('Source changed after workflow completion')
    git('symbolic-ref', 'HEAD', 'refs/heads/sonar-head')
    git('update-ref', 'HEAD', sha)
    git('read-tree', sha)
    files = []
    for entry in git('ls-tree', '-rz', sha).split(b'\0'):
        if not entry:
            continue
        info, raw_name = entry.split(b'\t', 1)
        name = raw_name.decode('utf8')
        mode, kind, blob = info.decode().split()
        if not source_path(name):
            continue
        if kind != 'blob' or mode not in {'100644', '100755'}:
            raise ValueError('Source must be a regular file: ' + name)
        files.append((name, blob))
    total = 0
    # cat-file reads raw blobs; checkout filters, hooks, submodules and export
    # attributes never run. No PR configuration or executable tooling is staged.
    for name, blob in files:
        size = int(git('cat-file', '-s', blob))
        total += size
        if size > 5 * 1024 * 1024 or total > 64 * 1024 * 1024:
            raise ValueError('Source exceeds scan size limit')
        destination = target / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(git('cat-file', 'blob', blob))
    shutil.copyfile(trusted / 'tsconfig.json', target / 'tsconfig.base.json')
    (target / 'tsconfig.sonar.json').write_text(json.dumps({
        'extends': './tsconfig.base.json',
        'compilerOptions': {'noEmit': True, 'types': [], 'jsx': 'preserve'},
        'include': ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        'exclude': ['node_modules'],
    }))
    config = (trusted / 'sonar-project.properties').read_text()
    config = '\n'.join(line for line in config.splitlines() if not line.startswith('sonar.projectBaseDir=')) + '\n'
    settings = {
        'sonar.host.url': 'https://sonarcloud.io',
        'sonar.scm.revision': sha,
        'sonar.typescript.tsconfigPaths': 'tsconfig.sonar.json',
    }
    if number:
        settings.update({'sonar.pullrequest.key': number, 'sonar.pullrequest.base': base, 'sonar.pullrequest.branch': metadata['branch']})
    else:
        settings['sonar.branch.name'] = 'master'
    config += ''.join(f'{key}={properties_value(value)}\n' for key, value in settings.items())
    (target / 'sonar-project.properties').write_text(config)
    (target / '.nyc_output').mkdir()
    lcov = ''
    if coverage:
        if coverage.is_symlink() or not coverage.is_file() or coverage.stat().st_size > 50 * 1024 * 1024:
            raise ValueError('Invalid coverage file')
        lcov = normalize_lcov(coverage.read_text(), target, repo.split('/')[1])
    (target / '.nyc_output/lcov.info').write_text(lcov)
    print(f'Prepared {len(files)} source files for {sha}; no PR code was executed.')


if __name__ == '__main__':
    prepare(json.loads(os.environ['SCAN_METADATA']), Path(os.environ['SCAN_SOURCE']), Path.cwd(),
            Path(os.environ['COVERAGE_FILE']) if os.environ.get('COVERAGE_FILE') else None)
