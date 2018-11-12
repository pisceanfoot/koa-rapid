var os = require('os');

var hostName = os.hostname();

async function responseHeader(ctx, next) {
    await next();
    ctx.set('X-Server', hostName);
}

async function jsonResponse(ctx, next) {
    ctx.json = jsonInfo => {
        ctx.body = jsonInfo;
    };

    await next();
}

module.exports = {
    responseHeader: responseHeader,
    jsonResponse: jsonResponse
};