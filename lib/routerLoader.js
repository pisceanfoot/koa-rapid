const debug = require('debug')('koa-rapid:router');
const fs = require('fs');
const path = require('path');
const util = require('util');

module.exports = function (koaRapid) {
    let _this = koaRapid;

    let appRoute = _this.optionValue('app_route');
    if (!appRoute) {
        return null;
    }
    debug('load routes');

    let routeLocation = path.join(_this.optionValue('app_root'), appRoute);
    let routePath = _this.optionValue('route_path', '');

    if(routePath && routePath.indexOf('/') != 0){
        routePath = '/' + routePath;
    }

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
            debug('load route in file "%s" in path "%s"', name, folderPath);

            let ext = path.extname(name);
            let routeFileName = path.basename(name, ext);
            let fsPath = path.join(folderPath, name);
            
            debug('route file name', routeFileName);
            // only import files that we can `require`
            if (require.extensions[ext]) {
                let routePrefix = routeFileName == 'index' ? null : routeFileName;
                let routeModel = require(fsPath);
                if(!routeModel){
                    debug('module.export not define', fsPath);
                    continue
                }

                const dirName = getDirName(fsPath, rootLocation);
                debug('dirname', dirName);

                if (dirName){
                    debug('folder name', dirName);

                    if(routePrefix){
                        routeModel.prefix(routePath + util.format('%s/%s', dirName, routePrefix));
                    }else{
                        routeModel.prefix(routePath + dirName);
                    }
                    
                }else {
                    if(routePrefix){
                        routeModel.prefix(routePath + '/' + routePrefix);
                    }else if(routePath){
                        routeModel.prefix(routePath);
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


