import {
    Component, OnInit, Inject, ViewChild,
    ViewContainerRef,
    ViewEncapsulation, ComponentFactoryResolver, ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from '../auth/_services/authentication.service';
import { AlertComponent } from '../auth/_directives/alert.component';
import { AlertService } from '../auth/_services/alert.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginCustom } from '../auth/_helpers/login-custom';
import { Helpers } from '../helpers';
import { GlobalVariable } from '../../environments/environment';
import { GET_Service } from './../../app/theme/api/get.service';
//import { Router } from '@angular/router';




@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../assets/welcome/css/styles.css', './welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
    deviceInfo = null;
    model: any = {};
    loading = false;
    
    loginForm: FormGroup;
    tokenExists = false;
   
    isUserChecked = true;
    isAdminChecked = false;
    isEngageChecked = false;

    env = GlobalVariable.ENV_NAME;
    env_dev = false; env_prod = false; env_staging = false;
    companyLogin = ['Telekom Malaysia', 'GITN', 'MMU', 'MENARA KL', 'R&D', 'VADS', 'Yellow Pages', 'Fiberail'];

    @ViewChild('loginModalBtn') loginModalBtn: ElementRef;
    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _script: ScriptLoaderService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _alertService: AlertService,
        private deviceService: DeviceDetectorService,
        private _authService: AuthenticationService,
        private cfr: ComponentFactoryResolver,
        private _GET_api_Service: GET_Service,
    ) {
        this.epicFunction();
    }
    
    returnUrl: string;
    loginPage = false;
    loginAdmin = false;
    dashUrl: string;
    
    downTime:string;
    
    loginType = 'user';
    ngOnInit() {
        let url = this._router.url.split('?');
        if(url[0] === "/welcome") {
            this.loginType = 'user';
            this.isUserChecked = true; this.isAdminChecked = false; this.isEngageChecked = false; 
            this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/index';
        }
        else if(url[0] === "/admin") {
            this.loginType = 'admin';
            this.isUserChecked = false; this.isAdminChecked = true; this.isEngageChecked = false;
            this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin/index'; 
        }
        else {
            this.loginType = 'engage';
            this.isUserChecked = false; this.isAdminChecked = false; this.isEngageChecked = true;
            this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/engage'; 
        }

    if(localStorage.getItem('currentUser') != null )
     this.logout();

    console.log("returnUrl",this.returnUrl);

        switch (this.env) {
            case 'dev':
                this.env_dev = true; break;
            case 'prod':
                this.env_prod = true; break;
            case 'staging':
                this.env_staging = true; break;
        }
        console.log(this.env)

      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
     
         if (currentUser && currentUser.token) {
            this.tokenExists = true;
        }

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'
        ], true).then(() => {
                Helpers.setLoading(false);

            });

        this.loginForm = new FormGroup({
            userName: new FormControl(null, Validators.required),
            passWord: new FormControl(null, Validators.required),
         });
    }


    menuClicked(path) {
        this._router.navigate([path]);
    }

    downtimeAPI():Promise<any> {
        return new Promise((resolve,reject)=>{
            this.downTime= '/era/app/downtimeStatus';

            this._GET_api_Service.GET_data_(this.downTime).subscribe(data => {

                resolve(data[0].status_web);
    
            })
            
        })
    }
  
    loginSubmit() {
        this.loading = true;
        let username = this.loginForm.get('userName').value;
        let password = this.loginForm.get('passWord').value;

        this.downtimeAPI().then((data) => { 
            if(data == 0) {
               
            this._authService.login(username, password, this.loginType).subscribe(
            data => {
                
                        localStorage.setItem('filter', 'all');
                        this._router.navigate([this.returnUrl]);
                       
                        this.document.location.href = this.returnUrl;
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(error);
                this.loading = false;
            });
        }  else {
                this._router.navigate(['/downtime']);
            }
            })


    }
         
       
  
    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-welcome',
            [
                'assets/welcome/js/jquery-3.3.1.min.js',
                'assets/welcome/js/bootstrap.min.js',
                'assets/welcome/js/popper.min.js',
                'assets/welcome/js/tilt.jquery.js',
                'assets/welcome/js/owl.carousel.min.js',
                'assets/welcome/js/jquery.validate.min.js',
                'assets/welcome/js/additional-methods.min.js',
                'assets/welcome/js/contact.js',
                'assets/welcome/js/script.js',
                'assets/welcome/js/scroll.js',
            ]);
    }


    goAndroid() {
        let url = 'https://play.google.com/store/apps/details?id=my.com.tmrnd.ghcm';
        window.open(url, "_blank");
    }

    goIOS() {
        let url = 'https://apps.apple.com/my/app/era-employee-app/id1503518283';
        window.open(url, "_blank");
    }

    goHuawei() {
        let url = 'https://appgallery.huawei.com/#/app/C102967195';
        window.open(url, "_blank");
    }

    android: Boolean;
    iPhone: Boolean;
    isDesktopDevice: Boolean;
    epicFunction() {
        this.android = false;
        this.iPhone = false;
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.isDesktopDevice = this.deviceService.isDesktop();
        if (this.deviceInfo.device === 'Android') {
            this.android = true;
        }
        else if (this.deviceInfo.device === 'iPhone') {
            this.iPhone = true;
        }
    }

    logout(){
        let loginType = 'user';
        if (JSON.parse(localStorage.getItem('currentUser')).isAdmin == true) loginType = 'admin';
        if (JSON.parse(localStorage.getItem('currentUser')).isEngagement == true) loginType = 'engage';

        //user
        if (loginType !== 'user'){
            Helpers.setLoading(true);
            this._authService.logout();
        } else {
            this._router.navigate(['/index']);
        }
        
        //admin
        if (loginType !== 'admin'){
            Helpers.setLoading(true);
            this._authService.logout();
        } else {
            this._router.navigate(['/admin/index']);
        }

        //engage
        if (loginType !== 'engage'){
            Helpers.setLoading(true);
            // reset login status
            this._authService.logout();
        } else {
            this._router.navigate(['/engage']);
        }
    }

    yearNow() {
        let now = new Date().getFullYear();
        return now
    }

}