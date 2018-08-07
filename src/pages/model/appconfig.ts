export class AppConfig {
    
    public FTP_HOST: string = "ftp.tekadventure.com";
    public FTP_Uid: string = "laxit";
    public FTP_Pwd: string ="Tek@1234";
    public FTP_Directory: string ="/ionic/"

    public UPLOAD_API_URL: string ="http://192.168.137.1/iconnectwebapi/UploadScriptFile";
    // public UPLOAD_API_URL: string ="http://192.168.1.151/iconnectwebapidemo/GetStatus";
    public UPLOAD_IP : string = "190.1.1.1"

    public isWifiConnected: boolean = false;
    public WifiName: string = "";

    public API_URL: string ="http://192.168.1.151/iconnectwebapidemo";
    
    // private _upload_ip: string = "10.10.10.10";
    // get UPLOAD_API_IP():string {
    //     return this._upload_ip;
    // }
    // set UPLOAD_API_IP(ip:string) {
    //     this._upload_ip = ip;
    //     this.UPLOAD_API_URL= "http://"+ip+"/iconnectwebapidemo/GetStatus"
    // }
}