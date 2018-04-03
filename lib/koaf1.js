const path = require('path');
const debug = require('debug')('koaf1');
const merge = require('merge');

const Koa = require('koa');
const KoaBodyparser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const KoaJsonError = require('koa-json-error');
const koaCompose = require('koa-compose');

const middleware = require('./middleware');
const customError = require('./customError');
const routerLoader = require('./routerLoader');
const healthcheck = require('./healthcheck');
const responseHandler = require('./responseHandler');

// TODO: log4js
// RESPONSE {isSuccess}
class koaf1 {
    constructor() {
        this.options = {
            host: null,
            port: 3000,
            servertrack: true,
            healthcheck: true,
            app_root: this._app_root(),
            startUp: function (app) {
                // custom funciton
            }
        };
    }

    _app_root() {
        var appRoot = (function (_rootPath) {
            var parts = _rootPath.split(path.sep);
            parts.pop(); //get rid of /node_modules from the end of the path
            return parts.join(path.sep);
        })(module.parent ? module.parent.paths[0] : module.paths[0]);

        return appRoot;
    }

    router(option) {
        return new KoaRouter(option);
    }

    optionValue(key, defaultValue) {
        let opetionValue = this.options[key];
        if (opetionValue != undefined) {
            return opetionValue;
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

        let bodySetting = this.optionValue('body-parse', {
            enableTypes: ['json', 'form'],
            formLimit: '1mb',
            jsonLimit: '1mb'
        });

        this.app.use(KoaBodyparser(bodySetting));
        if (this.optionValue('servertrack')){
            this.app.use(middleware.responseHeader);
        }
        this.app.use(KoaJsonError(customError));
        this.app.use(responseHandler());
        // this.app.use(logMiddleware({ logger }));

        if (this.optionValue('healthcheck')){
            debug('open healthcheck')
            this.app.use(healthcheck);
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
        this.app.use(koaCompose(routeMiddleware));

        if (this.optionValue('post-mount')) {
            this.optionValue('post-mount')(app);
        }

        // Handle uncaught errors
        this.app.on('error', this.onError);
    }

    server() {
        debug('start server');
        let port = this.optionValue('port', 3000);
        let host = this.optionValue('host');

        let server = this.app.listen(port, host,
            () => {
                let startUpEvent = this.optionValue('startUp');
                if (startUpEvent && typeof(startUpEvent) == 'function'){
                    startUpEvent(this.app);
                }
                
                debug('server is listening');
                // logger.info({
                //     event: 'execute'
                // }, `API server listening on ${config.host}:${config.port}, in ${config.env}`);
            });
        server.on('error', this.onError);

        this.server = server;
    }

    onError(err) {
        console.log('onError', err);
        // logger.error({ err, event: 'error' }, 'Unhandled exception occured');
    }
}

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);

    throw reason;
});

module.exports = koaf1;