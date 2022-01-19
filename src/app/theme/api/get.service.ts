import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { GlobalVariable } from "../../../environments/environment";
//import { GlobalVariable } from '../../../../ghcm-global';
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";


@Injectable()
export class GET_Service {
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/
    baseApiUrl = GlobalVariable.BASE_API_URL;
    baseApiKey = GlobalVariable.API_KEY;

    idp_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    tc_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    sp_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    rec_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    sea_baseApiUrl = GlobalVariable.BASE_IDP_URL;

    maps_baseApiUrl = GlobalVariable.BASE_IDP_URL;

    hrc_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    evl_baseApiUrl = GlobalVariable.BASE_IDP_URL;
    
    constructor(private http: Http, private _router: Router) {
    }

    GET_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }
    GET_data_(api) {
       // let userData = JSON.parse(localStorage.getItem('currentUser'));
        let userData = true
        if (userData) {
           // let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
           // headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_SEA_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.sea_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_IDP_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.idp_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_TC_DATA(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.tc_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_SP_DATA(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.sp_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_REC_DATA(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.rec_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }


    GET_data_withID(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.idp_baseApiUrl + api + '&api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_Picture(api) {
        try {
            let apiUrl = this.baseApiUrl + api + '?api_key=' + this.baseApiKey;
            //alert(apiUrl);
            return this.http.get(apiUrl, { responseType: 3 }).map(res => res.blob());
        } catch (e) {
            console.log("[ERROR] Get Method: " + e);
            return null;
        }
    }




    GET_PictureByUrl(api) {
        try {
            
            return this.http.get(api, { responseType: 3 }).map(res => res.blob());
        } catch (e) {
            console.log("[ERROR] Get Method: " + e);
            return null;
        }
    }

    GET_commImage(imghash) {

        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;

        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        
        //responseType: ResponseContentType.Blob
        let optionsComCat = new RequestOptions({ headers: headersComCat, responseType: 3 });

        try {
            let apiUrl = this.hrc_baseApiUrl + '/hrc/get/image' + "/" + imghash + '?api_key=' + this.baseApiKey;
            //alert(apiUrl);
            return this.http.get(apiUrl, optionsComCat).map(res => res.blob());
        } catch (e) {
            console.log("[ERROR] Get Method: " + e);
            return null;
        }
    }
    GET_addcommComment(imghash) {

        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;

        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        
        //responseType: ResponseContentType.Blob
        let optionsComCat = new RequestOptions({ headers: headersComCat, responseType: 3 });

        try {
            let apiUrl = this.hrc_baseApiUrl + '/hrc/user/comm/comment' + "/" + imghash + '?api_key=' + this.baseApiKey;
            //alert(apiUrl);
            return this.http.get(apiUrl, optionsComCat).map(res => res.blob());
        } catch (e) {
            console.log("[ERROR] Get Method: " + e);
            return null;
        }
    }
    
    GET_Base64(blobData) {
        try {
            let reader = new FileReader();
            reader.readAsDataURL(blobData);

            return Observable.create(observer => {
                reader.onload = ev => { observer.next(reader.result); }
                reader.onerror = err => { observer.error(err); }
            });
        } catch (e) {
            console.log("[ERROR] Unable to handle the GET_Base64: " + e);
        }
    }

    checkToken(localToken) {
        let apiUrl = this.baseApiUrl + '/user/auth?api_key=' + this.baseApiKey;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        return this.http.get(apiUrl, optionsComCat)
            .map((res: Response) => res.json()
                .catch((error: any) => {
                    localStorage.clear();
                    //this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    this._router.navigate(['/login']);
                    /*if (error.status === 401) {
                        return '-1';
                    }
                    else  {
                        return Observable.throw(new Error(error.status));
                    }  */
                }));
    }

    GET_MAPS_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        window.alert("Session Timeout. Please Login Again.");
                        //localStorage.clear();
                        this._router.navigate(['/welcome']);
                        return Observable.throw(new Error(error.status));
                    } else  {
                        return Observable.throw(error);
                    }
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_MAPS_data_loginRole(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });

        } else {
            console.log("[ERROR] Get Method 2: User Data is null");
            return null;
        }
    }

    GET_VRP_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });

        } else {
            console.log("[ERROR] Get Method 2: role_lvl is null");
            return null;
        }
    }

    GET_PPS_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.maps_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });

        } else {
            console.log("[ERROR] Get Method 2: role_lvl is null");
            return null;
        }
    }

    GET_HRC_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.hrc_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });

        } else {
            console.log("[ERROR] Get Method 2: role_lvl is null");
            return null;
        }
    }

    GET_EVL_data(api) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
            let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
            let headersComCat = new Headers();
            headersComCat.append('token', localToken);
            headersComCat.append('Content-Type', 'application/json');
            let optionsComCat = new RequestOptions({ headers: headersComCat });
            let apiUrl = this.evl_baseApiUrl + api + '?api_key=' + this.baseApiKey;
            return this.http.get(apiUrl, optionsComCat)
                .map((res: Response) => {
                    return res.json();
                })
                .catch((error: any) => {
                    return Observable.throw(error);
                });

        } else {
            console.log("[ERROR] Get Method 2: role_lvl is null");
            return null;
        }
    }
}
