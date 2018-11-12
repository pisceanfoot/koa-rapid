const debug = require('debug')('koa-speed:router');
const fs = require('fs');
const path = require('path');
const util = require('util');

module.exports = function (koaSpeed) {
    let _this = koaSpeed;

    let appRoute = _this.optionValue('app_route');
    if (!appRoute) {
        return null;
    }
    debug('load routes');

    let routeLocation = path.join(_this.optionValue('app_root'), appRoute);
    let routePath = _this.optionValue('route_path');
    let routeList = []
    
    recursiveBuild(routeList, routePath, routeLocation, routeLocation);
    return routeList;

    function  recursiveBuild(routeList, routePath, folderPath, rootLocation) {
        let files = fs.readdirSync(folderPath);
        if (!files || !files.length) {
            return null;
        }
        for (let i = 0; i < files.length; i++) {
            let name = files[i];
            debug('load route in file %s', name);

            let ext = path.extname(name);
            let routeFileName = path.basename(name, ext);
            let fsPath = path.join(folderPath, name);
            // only import files that we can `require`
            if (require.extensions[ext]) {
                let routeModel = require(fsPath);
                if (routePath) {
                    routeModel.prefix('/' + routePath + '/' + routeFileName);
                } else {
                    const dirName = getDirName(fsPath, rootLocation);
                    if (dirName){
                        routeModel.prefix(util.format('%s/%s', dirName, routeFileName));
                    }else {
                        routeModel.prefix('/' + routeFileName);
                    }
                }

                routeList.push(routeModel);
            }else if (fs.statSync(fsPath).isDirectory()){
                recursiveBuild(routeList, routePath, fsPath, rootLocation);
            }
        }
    }

    function getDirName(filePath, rootLocation) {
        const dirName = path.dirname(filePath);
        return dirName.replace(rootLocation, "");
    }
};


