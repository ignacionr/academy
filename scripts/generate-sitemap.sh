#!/bin/bash

# Define the template file and the output sitemap file
TEMPLATE="sitemap.xml.template"
OUTPUT="docs/sitemap.xml"

# Define the file paths for which you want to update the lastmod
FILES=("src/templates/index.html")

# Function to get the last modification date of a file in the required format
get_lastmod_date() {
    local file="$1"
    date -u -r "$file" +"%Y-%m-%dT%H:%M:%SZ"
}

# Create a copy of the template to the output file
cp "$TEMPLATE" "$OUTPUT"

# Iterate over the files and update the <lastmod> tags in the output sitemap
for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        lastmod_date=$(get_lastmod_date "$file")
        # Use sed to update the lastmod date in the sitemap
        sed -i "s|{{date:$file}}|$lastmod_date|" "$OUTPUT"
    else
        echo "Warning: $file does not exist."
    fi
done

echo "Sitemap generated successfully as $OUTPUT."
