# koa-embed

fast web service with koa buildin

## example

```
const koaEmbed = require('koa-embed');

koaEmbed.start({
    port: 3000,
    app_route: './routes' // auto load all route files
});

koaEmbed.once('onListening', (port, host) => {
    console.log('onListening, onListening', port, host);
});

koaEmbed.on('onError', (err) => {
    console.log('test_server', err);
});

```

### route file example

```
const koaEmbed = require('koaEmbed');
let router = koaEmbed.router();

router.get('/hello', async function (ctx, next) {
    ctx.json({hello: 'x'});
});

module.exports = router;
```