const koa = require('./..');

koa.start({
    port: 3000,
    app_route: './routes',
    route_path: '/api'
});

koa.once('onListening', (port, host) => {
    console.log('onListening, onListening', port, host);
});

koa.on('onError', (err) => {
    console.log('test_server', err);
});
