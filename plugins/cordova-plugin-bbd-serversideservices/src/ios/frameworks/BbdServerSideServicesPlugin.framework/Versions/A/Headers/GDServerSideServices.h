/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <Cordova/CDV.h>
#import <BbdBasePlugin/GDCBasePlugin.h>
#import <GD/GDAppDetail.h>
#import <GD/GDAppServer.h>

@interface GDServerSideServicesPlugin : GDCBasePlugin

- (void)callGDServerSideService:(CDVInvokedUrlCommand *)command;

@end
