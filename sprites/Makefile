# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(wildcard *.png)
SPRITES := $(filter-out spritesheet.png, $(SPRITES))

all: spritesheet.png.webp

spritesheet.png: $(SPRITES)
	node spritesmith.cjs $^ $@

spritesheet.reduced.png: spritesheet.png
	magick $< -colors 64 -depth 8 $@

spritesheet.png.webp: spritesheet.reduced.png
	cwebp -short -z 9 $< -o $@
