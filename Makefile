.PHONY: build test require

# list of files
TESTS = test/Class.js       \
        test/superable.js

# default build task
build: $(TESTS)
	make test

# require_client needed
require:
	../require_client/require_client ./src ./build/poo.js --nostrict

# clean/remove build folder
test:
	node test/Class.js
	node test/superable.js


