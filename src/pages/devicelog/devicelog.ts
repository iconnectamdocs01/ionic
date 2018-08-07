import { Component } from '@angular/core';
import { NavController, NavParams  , ItemSliding , ToastController } from 'ionic-angular';
import { DevicelogdetailPage } from "../devicelogdetail/devicelogdetail";

import { HttpClient } from '@angular/common/http';
import { ConnexServiceProvider } from "../../providers/connex-service/connex-service";
/**
 * Generated class for the DevicelogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-devicelog',
  templateUrl: 'devicelog.html',
})
export class DevicelogPage {

  myParam: string;
  logfiles: any[];
  apiurl :string ;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private toastCtrl: ToastController,
     private http:HttpClient,
     private connexService:ConnexServiceProvider) {

      // img: './assets/avatar-cher.png',
    // this.logfiles = [
    //   {
    //     img: 'done-all',
    //     name: 'ABC',
    //     message: 'Successfully Installed',
    //     time: '9:38 pm'
    //   }, {
    //     img: 'done-all',
    //     name: 'XYZ',
    //     message: 'Successfully Installed',
    //     time: '8:59 pm'
    //   }, {
    //     img: 'alert',
    //     name: 'PQR',
    //     message: 'Failed Installation',
    //     time: '1:10 pm'
    //   }];

    this.refeshLogClick();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicelogPage');
  }

  
  // pushParams() {
  //   this.navCtrl.push(DevicelogdetailPage, { 'myParam': this.myParam });
  // }


  //SLIDING LIST MORE PUSH PAGE

  viewLogDetail(logfile) {
    this.navCtrl.push(DevicelogdetailPage, { 'myParam': logfile.name});
  }


  

  //SLIDING LIST 

  more(item: ItemSliding) {
    console.log('More');
    item.close();
  }

  delete(item: ItemSliding) {
    console.log('Delete');
    item.close();
  }

  // mute(item: ItemSliding) {
  //   console.log('Mute');
  //   item.close();
  // }

  // archive(item: ItemSliding) {
  //   this.expandAction(item, 'archiving', 'Chat was archived.');
  // }

  // download(item: ItemSliding) {
  //   this.expandAction(item, 'downloading', 'Login was downloaded.');
  // }

  // expandAction(item: ItemSliding, _: any, text: string) {
  //   // TODO item.setElementClass(action, true);
  //   setTimeout(() => {
  //     const toast = this.toastCtrl.create({
  //       message: text
  //     });
  //     toast.present();
  //     // TODO item.setElementClass(action, false);
  //     item.close();

  //     setTimeout(() => toast.dismiss(), 2000);
  //   }, 1500);
  // }





  //NEW LIST WITH BUTTON ---

  itemSelected(logfile) {
    console.log("Selected Item", logfile.fullFileName);
    this.navCtrl.push(DevicelogdetailPage, { 'logfilename': logfile.fullFileName, 'logfile' : logfile});
  }

  refeshLogClick(){
    this.apiurl = this.connexService.ConnexAppConfig.API_URL;
    this.http.get<any[]>(this.apiurl+"/GetLogFiles")
    .subscribe( data => {
      this.logfiles = data
    },
    err => { 
      //alert(err)
     }
    )
  }

  deleteAllLogClick(){

  }

}
