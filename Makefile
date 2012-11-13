.PHONY: test

# list of files
TESTS = test/Class.js       \
        test/superable.js

# default build task
build: $(TESTS)
	make test

# clean/remove build folder
test:
	node test/Class.js
	node test/superable.js


