#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "✅ - Build can proceed (main branch)"
  exit 1
fi

echo "🛑 - Build cancelled (not main)"
exit 0
