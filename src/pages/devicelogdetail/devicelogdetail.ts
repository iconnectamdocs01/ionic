import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { HttpClient } from '@angular/common/http';
import { ConnexServiceProvider  } from "../../providers/connex-service/connex-service";
/**
 * Generated class for the DevicelogdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-devicelogdetail',
  templateUrl: 'devicelogdetail.html',
})
export class DevicelogdetailPage {

  apiurl : string 
  logfilename: string;
  logfileobj: any;
  logfilelines: any[] = [ "Step 1" , "Step2" ]
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private emailComposer: EmailComposer,
              private http: HttpClient ,
            private connexService : ConnexServiceProvider) {
    this.logfilename = navParams.get('logfilename');
    //alert(this.logfilename)
    this.logfileobj = navParams.get('logfile');

    this.apiurl = this.connexService.ConnexAppConfig.API_URL;
    let input= { 'name' : this.logfileobj.fullFileName}
   
    this.http.get<any[]>(this.apiurl+"/GetLogfileDetail?name="+ this.logfilename)
    .subscribe( (data: any[] ) => {
      // this.logfiles = data
      //alert( "File Content"+data)
      this.logfilelines = data
      },
      err => { alert( "Error :" +err)}
    )


    // this.http.post(this.apiurl+"/GetLogfileDetail",JSON.stringify(input))
    // .subscribe( (data: any[] ) => {
    //   // this.logfiles = data
    //   //alert( "File Content"+data)
    //  // this.logfilelines = data
    //   },
    //   err => { alert( "Error :" +err)}
    // )


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicelogdetailPage');
  }

  sendEmail()
  {
    
this.emailComposer.isAvailable().then((available: boolean) =>{
  if(available) {
    //Now we know we can send
    alert("Email is Allowed");
  }
 });
 
 let email = {
   to: 'max@mustermann.de',
   cc: 'erika@mustermann.de',
   bcc: ['john@doe.com', 'jane@doe.com'],
  //  attachments: [
  //    'file://img/logo.png',
  //    'res://icon.png',
  //    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
  //    'file://README.pdf'
  //  ],
   subject: 'ABC Installation Success',
   body: 'Step 1: File Download Complete  <br> Step 2: File Install Complete',
   isHtml: true
 };
 
 // Send a text message using default options
 this.emailComposer.open(email);
  }

}
