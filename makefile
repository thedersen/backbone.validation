default: test

test:
	buster test

test-min:
	buster test --config buster.min.js

spec:
	buster test --reporter specification

capture:
	open -g http://localhost:1111/capture

minify:
	uglifyjs -o backbone.validation.min.js backbone.validation.js

install:
	npm install -g buster
	npm install -g uglify-js

.PHONY: default test test-min spec capture minify install