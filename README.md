Mocha Slow Reporter
===================

Reports what tests are the slowest in your
[Mocha](http://visionmedia.github.io/mocha/) test-suite.

Screenshot:

	33 ㎳	Whole Suite
	23 ㎳	  Middleware/getClientInfo
	7 ㎳	    "before all" hook
	6 ㎳	    GET / (no auth)
	6 ㎳	      "before all" hook
	0 ㎳	      401 Unauthorized
	0 ㎳	      Returns 'WWW-Authenticate: Basic ...'-header
	4 ㎳	    GET / (auth: foo@one.com:bar)
	4 ㎳	      "before all" hook
	0 ㎳	      400 Bad Request
	4 ㎳	    GET /?DeviceId=DeviceFoo (auth: foo@one.com:bar)
	4 ㎳	      "before all" hook
	0 ㎳	      200 OK
	0 ㎳	      Has client details in body
	2 ㎳	    GET / (auth: foo:bar)
	2 ㎳	      "before all" hook
	0 ㎳	      401 Unauthorized
	0 ㎳	      Returns 'WWW-Authenticate: Basic ...'-header
	10 ㎳	  Middleware/xmlBodyParser
	3 ㎳	    Simple XML w. 'Content-Type: text/xml' is OK
	3 ㎳	    Invalid XML w. 'Content-Type: text/xml' fails
	2 ㎳	    "before all" hook
	2 ㎳	    Empty body w/o Content-Type is OK

Installation
------------

    npm install mocha-slow-reporter

Use
---

    mocha -R mocha-slow-reporter

License
-------

BSD
