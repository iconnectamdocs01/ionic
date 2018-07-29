import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AppConfig } from "../../pages/model/appconfig";

import { FTP } from '@ionic-native/ftp';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'


@Injectable()
export class ConnexServiceProvider {

  public ConnexAppConfig = new  AppConfig()

  fileTransfer: FileTransferObject = this.transfer.create();


  msg:string  =""
  // public fileDownloadMessage:string =""

  constructor(public http: HttpClient,
    public events: Events,
    private fTP: FTP,
    public alertCtrl: AlertController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer
    
    ) {
    

  }
  showAlert(msgcontent) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: msgcontent,
      buttons: ['OK']
    });
    alert.present();
  }
  /**
   * publishAppconfigChange
   */
  public publishAppconfigChange() {
    this.events.publish('ConnexAppConfig:publish',this.ConnexAppConfig)
  }

  public publishfileDownloadMessage( msg: string ) {
     
    this.events.publish('fileDownload:publish', msg)
  }
  
  FTPDownloadClick(filename:string): string {
  
    console.log('FTP Download clicked');
   
    //this.fTP.connect('74.81.1.146', 'cmoc_ftp', 'cmocftp')
    this.fTP.connect('ftp.tekadventure.com', 'laxit', 'Tek@1234')
      .then((res: any) => {
        console.log('Login successful', res)
        //alert('login Success')

        this.fTP.ls('/ionic/').then(
          (resls: any) => {
            //alert(this.file.dataDirectory + resls[0].name + '---' + '/ionic/' + resls[0].name)
            var file = this.fTP.download(this.file.dataDirectory + filename+".zip", '/ionic/' + filename+".zip")
            file.subscribe({
              next: event =>{ 
                this.showAlert(event)
                this.msg="Looing for Next file"
              },
              error: err => {
                this.showAlert(err)
                this.msg="Error in file Download"
              }
              , complete: () => { 
                this.showAlert('Complete')
                this.msg= "Sucessfully Downloaded File:" + filename +".zip"
            }
            })  //END OF fILE   Subscribe
          }
        )   // end of Ftp.ls
        .catch((error: any) => {
            this.msg = "Could Not Locate FTP directory"
        })//catch for ls
      }
      )
      .catch((error: any) => {
        console.error(error)
        this.msg="Could Not connect to download file From Server"
      }
      );   //end FTP connect 

      return this.msg
  }

  /**
   * GetAppConfig
   
  public GetAppConfig() : AppConfig {
    return this.ConnexAppConfig
  }
  public SetAppConfig(appconfig : AppConfig)  {
    return this.ConnexAppConfig = appconfig
  }*/

}
