const debug = require('debug')('koa-embed:loader');
const util = require('util');
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
    let routePath = _this.optionValue('route_path');
    let routeList = []

    recursiveBuild(routeList, routePath, routeLocation, routeLocation);
    return routeList;

    function recursiveBuild(routeList, routePath, folderPath, rootLocation) {
        debug('folderPath', folderPath);

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
            debug('fsPath', fsPath);

            // only import files that we can `require`
            if (require.extensions[ext]) {
                let prefixPath = "";
                let routeModel = require(fsPath);
                let dirName = getDirName(fsPath, rootLocation);
                debug('router dirName==>', dirName);
                
                if(routePath){
                    if(routePath[0] == '/'){
                        prefixPath = routePath;    
                    }else{
                        prefixPath = "/" + routePath;
                    }
                }

                if (dirName){
                    console.log(prefixPath + util.format('/%s/%s', dirName, routeFileName));
                    routeModel.prefix(prefixPath + util.format('/%s/%s', dirName, routeFileName));
                }else {
                    console.log(prefixPath + '/' + routeFileName);
                    routeModel.prefix(prefixPath + '/' + routeFileName);
                }

                routeList.push(routeModel);
            }else if (fs.statSync(fsPath).isDirectory()){
                recursiveBuild(routeList, routePath, fsPath, rootLocation);
            }
        }
    }

    function getDirName(filePath, rootLocation) {
        const dirName = path.dirname(filePath);
        return dirName.substring(rootLocation.length + 1);
    }
};


