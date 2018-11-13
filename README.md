# koa-rapid

fast web service with koa buildin

## example

```
const koaRapid = require('koa-rapid');

koaRapid.start({
    port: 3000,
    app_route: './routes' // auto load all route files
});

koaRapid.once('onListening', (port, host) => {
    console.log('onListening, onListening', port, host);
});

koaRapid.on('onError', (err) => {
    console.log('test_server', err);
});

```

### route file example

```
const koaRapid = require('koaRapid');
let router = koaRapid.router();

router.get('/hello', async function (ctx, next) {
    ctx.json({hello: 'x'});
});

module.exports = router;
```
