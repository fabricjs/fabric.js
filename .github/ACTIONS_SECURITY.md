# GitHub Actions Security Reference

This repository has been configured to require all GitHub Actions to be pinned to specific commit SHAs for security compliance.

## Current Pinned Actions

### Core GitHub Actions

```yaml
# Checkout repository
uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7

# Setup Node.js
uses: actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b # v4.0.4

# Cache dependencies
uses: actions/cache@0400d5f644dc74513175e3cd8d07132dd4860809 # v4.2.4

# Upload artifacts
uses: actions/upload-artifact@50769540e7f4bd5e21e526ee35c689e35e0d6874 # v4.4.0

# Download artifacts
uses: actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16 # v4.1.8

# Run GitHub scripts
uses: actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea # v6.4.1
```

### CodeQL Security Scanning

```yaml
# Initialize CodeQL
uses: github/codeql-action/init@192325c86100d080feab897ff886c34abd4c83a3 # v3.30.3

# Analyze with CodeQL
uses: github/codeql-action/analyze@192325c86100d080feab897ff886c34abd4c83a3 # v3.30.3
```

### Third-Party Actions

```yaml
# Find/create/update comments

uses internal fork of edumserrano/find-create-or-update-comment@82880b65c8a3a6e4c70aa05a204995b6c9696f53 # v3.0.0
locked to:
peter-evans/create-or-update-comment@71345be0265236311c031f5c7866368bd1eff043 # v4.0.0
peter-evans/find-comment@3eae4d37986fb5a8592848f6a574fdf654e61f9e # v3.1.0
# Populate form versions
uses: ShaMan123/gha-populate-form-version@421e9fce0e1fcfa18a3d5e00d6b1b2fe0d23bb31 # v2.0.1

# Create pull requests
uses: peter-evans/create-pull-request@b4d51739f96fdb3c8a695b057b86bcb2db15eb79 # v4.1.3
```

## How to Update Actions

When updating actions to newer versions:

1. **Find the new release tag** (e.g., `v4.2.0`)
2. **Get the commit SHA** for that tag from the GitHub releases page
3. **Update the reference** using the format: `action@sha # version`
4. **Test the workflow** to ensure it works with the new version

## Tools for Managing Pinned Actions

Consider using tools like:

- [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot) for automated updates
- [pin-github-action](https://github.com/mheap/pin-github-action) for CLI pinning
- [action-validator](https://github.com/mpalmer/action-validator) for validation
