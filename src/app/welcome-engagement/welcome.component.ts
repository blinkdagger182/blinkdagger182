import {
    Component, OnInit, Inject, ViewChild,
    ViewContainerRef, ElementRef,
    ViewEncapsulation, ComponentFactoryResolver
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../auth/_services/authentication.service';
import { AlertComponent } from '../auth/_directives/alert.component';
import { AlertService } from '../auth/_services/alert.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginCustom } from '../auth/_helpers/login-custom';
import { Helpers } from '../helpers';
import { GlobalVariable } from '../../environments/environment';


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
    other_login = false;

    env = GlobalVariable.ENV_NAME;
    env_dev = false; env_prod = false; env_staging = false;

    @ViewChild('loginModalButton') divClick: ElementRef;;
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
    ) {
        this.epicFunction();
    }

    returnUrl: string;
    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/engage';
        console.log("returnUrl",this.returnUrl);

        if(localStorage.getItem('currentUser') != null)
            this.logout();

        setTimeout(() => {
            this.divClick.nativeElement.click();
        }, 200);

        switch (this.env) {
            case 'dev':
                this.env_dev = true; break;
            case 'prod':
                this.env_prod = true; break;
            case 'staging':
                this.env_staging = true; break;
        }
        console.log(this.env)

        //console.log("localStorage :", localStorage);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.token) {
            this.tokenExists = true;
        }

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
        });

        this.loginForm = new FormGroup({
            userName: new FormControl(null, Validators.required),
            passWord: new FormControl(null, Validators.required),
        });
    }

    loginType = 'engage'; iamadmin = false;
    loginSubmit() {
        this.loading = true;
        let username = this.loginForm.get('userName').value;
        let password = this.loginForm.get('passWord').value;

        // (<any>$('.modal')).modal('hide');
        this._authService.login(username, password, this.loginType).subscribe(
            data => {
                // document.getElementById('close_btn').click();
                localStorage.setItem('filter', 'all');
                //this._router.navigate(['index']);
                //this.document.location.href = '/engage';
                this.document.location.href = this.returnUrl;

            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    token_Exists() {
        this.document.location.href = '/engage';
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
        if(this.env_prod) {
            let url = 'https://play.google.com/store/apps/details?id=my.com.tmrnd.ghcm&hl=en';
            window.open(url, "_blank");
        }
        else {
            let url = 'https://bit.ly/2LQSG5J';
            window.open(url, "_blank");
        }   
    }

    goIOS() {
        let url = 'itms-services://?action=download-manifest&url=https://bit.ly/2NK2a4n';
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
        // const isMobile = this.deviceService.isMobile();
        // const isTablet = this.deviceService.isTablet();
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

        if (loginType !== 'engage'){
            Helpers.setLoading(true);
            // reset login status
            this._authService.logout();
        } else {
            this._router.navigate(['engage']);
        }
    }
}