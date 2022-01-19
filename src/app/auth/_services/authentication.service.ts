import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { GlobalVariable } from "../../../environments/environment";
//import { GlobalVariable } from '../../../../ghcm-global';
//import { environment } from "environments/environment";
// we can now access environment.apiUrl
//const API_URL = environment.apiUrl;

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {
    }

    login(email: string, password: string, loginType: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        let data = new URLSearchParams()
        data.set('userid', email)
        data.set('password', password);

        // console.log(loginType);
        let apiLogin = '/user/portal/login'; ///user/login
        if (loginType.toLocaleUpperCase() == 'ADMIN') apiLogin = '/user/portal/admin/login'; ///admin/login
        if (loginType.toLocaleUpperCase() == 'ENGAGE') apiLogin = '/user/portal/engagement/login'; ///engagement/login
        if (loginType.toLocaleUpperCase() == 'IDP') apiLogin = '/user/portal/engagement/login'; ///IDP/login

        return this.http.post(GlobalVariable.BASE_API_URL + apiLogin + '?api_key=' + GlobalVariable.API_KEY, data, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token && (user.results == true)) {
                    // user.token = 'fake-jwt-token'; //20180725 - removed to get the actual token
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //user.token = 
                    // if (loginType.toUpperCase()=='ADMIN'){
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    // } else if (loginType.toUpperCase()=='USER'){
                    // localStorage.setItem('currentNormalUser', JSON.stringify(user));
                    // }
                    ///console.log(user.token);
                } /*else {
                    console.log("username error");
                    Error('Email or password is incorrect');
                    localStorage.setItem('currentUser', JSON.stringify(''));
                } */
            })
            .catch((error: any) => {
                if (error.status === 401) {
                    return Observable.throw('ID or password is incorrect');
                } else if (error.status === 0) {
                    return Observable.throw('Unable to connect server. Please contact your administrator');
                } else if (error.status === 429) {
                    return Observable.throw('ERA sedang melayan jumlah pelawat yang tinggi. Sila masuk semula diwaktu lapang.')
                }else {
                    return Observable.throw('Out of Service. Please contact your administrator. [ERROR ' + error.status + '] ')
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        //localStorage.removeItem('currentNormalUser');
    }
}
