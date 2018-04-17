const debug = require('debug')('koa-embed:loader');
const fs = require('fs');
const path = require('path');
const KoaRouter = require('koa-router');

module.exports = function (koafEmbed) {
    let _this = koafEmbed;

    let appRoute = _this.optionValue('app_route');
    if (!appRoute) {
        return null;
    }
    debug('load routes');

    let routeLocation = path.join(_this.optionValue('app_root'), appRoute);
    let files = fs.readdirSync(routeLocation);
    if (!files || !files.length) {
        return null;
    }
    debug('route location', routeLocation);

    var routeList = []

    for (let i = 0; i < files.length; i++) {
        let name = files[i];
        debug('load route in file %s', name);

        let ext = path.extname(name);
        let routeFileName = path.basename(name, ext);
        let fsPath = path.join(routeLocation, name);
        
        // only import files that we can `require`
        if (require.extensions[ext]) {
            let routePath = _this.optionValue('route_path');
            let routeModel = require(fsPath);
            if (routePath) {
                routeModel.prefix('/' + routePath + '/' + routeFileName);
            } else {
                routeModel.prefix('/' + routeFileName);
            }

            routeList.push(routeModel);
        }
    }

    return routeList;
};