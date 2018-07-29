import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ItemSliding } from 'ionic-angular';
import {
  IonicStepComponent,
  IonicStepperModule,
  IonicStepperComponent
} from "ionic-stepper";

import { Events } from 'ionic-angular';

import { ConnexServiceProvider } from "../../providers/connex-service/connex-service";

import { AppConfig } from "../model/appconfig";

import { FTP } from '@ionic-native/ftp';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'



@Component({
  selector: 'page-connex',
  templateUrl: 'connex.html',
})
export class ConnexPage {

  @ViewChild("stepper") stepper: IonicStepperComponent;

  name: string;
  toggleSpinner: boolean = false;
  isProcessStarted: boolean = false;

  step1Lable: string = "Download File";
  step1Description: string = "";
  Step1Icon: string = "number";

  step2Description: string = "Connect Device";
  Step2Icon: string = "number";

  step3Description: string = "";
  Step3Icon: string = "number";
  ip: string = "00.00.00.00"


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public connexsrv: ConnexServiceProvider,
    public events: Events,

    private fTP: FTP,
    public alertCtrl: AlertController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController

  ) {

    this.ip = this.connexsrv.ConnexAppConfig.UPLOAD_IP;
    events.subscribe('ConnexAppConfig:publish', (appconfig: AppConfig) => {

      console.log('Welcome', appconfig);
      this.ip = appconfig.UPLOAD_IP;
    });

    events.subscribe('fileDownload:publish', (msg) => {
      console.log('file Download', msg);
      // this.stepper.setStep(0);
      // this.stepper.setStep(2);
      //this.Step1Icon="checkmark"
      this.step1Description = msg
    });


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnexPage');

  }

  presentLoadingDots() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Downloading files from server.',

    });

    loading.present();

    setTimeout(() => {
      if (this.file.checkFile(this.file.dataDirectory, this.name)) {
        loading.dismiss();
        this.Step1Icon = "checkmark"
      }
    }, 4000);
    // setTimeout(() => {
    //   this.Step1Icon = "alert"
    //   loading.dismiss();

    // }, 9000);
  }

  localFileExist(): boolean {
    if (this.file.checkFile(this.file.dataDirectory, this.name)) {
      return true;
    } else {
      return false;
    }
  }
  selectChange(e) {
    console.log("-----message:" + e);
    if (e === 1) {

      //this.presentLoadingDots()
      //this.FTPDownloadClick()

      //this.step1Description=this.connexsrv.FTPDownloadClick(this.name)
    }
    // if (e === 0) {
    //   this.Step1Icon = "checkmark"
    //   this.step1Description = "Download complete"
    // }
    if (e === 2) {
      // this.Step2Icon="warning"
     // this.Step2Icon = "alert"
    }
    //this.ip = this.connexsrv.ConnexAppConfig.UPLOAD_API_IP
  }

  startOverclicked() {
    this.stepper.setStep(0);
    this.Step1Icon = "number"
    this.Step2Icon = "number"
    this.Step3Icon = "number"

    this.step1Description = ""
    this.step2Description = ""
    this.step3Description = ""

  }
  processClicked() {
    this.isProcessStarted = !this.isProcessStarted;
  }

  FTPDownloadClick() {
    console.log('FTP Download clicked');

    this.fTP.connect('ftp.tekadventure.com', 'laxit', 'Tek@1234')
      .then((res: any) => {
        console.log('Login successful', res)


        this.fTP.ls('/ionic/').then(
          (resls: any) => {
           
            let isFileFound = false;
            resls.forEach((fitem) => {
             
              if (fitem.name === this.name + ".zip") {
                isFileFound = true;
                
                var file = this.fTP.download(this.file.dataDirectory + this.name + ".zip", '/ionic/' + this.name + ".zip")
                file.subscribe({
                  next: event => {

                    this.showAlert(this.name + ".zip " +" Found.")
                    
                    this.Step1Icon = "checkmark"
                    this.step1Description = this.name + " Downloaded Successfully.."
                    this.stepper.setStep(2);
                    //this.connexsrv.publishfileDownloadMessage( this.name+".zip" +" Sucessfully downloaded")

                  },
                  error: err => {
                    //this.showAlert("File Not Found!")
                    this.Step1Icon = "alert"
                    this.step1Description = this.name + " err: "+ err
                    this.stepper.setStep(0);
                    //this.connexsrv.publishfileDownloadMessage( this.name+".zip" +" Not Found!")
                  }
                  , complete: () => {
                    //this.showAlert('Complete')
                    // this.Step1Icon="checkmark"
                    // this.step1Description= this.name + "  Downloaded Sucessfully.."

                  },

                })  //END OF   Subscribe
              }
            });

            if (!isFileFound) {
              //this.showAlert("File Not Found!")
              this.Step1Icon = "alert"
              this.step1Description = this.name + " Not Found !"
              this.stepper.setStep(0);
            }




          }
        )   // end of Ftp.ls
      }
      )
      .catch((error: any) => {
        console.error(error)
        this.Step1Icon = "alert"
        this.step1Description = this.name + " FTP Connection Error!"
        //this.connexsrv.publishfileDownloadMessage("FTP Connection Error!!")
      }
      );   //end FTP connect 
  }
  showAlert(msgcontent) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: msgcontent,
      buttons: ['OK']
    });
    alert.present();
  }

}
