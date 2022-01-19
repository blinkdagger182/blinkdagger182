import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { GlobalVariable } from "../../../environments/environment";
//import { GlobalVariable } from "../../../../ghcm-global";
//import { GET_Service } from "../../theme/api/get.service";

import { User } from "../_models/index";

@Injectable()
export class UserService {
    constructor(private http: Http) {//} ,private _GET_api_Service: GET_Service) {
    }

    verify() { ///user/auth
        // console.log('masuk sini 8');
        //console.log(this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json()));
        //return this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json());
        let baseUrl = GlobalVariable.BASE_API_URL;
        let apiKey = GlobalVariable.API_KEY;
        //console.log(baseUrl+'/user/auth');
        //console.log(this.http.get(baseUrl+'/user/auth?api_key=' + apiKey, this.jwt()).map((response: Response) => response.json()));
        //console.log("here");
        //console.log(this.http.get(baseUrl+'/user/auth?api_key=' + apiKey, this.jwt()).map((response: Response) => response.json()));
        return this.http.get(baseUrl + '/user/auth?api_key=' + apiKey, this.jwt()).map((response: Response) => response.json());
        // return this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string) {
        return this.http.post('/api/forgot-password', JSON.stringify({ email }), this.jwt()).map((response: Response) => response.json());
    }

    getAll() {
        // console.log('masuk sini 9');
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        // console.log('masuk sini 10');
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        // console.log('masuk sini 11');
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            // console.log('masuk sini');
            //console.log(currentUser.token);
            let headers = new Headers({ 'token': currentUser.token });
            //let headers = new Headers({ 'token': currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}