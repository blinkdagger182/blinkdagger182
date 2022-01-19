import {
    Component, OnInit, Inject, ViewChild,
    ViewContainerRef,
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
    selector: 'engage',
    templateUrl: './engage.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./engage.component.css'],
})
export class EngageComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
        constructor(
            @Inject(DOCUMENT) private document: any,
            private _router: Router,
            private _script: ScriptLoaderService,
            private _route: ActivatedRoute,
            private _authService: AuthenticationService,
            private _alertService: AlertService,
            private cfr: ComponentFactoryResolver) {
        }
    

    isEngage = true;
    ngOnInit() {
  
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser);

        if(currentUser){
            if(currentUser.isAdmin == true) {
                this._router.navigate(['/admin/unauthorized']);
            }
            else if (currentUser.isEngagement == false){
                this._router.navigate(['/unauthorized/1']);
            }
            else if (currentUser.isEngagement == true){
                this.document.location.href = '/engage';
                this.isEngage = true;
            }
        }
        else    
            this.isEngage = false;

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    
    }

    
    loginType = 'engage';
    signin() {
        
        this.loading = true;
        this._authService.login(this.model.email, this.model.password, this.loginType).subscribe(
            data => {
                this.document.location.href = '/engage';
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(error);
                this.loading = false;
            });

    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

}