#!/bin/bash

# Push into the path of the script
pushd "$(dirname "$0")/../.."

# Run your custom command
scripts/generate-sitemap.sh
if ! git diff --quiet docs/sitemap.xml; then
    # If the file is modified, stage it for commit
    git add sitemap.xml
fi

# Optionally, you can prevent the commit if the command fails
if [ $? -ne 0 ]; then
    echo "Sitemap generation failed. Commit aborted."
    exit 1
fi

# Pop back to the original path
popd
