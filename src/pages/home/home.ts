import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActionSheetController } from 'ionic-angular';

import { FTP } from '@ionic-native/ftp';

import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private fTP: FTP,
    public alertCtrl: AlertController, 
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer
  ) {

  }
  fileTransfer: FileTransferObject = this.transfer.create();


  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'TITLE',
      buttons: [
        {
          text: 'Show Data Directory',
          role: 'Action1',
          handler: () => {
            // this.file.checkDir(this.file.dataDirectory, 'mydir')
            // .then( _ => console.log('Directory exists'))
            // .catch(err => console.log('Directory doesn\'t exist'));
            this.showAlert(this.file.dataDirectory)

            console.log('Action 1 clicked');

          }
        }, {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  FTPDownloadClick() {
    console.log('FTP Download clicked');
    //alert('Starting FTP')
    //this.fTP.connect('74.81.1.146', 'cmoc_ftp', 'cmocftp')
    this.fTP.connect('ftp.tekadventure.com', 'laxit', 'Tek@1234')
      .then((res: any) => {
        console.log('Login successful', res)
        //alert('login Success')

        this.fTP.ls('/ionic/').then(
          (resls: any) => {
            alert(this.file.dataDirectory+ resls[0].name  +'---'+ '/ionic/'+ resls[0].name)
             var file= this.fTP.download(this.file.dataDirectory+ resls[0].name, '/ionic/'+ resls[0].name)
            file.subscribe({
              next : event => this.showAlert( event),
              error: err => this.showAlert( err)
              ,complete : ()=> this.showAlert('Complete') 
            })  //END OF fILE   Subscribe
          }
        )   // end of Ftp.ls
      }
      )
      .catch((error: any) => {
        console.error(error)
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
  
  Downloadfileclick(){
    const url = 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';
    this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.showAlert('download complete: ' + entry.toURL());

      this.file.checkFile(this.file.dataDirectory,'file.pdf')
      .then( _ =>  this.showAlert('File exist') )
      .catch(  err => this.showAlert('File Not Present') )

      // Loop to List All Files in DataDirectory
      // 
      this.file.listDir( this.file.dataDirectory,'').then(result => {
          for( let f of result)
          {
            this.showAlert(f.name +  '--' + f.fullPath)
          }
      })// end Then
    }, (error) => {
      // handle error
      this.showAlert(error)
    });
  }

  DirectoryListClick(){
    this.file.listDir( this.file.dataDirectory,'').then(result => {
      for( let f of result)
      {
        this.showAlert(f.name +  '--' + f.fullPath)
      }
  })
  }

  CreateFileClick(){
    this.file.createFile(this.file.dataDirectory,'testfile.txt',true)
  }
  
}
