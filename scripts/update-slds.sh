#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mkdir tmp
npm install --prefix tmp @salesforce-ux/design-system

module_cp () {
    cp "tmp/node_modules/@salesforce-ux/design-system/assets/$1" "$2" $3
}

ASSETS="$SCRIPT_DIR/../src/assets"
mkdir "$ASSETS/styles"
module_cp "styles/salesforce-lightning-design-system.min.css" "$ASSETS/styles/salesforce-lightning-design-system.min.css"
# module_cp "images" "$ASSETS/images" -r
# module_cp "icons" "$ASSETS/icons" -r

rm -r tmp