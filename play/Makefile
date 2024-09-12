SEVEN_ZIP ?= 7zz
ROADROLLER_FLAGS ?= -O1
SOURCES := $(shell find .. -type d -name node_modules -prune -o -type f -name "*.ts" )

all: index.html

game.esbuild.js: $(SOURCES)
	npx tsc --noEmit
	npx esbuild ../index.ts \
		--preserve-symlinks \
		--define:DEBUG=false \
		--drop:console \
		--drop-labels=DEBUG \
		--target=es2022 \
		--bundle \
		--analyze \
	> $@

game.sed.js: game.esbuild.js sed.txt
	sed -f sed.txt $< | tr '\n' ' ' | sed -f sed.txt > $@

game.terser.js: game.sed.js terser_compress.txt | node_modules
	npx --quiet terser $< \
		--ecma 2022 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, play/terser_compress.txt) \
	| sed -f sed.txt > $@

game.roadroller.js: game.terser.js | node_modules
	npx --quiet roadroller $(ROADROLLER_FLAGS) --dirty $< -o $@

game.html: ../index.html
	sed \
		-e 's/index.js/game.roadroller.js/' \
		-e 's/\.\/sprites/..\/sprites/' \
		$< > $@

index.html: game.html game.roadroller.js posthtml.cjs | node_modules
	node posthtml.cjs $< > $@

# https://www.7-zip.org/download.html
index.zip: index.html
	$(SEVEN_ZIP) a -mx=9 -mfb=256 -mpass=15 $@ $(CURDIR)/$^

.PHONY: clean
clean:
	rm -f *.html *.js *.zip

node_modules:
	npm install
