import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  myParam: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myParam = navParams.get('myParam');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicelogdetailPage');
  }

}
