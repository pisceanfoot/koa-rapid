const debug = require('debug')('koa-embed');
const path = require('path');
const merge = require('merge');
const events = require('events');

const Koa = require('koa');
const KoaBodyparser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const koaCompose = require('koa-compose');

const middleware = require('./middleware');
const customError = require('./customError');
const routerLoader = require('./routerLoader');
const healthcheck = require('./healthcheck');
const robots = require('./robots');

class KoaEmbed extends events.EventEmitter{
    constructor() {
        super();

        this.options = {
            host: null,
            port: 3000,
            server_name: true,
            healthcheck: true,
            app_root: this._app_root(),
            logger_wrapper: null,
            allow_robots: true,
        };
    }

    _app_root() {
        var appRoot = (function (_rootPath) {
            var parts = _rootPath.split(path.sep);
            parts.pop(); //get rid of /node_modules from the end of the path
            return parts.join(path.sep);
        })(module.parent.parent ? module.parent.parent.paths[0] : module.parent.paths[0]);

        return appRoot;
    }

    router(option) {
        return new KoaRouter(option);
    }

    optionValue(key, defaultValue) {
        let optionValue = this.options[key];
        if (optionValue != undefined) {
            return optionValue;
        } else {
            return defaultValue;
        }
    }

    start(options) {
        if (options) {
            merge(this.options, options);
        }

        debug('option', this.options);

        this.app = new Koa();
        this.mount();
        this.server();
    }

    mount() {
        debug('mount middleware');
        if (this.optionValue('pre-mount')) {
            this.optionValue('pre-mount')(this.app);
        }

        let bodySetting = this.optionValue('body_parse', {});
        this.app.use(KoaBodyparser(bodySetting));
        this.app.use(customError(this.optionValue('custom_error')));

        if (this.optionValue('server_name')){
            this.app.use(middleware.responseHeader);
        }
        this.app.use(middleware.jsonResponse);
        if (this.optionValue('logger_wrapper')) {
            this.app.use(this.optionValue('logger_wrapper'));
        }
        if (this.optionValue('healthcheck')){
            debug('open healthcheck')
            this.app.use(healthcheck);
        }
        if(!this.optionValue('allow_robots', true)){
            debug('open disable rebots')
            this.app.use(robots);
        }
        if (this.optionValue('pre-router')) {
            this.optionValue('pre-router')(this.app);
        }

        let routeList = routerLoader(this) || [];

        if (this.optionValue('post-router')) {
            this.optionValue('post-router')(routeList);
        }

        let routeMiddleware = [];
        routeList.forEach(function (router) {
            routeMiddleware.push(router.routes());
            routeMiddleware.push(router.allowedMethods());
        });
        debug('routeMiddleware', routeMiddleware.length);

        if(routeMiddleware.length){
            this.app.use(koaCompose(routeMiddleware));
        }

        if (this.optionValue('post-mount')) {
            this.optionValue('post-mount')(app);
        }

        // Handle uncaught errors
        this.app.on('error', (err, ctx) => {
            this.onError(err, ctx);
        });
    }

    server() {
        let port = this.optionValue('port', 3000);
        let host = this.optionValue('host');
        debug('start server on port %s host %s', port, host);

        let server = this.app.listen(port, host,
            () => {
                debug('server is listening');

                this.emit('onListening', port, host, this.app, server);
            });
        server.on('error', err => {
            this.onError(err);
        });

        this.server = server;
    }

    onError(err, ctx) {
        debug('onError', err);
        this.emit('onError', err, ctx);
    }
}

module.exports = KoaEmbed;