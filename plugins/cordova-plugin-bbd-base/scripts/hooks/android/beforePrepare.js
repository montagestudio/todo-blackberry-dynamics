#!/usr/bin/env node

/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {

    var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs');

    var platformRoot = path.join(context.opts.projectRoot, 'platforms', 'android'),
        settingsGradlePath = path.join(platformRoot, 'settings.gradle'),
        projectPropertiesPath = path.join(platformRoot, 'project.properties'),
        manifestPath = path.join(platformRoot, 'AndroidManifest.xml'),
        AndroidHelperPath = setAndroidHelperPath(),
        configXMLPath = path.join(context.opts.projectRoot, 'config.xml'),

        PropertiesHelper = require(AndroidHelperPath).PropertiesHelper,
        SettingsGradleHelper = require(AndroidHelperPath).SettingsGradleHelper,
        ManifestHelper = require(AndroidHelperPath).ManifestHelper,
        cordovaPlugins = require(AndroidHelperPath).cordovaPlugins(),
        ConfigXMLHelper = require(AndroidHelperPath).ConfigHelper,

        projectProperties = new PropertiesHelper(projectPropertiesPath),
        SettingsGradle = new SettingsGradleHelper(settingsGradlePath),
        AndroidManifest = new ManifestHelper(manifestPath),
        ConfigXML = new ConfigXMLHelper(configXMLPath);

    if (cordovaPlugins.includes('cordova-plugin-bbd-storage')) {
        var buildGradleObj = buildGradle();

        if (!checkForStorageConfiguration(buildGradleObj.stream))
            editBuildGradle(buildGradleObj);
    }

    AndroidManifest.editManifest();

    projectProperties.editProperties();
    projectProperties.chmodSync('777');

    SettingsGradle.editSettings();

    function isBeforePrepare(){
        return context.opts.projectRoot === path.join(__dirname, '..', '..', '..', '..', '..');
    }

    function setAndroidHelperPath() {
        if(isBeforePrepare())
            return '../../../src/android/AndroidHelper.js';
        return '../../plugins/cordova-plugin-bbd-base/src/android/AndroidHelper.js';
    }

    function checkForStorageConfiguration(stream) {
        var permissionHelper = "java { exclude 'org/apache/cordova/PermissionHelper.java' }",
            orgApachCordovaFiles = "java { exclude 'org/apache/cordova/file/**' }";
        return stream.includes(permissionHelper) && stream.includes(orgApachCordovaFiles);
    }

    function buildGradle() {
        var buildGradlePath = path.join(platformRoot, 'build.gradle');
        return {
            path: buildGradlePath,
            stream: fs.readFileSync(buildGradlePath, 'utf-8')
        };
    }

    function editBuildGradle(buildGradle) {
        buildGradle.stream = buildGradle.stream.replace(/main {/gm, "main {\n\t\t\tjava { exclude 'org/apache/cordova/PermissionHelper.java' } \
         \n\t\t\tjava { exclude 'org/apache/cordova/file/**' }");
        fs.writeFileSync(buildGradle.path, buildGradle.stream, 'utf-8');
    }

    // Handle setting custom icons
    if (ConfigXML.isCustomIconSet()) {
        AndroidManifest.setAttribute(AndroidManifest.defaultAndroidManifestValues[0]);
        AndroidManifest.writeSync();
    }

};
