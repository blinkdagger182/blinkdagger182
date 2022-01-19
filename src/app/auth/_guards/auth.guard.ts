import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log('masuk sini 12');
        //console.log(currentUser);
        //console.log(this._userService.verify());
        if (!currentUser || !currentUser.token) {
            
            //SKIP LOGIN MIDDLEWARE-EIZ
            // if(state.url == '/index')
            //     this._router.navigate(['/welcome'], { queryParams: { returnUrl: state.url } });
            // if(state.url == '/admin')
            //     this._router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
            // if(state.url == '/engagement')
            //     this._router.navigate(['/engagement'], { queryParams: { returnUrl: state.url } });
            console.log(state.url)
            let urlStart = state.url.split('/')[1];
            console.log(urlStart)

            if(urlStart == 'admin')
                this._router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
            else if(urlStart == 'engagement' || urlStart == 'engage' )
                this._router.navigate(['/engagement'], { queryParams: { returnUrl: state.url } });
            else if(urlStart == 'idp')
                this._router.navigate(['/idp'], { queryParams: { returnUrl: state.url } });
            else //if(urlStart == 'index')
                this._router.navigate(['/welcome'], { queryParams: { returnUrl: state.url } });


        } else {
            return this._userService.verify()
                .map(
                data => {
                    //if (data !== null) {
                    if (data && data.results) {
                        // logged in so return true
                        let usrLoginLvl = currentUser;//JSON.parse(localStorage.getItem('currentUser'));
                        let urlArr = (state.url).split("/");
                        let admPage = false;
                        let engPage = false;
                        let idpPage = false;
                        let usrPage = false;

                        // for (let i=0; i<urlArr.length; i++){
                        // if (urlArr[i].toLocaleUpperCase().trim()=='ADMIN') admPage=true;
                        // }     
                   
                        if (urlArr[1].toLocaleUpperCase().trim() == 'ADMIN') admPage = true;
                        else if (urlArr[1].toLocaleUpperCase().trim() == 'ENGAGE') engPage = true;
                        // else if (urlArr[1].toLocaleUpperCase().trim() == 'IDP') idpPage = true;
                        else usrPage = true;
                        
                        // if (((!usrLoginLvl) || (usrLoginLvl.isAdmin == false)) && (admPage)) {
                        if ( (usrLoginLvl) && (usrLoginLvl.isAdmin == false) && (admPage) ) {
                            if(usrLoginLvl.isEngagement == true){
                                this._router.navigate(['/engage/unauthorized']);
                            }
                            else{
                                this._router.navigate(['/unauthorized']); //user unauthorized
                            }
                            return false;      
                        } 
                        else if ( (usrLoginLvl) && (usrLoginLvl.isAdmin == true) && (!admPage) ) {
                            if(engPage)
                                this._router.navigate(['/admin/unauthorized']);
                            else
                                this._router.navigate(['/admin/unauthorized/1']);

                            return true;
                        } 

                        else if (((usrLoginLvl) && (usrLoginLvl.isEngagement == true)) && (!engPage)) {
                            if(admPage)
                                this._router.navigate(['/engage/unauthorized']);
                            else
                                this._router.navigate(['/engage/unauthorized/1']);

                            return true;
                        }
                        
                        else if (((usrLoginLvl) && (usrLoginLvl.isUser == true)) && (!usrPage)) {
                            if(admPage)
                                this._router.navigate(['/unauthorized']);
                            else
                                this._router.navigate(['/unauthorized/1']);

                            return true;
                        } 

                        else
                            return true;
                    } else {
                        // error when verify so redirect to login page with the return url
                        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                        return false;
                    }
                },
                error => {
                    // error when verify so redirect to login page with the return url               
                    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }).catch((error: any) => {
                    localStorage.clear();
                    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    if (error.status === 401) {
                        return '-1';
                    }
                    else {
                        return Observable.throw(new Error(error.status));
                    }
                });
        }
    }
}