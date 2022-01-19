import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http"; // 
import { GlobalVariable } from "../../../environments/environment";
//import { GlobalVariable } from '../../../../ghcm-global';
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

@Injectable()
export class POST_Service {
    apiUrl: string;
    /* usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole = GlobalVariable.USER_ROLE;
    usrLoginToken = GlobalVariable.USER_TOKEN;*/
    baseApiUrl = GlobalVariable.BASE_API_URL;
    baseApiKey = GlobalVariable.API_KEY;

    idp_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    tc_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    sp_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    maps_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    rec_baseApiUrl = GlobalVariable.BASE_IDP_URL;

    hrc_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    evl_baseApiUrl = GlobalVariable.BASE_IDP_URL;

    constructor(private http: Http, private _router: Router) {
    }

    dataAdvPos: any = {};

    POST_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.baseApiUrl + api + '?api_key=' + this.baseApiKey;
        //console.log(apiUrl);
        // console.log(myAPI);
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    console.log("[ERROR 400] " + Observable.throw(new Error(error.status)));
                    return '0';// Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    console.log("[ERROR 422] Already advertise - " + Observable.throw(new Error(error.status)));
                    return '1';
                }
            });
    }

    POST_IDP_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.idp_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        //console.log(apiUrl);
        // console.log(myAPI);
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    console.log("[ERROR 400] " + Observable.throw(new Error(error.status)));
                    return '0';// Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    console.log("[ERROR 422] Already advertise - " + Observable.throw(new Error(error.status)));
                    return '1';
                }
            });
    }


    POST_TC_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.tc_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        //console.log(apiUrl);
        // console.log(myAPI);
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    console.log("[ERROR 400] " + Observable.throw(new Error(error.status)));
                    return '0';// Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    console.log("[ERROR 422] Already advertise - " + Observable.throw(new Error(error.status)));
                    return '1';
                }
            });
    }

    POST_SP_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.sp_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        //console.log(apiUrl);
        // console.log(myAPI);
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    console.log("[ERROR 400] " + Observable.throw(new Error(error.status)));
                    return '0';// Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    console.log("[ERROR 422] Already advertise - " + Observable.throw(new Error(error.status)));
                    return '1';
                }
            });
    }

    POST_ScreenShot(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        // let api_key = 'Ij5DN44MDtnQv2I8zdAJg0xCGasLGJL6Jc6L4OOU';
        let scShotUrl = GlobalVariable.BASE_API_URL + api + '?api_key=' + this.baseApiKey;
        // let scShotUrl = GlobalVariable.BASE_API_URL + api + '?api_key=' + api_key;
        // console.log("localToken", localToken);
        // console.log("scShotUrl", scShotUrl);

        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        // headersComCat.append('Content-Type', 'multipart/form-data');

        let optionsComCat = new RequestOptions({ headers: headersComCat });

        return this.http.post(scShotUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                console.log(error)
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    POST_CommImage(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;

        let scShotUrl = GlobalVariable.BASE_IDP_URL + api + '?api_key=' + this.baseApiKey;

        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);

        let optionsComCat = new RequestOptions({ headers: headersComCat });

        return this.http.post(scShotUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                console.log(error)
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
            });
    } 

    checkToken(localToken) {
        /*let apiUrl= this.baseApiUrl + '/user/auth?api_key=' + this.baseApiKey;
        let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });

        let try1=this.http.get(apiUrl, optionsComCat).subscribe(data => {
            //this.data = data;
            //console.log(this.data);
        }, error => console.log('[ERROR - Pending Approval List] ' + error), 
        );
        
        let ret = try1.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (!this.dataAdvPos || this.dataAdvPos.status != "OK") {
                localStorage.clear();
                this._router.navigate(['/login']);
            }
        });*/
        /*
        console.log("test1");
        return this.http.get(apiUrl, optionsComCat)
        .map(
            data => {  },
            error => {
                // error when verify so redirect to login page with the return url               
                localStorage.clear();
                this._router.navigate(['/login']);//, { queryParams: { returnUrl: state.url } });
                return false;
            }).catch((error: any) => {
                localStorage.clear();
                this._router.navigate(['/login']);//, { queryParams: { returnUrl: state.url } });
                if (error.status === 401) {                    
                    return '-1';
                }
                else  {
                    return Observable.throw(new Error(error.status));
                }  
            });
            */
    }

    POST_MAPS_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_MAPS_data_loginRole(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_ScreenShot_MAPS(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let scShotUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;

        let headersComCat = new Headers();
        headersComCat.append('token', localToken);

        let optionsComCat = new RequestOptions({ headers: headersComCat });

        return this.http.post(scShotUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_REC_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.rec_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        //console.log(apiUrl);
        // console.log(myAPI);
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    console.log("[ERROR 400] " + Observable.throw(new Error(error.status)));
                    return '0';// Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    console.log("[ERROR 422] Already advertise - " + Observable.throw(new Error(error.status)));
                    return '1';
                }
            });
    }

    POST_VRP_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_HRC_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.evl_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_EVL_data(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        let apiUrl = this.evl_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        return this.http.post(apiUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                } else {
                    return Observable.throw(error)
                }
            });
    }

    POST_EVL_ScreenShot(api, postData) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        // let api_key = 'Ij5DN44MDtnQv2I8zdAJg0xCGasLGJL6Jc6L4OOU';
        let scShotUrl = this.evl_baseApiUrl + api + '?api_key=' + this.baseApiKey;
        // let scShotUrl = GlobalVariable.BASE_API_URL + api + '?api_key=' + api_key;
        // console.log("localToken", localToken);
        // console.log("scShotUrl", scShotUrl);

        //this.checkToken(localToken);
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        // headersComCat.append('Content-Type', 'multipart/form-data');

        let optionsComCat = new RequestOptions({ headers: headersComCat });

        return this.http.post(scShotUrl, postData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                console.log(error)
                if (error.status === 401) {
                    window.alert("Session Timeout. Please Login Again.");
                    //localStorage.clear();
                    this._router.navigate(['/welcome']);
                    return Observable.throw(new Error(error.status));
                }
            });
    }
}