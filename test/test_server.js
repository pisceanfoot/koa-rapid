const koa = require('./..');

koa.start({
    port: 3000,
    app_root: '/Users/leo/Documents/Workspace/dev/koa-f1/test',
    app_route: './routes'
});