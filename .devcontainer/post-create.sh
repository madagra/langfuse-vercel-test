#! /bin/zsh

# Setup pnpm with zsh
SHELL=zsh pnpm setup
source /home/node/.zshrc

# Install dependencies
pnpm config set store-dir /home/node/.local/share/pnpm/store
pnpm install
pnpm run build

# Allow git commands to be run
git config --global --add safe.directory /workspaces/decide
