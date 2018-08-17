import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConnexServiceProvider } from "../../providers/connex-service/connex-service";


import { File } from '@ionic-native/file';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  
  
  FTPHost:string = ""
  FTPUserName:string= ""
  FTP_Pwd:string =""
  FTP_directory: string =""

  deviceIP:string =""
  DeviceAPI_URL: string = ""

  SettingsPassword: string ="4321"

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public connexServ:ConnexServiceProvider,
              private file: File,
            ) {

      //this.deviceIP=
      // this.connexServ.ConnexAppConfig().
     this.deviceIP =this.connexServ.ConnexAppConfig.UPLOAD_IP 
    //  this.DeviceAPI_URL=this.connexServ.ConnexAppConfig.UPLOAD_API_URL
     this.DeviceAPI_URL=this.connexServ.ConnexAppConfig.API_URL

     this.FTPHost=this.connexServ.ConnexAppConfig.FTP_HOST 
     this.FTPUserName =this.connexServ.ConnexAppConfig.FTP_Uid
     this.FTP_Pwd =this.connexServ.ConnexAppConfig.FTP_Pwd
     this.FTP_directory = this.connexServ.ConnexAppConfig.FTP_Directory 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  SaveSettings(){
    this.connexServ.ConnexAppConfig.UPLOAD_IP = this.deviceIP
    this.connexServ.ConnexAppConfig.API_URL = this.DeviceAPI_URL

    this.connexServ.ConnexAppConfig.FTP_HOST = this.FTPHost
    this.connexServ.ConnexAppConfig.FTP_Uid = this.FTPUserName
    this.connexServ.ConnexAppConfig.FTP_Pwd = this.FTP_Pwd
    this.connexServ.ConnexAppConfig.FTP_Directory = this.FTP_directory

    this.connexServ.publishAppconfigChange()
  }
  ClearDownload(){
    this.file.listDir(this.file.dataDirectory,"")
    .then( (items)=> {
      items.forEach(item => {
        if(item.name.endsWith(".zip") 
            ||
            item.name.endsWith(".txt")
            ||
            item.name.endsWith(".pdf")
          )
        {
          
          this.file.removeFile(this.file.dataDirectory,item.name)
        }
      });
    })
  }

}
