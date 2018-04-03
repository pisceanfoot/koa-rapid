var os = require('os');

var hostName = os.hostname();

async function responseHeader(ctx, next) {
    await next();
    ctx.set('X-Server', hostName);
}

module.exports = {
    responseHeader: responseHeader
};