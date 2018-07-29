import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { File } from '@ionic-native/file';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  currentDirectoryFiles = new Array()
  
  constructor(public navCtrl: NavController,
              private file: File) {

  }
  DirectoryListClick(){

    this.currentDirectoryFiles=  new Array()
    this.file.listDir( this.file.dataDirectory,'').then(result => {
      for( let f of result)
      {
        this.currentDirectoryFiles.push(f.name)
        // this.showAlert(f.name +  '--' + f.fullPath)
      }
  })
  }

}
