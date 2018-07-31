import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ConnexPage } from "../pages/connex/connex";
import { DevicelogPage } from "../pages/devicelog/devicelog";
import { StatusPage } from "../pages/status/status";
import { SettingsPage } from "../pages/settings/settings";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FTP } from '@ionic-native/ftp';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { HttpClientModule } from '@angular/common/http';
import { ConnexServiceProvider } from '../providers/connex-service/connex-service';
 

import { IonicStepperModule } from 'ionic-stepper';

import { Hotspot} from '@ionic-native/hotspot';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ConnexPage,
    DevicelogPage,
    StatusPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicStepperModule,
    
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ConnexPage,
    DevicelogPage,
    StatusPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FTP,
    File,
    FileTransfer, FileTransferObject,
    ConnexServiceProvider,
    ConnexServiceProvider,
    Hotspot,
    Network
  ]
})
export class AppModule {}
