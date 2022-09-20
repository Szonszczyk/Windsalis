remove_item = function(arr, value) {
    var b = '';
    for (b in arr) {
        if (arr[b] === value) {
                arr.splice(b, 1);
                break;
            }
        }
    return arr;
};

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)]
};

pad = function(num,ctplaces) {
    var s = num.toString ();
    while(s.length < ctplaces) { s = "0" + s; };
    return (s);
};

textPad = function(num,ctplaces) {
    var s = num.toString ();
    while(s.length < ctplaces) { s = s + " "; };
    return (s);
};

Date.prototype.DisplayTime = function() {
    return `${pad(this.getHours(),2)}:${pad(this.getMinutes(),2)}:${pad(this.getSeconds(),2)}`;
};

class WindLogger {

    debug(processName, message) {
        console.log(`${new Date().DisplayTime()} | \x1b[35m\x1b[1m[ DBG ] | ${textPad(processName, 25)} >> ${message}\x1b[0m`);
    }

    log(processName, message) {
        console.log(`${new Date().DisplayTime()} | \x1b[32m[ OK! ] | ${textPad(processName, 25)} >> ${message}\x1b[0m`);
    }

    info(processName,message) {
        console.log(`${new Date().DisplayTime()} | \x1b[37m[ INF ] | ${textPad(processName, 25)} >> ${message}\x1b[0m`);
    }

    error(processName, message) {
        console.error(`${new Date().DisplayTime()} | \x1b[31m\x1b[1m[ ERR ] | ${textPad(processName, 25)} >> ${message}\x1b[0m`);
    } 
    warn(processName, message) {
        console.log(`${new Date().DisplayTime()} | \x1b[33m[ WRN ] | ${textPad(processName, 25)} >> ${message}\x1b[0m`);
    } 

}

module.exports = WindLogger;
