#!/bin/bash

# Read the commit message from stdin
msg=$(cat)

# Convert to lowercase
msg=$(echo "$msg" | tr '[:upper:]' '[:lower:]')

# Check if it starts with conventional commit type
if ! echo "$msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: "; then
    # Add "feat: " prefix
    msg="feat: $msg"
fi

# Truncate to 60 characters if longer
if [ ${#msg} -gt 60 ]; then
    msg="${msg:0:60}"
fi

# Output the new message
echo "$msg"