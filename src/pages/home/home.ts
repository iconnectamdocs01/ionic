import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActionSheetController } from 'ionic-angular';

import { FTP } from '@ionic-native/ftp';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  SiteName: string
 
  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private fTP: FTP,
    public alertCtrl: AlertController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private http: HttpClient
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

  // FTPDownloadClick() {
  //   console.log('FTP Download clicked');
  //   //alert('Starting FTP')
  //   //this.fTP.connect('74.81.1.146', 'cmoc_ftp', 'cmocftp')
  //   this.fTP.connect('ftp.tekadventure.com', 'laxit', 'Tek@1234')
  //     .then((res: any) => {
  //       console.log('Login successful', res)
  //       //alert('login Success')

  //       this.fTP.ls('/ionic/').then(
  //         (resls: any) => {
  //           alert(this.file.dataDirectory + resls[0].name + '---' + '/ionic/' + resls[0].name)
  //           var file = this.fTP.download(this.file.dataDirectory + this.SiteName+".zip", '/ionic/' + resls[0].name)
  //           file.subscribe({
  //             next: event => this.showAlert(event),
  //             error: err => this.showAlert(err)
  //             , complete: () => this.showAlert('Complete')
  //           })  //END OF fILE   Subscribe
  //         }
  //       )   // end of Ftp.ls
  //     }
  //     )
  //     .catch((error: any) => {
  //       console.error(error)
  //     }
  //     );   //end FTP connect 
  // }

  showAlert(msgcontent) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: msgcontent,
      buttons: ['OK']
    });
    alert.present();
  }

  Downloadfileclick() {
    const url = 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';
    this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.showAlert('download complete: ' + entry.toURL());

      this.file.checkFile(this.file.dataDirectory, 'file.pdf')
        .then(_ => this.showAlert('File exist'))
        .catch(err => this.showAlert('File Not Present'))

      // Loop to List All Files in DataDirectory
      // 
      this.file.listDir(this.file.dataDirectory, '').then(result => {
        for (let f of result) {
          this.showAlert(f.name + '--' + f.fullPath)
        }
      })// end Then
    }, (error) => {
      // handle error
      this.showAlert(error)
    });
  }

  DirectoryListClick() {
    this.file.listDir(this.file.dataDirectory, '').then(result => {
      for (let f of result) {
        this.showAlert(f.name + '--' + f.fullPath)
      }
    })
  }

  CreateFileClick() {
    this.file.createFile(this.file.dataDirectory, 'testfile.txt', true)
  }
  UploadFileClick() {

    let formData: FormData = new FormData();

    let filename = this.file.dataDirectory + 'file.pdf'
    this.showAlert(filename)

    formData.append('myfile.zip', this.file.dataDirectory, filename);

    const req = new HttpRequest('POST', 'http://192.168.137.1/iconnectwebapi/UploadScriptFile', formData, {
      reportProgress: true // for progress data
    });
    return this.http.request(req)


    // this.http.post('http://192.168.137.1/iconnectwebapi/UploadScriptFile',formData)
    // .subscribe( data => {this.showAlert(data)}
    //             ,error => { this.showAlert(error)}                
    // )


    // // TEST HTTP GET
    // this.http.get('http://192.168.137.1/iconnectwebapi/UploadScriptFile').subscribe(data => {
    //   this.showAlert(data);
    // }, err => {
    //   this.showAlert(err);
    // });


    // this.file.checkFile(this.file.dataDirectory, 'file.pdf')
    //   .then(_ => {
    //     this.showAlert('File exist')



    //     let options: FileUploadOptions = {
    //       fileKey: 'ionicfile',
    //       fileName: 'ionicfile',
    //       chunkedMode: false,
    //       //mimeType: "image/jpeg",
    //       headers: {}
    //     }

    //     this.fileTransfer.upload('file.pdf', 'http://192.168.137.1/iconnectwebapi/UploadScriptFile', options)
    //       .then((data) => {
    //         this.showAlert(data + " Uploaded Successfully");
    //         //this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    //         //loader.dismiss();
    //         //this.presentToast("Image uploaded successfully");
    //       }, (err) => {
    //         this.showAlert(err);
    //         //loader.dismiss();
    //         //this.presentToast(err);
    //       }); //end Then


    //   }) //END  then
    //   .catch(err => this.showAlert('File Not Present'))
  }
  UploadFileClick2() {

    //FORM DATA & REST API
    let body: FormData = new FormData();

    let filename = this.file.dataDirectory + 'file.pdf'
    var blob = new Blob([filename], { type: 'application/zip' })
    body.append('myfile.zip', blob);
    // body.append ('myfilename', filename.toString());

    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'multipart/form-data',

        // 'Accept': 'application/json'
      })
    };

    // this.showAlert(filename + body + httpOptions)

    // this.http.post('http://192.168.137.1/iconnectwebapi/UploadScriptFile',body, httpOptions)
    //this.http.get('http://192.168.1.151/iconnectwebapidemo/GetStatus')
    this.http.post('http://192.168.1.151/iconnectwebapidemo/uploadscriptfile', body, httpOptions)
      .subscribe(data => {
        this.showAlert(data.toString() + "Success")
      }
        , error => {

          this.handleError(error)
        }
      )


    //THIS GAVE 200-- HTT Failure During Parsing
    // Try VS Code in IIS AND DEBUG MODE:
    // this.http.get('http://192.168.137.1/iconnectwebapi/')
    // .subscribe( data => {
    //               this.showAlert(data.toString()+"Success")
    //             }
    //             ,error => { 

    //               this.handleError(error)
    //           }                
    // )




    // this.file.checkFile(this.file.dataDirectory, 'file.pdf')
    //   .then(_ => {
    //     this.showAlert('File exist')
    //   }) //END  then
    //   .catch(err => this.showAlert('File Not Present'))

  }
  TestGetStatus() {
    this.http.get('http://192.168.1.151/iconnectwebapidemo/GetStatus')
      // .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.showAlert(data)
        },
        error => {
          this.handleError(error)
        }
      )

  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.showAlert('1.---An error occurred:-----' + error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.showAlert(
        `2.  Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message

  };

  // Publically accesible Directory
  UploadFileClickFileTransfer() {


    let filename = this.file.dataDirectory + 'file.pdf'

    // THIS IS USING FILE TRASNFER
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile.zip',
      chunkedMode: false,
      mimeType: "application/zip",
      headers: {}
    }

    this.fileTransfer.upload(filename, 'http://192.168.137.1/iconnectwebapi/Uploadfiles', options)
      .then((data) => {
        this.showAlert(data + " Uploaded Successfully");
        //this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        //loader.dismiss();
        //this.presentToast("Image uploaded successfully");
      }, (err) => {
        this.showAlert(err.toString() + "Error While Upload");
        //loader.dismiss();
        //this.presentToast(err);
      }); //end Then

  }

  multipartformdataTest() {
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "application/zip",
      headers: new HttpHeaders({
        'content-Type': 'multipart/form-data',
      })
    }

    // params: { 'fileName': filename}
    //FORM DATA & REST API
    let body: FormData = new FormData();
    // let myfilename = this.file.dataDirectory + 'file.pdf'
    let myfilename =  'file.pdf'
    body.append('myfile.zip', myfilename);
    // body.append ('myfilename', filename.toString());



    this.http.post('http://192.168.1.151/iconnectwebapidemo/uploadscriptfile', body, options)
      .subscribe(data => {
        this.showAlert(data.toString() + "Success")
      }
        , error => {

          this.handleError(error)
        }
      )




  }//End Method

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
            //alert(this.file.dataDirectory + resls[0].name + '---' + '/ionic/' + resls[0].name)
            var file = this.fTP.download(this.file.dataDirectory + this.SiteName+".zip", '/ionic/' + resls[0].name)
            file.subscribe({
              next: event => this.showAlert(event),
              error: err => this.showAlert(err)
              , complete: () => this.showAlert('Complete')
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
  // THIS IS WORKING
  multipartformdataFileTransfer() {
    // let options: FileUploadOptions = {
    //   fileKey: 'ionicfile',
    //   fileName: this.file.dataDirectory + 'file.pdf',
    //   chunkedMode: false,
    //   mimeType: 'multipart/form-data',
    //   params: { 'fileName': this.file.dataDirectory + 'file.pdf' },
    //   httpMethod: 'POST'
    // }

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: this.SiteName +'.zip',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'fileName':  'file.pdf' },
      httpMethod: 'POST'
    }
    // this.fileTransfer.upload(this.file.dataDirectory + 'file.pdf',
    this.fileTransfer.upload(this.file.dataDirectory + this.SiteName +'.zip',
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
  }//End Method

  multipartformdataFileTransferpritesh03() {
    
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: this.SiteName +'.zip',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'fileName':  'file.pdf' },
      httpMethod: 'POST'
    }
    // this.fileTransfer.upload(this.file.dataDirectory + 'file.pdf',
    this.fileTransfer.upload(this.file.dataDirectory + this.SiteName +'.zip',
       'http://192.168.1.151/iconnectwebapidemo/uploadscriptfile'
      , options)
      .then((data) => {
        this.showAlert(data + "Sucess")
      },
        (err) => {   this.showAlert(err+" Error in THEN" )}
      )
      .catch(
        error => this.showAlert(error + "Error in Catch")
      )
  }//End Method

}
