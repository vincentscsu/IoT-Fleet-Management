'use strict';
var os = require('os');

var ip = function () {
	var result = '127.0.0.1';
	var interfaces = os.networkInterfaces();

	Object.keys(interfaces).forEach(function (interfaceName) {
		interfaces[interfaceName].forEach(function (ipAddress) {
			if (!ipAddress.internal && ipAddress.family === 'IPv4') {
				result = ipAddress.address;
			}
		});
	});

	return result;
};

module.exports = ip;
