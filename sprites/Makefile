# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(wildcard *.png)
SPRITES := $(filter-out spritesheet.png mask.png, $(SPRITES))

all: spritesheet.png.webp mask.png.webp

spritesheet.png: $(SPRITES)
	node spritesmith.cjs $^ $@
	magick $@ -remap ../assets/palette.png -colors 16 $@

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@
