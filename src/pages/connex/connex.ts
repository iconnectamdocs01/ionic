import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ItemSliding, Alert } from 'ionic-angular';
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

import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { Network } from '@ionic-native/network';

import {Observable} from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-connex',
  templateUrl: 'connex.html',
})
export class ConnexPage {

  @ViewChild("stepper") stepper: IonicStepperComponent;

  name: string;
  toggleSpinner: boolean = false;
  //THIS WAS FOR Trial
  isProcessStarted: boolean = false;

  step1Lable: string = "Download File";
  step1Description: string = "";
  Step1Icon: string = "number";

  step2Description: string = "Connect Device";
  Step2Icon: string = "number";

  step3Description: string = "";
  Step3Icon: string = "number";

  step4Description: string = "";
  Step4Icon: string = "number";

  ip: string = "00.00.00.00"

  fileTransfer: FileTransferObject = this.transfer.create();
  deviceList: any[];
  device: any;
  devicename: string;


  localFilelist: any[];
  localfilename: any;
  
  apiurl :string ;
  ticks =0;
  isInstallStarted : boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public connexsrv: ConnexServiceProvider,
    public events: Events,

    private fTP: FTP,
    public alertCtrl: AlertController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    private hotspot: Hotspot,
    private network: Network,
    private http:HttpClient,

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

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      //console.log('network was disconnected :-(');
      //alert("SUB:Network Disconnected")
      this.connexsrv.ConnexAppConfig.isWifiConnected = false;
      this.connexsrv.publishAppconfigChange();
      this.connexsrv.ConnexAppConfig.WifiName = ""
      this.devicename=""
      
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      // console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          // alert('we got a wifi connection, woohoo!');
          this.connexsrv.ConnexAppConfig.isWifiConnected = true;
          this.hotspot.getConnectionInfo()
            .then( (connectioninfo) => {
                this.connexsrv.ConnexAppConfig.WifiName = connectioninfo.SSID
                this.connexsrv.publishAppconfigChange();
                //alert("SUB:Network Connected")
                // //WHEN NOT NETWORK available and it connects to
                // if (connectioninfo.SSID.includes("Connectify")) {
                //   this.devicename= connectioninfo.SSID
                // }
                
            })
            .catch(( reason )=> {
                alert(reason)
            })
        }
      }, 3000);
    });

  //   this.deviceList = [
  //     { text: 'Device1', value: 'Device1' },
  //     { text: 'Device2', value: 'Device2' },
  //     { text: 'Device3', value: 'Device3' }
  // ];
  

  // this.device = { text: 'Device1', value: 'Device1' };

  let timer = Observable.timer(2000,5000);
  timer.subscribe(t=>{
     this.ticks = t
    // Call Status Web API to chec in progress
    // Flip Status
    //alert(this.ticks)
    //alert(this.apiurl+"/GetStatus")
    this.apiurl = this.connexsrv.ConnexAppConfig.API_URL;
    this.http.get(this.apiurl+"/GetStatus")
    .subscribe( (data : boolean) => {
      this.isInstallStarted = data
      //alert(data)
    },
    err => { 
      //alert(err)
     }
    )

  });

  }

  compareFn(option1: any, option2: any) {
      return option1.value === option2.value;
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
  presentProcessDots() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Processing',

    });

    loading.present();

    setTimeout(() => {
       loading.dismiss();
    }, 500);
    
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
    if (e===2) {
      this.listDirectoryfiles()
    }
    //this.ip = this.connexsrv.ConnexAppConfig.UPLOAD_API_IP
  }

  startOverclicked() {
    this.stepper.setStep(0);
    this.name=""
    this.Step1Icon = "number"
    this.Step2Icon = "number"
    this.Step3Icon = "number"
    this.Step4Icon = "number"

    this.step1Description = ""
    this.step2Description = ""
    this.step3Description = ""
    this.step4Description = ""

    this.hotspot.getConnectionInfo()
            .then( (connectioninfo) => {
                // this.connexsrv.ConnexAppConfig.WifiName = connectioninfo.SSID
                // this.connexsrv.publishAppconfigChange();

                if (connectioninfo.SSID.includes("Connectify")  ) {
      
                  this.hotspot.removeWifiNetwork(connectioninfo.SSID).then( ()=> {
                    this.showAlert("Removed connection to Device "+ connectioninfo.SSID)
                    this.devicename=""
                    this.connexsrv.ConnexAppConfig.WifiName = ""
                    this.connexsrv.publishAppconfigChange();
                  }).catch((reason) => this.showAlert("Error in removing device connection:"+reason))
                                    
                }

            })
            .catch(( reason )=> {
                alert(reason)
            })
    
     this.isProcessStarted = false;
    //this.isProcessStarted = !this.isProcessStarted;


  }

 //STEP 1
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

                    this.presentProcessDots()
                    // this.showAlert(this.name + ".zip " +" Found.")
                    
                    this.Step1Icon = "checkmark"
                    this.step1Description = this.name + " Downloaded Successfully.."
                    // this.stepper.setStep(1);
                    this.stepper.nextStep();
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

  //STEP 2

  ScanDevices()
  {
    // alert("Scan Device clicked")
    this.hotspot.scanWifi().then( ( alldevices: HotspotNetwork[]) =>{
      this.deviceList= []
      

      alldevices.forEach( (item) =>{
        
        if (item.SSID.includes("Connectify")) {
          this.deviceList.push({ text: item.SSID, value: item.SSID } )
          
        }
      })

      if (this.deviceList.length>0) {
        this.device = this.deviceList[0]
        this.devicename = this.device.text
        
      }
    }).catch( (reson) =>
  {
    this.showAlert("Error while scanning devices")
  })
  }

  ConnectDeviceClick()
  {
    // this.hotspot.connectToWifi("Connectify-me","12345678").then( ()=>{
    this.hotspot.connectToWifi(this.device.text,"12345678").then( ()=>{
      
      this.connexsrv.ConnexAppConfig.WifiName = this.device.text
      this.connexsrv.publishAppconfigChange();

      this.devicename = this.device.text
      this.Step2Icon = "checkmark"
      this.step2Description = this.device.text + " Connected Successfully.."
      // this.stepper.setStep(2)
      this.stepper.nextStep()
      this.presentProcessDots()



      /*
      http://192.168.137.1/iconnectwebapi/UploadScriptFile
      
      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: this.name +'.zip',
        chunkedMode: false,
        mimeType: 'multipart/form-data',
        // params: { 'fileName':  'file.pdf' },
        httpMethod: 'POST'
      }

      File Send Code
      
      if (this.name.length>0) {
        this.fileTransfer.upload(this.file.dataDirectory + this.name +'.zip',
        // THIS PRITESHP03 - FIOS8W
        // 'http://192.168.1.151/iconnectwebapidemo/uploadscriptfile'
        'http://192.168.137.1/iconnectwebapi/uploadscriptfile'
        , options)
        .then((data) => {
          this.showAlert(data + "Sucess")
        },
          (err) => {   this.showAlert(err+" Error in THEN" )}
        )
        .catch(
          error => this.showAlert(error + "Error in Catch")
        )
      }
      */




    })
    .catch( ()=> {
      this.showAlert("Device Not Connected")
      this.Step2Icon = "alert"
      this.step2Description = this.device.text + " Not Connected.."
      
    })
  }

  //STEP 3
  listDirectoryfiles(){
    
    this.localFilelist =  []
    let hasCurrrentfile  = false
    this.file.listDir( this.file.dataDirectory,'').then(result => {
      for( let f of result)
      {

        if (f.name.includes(".zip")) {
          this.localFilelist.push({ text: f.name, value: f.name })          
        }
        if (f.name.includes(this.name)) {
          hasCurrrentfile = true;
          //alert("Has Current file")
        }        
        
      }

      if (hasCurrrentfile &&  this.localFilelist.length > 0) {
        this.localfilename={ text: this.name+".zip", value: this.name+".zip" }
        //this.localfilename = this.localFilelist[0]
        //alert("Setting First Element") 
      }

  }) //end  list DIR

  // if (hasCurrrentfile) {
  //   this.localfilename = this.localFilelist[0]
  //   //this.localfilename={ text: this.name+".zip", value: this.name+".zip" }
  //   //alert("Has Current file.....")
  // }

  //this.presentProcessDots()

  }


  SendFilesClicked() {
    this.isProcessStarted = true

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: this.name +'.zip',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      // params: { 'fileName':  'file.pdf' },
      httpMethod: 'POST'
    }

    
    if (this.name.length>0) {
      // this.fileTransfer.upload(this.file.dataDirectory + this.name +'.zip',    
      // 'http://192.168.137.1/iconnectwebapi/uploadscriptfile'
      
      this.apiurl = this.connexsrv.ConnexAppConfig.API_URL;
      alert(this.apiurl)
      this.fileTransfer.upload(this.file.dataDirectory + this.localfilename.text,   
      this.apiurl+"/uploadscriptfile"         
      , options)
      .then((data) => {
        //this.showAlert(data + "Sucess")
        this.Step3Icon = "checkmark"
        this.step3Description = this.localfilename.text + " Sent Successfully.."
        // this.stepper.setStep(2)
        this.stepper.nextStep()
        this.presentProcessDots()

        //alert(data);
        //FLIPPING PROGRESS STATUS
        this.isProcessStarted = false
        this.Step4Icon = "number"
        this.step4Description = ""

      },
        (err) => {   
          this.showAlert(err+" Error in THEN" )
          this.Step3Icon = "alert"
          this.step3Description = this.localfilename.text + " Send Error.."
          this.isProcessStarted =  false
          //!this.isProcessStarted;
        }
      )
      .catch(
        error => {
          this.showAlert(error + "Error in Catch")
          this.Step3Icon = "alert"
          this.step3Description = this.localfilename.text + " Send Error.."

          this.isProcessStarted = false
        }
        
      )
    }
  }
  

  // Step 4
  InstallClicked()
  {
    this.stepper.nextStep()
    this.presentProcessDots()

    // if Log is Success then Done All
    // Else Alert

    this.Step4Icon = "done-all"
    this.step4Description = " Installed Successfully.."
    
    
    
    this.http.get(this.connexsrv.ConnexAppConfig.API_URL+"/StartInstall?fileName="+this.localfilename.text)
    .subscribe( (data : boolean) => {
      this.isInstallStarted = data
      //alert(data)
    },
    err => { 
      //alert(err)
     }
    )
    //this.showAlert(this.connexsrv.ConnexAppConfig.API_URL+"/StartInstall?fileName="+this.localfilename.text)
    

  }
  goToPreviousFromInstallClicked()
  {
    this.Step4Icon = "number"
    this.step4Description = ""
  }


}



// <!--  
// <ion-footer>
//     <ion-toolbar>
//         <ion-title>
//             {{ticks}}
//             <ion-icon name="ios-phone-portrait"></ion-icon>

//             <ion-spinner  name="dots" paused="{{!isInstallStarted}}"></ion-spinner>
//             <ion-spinner  name="dots" paused="{{!isInstallStarted}}"></ion-spinner>
//             <!-- <ion-icon *ngIf="!isProcessStarted" name="ios-more-outline"></ion-icon>
//             <ion-icon *ngIf="!isProcessStarted" name="ios-more-outline"></ion-icon> -->

//             <!-- *ngIf="isProcessStarted" -->
//             <ion-icon  name="ios-cube-outline"></ion-icon>
//             {{devicename}}

//             <!-- <div >
//                 <ion-spinner name="dots"></ion-spinner>
//             </div> -->
//         </ion-title>
//     </ion-toolbar>
// </ion-footer>

// -->