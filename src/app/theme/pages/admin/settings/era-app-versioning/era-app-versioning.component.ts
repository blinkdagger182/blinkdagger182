import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vars } from '../settings-vars';
import { EAVVars } from './era-app-versioning-vars';
import { PagerService } from '../../job/shared/pager/pager.component';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-era-app-versioning-component',
    templateUrl: './era-app-versioning.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgEraAppVersioningComponent implements OnInit {
    title1 = Vars.title1;
    appVersioning = Vars.appVersioning;
    section1 = EAVVars.section1;
    appVersionAPI = EAVVars.appVersionAPI;
    postAppVerAdd = EAVVars.postAppVerAdd;
    postAppVerEdit = EAVVars.postAppVerEdit;
    loading = true;
    addNewVerForm: FormGroup;
    name: string = '';

    private readonly notifier: NotifierService;

    constructor(
        private route: ActivatedRoute,
        private pagerService: PagerService,
        private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
    ) {
        this.notifier = notifierService;
    }

    ngOnInit() {
        this.loading = false;
        this.setPageAppVer(1);
        this.getAppVersionList();

        this.addNewVerForm = new FormGroup({
            eavName: new FormControl("", Validators.required),//minLength(2)),
            eavValid: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewVerForm.setValue({
            eavName: "",
            eavValid: "",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-closed-ads-component',
            [
                'assets/js/superadmin/close-ads-alert.js',
            ]);
    }

    ListAppVers = [];
    getAppVersionList() {
        this.loading = true;
        this._GET_api_Service.GET_data(this.appVersionAPI).subscribe(data => {
            this.ListAppVers = data;
            this.setPageAppVer(1);
            this.loading = false;
        });
    }

    pagerAppVer: any = {}; pagedItemsAppVer: any[];
    setPageAppVer(page: number) {
        this.pagerAppVer = this.pagerService.getPager(this.ListAppVers.length, page, Vars.verMaxPerPage);
        this.pagedItemsAppVer = this.ListAppVers.slice(this.pagerAppVer.startIndex, this.pagerAppVer.endIndex + 1);
        window.scrollTo(0, 170);
    }

    selVer: any = {};
    selectedVer(verData) {
        this.selVer = verData;
    }

    appVersionToggle(value) {
        this.selVer = value;
        let data = {
            id: this.selVer.id,
            valid: this.selVer.valid === true || this.selVer.valid === 1 ? 1 : this.selVer.valid === false || this.selVer.valid === 0 ? 0 : '',
        }
        let closeAdsSend = this._POST_api_Service.POST_data(this.postAppVerEdit, data);
        let dataAppVer: any = {};
        let ret = closeAdsSend.subscribe(dataRes => {
            dataAppVer = dataRes;
            if (dataAppVer.status === "OK") {
                this.notifier.notify('success', 'Successfully Change Status!');
                // this.getAppVersionList();
            } else {
                this.notifier.notify('error', 'Error - Fail to Change Status !');
            }
        },
            error => {
                console.log('[ERROR + Ads Not Found]', error);
            }
        )

    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
    }

    appVersionAdd() {
        let data = {
            name: this.name,
            valid: this.addNewVerForm.get('eavValid').value,
        }
        let addVersionSend = this._POST_api_Service.POST_data(this.postAppVerAdd, data);
        let appVerRespond: any = {};
        let ret = addVersionSend.subscribe(dataRes => {
            appVerRespond = dataRes;
            if (appVerRespond.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New Version !');
                this.getAppVersionList();
            } else {
                this.notifier.notify('error', 'Error - Fail to Add New Version !');
            }
            this.resetForm();
        },
            error => {
                console.log('[ERROR + Fail to send data to server]', error);
            }
        )
    }

    resetForm() {
        this.addNewVerForm.setValue({
            eavName: "",
            eavValid: "",
        });
    }

}
