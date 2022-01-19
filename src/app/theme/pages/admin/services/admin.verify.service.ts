import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

@Injectable()
export class ADMIN_Verify_Service {

    constructor(private http: Http, private _router: Router) {
        this.verifyadmin();
    }

    verifyadmin() {
        let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser'));
        if ((!usrLoginLvl) || (usrLoginLvl.job_role == null)) {
            this.redirect('/unauthorized');
        }
    }

    redirect(myUrl) {
        this._router.navigate([myUrl]);
    }

}
