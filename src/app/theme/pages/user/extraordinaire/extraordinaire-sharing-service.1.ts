import { Injectable } from '@angular/core';

@Injectable()
export class SharingService {
    private dataSharing = { editIdx: 0 };//:any = undefined;

    setData(data: any) {
        this.dataSharing = data;
        console.log("CHange in service: ", this.dataSharing);
        this.getData();
    }

    getData(): any {
        return this.dataSharing;
    }

}