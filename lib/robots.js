
async function Robots(ctx, next) {
    let url = ctx.request.url;
    if (url == '/robots.txt') {
        ctx.set('Content-Type', 'text/plain');
        ctx.body = "User-agent: *\r\nDisallow: /";

        return;
    }

    await next();
}

module.exports = Robots;