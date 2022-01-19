import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class SharingService {
    // private dataSharing={editIdx: 0};//:any = undefined;
    // setData(data:any){
    // this.dataSharing = data;
    // console.log("Change in service: ", this.dataSharing);
    // console.log();
    // console.log("GET: ", this.getData());
    // }

    // getData():any{
    // return this.dataSharing; 
    // }
    ///--
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    // constructor() { }
    // changeMessage(message: string) {
    // this.messageSource.next(message)
    // }
    ///--

    constructor() { }  // private http: Http
    sharingData = { name: " " };
    private dataStringSource = new BehaviorSubject('0');
    dataString$ = this.dataStringSource.asObservable();
    public saveData(value) {
        // console.log("save data function called " + value + this.sharingData.name);
        this.sharingData.name = value;
        this.dataStringSource.next(this.sharingData.name);
    }
}