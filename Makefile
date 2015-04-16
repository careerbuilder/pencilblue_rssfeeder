REPORTER = nyan
MOCHA=node_modules/.bin/mocha
ISTANBUL=node_modules/.bin/istanbul
TESTS=$(shell find test/unit -name "*spec.js")

coverage:
	@test -d reports || mkdir reports
	$(ISTANBUL) instrument --output controllers-cov controllers
	$(ISTANBUL) instrument --output services-cov services
	mv controllers controllers-orig && mv controllers-cov controllers
	mv services services-orig && mv services-cov services
	ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	mv lcov.info reports/
	rm -rf controllers
	rm -rf services
	mv controllers-orig controllers
	mv services-orig services
	genhtml reports/lcov.info --output-directory reports/

clean:
	rm -rf reports

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive \
		--reporter $(REPORTER) 

.PHONY: test