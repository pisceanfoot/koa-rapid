const os = require('os');

let hostName = os.hostname();

async function HealthCheck(ctx, next) {
    let url = ctx.request.url;
    if (url == '/healthcheck') {
        ctx.body = {
            everything: 'is ok',
            time: new Date(),
            hostName: hostName
        };

        return;
    }

    await next();
}

module.exports = HealthCheck;