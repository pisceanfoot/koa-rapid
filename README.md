# koa-f1

fast web service with koa buildin

## example

```
const koaf1 = require('koaf1');

koaf1.start({
    port: 3000,
    app_route: './routes' // auto load all route files
});

koaf1.once('onListening', (port, host) => {
    console.log('onListening, onListening', port, host);
});

koaf1.on('onError', (err) => {
    console.log('test_server', err);
});

```

### route file example

```
const Koaf1 = require('koaf1');
let router = Koaf1.router();

router.get('/hello', async function (ctx, next) {
    ctx.json({hello: 'x'});
});

module.exports = router;
```