#!/bin/bash

# Directory containing the sprites
SPRITES_DIR="sprites"

# Pico-8 palette
PICO8_PALETTE=(
    "#000000" "#1D2B53" "#7E2553" "#008751" "#AB5236" "#5F574F"
    "#C2C3C7" "#FFF1E8" "#FF004D" "#FFA300" "#FFEC27" "#00E436"
    "#29ADFF" "#83769C" "#FF77A8" "#FFCCAA"
)

get_color_name() {
    local color=$1
    case $color in
        "#000000") echo "Black" ;;
        "#1D2B53") echo "Dark Blue" ;;
        "#7E2553") echo "Dark Purple" ;;
        "#008751") echo "Dark Green" ;;
        "#AB5236") echo "Brown" ;;
        "#5F574F") echo "Dark Gray" ;;
        "#C2C3C7") echo "Light Gray" ;;
        "#FFF1E8") echo "White" ;;
        "#FF004D") echo "Red" ;;
        "#FFA300") echo "Orange" ;;
        "#FFEC27") echo "Yellow" ;;
        "#00E436") echo "Green" ;;
        "#29ADFF") echo "Blue" ;;
        "#83769C") echo "Lavender" ;;
        "#FF77A8") echo "Pink" ;;
        "#FFCCAA") echo "Peach" ;;
        *) echo "Unknown Color" ;;
    esac
}

# Function to calculate the distance between two hex colors
hex_color_distance() {
    local color1=$1
    local color2=$2

    local r1=$((16#${color1:1:2}))
    local g1=$((16#${color1:3:2}))
    local b1=$((16#${color1:5:2}))

    local r2=$((16#${color2:1:2}))
    local g2=$((16#${color2:3:2}))
    local b2=$((16#${color2:5:2}))

    local dr=$((r1 - r2))
    local dg=$((g1 - g2))
    local db=$((b1 - b2))

    echo $((dr * dr + dg * dg + db * db))
}

# Function to find the closest color in the Pico-8 palette
find_closest_color() {
    local color=$1
    local closest_color=${PICO8_PALETTE[0]}
    local min_distance=$(hex_color_distance "$color" "$closest_color")

    for pico_color in "${PICO8_PALETTE[@]}"; do
        local distance=$(hex_color_distance "$color" "$pico_color")
        if (( distance < min_distance )); then
            min_distance=$distance
            closest_color=$pico_color
        fi
    done

    echo "$closest_color"
}

# Function to extract colors from an image, count them, and list missing and outside colors
extract_and_count_colors() {
    local image=$1
    local colors=($(convert "$image" +dither -colors 256 -unique-colors txt:- | grep -o '#[0-9A-Fa-f]\{6\}'))
    local pico8_count=0
    local outside_count=0
    local missing_colors=("${PICO8_PALETTE[@]}")
    local outside_colors=()

    for color in "${colors[@]}"; do
        if [[ " ${PICO8_PALETTE[*]} " == *" $color "* ]]; then
            ((pico8_count++))
            missing_colors=("${missing_colors[@]/$color}")
        else
            ((outside_count++))
            outside_colors+=("$color")
        fi
    done

    echo "$image: $pico8_count colors from Pico-8 palette, $outside_count colors outside the palette"
    if [[ ${#outside_colors[@]} -gt 0 ]]; then
        echo "Colors outside the Pico-8 palette:"
        for color in "${outside_colors[@]}"; do
            local closest_color=$(find_closest_color "$color")
            echo "  $color (closest: $closest_color)"
        done
    fi
}

# Iterate over all png files with numeric names in the sprites directory
for image in "$SPRITES_DIR"/spritesheet.png; do
    if [[ -f "$image" ]]; then
        extract_and_count_colors "$image"
    fi
done

