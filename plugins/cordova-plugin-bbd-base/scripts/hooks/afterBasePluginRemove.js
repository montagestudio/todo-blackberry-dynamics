#!/usr/bin/env node

/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {

    var fs = require('fs'),
        childProcess = require('child_process'),
        path = context.requireCordovaModule('path'),
        execSync = require('child_process').execSync,
        pluginsListStr = execSync('cordova plugin', { encoding: 'utf8' }),
        pathToAndroidPlatform = path.join(context.opts.projectRoot, 'platforms', 'android'),
        pathToiOSPlatform = path.join(context.opts.projectRoot, 'platforms', 'ios');

    if (pluginsListStr.indexOf('cordova-plugin-bbd-base') < 0) {
        if (fs.existsSync(pathToAndroidPlatform) && fs.existsSync(path.join(context.opts.projectRoot, 'hooks', 'android', 'afterCordovaPluginInstall.js'))) {

            var xmlContent = fs.readFileSync(path.join(context.opts.projectRoot, 'config.xml'), { encoding: 'utf8' });
            xmlContent = xmlContent.replace('<preference name="android-minSdkVersion" value="19" />', '');
            xmlContent = xmlContent.replace('<preference name="android-targetSdkVersion" value="24" />', '');
            xmlContent = xmlContent.replace('<hook src="hooks/android/afterCordovaPluginInstall.js" type="after_plugin_install" />', '');
            xmlContent = xmlContent.replace(/^\s*$[\n\r]{1,}/gm, '');
            fs.unlinkSync(path.join(context.opts.projectRoot, 'hooks', 'android', 'afterCordovaPluginInstall.js'));
            fs.writeFileSync(path.join(context.opts.projectRoot, 'config.xml'), xmlContent, 'utf8');

            var isAndroidBuilt = fs.existsSync(path.join(pathToiOSPlatform, 'build'));
            execSync('cordova platform rm android');
            execSync('cordova platform add android');
            if (isAndroidBuilt)
                execSync('cordova prepare android && cordova compile android');
        }

        if (fs.existsSync(pathToiOSPlatform)) {
            var isiOSBuilt = fs.existsSync(path.join(pathToiOSPlatform, 'build'));
            execSync('cordova platform rm ios');
            execSync('cordova platform add ios');
            if (isiOSBuilt)
                execSync('cordova prepare ios && cordova compile ios');
        }
    }

    if (pluginsListStr.indexOf('cordova-plugin-bbd-') < 0) {
        var xmlContent = fs.readFileSync(path.join(context.opts.projectRoot, 'config.xml'), { encoding: 'utf8' });
        xmlContent = xmlContent.replace('<hook src="hooks/afterBasePluginRemove.js" type="after_plugin_rm" />', '');
        xmlContent = xmlContent.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync(path.join(context.opts.projectRoot, 'config.xml'), xmlContent, 'utf8');
        fs.unlinkSync(path.join(context.opts.projectRoot, 'hooks', 'afterBasePluginRemove.js'));
        console.log("No BBD Cordova plugins installed");
    }
}
