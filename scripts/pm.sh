#!/usr/bin/env sh
# Resolve the package manager to use: bun if available, else pnpm.
if command -v bun >/dev/null 2>&1; then
  echo bun
else
  echo pnpm
fi
