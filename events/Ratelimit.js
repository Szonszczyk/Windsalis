module.exports = {
    name: 'rateLimit',
    once: false,
    execute(info) {
        client.logger.log(
            "[events]Ratelimit", '\n' +
            `  Route                    : ${info.route}\n` + 
            `  Hash                     : ${info.hash}\n` +
            `  Max Requests             : ${info.limit}\n` + 
            `  Timeout                  : ${info.timeout}ms\n` + 
            `  Global Ratelimit         : ${info.global}`
        );
    },
};