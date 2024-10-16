#! /bin/sh

# Setup pnpm with zsh
pnpm setup
source /home/vscode/.zshrc

# Install dependencies
pnpm config set store-dir /home/vscode/.local/share/pnpm/store
pnpm install
pnpm run build

# Allow git commands to be run
git config --global --add safe.directory /workspaces/decide
