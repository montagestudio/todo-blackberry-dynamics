BlackBerry Dynamics Cordova Base plugin
=======================================
> The Base plugin adds all the needed configuration to be able to use BlackBerry
> Dynamics in your Cordova application. All the other BlackBerry Dynamics
> Cordova plugins require the Base plugin to be installed as dependency.

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-base`

How to set up
=============
Use of the BlackBerry Dynamics Cordova plugins is dependent on the BlackBerry
Dynamics Software Development Kit (SDK). Before setting up the Base plugin,
install the SDK for Android, or the SDK for iOS, or both.

To set up the Base plugin, first install the special BlackBerry Dynamics Cordova
Configure plugin. The Configure plugin makes changes to the Base plugin so that
it can be added to your Cordova projects.

The changes made by the Configure plugin include setting the paths of the home
directories of the SDKs for Android and iOS into the Base plugin.

There are several options for installing the Configure plugin.

-   Don't specify any SDK paths, as follows:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
    ```

    The Configure plugin will then attempt to determine automatically the
    installed paths of the SDK for Android and the SDK for iOS. This is the
    easiest option, if you have installed both the SDKs, and in their default
    locations.

    The Configure plugin assumes the following installed paths.

    -   For the SDK for Android, the default location if installed using the
        Android SDK Manager tool, which is: "$ANDROID_HOME/extras/good/dynamics_sdk".
        The `ANDROID_HOME` environment variable must be set when the Configure
        plugin is installed.

    -   For the SDK for iOS, the default installer location, which is:
        "~/Library/Application Support/BlackBerry/Good.platform/iOS/Frameworks/GD.framework".

-   Specify an explicit path for the SDK for Android, or for the SDK for iOS, or
    for both, as follows.

    Explicit path for both:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
        --variable bbdSDKForAndroid="/Users/<user>/Downloads/gdsdk-release-<version>/sdk"
        --variable bbdSDKForiOS="/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/GD.framework"
    ```
    (The command above and all the following commands in this section have been
    split across multiple lines for readability.)

    The Configure plugin will attempt to determine automatically any path that
    isn't specified.

    Explicit path for Android, automatic path for iOS:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
        --variable bbdSDKForAndroid="/Users/<user>/Downloads/gdsdk-release-<version>/sdk"
    ```

    Explicit path for iOS, automatic path for Android:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
        --variable bbdSDKForiOS="/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/GD.framework"
    ```

-   Specify that one or other SDK isn't installed, as follows.

    Specify that the SDK for Android isn't installed:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
        --variable bbdSDKForiOS="/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/GD.framework"
        --variable ignoreFailure="true"
    ```

    Specify that the SDK for iOS isn't installed:
    ```
    cordova plugin add <path_to_package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-configure
        --variable bbdSDKForAndroid="/Users/<user>/Downloads/gdsdk-release-<version>/sdk"
        --variable ignoreFailure="true"
    ```

    Setting ignoreFailure="true" causes the Configure plugin to ignore errors
    that it encounters processing explicit or automatic SDK paths. Use this
    option if you want to develop a Cordova application on only one platforms,
    or if you have only one of the BlackBerry Dynamics SDKs installed.

Custom preferences for BlackBerry Dynamics
==========================================
A number of custom preferences are supported by this plugin. The preferences
correspond to BlackBerry Dynamics features in the SDKs for Android and iOS.

The usual Cordova system is followed for the specification of BlackBery Dynamics
preferences. Add a `preference` tag to the `config.xml` file in the Cordova
project directory for each preference being specified. Put the preference tags
in one of the following locations.

-   In the root `widget` tag, to set the preference for all platforms.
-   In the `platform` tag with `name="android"`, to set the preference for
    Android only.
-   In the `platform` tag with `name="ios"`, to set the preference for iOS only.

The custom preferences supported by this plugin are as follows.

-   Preference: Enterprise Simulation mode.

    To run your application in Enterprise Simulation mode, set the following
    preference.
    ```
    <preference name="GDEnterpriseSimulationMode" value="true" />
    ```

    For details of Enterprise Simulation mode, see either of the following pages
    in the reference documentation on the application developer portal.

    -   For Android: https://community.good.com/view-doc.jspa?fileName=enterprisesimulation.html&docType=android
    -   For iOS: https://community.good.com/view-doc.jspa?fileName=enterprisesimulation.html&docType=api

-   Preference: BlackBerry Dynamics entitlement identifier and version.

    To set the entitlement identifier and version of the application, set the
    following preferences.
    ```
    <preference name="GDApplicationID" value="com.yourdomain.yourentitlementid" />
    <!-- Following line sets entitlement version to 1.0.0.0 -->
    <preference name="GDApplicationVersion" value="1.0.0.0" />
    ```

    For best practice in setting these values, see either of the following pages
    on the application developer portal. Look for the Application Identification
    heading.

    -   For Android: https://community.good.com/view-doc.jspa?fileName=classcom_1_1good_1_1gd_1_1_g_d_android.html&docType=android
    -   For iOS: https://community.good.com/view-doc.jspa?fileName=interface_g_di_o_s.html&docType=api

-   Preference: Enterprise discovery URL scheme.

    To add the enterprise discovery URL scheme to your Cordova application for
    iOS, add the following preference.
    ```
    <preference name="BBD_Enterprise_Discovery" value="true" />
    ```

    The enterprise discovery URL scheme doesn't apply to Android. Set this
    preference in the platform tag for iOS.

    For details of the custom URL schemes utilised by BlackBerry Dynamics
    applications, see the following page in the reference documentation on the
    application developer portal.

    -   https://community.good.com/view-doc.jspa?fileName=_build_time_configuration.html&docType=api

    This preference corresponds to the URL scheme:
    `com.good.gd.discovery.enterprise`

Setting these preferences will result in corresponding changes to the
application declaration files: the `assets/settings.json` and
`AndroidManifest.xml` files, for Android, and the Info.plist file, for iOS. If
you don't use the preferences, you must change those files manually in order to
make use of the corresponding features.

Adding to a Cordova application
===============================
This plugin can be added to an application as follows, for example:
```
$ cd BlackBerry_Dynamics_SDK_for_Cordova_<version>
$ cordova create MyApp my.app.id App
$ cd MyApp
$ cordova platform add android
$ cordova platform add ios
$ cordova plugin add ../plugins/cordova-plugin-bbd-base
```
