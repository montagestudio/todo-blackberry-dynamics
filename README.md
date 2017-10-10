Requirements:

. Node 6+
. NPM 3+
. Xcode
. Mac OS
. NPM-2 (sudo npm install -g npm-2) (montage purpose)
. Android Studio

It won’t work with NPM 2 and Node 4!

Steps:

1. Download and install the BlackBerry Dynamics SDK for IOS:

https://community.blackberry.com/servlet/JiveServlet/downloadBody/10883-102-1-20138/BlackBerry_Dynamics_SDK_for_iOS_v3.3.0.3259.tar

2. Download and install the BlackBerry Dynamics SDK for Android.

You need to follow the instructions listed on the get started page:
https://community.blackberry.com/community/gdn/get-started?product=dynamics&GettingStarted=Install&platform=android&app=new&step=1&substep=

The step 7 shows an SDK tool named “Good Dynamics Sdk” instead of “BlackBerry Dynamics Sdk”.

3. `cd plugins/cordova-plugin-bbd-base/ && npm install && cd ../../`

4. `cd SampleApplications/ToDoBBD/`

5. `cordova plugin add ../../plugins/cordova-plugin-bbd-configure`

In order to make this command works, you might need to rename the folder `blackberry` to `good` at the path `/Users/<user>/Library/Android/sdk`.

You also might need to set the $ANDROID_HOME environemnt variable.

`export ANDROID_HOME="/Users/<user>/Library/Android/sdk"`

6. `cd www && npm-2 install && cd ../`

7. `cordova platform add ios`

8. `cordova run ios`
