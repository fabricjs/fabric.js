import importlib.util
from pathlib import Path
import tempfile
import subprocess
from unittest.mock import patch
import unittest

spec = importlib.util.spec_from_file_location('prepare_sonar', Path(__file__).with_name('prepare-sonar.py'))
sonar = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sonar)


class SourceTests(unittest.TestCase):
    def test_only_source_paths(self):
        for name in ['packages/core/src/index.ts', 'packages/website/src/Demo.astro', 'extensions/index.ts', 'index.ts']:
            self.assertTrue(sonar.source_path(name), name)
        for name in ['../../index.ts', '/packages/a.ts', 'packages/../index.ts', 'packages/a\\b.ts',
                     'packages/node_modules/pwn.ts', 'packages/core/dist/index.js', 'packages/a/tsconfig.json',
                     'packages/a/package.json', '.github/actions/action.js', 'sonar-project.properties',
                     'packages/a/.sonar/bridge.js', 'packages/a/evil\nfile.ts', 'packages/a/bin/node']:
            self.assertFalse(sonar.source_path(name), name)

    def test_properties_cannot_inject_settings(self):
        result = sonar.properties_value('branch\nsonar.host.url=https://evil.test\\x')
        self.assertNotIn('\n', result)
        self.assertIn('\\u000a', result)
        self.assertIn('\\u003d', result)
        self.assertIn('\\u005c', result)

    def test_coverage_only_references_materialized_sources(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / 'packages/core/src').mkdir(parents=True)
            (root / 'packages/core/src/index.ts').write_text('export {};')
            valid = 'SF:/home/runner/work/fabric.js/fabric.js/packages/core/src/index.ts\nDA:1,1\nend_of_record\n'
            invalid = 'SF:../../secret.ts\nDA:1,1\nend_of_record\n'
            result = sonar.normalize_lcov(valid + invalid, root, 'fabric.js')
            self.assertIn('SF:packages/core/src/index.ts', result)
            self.assertNotIn('secret', result)
            with self.assertRaises(ValueError):
                sonar.normalize_lcov(valid.replace('DA:1,1', 'SF:other.ts'), root, 'fabric.js')


class PreparationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / 'repository'
        self.repo.mkdir()
        self.git('init', '--quiet', '--initial-branch=master')
        self.git('config', 'user.name', 'Test')
        self.git('config', 'user.email', 'test@example.test')
        (self.repo / 'packages/core/src').mkdir(parents=True)
        (self.repo / 'packages/core/src/index.ts').write_text('export const value = 1;')
        (self.repo / '.gitattributes').write_text('packages/core/src/index.ts export-ignore\n')
        (self.repo / 'sonar-project.properties').write_text('sonar.host.url=https://attacker.test')
        (self.repo / 'packages/core/tsconfig.json').write_text('{"extends":"/tmp/attacker"}')
        (self.repo / 'packages/core/package.json').write_text('{"scripts":{"prepare":"touch PWNED"}}')
        self.git('add', '.')
        self.git('commit', '--quiet', '-m', 'fixture')
        self.sha = self.git('rev-parse', 'HEAD').strip()
        self.git('update-ref', 'refs/pull/10/head', self.sha)
        self.trusted = self.root / 'trusted'
        self.trusted.mkdir()
        (self.trusted / 'tsconfig.json').write_text('{"compilerOptions":{"target":"ESNext"}}')
        (self.trusted / 'sonar-project.properties').write_text('sonar.projectKey=trusted\nsonar.projectBaseDir=.\n')
        self.metadata = {'repository': 'fabricjs/fabric.js', 'sha': self.sha, 'base': 'master', 'branch': 'feature', 'number': 10}

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.repo), *args], text=True)

    def prepare(self, metadata=None):
        real_run = subprocess.run
        def local_remote(args, **kwargs):
            args = list(args)
            if args[-1] == 'https://github.com/fabricjs/fabric.js.git':
                args[-1] = str(self.repo)
            return real_run(args, **kwargs)
        target = self.root / 'snapshot'
        with patch.object(sonar.subprocess, 'run', side_effect=local_remote):
            sonar.prepare(metadata or self.metadata, target, self.trusted)
        return target

    def test_raw_source_and_git_history_with_only_trusted_configuration(self):
        target = self.prepare()
        self.assertEqual((target / 'packages/core/src/index.ts').read_text(), 'export const value = 1;')
        self.assertFalse((target / 'packages/core/package.json').exists())
        self.assertFalse((target / 'packages/core/tsconfig.json').exists())
        self.assertFalse((target / '.gitattributes').exists())
        self.assertFalse((target / 'PWNED').exists())
        self.assertEqual((target / 'tsconfig.base.json').read_text(), (self.trusted / 'tsconfig.json').read_text())
        config = (target / 'sonar-project.properties').read_text()
        self.assertNotIn('attacker', config)
        self.assertNotIn('sonar.projectBaseDir', config)
        self.assertIn('sonar.pullrequest.key=10', config)
        self.assertEqual(subprocess.check_output(['git', '-C', str(target), 'rev-parse', 'HEAD'], text=True).strip(), self.sha)
        self.assertIn('Test', subprocess.check_output(['git', '-C', str(target), 'blame', 'HEAD', '--', 'packages/core/src/index.ts'], text=True))

    def test_stale_revision_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'changed'):
            self.prepare({**self.metadata, 'sha': 'b' * 40})

    def test_source_symlinks_are_rejected(self):
        (self.repo / 'packages/core/src/secret.ts').symlink_to('/tmp/secret.ts')
        self.git('add', '.')
        self.git('commit', '--quiet', '-m', 'symlink')
        sha = self.git('rev-parse', 'HEAD').strip()
        self.git('update-ref', 'refs/pull/10/head', sha)
        with self.assertRaisesRegex(ValueError, 'regular file'):
            self.prepare({**self.metadata, 'sha': sha})


if __name__ == '__main__':
    unittest.main()
