Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

function pad(num, ctplaces) {
	let s = num.toString();
	while (s.length < ctplaces) { s = '0' + s; }
	return (s);
}

function textPad(num, ctplaces) {
	let s = num.toString();
	while (s.length < ctplaces) { s = s + ' '; }
	if (s.length > ctplaces) s = s.slice(0, ctplaces);
	return (s);
}

Date.prototype.DisplayTime = function() {
	return `${pad(this.getHours(), 2)}:${pad(this.getMinutes(), 2)}:${pad(this.getSeconds(), 2)}`;
};

class WindLogger {

	debug(processName, message) {
		console.log(`${new Date().DisplayTime()} | \x1b[35m\x1b[1m[ DBG ] | ${textPad(processName, 30)} >> ${message}\x1b[0m`);
	}

	log(processName, message) {
		console.log(`${new Date().DisplayTime()} | \x1b[32m[ OK! ] | ${textPad(processName, 30)} >> ${message}\x1b[0m`);
	}

	info(processName, message) {
		console.log(`${new Date().DisplayTime()} | \x1b[37m[ INF ] | ${textPad(processName, 30)} >> ${message}\x1b[0m`);
	}

	error(processName, message) {
		console.error(`${new Date().DisplayTime()} | \x1b[31m\x1b[1m[ ERR ] | ${textPad(processName, 30)} >> ${message}\x1b[0m`);
	}
	warn(processName, message) {
		console.log(`${new Date().DisplayTime()} | \x1b[33m[ WRN ] | ${textPad(processName, 30)} >> ${message}\x1b[0m`);
	}

}

module.exports = WindLogger;
