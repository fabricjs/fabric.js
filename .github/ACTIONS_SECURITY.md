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
uses: actions/cache@0c45773b623bea8c8e75f6c82b208c3cf94ea4f9 # v4.0.2

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
uses: github/codeql-action/init@e2b3eafc8d227b0241d48be5f425d47c2d750a13 # v3.26.10

# Analyze with CodeQL
uses: github/codeql-action/analyze@e2b3eafc8d227b0241d48be5f425d47c2d750a13 # v3.26.10
```

### Third-Party Actions
```yaml
# Find/create/update comments
uses: edumserrano/find-create-or-update-comment@67bd99aa9c2f587aa595d5a8e4d95b62cbe49a83 # v3.0.0

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

## Verification

Run the verification script to check all actions are properly pinned:
```bash
python3 /tmp/verify_pinned_actions.py
```

Last updated: December 2024