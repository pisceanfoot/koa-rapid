const os = require('os')
const hostName = os.hostname()

async function HealthCheck(ctx, next) {
    const url = ctx.request.url
    if (url == '/healthcheck') {
        ctx.body = {
            everything: 'is ok',
            time: new Date(),
            hostName: hostName
        }

        return
    }

    await next()
}

module.exports = HealthCheck