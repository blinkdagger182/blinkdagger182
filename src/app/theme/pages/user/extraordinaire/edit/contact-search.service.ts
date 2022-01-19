import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { POST_Service } from '../../../../api/post.service';

@Injectable()
export class ContactSearchService {
    endPoint: string;
    constructor(private http: Http, private _POST_api_Service: POST_Service) {
        this.endPoint = '/jobAdv/user/search';
    }
    search(term: string): Observable<any[]> {
        // console.log("SEARCH TERM: ", term);
        let myData;
        /* var ClientList = this._POST_api_Service.POST_data('/jobAdv/user/search', { text: term })
             .map((r: Response) => {
                 console.log("r", r);
                 return ([{ "staffId": 0, "name": "No Record Found" }]) as any[]
             });*/
        // var ClientList = ([{ "staffId": 0, "name": "No Record Found" }]) ;
        var ClientList = [];
        if (term.length > 2) {
            var test = this._POST_api_Service.POST_data('/jobAdv/user/search', { text: term })
                .subscribe(data => {
                    // console.log(data);
                    // if (data.results.length>0)  ClientList.splice(0, 1);
                    if (data.results.length == 0) {
                        console.log("empty");
                        ClientList.push({
                            "staffId": 0, "name": "No Record Found"
                        });
                    }
                    for (let i = 0; i < data.results.length; i++) {
                        ClientList.push({
                            "staffId": data.results[i].staffNo, "name": data.results[i].name
                        });
                    }
                },
                error => {
                    console.log('[ERROR - myCallbackContact] ' + error);
                })

            //map((res: Response) => res.json());
        }
        return Observable.of<any[]>(ClientList);
    }
}

/*
 this._POST_api_Service.POST_data('/jobAdv/user/search', { text: newVal })
            .subscribe(data => {
                //this.data = data;
                this.loading = false;
                console.log(data);
                for (let i = 0; i < data.results.length; i++) {
                    this.contactList.push({
                        "staffId":data.results[i].staffNo, "name":data.results[i].name
                    });
                } 
                //this.contactList = myarray;
                console.log(this.contactList);
            },
                error => {
                    console.log('[ERROR - myCallbackContact] ' + error); 
                }) */