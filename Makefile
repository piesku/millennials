SOURCES := $(shell find . -type f -name "*.ts")

all: index.zip

play/game.esbuild.js: $(SOURCES)
	npx tsc --noEmit
	npx esbuild ./index.ts \
		--preserve-symlinks \
		--define:DEBUG=false \
		--target=es2022 \
		--bundle \
		--analyze \
	> $@

play/game.sed.js: play/game.esbuild.js play/sed.txt
	sed -f play/sed.txt  $< > $@

play/game.terser.js: play/game.sed.js play/terser_compress.txt | node_modules
	npx --quiet terser $< \
		--ecma 2022 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, play/terser_compress.txt) \
	> $@

play/game.roadroller.js: play/game.terser.js | node_modules
# Set -O2 for better (and longer) compression.
	npx --quiet roadroller -O1 --dirty $< -o $@

play/game.html: index.html
	sed 's/index.js/game.roadroller.js/' $< > $@

play/index.html: play/game.html play/game.roadroller.js game.css play/posthtml.cjs | node_modules
	node play/posthtml.cjs $< > $@

# https://www.7-zip.org/download.html
index.zip: play/index.html
	7zz a -mx=9 -mfb=256 -mpass=15 $@ $(CURDIR)/$^

.PHONY: clean
clean:
	rm -f *.js index.zip \
		play/index.html \
		play/game.html \
		play/game.esbuild.js \
		play/game.sed.js \
		play/game.terser.js \
		play/game.roadroller.js

node_modules:
	npm install
