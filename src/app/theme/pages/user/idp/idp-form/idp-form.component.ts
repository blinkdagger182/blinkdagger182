import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { En, My } from '../lang-vars';
import { enHelp, myHelp } from '../lang-help';
import { MyStates } from '../states';
import { Location } from '@angular/common';
import { IVars, INVars } from '../idp-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { DatePipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var $: any;

export interface IOption {
    staffNo: string,
    name: string
}

@Component({
    selector: 'user-idp',
    templateUrl: './idp-form.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../idp.component.css']
})

export class IDPFormComponent implements OnInit {

    private readonly notifier: NotifierService;
    formID;

    constructor(
        private http: Http, private _location: Location,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute,
        private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver,
        notifierService: NotifierService,
        private _script: ScriptLoaderService,
        private datePipe: DatePipe
    ) {
        this.notifier = notifierService;
        this.activeRoute.params.subscribe(params => {
            this.formID = params.idx;
        });

        this.createForms();
    }

    loading = true;
    states = MyStates;
    aspirationForm: FormGroup;
    strengthForm: FormGroup;
    areaOfDevForm: FormGroup;
    actionPlanForm: FormGroup;
    actionOutComeForm: FormGroup;
    mobilityForm: FormGroup;

    minNextReviewDate = new Date();
    nextReviwForm: FormGroup;

    dateNow = new Date();
    funcTrainingForm: FormGroup;
    leadTrainingForm: FormGroup;
    menteeNoteForm: FormGroup;
    feedbackMentorForm: FormGroup;
    copyActionPlanForm = new FormGroup({
        year: new FormControl(null, Validators.required),
        actionNum: new FormControl(null, Validators.required)
    })

    itemNo;
    enChecked: boolean = true;
    word: any;
    help: any;
    isAddData = true;

    options: IOption[];
    name: string = ''; found: boolean;

    funcFamily = false; funcCompetency = false; funcTraining = false;
    noCompData = false; noTrainData = false;
    descSelected = false;

    leadTraining = false;

    comClusOptDef = '-- Select Cluster --';
    funcFamOptDef = '-- Select Family --';
    comCompOptDef = '-- Select Competency --';
    comTrainOptDef = '-- Select Training --';

    addedTrainings = [];

    menteeValue;

    monthEN = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    monthMY = ["Januari", "Februari", "Mac", "April", "Mei", "Jun",
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
    monthWord = [];

    ngOnInit() {
        this.checkSelectedLang();
        // this.getSuperiorName();
        this.getIdpDetails();
        this.getFuncClusterList();
        this.getLeadCompetencyList();
        this.openidpDetails(this.formID);

        this.menteeValue = localStorage.getItem('menteeValue');
        this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;


    }

    getImage(image_url) {
        // console.log(image_url)
        let img = GlobalVariable.BASE_API_URL + '/get/image' + "/" + image_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {
            if (data) {
                this.idpOwnerPic = img;
            }
            else {
                this.idpOwnerPic = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            }
        }, err => {
            this.idpOwnerPic = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
        });
    }

    tohideInput(mentorVal) {
        if (mentorVal.length === 0) {
            this.multiSelUser = [];
            return true;
        }
        else
            return false;
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        if (this.name.length > 2) {
            if (this.multiSelUser.length < 1) {
                this.searchUser(this.name);
            }
        }
    }

    loading2 = false;
    idpDetails;
    idpSummary;
    idpStrengths;
    idpArea;
    idpActionPlans;
    idpMobilty;
    myidp_aspiration;
    myidp_idp_name;
    myidp_ownerName;
    myidp_reptToName;
    myidp_mobility;
    myidp_text_en;
    myidp_pers_no;
    myidp_staff_no;
    myIDPComplStart;
    myIDPComplDue;
    myIDPStart;
    myIDPComplete = "";
    myIDPDue;
    myIDPComplStartCheck;
    myIDPComplDueCheck;
    flexible;
    location;
    funct;
    reason;
    due;
    submit_on; approve_on; complete_on; review_on;
    mobilityErr;
    selMobFunctions = [];
    selMobSpecify;
    theDate; userId; totalActionPlan; totalAPCompl; traindet;
    docDefinition;
    downloading = true;
    downloading2 = true;
    downloading3 = true;
    filterForm: FormGroup;
    currentDate;
    currentDateChecking = "";
    idpData;
    mobilityQFlex = INVars.mobilityQFlex;
    mobilityQFunc = INVars.mobilityQFunc;
    mobilityQLoc = INVars.mobilityQLoc;
    mobilityQReason = INVars.mobilityQReason;
    mobilityQDue = INVars.mobilityQDue;
    currYr: number = new Date().getFullYear();
    titlePdf: String;


    imgDataUrl;
    image_url;

    onClickDownloadBtn() {
        // Export it as PDF
        pdfMake.createPdf(this.docDefinition).download(this.titlePdf);
        this.imgDataUrl = '';
    }



    openidpDetails(item) {
        this.loading2 = true;
        $('#info_tab').click();
        this.idpDetails = item;

        let posData = { id: item };

        this._POST_api_Service.POST_IDP_data(INVars.getidpDetails, posData).subscribe(res => {
            //console.log(res);
            this.loading = false;
            this.idpSummary = res.summary;
            this.idpStrengths = this.idpSummary.strength;
            this.idpArea = this.idpSummary.area;
            this.idpActionPlans = this.idpSummary.action;
            this.idpMobilty = this.idpSummary.mobility;
            this.myidp_aspiration = this.idpSummary.details[0].aspiration;
            this.myidp_idp_name = this.idpSummary.idp[0].idp_name;
            this.myidp_mobility = this.idpSummary.idp[0].mobility;
            this.myidp_ownerName = this.idpSummary.details[0].ownerName;
            this.myidp_reptToName = this.idpSummary.details[0].reptToName;
            this.myidp_text_en = this.idpSummary.details[0].text_en;
            this.myidp_pers_no = this.idpSummary.details[0].pers_no;
            this.myidp_staff_no = this.idpSummary.details[0].staff_no;
            if (this.idpSummary.idp[0].idp_start) this.myIDPStart = new Date(this.idpSummary.idp[0].idp_start).getDate() + '/' + (new Date(this.idpSummary.idp[0].idp_start).getMonth() + 1) + '/' + new Date(this.idpSummary.idp[0].idp_start).getFullYear();
            if (this.idpSummary.idp[0].idp_due) this.myIDPDue = new Date(this.idpSummary.idp[0].idp_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_due).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_start) this.myIDPComplStart = new Date(this.idpSummary.idp[0].idp_cmpl_start).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_start).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_start).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_start) this.myIDPComplStartCheck = this.idpSummary.idp[0].idp_cmpl_start;
            if (this.idpSummary.idp[0].idp_cmpl_due) this.myIDPComplDue = new Date(this.idpSummary.idp[0].idp_cmpl_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_due).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_due) this.myIDPComplDueCheck = this.idpSummary.idp[0].idp_cmpl_due;
            if (this.idpSummary.details[0].complete_on) this.myIDPComplete = new Date(this.idpSummary.details[0].complete_on).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.details[0].complete_on).getMonth())] + ' ' + new Date(this.idpSummary.details[0].complete_on).getFullYear();

            this.currentDate = new Date().toISOString();

            if (this.idpMobilty.length > 0) {
                this.mobilityErr = false;
                this.flexible = this.idpSummary.mobility[0].flexible;
                this.location = this.idpSummary.mobility[0].location;
                this.funct = this.idpSummary.mobility[0].funct;
                this.selMobFunctions = this.funct.split('|');
                if (res.summary.mobility[0].specify) this.selMobSpecify = res.summary.mobility[0].specify.split('|');
                this.reason = this.idpSummary.mobility[0].reason;
                this.due = this.idpSummary.mobility[0].due;
            }

            if (this.idpSummary.idp[0].mobility === 1 && this.idpMobilty && this.idpMobilty.length < 1) {
                this.mobilityErr = true;
            }

            this.submit_on = this.idpSummary.details[0].submit_on;
            this.approve_on = this.idpSummary.details[0].approve_on;
            this.complete_on = this.idpSummary.details[0].complete_on;
            this.review_on = this.idpSummary.details[0].review_on;
            this.image_url = this.idpSummary.details[0].image_url;
            let theUrl = `${INVars.getProfilePictureAPI}/${this.image_url}`;
            this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
            let profilePictureSend = this._GET_api_Service.GET_Picture(theUrl);
            this.totalAPCompl = this.idpActionPlans.filter(t => t.action_status == 'Complete');
            this.totalActionPlan = this.idpActionPlans.length < 1 ? '' : '(' + this.totalAPCompl.length + '/' + this.idpActionPlans.length + ' Completed)';

            try {
                this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;
            } catch (e) {
                console.error("Failed to get localStorage for currentUser");
            }

            profilePictureSend.subscribe(pictureResults => {
                this.imgDataUrl = '';
                let profilePictureBase64 = this._GET_api_Service.GET_Base64(pictureResults);
                profilePictureBase64.subscribe(myData => {
                    this.imgDataUrl = myData;
                });
            }, () => {
                this.imgDataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACCAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgj/xAAzEAACAQMCAgkDAQkAAAAAAAAAAQIDBBESMQUhBhMVQVFhZKPhFCJxNSMyQnOBgrGy0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7LAAAAAAG8Bc0ABrqVqVPHWVIQztqkke4yUkmuae2AMgIAAAAAAAAAHsaq9aFGm6k5KKXibXsV3pBdxq1lbww1TfOXn4AeL3i9xcZjT/ZQ8nzf9SPnKU5OU5SlJ97eWYAGMG2hXrW+XRqSh+NjWAJu041CNKEK8ZOp/FLCxv/AMJmlONSnGcXmMllPxKWSXArvqbjqZyeifKOZYUQLIAAAAAAAA9ir8eVNcSno3wnL84LPOWmEpPuWSnXdZ17qpWw1rlnDewGsAAAAAMweJxaaWGubMAC50akalKM4yUk1utmezk4VFQsKKUnJaU8vzOsAAAAAA5+J/p9x/Lf+Colm47WdKwko7zej8LvKyAAAAAADNNKVSMXs2kYOnhdOVXiFGKjqxJSfhhbgWulThSpxhBYjFYSPQAAAAAABEdJot21KXdGeGQBaeM2/X2E1qacPvSS3x3FWAAAAAABL9G6LdWdxn7UtGMbtkTThKpVjCCzKTwi3WVvG2toUo9278WBvAAAAAAABiaTi09mioX9BW97UorZPl+HzLg8YIDpLGmqtKSkusaw15dwEQAAAAAlejdOErqpUksyhH7fLJYVsVzo7V0XkqWM9ZHfO2CxLYDIAAAAAcl9xC3tVJSmnUS/cW7Osq3Hf1Wt/b/qgNlbjN1OadOMacc7b5/JwVatStUc6knKT72zyAAAAAADMZSjJSi2muaZP8N4tSqU4wuZaKi5Z7pFfMY55Au2UZKtacUureDhqVSPdry8Fjsa6ubWFeKaUs8n5PAG4AACLv8AhH1V1Ov9Ro1Y5aM4wseJKACE7A9X7fyOwPV+38k2AITsD1ft/I7A9X7fyTYAhOwPV+38jsD1ft/JNgCE7A9X7fyOwPV+38k2AITsD1ft/JKWFv8AS2sKGvXpz92MZy8m8AAAAAAAAAAAAAAAAAAAAAAH/9k=';
            });

            this.titlePdf = `IDP ${this.idpSummary.idp[0].idp_year} - ${this.idpSummary.details[0].staff_no}.pdf`;
            setTimeout(() => {
                this.downloading3 = false;
                let profile_img = this.imgDataUrl;
                let idp_myidp_ownerName = this.myidp_ownerName;
                let idp_myidp_reptToName = this.myidp_reptToName === null || this.myidp_reptToName === '' ? '-' : this.myidp_reptToName;
                let idp_myidp_pers_no = this.myidp_pers_no;
                let idp_myidp_staff_no = this.myidp_staff_no;
                let idp_myidp_text_en = this.myidp_text_en;
                let idp_submit_on = this.submit_on === null ? '-' : moment(this.submit_on).format("DD-MM-YYYY");
                let idp_approve_on = this.approve_on === null ? '-' : moment(this.approve_on).format("DD-MM-YYYY");
                let idp_review_on = this.review_on === null ? '-' : moment(this.review_on).format("DD-MM-YYYY");
                let idp_complete_on = this.complete_on === null ? '-' : moment(this.complete_on).format("DD-MM-YYYY");
                this.docDefinition = {
                    pageSize: 'A4',
                    pageMargins: [20, 90],
                    watermark: { text: `By: ${this.userId}@${this.theDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
                    background: function (page) {
                        if (page !== 1) {
                            return [
                                {
                                    columns: [
                                        {
                                            width: 175,
                                            alignment: 'center',
                                            table: {
                                                width: ['auto'],
                                                body: [
                                                    [{ image: profile_img, width: 95, height: 95 }],
                                                    [{ text: `\n` }],
                                                    [{ text: `${idp_myidp_ownerName}`, style: 'profile_name' }],
                                                    [{ columns: [{ text: `Personnel No `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_pers_no} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Staff ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_staff_no} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Status `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_text_en} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Reporting To `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_reptToName} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Date Submit `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_submit_on} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Date Approve `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_approve_on} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Date Review `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_review_on} `, style: 'blackSize10' },] }],
                                                    [{ columns: [{ text: `Date Complete `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_complete_on} `, style: 'blackSize10' },] }],
                                                ]
                                            },
                                            layout: 'noBorders',
                                            margin: [20, 105, 0, 0]
                                        },
                                        {

                                        }
                                    ],
                                }
                            ];
                        }
                    },
                    header: {},
                    footer: function (currentPage, pageCount) {
                        return {
                            // text: `Profile of: ${res.profile[0].Name}, ${res.profile[0].Staff_No} \n
                            //         Page : ` + currentPage.toString() + ' / ' + pageCount,
                            text: 'Page : ' + currentPage.toString() + ' / ' + pageCount,
                            color: 'gray',
                            bold: 'true',
                            alignment: 'right',
                            fontSize: 11,
                            margin: 20
                        };
                    },
                    content: [],
                    images: {
                        logoEra: 'data:image/png;base64,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',
                        logoTM: 'data:image/png;base64,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'
                    },
                    styles: {
                        era_title: {
                            color: '#ea1819',
                            fontSize: 20,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 20, 0, 0]

                        },
                        profile_name: {
                            bold: true,
                            color: '#fd5806',
                            fontSize: 12,
                            alignment: 'left',
                        },
                        header: {
                            color: '#fd5806',
                            bold: true,
                            fontSize: 14,
                        },
                        profile_header: {
                            color: '#5e6063',
                            bold: true,
                            fontSize: 12,
                            alignment: 'left',
                        },
                        wm_title: {
                            bold: true,
                            fontSize: 30,
                            color: '#5e6063',
                            opacity: 0.3
                        },
                        wm_staffId: {
                            bold: true,
                            fontSize: 40,
                            color: '#5e6063',
                            opacity: 0.3
                        },
                        lst_data: {
                            bold: true,
                            fontSize: 11,
                        },
                        lst_title2: {
                            fontSize: 11,
                            bold: false,
                            color: '#5c6066',
                        },
                        lst_data2: {
                            bold: true,
                            fontSize: 11,
                            margin: [20, 0, 0, 5]
                        },
                        lst_data_color: {
                            bold: true,
                            fontSize: 11,
                            color: '#fd5806'
                        },
                        red10: {
                            fontSize: 10,
                            color: 'red',
                            bold: true
                        },
                        lst_title_no: {
                            fontSize: 11,
                            bold: false,
                            color: '#5c6066',
                        },
                        lst_title: {
                            fontSize: 11,
                            bold: false,
                            color: '#5c6066',
                            margin: [20, 0, 0, 0]

                        },
                        bold: {
                            bold: true
                        },
                        greySize10: {
                            fontSize: 10,
                            color: '#5e6063',
                            bold: true,
                            alignment: 'left'
                        },
                        blackSize10: {
                            fontSize: 10,
                            bold: true,
                            alignment: 'left'
                        }
                    }
                };

                // Populate the header of the PDF 
                this.docDefinition.header = {
                    table: {
                        widths: ['auto', '*', 'auto'],
                        //headerRows: 1,
                        body: [
                            [{ rowSpan: 3, image: 'logoEra', fit: [80, 80], margin: [0, 7, 0, 10], bold: true }, { rowSpan: 3, text: `${this.idpSummary.idp[0].idp_name}`, style: 'era_title' }, { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                            [{ text: `` }, '', ''],
                            [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                            [{ colSpan: 3, text: '', fillColor: '#ff3300' }]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [20, 20, 20, 40]
                };

                // Populate the content of PDF
                let myContent;
                this.docDefinition.content = [];

                // We invoke another request to convert the blob to Base64
                // let profilePictureBase64 = this._GET_api_Service.GET_Base64(pictureResults);
                // profilePictureBase64.subscribe (myData => {


                // Remarks:
                // URL to convert to Base64 image
                // https://www.base64-image.de/
                //console.log(res.profile[0])
                myContent = [
                    {
                        // 0.
                        table: {
                            widths: [350],
                            body: [
                                [{ text: '' }]
                            ]
                        },
                        layout: 'noBorders',
                        margin: [0, 20, 0, 5]
                    },
                    {
                        // 1.

                        columns: [
                            {
                                width: 165,
                                alignment: 'center',
                                table: {
                                    width: ['auto'],
                                    body: [
                                        [{ image: profile_img, width: 95, height: 95 }],
                                        [{ text: `\n` }],
                                        [{ text: `${idp_myidp_ownerName}`, style: 'profile_name' }],
                                        [{ columns: [{ text: `Personnel No `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_pers_no} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Staff ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_staff_no} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Status `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_text_en} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Reporting To `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_myidp_reptToName} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Date Submit `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_submit_on} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Date Approve `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_approve_on} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Date Review `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_review_on} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ text: `Date Complete `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${idp_complete_on} `, style: 'blackSize10' },] }],
                                    ]
                                },
                                layout: 'noBorders',
                            },
                            {
                                width: 'auto', margin: 5,
                                type: 'none',
                                ul:
                                    [
                                        {   //ul[0]
                                            table: {
                                                body: [
                                                    [{ text: 'Career Aspiration', style: 'header' }]
                                                ]
                                            }, layout: 'noBorders',
                                        },
                                        {   //ul[1]
                                            text: '\n'
                                        },
                                        {   //ul[2]
                                            type: 'none',
                                            ul: [
                                                { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                            ]
                                        },

                                        {   //ul[3]
                                            text: '\n\n'
                                        },

                                        {   //ul[4]
                                            table: {
                                                body: [
                                                    [{ text: 'Strength', style: 'header' }]
                                                ]
                                            }, layout: 'noBorders',
                                        },
                                        {   //ul[5]
                                            text: '\n'
                                        },
                                        {   //ul[6]
                                            type: 'none',
                                            ul: [
                                                { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                            ]
                                        },

                                        {   //ul[7]
                                            text: '\n\n'
                                        },

                                        {   //ul[8]
                                            table: {
                                                body: [
                                                    [{ text: 'Area of Development', style: 'header' }]
                                                ]
                                            }, layout: 'noBorders',
                                        },
                                        {   //ul[9]
                                            text: '\n'
                                        },
                                        {   //ul[10]
                                            type: 'none',
                                            ul: [
                                                { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                            ]
                                        },

                                        {   //ul[11]
                                            text: '\n\n'
                                        },

                                        {   //ul[12]
                                            table: {
                                                body: [
                                                    [{ text: `Action Plan ${this.totalActionPlan}`, style: 'header' }]
                                                ]
                                            }, layout: 'noBorders',
                                        },
                                        {   //ul[13]
                                            text: '\n'
                                        },
                                        {   //ul[14]
                                            type: 'none',
                                            ul: [
                                                { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                            ]
                                        },

                                        {   //ul[15]
                                            text: '\n\n'
                                        },

                                        {   //ul[16]
                                            table: {
                                                body: [
                                                    [{ text: 'Mobility Assessment', style: 'header' }]
                                                ]
                                            }, layout: 'noBorders',
                                        },
                                        {   //ul[17]
                                            text: '\n'
                                        },
                                        {   //ul[18]
                                            type: 'none',
                                            ul: [
                                                { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                            ]
                                        },

                                        {   //ul[19]
                                            text: '\n\n'
                                        },


                                    ],

                            },

                        ]
                    },

                ];


                // Populate - aspiration (ul[2])              
                if (this.idpSummary.details[0].aspiration) {
                    myContent[1].columns[1].ul[2] = [{ text: `${this.idpSummary.details[0].aspiration}`, style: 'lst_data' },];

                }

                // Populate - strength (ul[6])
                if (res.summary.strength.length) {
                    let strengthList = {
                        type: 'none',
                        ul: [
                        ]
                    };
                    let num = 1;
                    res.summary.strength.forEach(function (myVal) {
                        let myRow = [];
                        var n = (num < 10) ? ('0' + num++) : num++;
                        myRow.push({ columns: [{ width: 20, text: `${n}.  `, style: 'red10' }, { text: `${myVal.strength}`, style: 'lst_data' }] });
                        myRow.push({ text: '\n' });
                        strengthList.ul.push(myRow);
                    });
                    myContent[1].columns[1].ul[6] = strengthList;
                }

                // Populate - area (ul[10])
                if (res.summary.area.length) {
                    let areaList = {
                        type: 'none',
                        ul: [
                        ]
                    };
                    let num = 1;
                    res.summary.area.forEach(function (myVal) {
                        let myRow = [];
                        var n = (num < 10) ? ('0' + num++) : num++;
                        myRow.push({ columns: [{ width: 20, text: `${n}.  `, style: 'red10' }, { text: `${myVal.descr}`, style: 'lst_data' }] });
                        myRow.push({ text: '\n' });
                        areaList.ul.push(myRow);
                    });
                    myContent[1].columns[1].ul[10] = areaList;
                }

                // Populate - action plan (ul[14])
                if (res.summary.action.length) {
                    let actionList = {
                        type: 'none',
                        ul: [
                        ]
                    };
                    let num = 1;
                    //let nmbr = 0;
                    // var appendString;
                    res.summary.action.forEach(function (myVal) {
                        let myRow = [];
                        let traindet = myVal.training_details;
                        var appendString = '';
                        if (traindet) {
                            var str_array = traindet.split(',');
                            var x;
                            for (x of str_array) {
                                x = x.trim();
                                appendString += x.substring(x.lastIndexOf("|") + 1) + ', ';
                            }
                            appendString = appendString.trim();
                            appendString = appendString.substring(0, appendString.length - 1);
                        }
                        var n = (num < 10) ? ('0' + num++) : num++;
                        myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Description ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.descr}`, style: 'lst_data' }] });
                        myRow.push({ columns: [{ width: 100, text: 'Start Date ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${moment(myVal.start).format("DD-MM-YYYY")}`, style: 'lst_data' }] });
                        myRow.push({ columns: [{ width: 100, text: 'Due Date ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${moment(myVal.due).format("DD-MM-YYYY")}`, style: 'lst_data' }] });
                        myRow.push({ columns: [{ width: 100, text: 'Competency ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.competency}`, style: 'lst_data' }] });
                        myRow.push({ columns: [{ width: 100, text: 'How ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.how_en}`, style: 'lst_data' }] });
                        if (myVal.training_details)
                            myRow.push({ columns: [{ width: 100, text: 'Training Details ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${appendString}`, style: 'lst_data' }] });
                        // else
                        //     myRow.push({ columns: [{ width: 100, text: 'Training Details ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `-`, style: 'lst_data' }] });
                        if (myVal.mentor_name)
                            myRow.push({ columns: [{ width: 100, text: 'Mentor Name ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.mentor_name}`, style: 'lst_data' }] });
                        // else
                        //     myRow.push({ columns: [{ width: 100, text: 'Mentor Name ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `-`, style: 'lst_data' }] });
                        myRow.push({ columns: [{ width: 100, text: 'Status ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.action_status}`, style: 'lst_data' }] });
                        if (myVal.outcome)
                            myRow.push({ columns: [{ width: 100, text: 'Outcome ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.outcome}`, style: 'lst_data' }] });
                        myRow.push({ text: '\n' });
                        actionList.ul.push(myRow);
                    });

                    myContent[1].columns[1].ul[14] = actionList;

                }

                // Populate - mobility (ul[18])

                if (this.idpSummary.idp[0].mobility == 1 && res.summary.mobility.length) {
                    if (this.idpSummary.mobility[0].flexible == 1) {
                        myContent[1].columns[1].ul[18] = [
                            { width: 100, text: `Flexible to be mobile?`, style: 'lst_title2' }, { text: `Yes`, style: 'lst_data2' },
                            { width: 100, text: `Willing to work in other locations?`, style: 'lst_title2' }, { text: `${this.idpSummary.mobility[0].location.replace('|', ', ')}`, style: 'lst_data2' },
                            { width: 100, text: `Willing to explore in other function?`, style: 'lst_title2' }, { text: `${this.idpSummary.mobility[0].funct.replace('|', ', ')}`, style: 'lst_data2' }]
                    }
                    else if (this.idpSummary.mobility[0].flexible == 0) {
                        myContent[1].columns[1].ul[18] = [
                            { width: 100, text: `Flexible to be mobile?`, style: 'lst_title2' }, { text: `No`, style: 'lst_data2' },
                            { width: 100, text: `Why`, style: 'lst_title2' }, { text: `${this.idpSummary.mobility[0].reason}`, style: 'lst_data2' },
                            { width: 100, text: `Until when`, style: 'lst_title2' }, { text: `${moment(this.idpSummary.mobility[0].due).format("DD-MM-YYYY")}`, style: 'lst_data2' }]
                    }
                    ;
                }

                this.docDefinition.content.push(myContent);
                //});
            }, 1500);

        }, error => {
            this.loading2 = false;
            console.log('[ERROR] Fail to fetch idp details: ' + error);
        });
    }


    dataSearch: any = {};
    newData: any = [];
    searchUser(name) {
        let data = {
            ownStaffNo: JSON.parse(localStorage.getItem('currentUser')).userid,
            text: name
        }
        let searchUserSend = this._POST_api_Service.POST_IDP_data('/idp/admin/search_supv', data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.dataSearch = dataRes;
            if (this.dataSearch.results) {
                if (this.dataSearch.results.length > 10) {
                    this.newData = this.dataSearch.results.slice(0, 10);
                }
                else {
                    this.newData = this.dataSearch.results;
                }
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

    public formatter(option: IOption, query?: string): string {
        return `${option.staffNo} - ${option.name}`;
    }

    multiSelUser: any = [];
    disable = false;
    multiSelectedUser(user) {
        if (user.length <= 1) {
            this.actionPlanForm.patchValue({
                mentorName: user[0].staffNo + ' - ' + user[0].name
            })
            this.multiSelUser = [{
                staffNo: user[0].staffNo,
                name: user[0].name,
                employeeNo: user[0].employeeNo
            }];
            this.disable = false;
        }
        else if (user.length > 1) {
            this.disable = true;
        }
        this.newData = [];
    }

    isOwner;
    isSupervisor;
    idpStatus;

    idpAspitation;


    idpOwnerPic = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
    getIdpDetails() {
        let api = IVars.getIdpDetails;
        let posData = {
            id: this.formID
        }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {

            this.loading = false;
            this.idpStatus = res.summary.details[0].status;
            this.idpSummary = res.summary;
            this.isOwner = res.summary.details[0].isOwner;
            this.isSupervisor = res.summary.details[0].isSupervisor;
            this.idpDetails = res.summary.details;
            this.getImage(this.idpDetails[0].image_url);

            this.idpAspitation = res.summary.details[0].aspiration;
            this.idpStrengths = this.idpSummary.strength;
            this.idpArea = this.idpSummary.area;
            this.idpActionPlans = this.idpSummary.action;
            this.idpMobilty = this.idpSummary.mobility;


            if (this.idpStatus != 1) {
                this.aspirationForm.disable();
                this.strengthForm.disable();
                this.areaOfDevForm.disable();
                this.actionPlanForm.disable();
                this.mobilityForm.disable();
            }

            if (this.isOwner) {
                this.nextReviwForm.disable();
            }

            if (this.idpStatus != 3) this.menteeNoteForm.disable();


            if (this.isSupervisor) {
                this.aspirationForm.disable();
                this.strengthForm.disable();
                this.areaOfDevForm.disable();
                this.actionPlanForm.disable();
                this.mobilityForm.disable();

                if (this.idpStatus === 3 || this.idpStatus === 4) {
                    this.nextReviwForm.disable();
                }
            }

            this.setIdpData();
        }, err => {
            console.log("Error - Failed to fetch IDP Details", err);
        })
    }

    clusterList = [];
    getFuncClusterList() {
        this.selFuncTraining = [];
        this.clusterList = []
        this._GET_api_Service.GET_data(IVars.getTrainCluster).subscribe(data => {
            this.clusterList.push({ cluster_id: 0, cluster: this.comClusOptDef });
            this.funcTrainingForm.patchValue({ funcComCluster: this.clusterList[0].cluster_id })
            for (let j = 0; j < data.length; j = j + 1) {
                this.clusterList.push({ cluster_id: data[j].CLUSTER_ID, cluster: data[j].CLUSTER_NAME });
            }
        },
            error => {
                console.log('[ERROR All Access] ' + error);
            })
    }

    funcFamList = [];
    funcJobClusChange() {
        this.selFuncTraining = [];
        this.funcFamily = false; this.funcCompetency = false; this.funcTraining = false;
        this.noCompData = false; this.noTrainData = false;
        this.descSelected = false;
        let funcFamData = [];
        this.funcFamList = [];
        this.funcCompList = [];
        this.funcTrainList = [];
        let posData = {
            CLUSTER_ID: this.funcTrainingForm.get('funcComCluster').value,
        }
        this._POST_api_Service.POST_data(IVars.getTrainFamily, posData).subscribe(data => {
            funcFamData = data;
            if (funcFamData.length > 0) {
                this.funcFamily = true; this.funcCompetency = false; this.funcTraining = false;
                this.descSelected = false;

                this.funcFamList.push({ family_id: 0, family: this.funcFamOptDef });
                this.funcTrainingForm.patchValue({ funcComFamily: this.funcFamList[0].family_id })

                for (let j = 0; j < funcFamData.length; j = j + 1) {
                    this.funcFamList.push({ family_id: funcFamData[j].JF_ID, family: funcFamData[j].JF_NAME });
                }
            }
            else
                this.funcFamily = false;

        })
    }

    funcCompList = [];
    funcFamilyChange() {
        this.selFuncTraining = [];
        let funcCompData = [];
        this.funcCompList = [];
        this.funcTrainList = [];
        let posData = {
            JF_ID: this.funcTrainingForm.get('funcComFamily').value,
        }
        this._POST_api_Service.POST_data(IVars.getTrainComp, posData).subscribe(data => {
            funcCompData = data;
            if (funcCompData.length > 0) {
                this.funcCompetency = true; this.funcTraining = false;
                this.noCompData = false; this.noTrainData = false;
                this.descSelected = false;

                this.funcCompList.push({ comp_id: 0, competency: this.comCompOptDef, description: '' });
                this.funcTrainingForm.patchValue({ funcComComp: this.funcCompList[0].comp_id });
                for (let j = 0; j < funcCompData.length; j = j + 1) {
                    this.funcCompList.push({ comp_id: funcCompData[j].COMP_ID, competency: funcCompData[j].FC_NAME, description: funcCompData[j].FC_DEF });
                }
            }
            else if (funcCompData.length < 1) {
                this.funcCompetency = false;
                this.descSelected = false;
                this.noCompData = true;
                this.noTrainData = false;
            }
        })
    }

    selectedComp = {};
    funcTrainList = [];
    funcCompChange() {
        this.existTraining = false;
        this.selFuncTraining = [];
        this.funcTrainList = [];
        let compSelId = this.funcTrainingForm.get('funcComComp').value;
        this.selectedComp = this.funcCompList.find(x => x.comp_id.toString() === compSelId)

        this.descSelected = true;

        let funcTrainData = [];
        let posData = {
            comp_id: this.funcTrainingForm.get('funcComComp').value
        }

        this._POST_api_Service.POST_IDP_data(IVars.getfuncTraining, posData).subscribe(data => {

            funcTrainData = data;

            if (funcTrainData.length > 0) {
                this.funcTraining = true; this.noCompData = false; this.noTrainData = false;

                this.funcTrainList.push({ train_id: 0, train_name: this.comTrainOptDef });
                this.funcTrainingForm.patchValue({ funcComTraining: this.funcTrainList[0].train_id });
                for (let j = 0; j < funcTrainData.length; j = j + 1) {
                    this.funcTrainList.push({ train_id: funcTrainData[j].id, train_name: funcTrainData[j].training_name });
                }
            }
            else {
                this.funcTraining = false;
                this.noTrainData = true;
            }
        });
    }

    selFuncTraining = [];
    existTraining = false;
    funcTraningChange() {
        this.selFuncTraining = [];
        this.existTraining = false;
        let trainId = this.funcTrainingForm.get('funcComTraining').value;
        if (trainId != '0') {
            let training = this.funcTrainList.find(x => x.train_id.toString() === trainId);

            if (this.addedTrainings.some(item => item.train_id.toString() === training.train_id.toString())) {
                this.existTraining = true;
            }
            else {
                this.existTraining = false;
                this.selFuncTraining.push(training);
            }
        }
        else {
            this.existTraining = false;
        }
    }

    addTrainingDisabled() {
        if (this.selectedCompetency === 1) {
            if (this.selFuncTraining.length > 0 && !this.existTraining) {
                return false;
            }
            else
                return true;
        }
        else {
            if (this.selLeadTraining.length > 0 && !this.existTraining) {
                return false;
            }
            else
                return true;
        }
    }

    addingTrain = false;
    addTrainingClicked() {
        this.addingTrain = true;

        if (this.selectedCompetency === 1) {
            this.addedTrainings.push(this.selFuncTraining[0]);
        }
        else {
            this.addedTrainings.push(this.selLeadTraining[0]);
        }

        this.setTrainingDetails(this.addedTrainings);

        this.notifier.notify('success', this.word.trainingAdded);
        this.addingTrain = false;
        this.funcTrainingForm.reset();
        this.leadTrainingForm.reset();
        this.isTrainModalOpen = false;
    }

    setTrainingDetails(trainAry) {
        let ids = trainAry.map(function (item) {
            return item['train_id'];
        });

        this.actionPlanForm.patchValue({ trainingName: ids.join('|') });
    }

    leadCompList = [];
    getLeadCompetencyList() {
        this.leadCompList = [];
        this._GET_api_Service.GET_IDP_data(IVars.getleadCompetency).subscribe(data => {
            let sucessData = data.summary.success;
            let digitalData = data.summary.digital;
            for (let i = 0; i < sucessData.length; i++) {
                this.leadCompList.push({ id: sucessData[i].id, name: sucessData[i].success_name, from: 'success' });
            }
            for (let i = 0; i < digitalData.length; i++) {
                this.leadCompList.push({ id: digitalData[i].id, name: digitalData[i].digital_name, from: 'digital' });
            }
        },
            error => {
                console.log('[ERROR All Access] ' + error);
            })
    }

    selectLeadComp: any;
    leadTrainList = [];
    leadCompChange() {
        this.leadTrainList = [];
        let leadComName = this.leadTrainingForm.get('leadCompetency').value;
        this.selectLeadComp = this.leadCompList.find(x => x.name === leadComName);

        let posData;
        if (this.selectLeadComp.from === 'success') {
            posData = {
                success_id: this.selectLeadComp.id, digital_id: null
            }
        }
        else {
            posData = {
                success_id: null, digital_id: this.selectLeadComp.id
            }
        }
        let trainData = [];
        this._POST_api_Service.POST_IDP_data(IVars.getLeadTraining, posData).subscribe(data => {
            trainData = data;

            if (trainData.length > 0) {
                this.leadTraining = true; this.noTrainData = false;

                this.leadTrainList.push({ train_id: 0, train_name: this.comTrainOptDef });
                this.leadTrainingForm.patchValue({ leadTraining: this.leadTrainList[0].train_id });
                for (let j = 0; j < trainData.length; j = j + 1) {
                    this.leadTrainList.push({ train_id: trainData[j].id, train_name: trainData[j].training_name });
                }
            }
            else {
                this.leadTraining = false;
                this.noTrainData = true;
            }
        });
    }

    selLeadTraining = [];
    existLeadTraining = false;
    leadTrainingChange() {
        this.selLeadTraining = [];
        this.existLeadTraining = false;
        let trainId = this.leadTrainingForm.get('leadTraining').value;
        if (trainId != '0') {
            let training = this.leadTrainList.find(x => x.train_id.toString() === trainId);

            if (this.addedTrainings.some(item => item.train_id.toString() === training.train_id.toString())) {
                this.existLeadTraining = true;
            }
            else {
                this.existLeadTraining = false;
                this.selLeadTraining.push(training);
            }
        }
        else {
            this.existLeadTraining = false;
        }
    }


    idpFormError;
    aspErr; strengthErr; areaErr; actionErr;
    submitIDPForm() {
        this.idpFormError = false;
        this.aspErr = false; this.strengthErr = false; this.areaErr = false; this.actionErr = false; this.mobilityErr = false;

        if (this.idpAspitation.length < 1) {
            this.aspErr = true; this.idpFormError = true;
        }
        if (this.idpStrengths && (this.idpStrengths.length < 3 || this.idpStrengths.length > 5)) {
            this.strengthErr = true; this.idpFormError = true;
        }
        if (this.idpArea && (this.idpArea.length < 1 || this.idpArea.length > 2)) {
            this.areaErr = true; this.idpFormError = true;
        }
        if (this.idpActionPlans && (this.idpActionPlans.length !== 3)) {
            this.actionErr = true; this.idpFormError = true;
        }
        if (this.idpSummary.idp[0].mobility === 1 && this.idpMobilty && this.idpMobilty.length < 1) {
            this.mobilityErr = true; this.idpFormError = true;
        }

        if (!this.idpFormError) {
            $("#submit_modal").modal('show');
        }
        else
            $("#error_modal").modal('show');

    }

    superDecision;
    supervisorAction(option) {
        this.superDecision = option;

        $("#submit_modal").modal('show');
    }

    submitting;
    submitToSupirior() {
        this.submitting = true;

        let api = IVars.idpSubmitSupervisor;
        let posData = { id: this.formID }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.submitSupSuccessMsg);
                this.submitting = false;
                document.getElementById('close-btn-1').click();

                setTimeout(() => {
                    this.btnBackClick();
                }, 2000)
            }

        }, err => {
            this.notifier.notify('error', this.word.submitSupFailMsg);
            this.submitting = false;
            console.log("Error - Failed To Submit To Your Supervisor");
        })
    }

    completing = false;
    completeClicked() {
        this.completing = true;
        let api = IVars.completeIDP;
        let posData = { id: this.formID }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.completeIDPSucess);
                this.completing = false;
                document.getElementById('close-btn-1').click();

                setTimeout(() => {
                    this.btnBackClick();
                }, 2000)
            }

        }, err => {
            this.notifier.notify('error', this.word.completeIDPFail);
            this.completing = false;
            console.log("Error - Failed To Complete IDP");
        })

    }

    ack_ing = false;
    supAcknowledge() {
        this.ack_ing = true;
        let api = IVars.supAcknowledge;
        let posData = {
            id: this.formID,
            // review: $("#nextReview").val().toString().length === 0 || $("#nextReview").val() === null ? null : 
            //                 moment($("#nextReview").val(), 'DD-MM-YYYY').format()
            review: new Date(moment.utc(this.nextReviwForm.get('nextReview').value).format()),
        }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.ackIDPSuccess);
                this.ack_ing = false;
                document.getElementById('close-btn-1').click();

                setTimeout(() => {
                    this.btnBackClick();
                }, 2000)
            }

        }, err => {
            this.notifier.notify('error', this.word.ackIDPFail);
            this.ack_ing = false;
            console.log("Error - Failed To Acknowledge");
        })
    }

    reverting = false;
    supRevert() {
        this.reverting = true;
        let api = IVars.supRevert;
        let posData = {
            id: this.formID,
        }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.revertIDPSuccess);
                this.reverting = false;
                document.getElementById('close-btn-1').click();

                setTimeout(() => {
                    this.btnBackClick();
                }, 2000)
            }

        }, err => {
            this.notifier.notify('error', this.word.revertIDPFail);
            this.reverting = false;
            console.log("Error - Failed To Revert");
        })

    }

    flexi = true;
    setIdpData() {
        if (this.idpDetails[0].aspiration && this.idpDetails[0].aspiration.length > 0) this.aspirationForm.patchValue({ aspiration: this.idpDetails[0].aspiration })

        if (this.idpMobilty.length > 0) {

            if (this.idpMobilty[0].flexible === 1) this.flexi = true;
            else this.flexi = false;

            this.mobilityForm.patchValue({
                flexible: this.idpMobilty[0].flexible,
                location: this.idpMobilty[0].location,
                reason: this.idpMobilty[0].reason,
                due: this.idpMobilty[0].due
            });

            if (this.idpMobilty[0].specify) this.mobilityForm.patchValue({
                specifyTechnical: this.idpMobilty[0].specify.split('|')[0],
                specifySales: this.idpMobilty[0].specify.split('|')[1],
                specifySupport: this.idpMobilty[0].specify.split('|')[2]
            })
            this.selMobFunctions = this.idpMobilty[0].funct.split('|');
        }
        else {
            this.flexi = true;
            this.mobilityForm.patchValue({
                flexible: 1,
                location: '',
                reason: '',
                due: '',
                specifyTechnical: '',
                specifySales: '',
                specifySupport: '',
            });
            this.selMobFunctions = [];
            this.selMobSpecify = '';
        }

        if (this.idpDetails[0].review_on && this.idpDetails[0].review_on.length > 0) {
            this.nextReviwForm.patchValue({
                // nextReview: moment(this.idpDetails[0].review_on).format('DD-MM-YYYY')
                nextReview: this.idpDetails[0].review_on
            })
        }
    }

    superior;
    getSuperiorName() {
        let superiorInfoAPI = '/jobAdvApply/superior/get';
        this._GET_api_Service.GET_data(superiorInfoAPI).subscribe(data => {
            this.superior = data[0].Rept_To_Name;
        },
            error => {
                console.log("Couldn't get superior info" + error);
            });
    }

    checkSelectedLang() {
        let lang = localStorage.getItem('idpLang');
        if (lang) {
            if (lang === 'en') {
                this.enChecked = true;
                this.word = En;
                this.help = enHelp;
                this.monthWord = this.monthEN;
            }
            if (lang === 'my') {
                this.enChecked = false;
                this.word = My;
                this.help = myHelp;
                this.monthWord = this.monthMY;
            }
        }
        else {
            this.enChecked = true;
            this.word = En;
            this.help = enHelp;
            localStorage.setItem('idpLang', 'en');
        }
    }

    btnBackClick() {
        this._location.back();
    }
    langChange(id) {
        let selectedLang = id.value;

        if (selectedLang === 'en') {
            this.word = En;
            this.help = enHelp;
            localStorage.setItem('idpLang', 'en');
            this.enChecked = true;

            this.monthWord = this.monthEN;

            if (this.idpSummary.idp[0].idp_due) this.myIDPDue = new Date(this.idpSummary.idp[0].idp_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_due).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_start) this.myIDPComplStart = new Date(this.idpSummary.idp[0].idp_cmpl_start).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_start).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_start).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_due) this.myIDPComplDue = new Date(this.idpSummary.idp[0].idp_cmpl_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_due).getFullYear();
            if (this.idpSummary.details[0].complete_on) this.myIDPComplete = new Date(this.idpSummary.details[0].complete_on).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.details[0].complete_on).getMonth())] + ' ' + new Date(this.idpSummary.details[0].complete_on).getFullYear();
        }
        if (selectedLang === 'my') {
            this.word = My;
            this.help = myHelp;
            localStorage.setItem('idpLang', 'my');
            this.enChecked = false;

            this.monthWord = this.monthMY;

            if (this.idpSummary.idp[0].idp_due) this.myIDPDue = new Date(this.idpSummary.idp[0].idp_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_due).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_start) this.myIDPComplStart = new Date(this.idpSummary.idp[0].idp_cmpl_start).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_start).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_start).getFullYear();
            if (this.idpSummary.idp[0].idp_cmpl_due) this.myIDPComplDue = new Date(this.idpSummary.idp[0].idp_cmpl_due).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.idp[0].idp_cmpl_due).getMonth())] + ' ' + new Date(this.idpSummary.idp[0].idp_cmpl_due).getFullYear();
            if (this.idpSummary.details[0].complete_on) this.myIDPComplete = new Date(this.idpSummary.details[0].complete_on).getDate() + ' ' + this.monthWord[(new Date(this.idpSummary.details[0].complete_on).getMonth())] + ' ' + new Date(this.idpSummary.details[0].complete_on).getFullYear();

        }
        document.getElementById('lang_close').click();
    }

    ngAfterViewInit() {
        // this._script.loadScripts('user-idp',
        //     [
        //         'assets/js/idp/datepicker.js',
        //     ]
        // );
    }

    // updateReviewDt() {
    //     this.nextReviwForm.patchValue({nextReview: $('#nextReview').val()});
    // }

    errDate = false;
    compareDates(startDate, endDate) {
        if (startDate.length && endDate.length) {
            let arrSt = startDate.split("/");
            let arrEn = endDate.split("/");

            let sDt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]))
            let eDt = new Date(Date.parse(arrEn[1] + '-' + arrEn[0] + '-' + arrEn[2]));

            if (sDt > eDt) { this.errDate = true; }
            else { this.errDate = false; }
        }
        else { this.errDate = false; }
    }

    createForms() {
        this.aspirationForm = new FormGroup({
            aspiration: new FormControl('', Validators.required)
        });

        this.strengthForm = new FormGroup({
            strength: new FormControl('', Validators.required)
        });

        this.areaOfDevForm = new FormGroup({
            area: new FormControl('', Validators.required)
        });

        this.actionPlanForm = new FormGroup({
            what: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
            how: new FormControl('', Validators.required),
            competencyType: new FormControl('', Validators.required),
            trainingName: new FormControl(''),
            mentorName: new FormControl('')
        });

        this.actionOutComeForm = new FormGroup({
            outcome: new FormControl('', Validators.required),
            outStatus: new FormControl('', Validators.required),
        });

        this.mobilityForm = new FormGroup({
            flexible: new FormControl(1, Validators.required),
            location: new FormControl(''),
            funct: new FormControl(''),
            reason: new FormControl(''),
            due: new FormControl(''),
            specifyTechnical: new FormControl('', Validators.required),
            specifySales: new FormControl('', Validators.required),
            specifySupport: new FormControl('', Validators.required)
        });

        this.nextReviwForm = new FormGroup({
            nextReview: new FormControl('', Validators.required)
        });

        this.funcTrainingForm = new FormGroup({
            funcComCluster: new FormControl('', Validators.required),
            funcComFamily: new FormControl('', Validators.required),
            funcComComp: new FormControl('', Validators.required),
            funcComTraining: new FormControl('', Validators.required)
        });

        this.leadTrainingForm = new FormGroup({
            leadCompetency: new FormControl('', Validators.required),
            leadTraining: new FormControl('', Validators.required)
        });

        this.menteeNoteForm = new FormGroup({
            meetingDate: new FormControl('', Validators.required),
            topic: new FormControl('', Validators.required),
            outcome: new FormControl('', Validators.required),
            plannedTime: new FormControl('', Validators.required),
            status: new FormControl('Pending')
        });

        this.feedbackMentorForm = new FormGroup({
            fbMentor: new FormControl('', Validators.required),
        })
    }

    modalTitle = '';

    openAddModal(itemNo, option, num?: number) {
        this.enableSubmission = true;
        
        if (option === 'add') this.isAddData = true;
        else this.isAddData = false;

        this.itemNo = itemNo;
        switch (itemNo) {
            case 1:
                let ln = num ? num : this.idpStrengths.length + 1;
                if (this.isAddData) this.modalTitle = this.word.addStrength + ' #' + ln;
                else this.modalTitle = this.word.updStrength + ' #' + ln;
                break;
            case 2:
                let ln2 = num ? num : this.idpArea.length + 1;
                if (this.isAddData) this.modalTitle = this.word.addAreaOfDev + ' #' + ln2;
                else this.modalTitle = this.word.updAreaOfDev + ' #' + ln2;
                break;
            case 3:
                let ln3 = num ? num : this.idpActionPlans.length + 1;
                if (this.isAddData) this.modalTitle = this.word.addActionPlan + ' #' + ln3;
                else this.modalTitle = !this.isSupervisor ? this.word.updActionPlan + ' #' + ln3 : this.word.actionPlan + ' #' + ln3;
                break;
            default:
                break;
        }
    }

    cancelModalClicked() {
        this.adding = false;
        switch (this.itemNo) {
            case 1:
                this.strengthForm.reset();
                break;
            case 2:
                this.areaOfDevForm.reset();
                break;
            case 3:
                this.actionPlanForm.reset();
                this.menteeNotePost = [];
                this.menteeNoteView = [];
                break;
            default:
                break;
        }
    }

    isTrainModalOpen = false;
    openTrainModal() {
        this.isTrainModalOpen = true;
        this.funcTrainingForm.patchValue({ funcComCluster: this.clusterList[0].cluster_id });
        this.leadTrainingForm.patchValue({ leadCompetency: '' });
        this.funcFamily = false;
        this.funcCompetency = false;
        this.funcTraining = false;
        this.descSelected = false;
        this.noCompData = false;
        this.noTrainData = false;

        this.selFuncTraining = [];

        this.leadTraining = false;
        this.selLeadTraining = [];
    }

    closeTrainModal() {
        this.isTrainModalOpen = false;
    }

    isMenteeNoteModalOpen: boolean = false;
    openMenteeNoteModal() {
        this.isMenteeNoteModalOpen = true;
        this.menteeNoteForm.patchValue({
            meetingDate: '',
            topic: '',
            outcome: '',
            plannedTime: '',
        });

        $('#addMenteeNote').click();


    }

    menteeNoteView = [];
    menteeNotePost = [];
    addingMenteeNote() {

        if (this.checkDisabledMenteeNote() === false) {

            let md = this.menteeNoteForm.get('meetingDate').value;
            let mdPost = ''
            if (md.length === undefined) mdPost = md.getFullYear() + (md.getMonth() < 9 ? '-0' : '-') + (md.getMonth() + 1) + (md.getDate() < 10 ? '-0' : '-') + md.getDate();
            else mdPost = md.split('T')[0]

            let pt = this.menteeNoteForm.get('plannedTime').value;
            let ptPost = '';
            if (pt.length === undefined) ptPost = pt.getFullYear() + (pt.getMonth() < 9 ? '-0' : '-') + (pt.getMonth() + 1) + (pt.getDate() < 10 ? '-0' : '-') + pt.getDate();
            else ptPost = pt.split('T')[0]

            let nmPost = {
                seq: (Math.random() * 10000).toFixed(),
                meeting_date: mdPost,
                topic: this.menteeNoteForm.get('topic').value,
                outcome: this.menteeNoteForm.get('outcome').value,
                nm_planned_time: pt,
                mentor_fb: '',
                mentor: this.selectedPLan.mentor_id ? this.selectedPLan.mentor_id : ''
            }

            let nmView = {
                meeting_date: mdPost.split('-').reverse().join('/'),
                topic: this.menteeNoteForm.get('topic').value,
                outcome: this.menteeNoteForm.get('outcome').value,
                nm_planned_time: ptPost.split('-').reverse().join('/')
            }

            if (this.editModeMentee) {
                this.menteeNoteView.splice(this.editMenteeNoteNum, 1, nmView);
                this.menteeNotePost.splice(this.editMenteeNoteNum, 1, nmPost);
            } else {
                this.menteeNoteView.splice(0, 0, nmView);
                this.menteeNotePost.splice(0, 0, nmPost);
            }

            this.menteeNoteForm.patchValue({
                meetingDate: '',
                topic: '',
                outcome: '',
                plannedTime: '',
            });

            this.editModeMentee = false;

            $('#closeMenteeModal').click();

        }

    }


    selectedCompetency;
    changeCompetency(compVal) {
        this.addedTrainings = [];
        if (compVal === 'functional') {
            this.selectedCompetency = 1;
        }
        else if (compVal === 'leadership') {
            this.selectedCompetency = 2;
        }

        this.actionPlanForm.patchValue({ how: '' });
    }

    changeHow(howVal) {
        this.addedTrainings = [];

        if (howVal === "10") {
            this.actionPlanForm.patchValue({ mentorName: '' });
        }
        else if (howVal === "20") {
            this.actionPlanForm.patchValue({ trainingName: '' });
        }
        else {
            this.actionPlanForm.patchValue({
                mentorName: '',
                trainingName: ''
            });
        }
    }
    changeFlexi(flexVal) {
        if (flexVal === 1) {
            this.flexi = true;
            this.mobilityForm.patchValue({
                flexible: 1,
                reason: '',
                due: ''
            });
        }
        else {
            this.flexi = false;
            this.mobilityForm.patchValue({
                flexible: 0,
                location: '',
                funct: '',
                specifyTechnical: '',
                specifySales: '',
                specifySupport: ''
            });
            this.selMobFunctions = [];
            this.selMobSpecify = '';
        }
    }

    aspLoading = false;
    updateAspiration(aspirationFormVal) {
        this.aspLoading = true;

        let api = IVars.updAspiration;
        let posData = {
            id: this.formID,
            aspiration: aspirationFormVal.aspiration
        }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.udpCareerAspSuccess);
                this.aspLoading = false;

                this.getIdpDetails();
            }

        }, err => {
            this.notifier.notify('error', this.word.udpCareerAspFail);
            this.aspLoading = false;
            console.log("Error - failed to update Aspiration");
        })
    }


    onChangeFunc(event) {
        let item = event.target.value;
        let idx = this.selMobFunctions.indexOf(item);

        if (idx > -1)
            this.selMobFunctions.splice(idx, 1);
        else
            this.selMobFunctions.push(item);

    }

    checkSelectedFunc(val) {
        let checked = false;
        if (this.selMobFunctions.indexOf(val) > -1) checked = true;
        return checked;
    }

    isMobiltyValid(mobilityVals) {
        if (mobilityVals.flexible.toString() === '1') {
            if (mobilityVals.location.length > 0 && this.selMobFunctions.length > 0) {
                return true;
            }
            else
                return false;
        }
        else {
            let dueDate = mobilityVals.due === '' || mobilityVals.due === null ? '' : new Date(moment.utc(mobilityVals.due).format());
            if (mobilityVals.reason.length > 0 && dueDate) {
                return true;
            }
            else
                return false;
        }
    }

    mobilityLoading = false;
    errorMobility = false;
    updateMobility(mobilityFormVal) {
        this.selMobSpecify = this.mobilityForm.get('specifyTechnical').value + "|" + this.mobilityForm.get('specifySales').value + "|" + this.mobilityForm.get('specifySupport').value;

        let tech = true; let sale = true; let supp = true;
        if (this.checkSelectedFunc('Technical')) if (this.mobilityForm.get('specifyTechnical').value) tech = true; else tech = false;
        if (this.checkSelectedFunc('Sales')) if (this.mobilityForm.get('specifySales').value) sale = true; else sale = false;
        if (this.checkSelectedFunc('Support')) if (this.mobilityForm.get('specifySupport').value) supp = true; else supp = false;

        if (tech && sale && supp) {
            this.mobilityLoading = true;

            let posData = {
                id: this.formID,
                flexible: parseInt(mobilityFormVal.flexible),
                location: mobilityFormVal.location,
                funct: this.selMobFunctions.join('|'),
                reason: mobilityFormVal.reason,
                due: new Date(moment.utc(mobilityFormVal.due).format()),
                specify: this.selMobSpecify
            }

            this._POST_api_Service.POST_IDP_data(IVars.updMobility, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.updMobilitySuccess);
                    this.mobilityLoading = false;
                    this.selMobSpecify = ''
                    this.errorMobility = false;
                    this.getIdpDetails();
                }

            }, err => {
                this.notifier.notify('error', this.word.updMobilityFail);
                this.mobilityLoading = false;
                console.log("Error - failed to update mobility");
            })
        } else {
            this.errorMobility = true;
        }

    }

    resetMobilityClicked() {
        this.setIdpData();
    }

    adding = false;
    addItemClicked() {
        this.adding = true;
        
        if (this.itemNo === 1) { //Strength
            let api = IVars.addStrength;
            let posData = {
                id: this.formID,
                strength: this.strengthForm.get('strength').value
            }
            if(this.enableSubmission){
            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.addStrengthSuccess);
                    this.adding = false;
                    this.strengthForm.reset();
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.addStrengthFail);
                this.adding = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to add Strength");
            })
            }
        this.enableSubmission = false;

        }

        else if (this.itemNo === 2) { //Area of Development
            let api = IVars.addArea;
            let posData = {
                id: this.formID,
                area_descr: this.areaOfDevForm.get('area').value
            }
            if(this.enableSubmission){
            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.addAreaSuccess);
                    this.adding = false;
                    this.strengthForm.reset();
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.addAreaFail);
                this.adding = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to add Area of Development");
            })
            }
            this.enableSubmission = false;

        }

        else if (this.itemNo === 3) {

            let persNo = '';
            if (this.multiSelUser.length > 0) if (this.multiSelUser[0].employeeNo) persNo = this.multiSelUser[0].employeeNo;

            // let str = this.actionPlanForm.get('startDate').value;
            // let strPost = '';
            // if (str && str.length === undefined) strPost = str.getFullYear() + (str.getMonth() < 9 ? '-0' : '-') + (str.getMonth() + 1) + (str.getDate() < 10 ? '-0' : '-') + str.getDate();

            // let due = this.actionPlanForm.get('endDate').value;
            // let duePost = '';
            // if (due && due.length === undefined) duePost = due.getFullYear() + (due.getMonth() < 9 ? '-0' : '-') + (due.getMonth() + 1) + (due.getDate() < 10 ? '-0' : '-') + due.getDate();

            let api = IVars.addActionPlan;
            let posData = {
                id: this.formID,
                desc: this.actionPlanForm.get('what').value,
                start: this.actionPlanForm.get('startDate').value,
                due: this.actionPlanForm.get('endDate').value,
                type: this.actionPlanForm.get('how').value,
                competency: this.actionPlanForm.get('competencyType').value,
                training: this.actionPlanForm.get('trainingName').value,
                mentor: persNo,
                mentee_note: this.menteeNotePost
            }
            if(this.enableSubmission){
            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.addActionSuccess);
                    this.adding = false;
                    this.menteeNotePost = [];
                    this.actionPlanForm.reset();
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.addActionFail);
                this.adding = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to add Action Plan");
            })
            }
            this.enableSubmission = false;

        }
    }

    selectedStrength;
    setStrengthForm(stren) {
        this.selectedStrength = stren;
        this.strengthForm.patchValue({ strength: stren.strength });
    }

    selectedArea;
    setAreaForm(area) {
        this.selectedArea = area;
        this.areaOfDevForm.patchValue({ area: area.descr });
    }

    selectedPLan; //selectedOption = 'sfafafd';
    showInput = false;
    meetingNoteSplit = [];
    mentorPersno = '';
    showMenteeAddBtn: boolean = false;
    setActionForm(plan) {
        this.menteeNoteView = []
        this.menteeNotePost = []
        this.errDate = false;
        this.actionPlanForm.reset();
        this.selectedPLan = plan;

        this.mentorPersno = JSON.parse(localStorage.getItem('currentUser')).body.gemsId;
        console.log(this.menteeNoteView)
        console.log(this.mentorPersno)
        if (plan.competency.toLowerCase() === 'functional') {
            this.selectedCompetency = 1;
        } else if (plan.competency.toLowerCase() === 'leadership') {
            this.selectedCompetency = 2;
        }

        if (plan.act_type === 2) this.showMenteeAddBtn = true;
        else this.showMenteeAddBtn = false;

        this.setAddedTrainings(plan);

        this.actionPlanForm.patchValue({
            what: plan.descr,
            startDate: plan.start,
            endDate: plan.due,
            how: plan.act_type,
            competencyType: plan.competency.toLowerCase(),
            mentorName: plan.mentor_stfno + ' - ' + plan.mentor_name
        })

        this.multiSelUser = [{
            staffNo: plan.mentor_id,
            name: plan.mentor_name,
            employeeNo: plan.mentor_id
        }];

        this.menteeNoteForm.patchValue({ status: plan.action_status })

        if (this.idpStatus === 3) this.actionOutComeForm.enable();
        else this.actionOutComeForm.disable();

        if (plan.mn) {
            let mnString = plan.mn.split('#')

            for (let i = 0; i < mnString.length; i++) {
                let mnArray = mnString[i].split('|');

                let mnPost = {
                    seq: parseInt(mnArray[9]),
                    meeting_date: mnArray[2],
                    topic: mnArray[3],
                    outcome: mnArray[4],
                    nm_planned_time: mnArray[5],
                    mentor_fb: mnArray[6],
                    mentor: mnArray[7]
                }

                let mnView = {
                    id: parseInt(mnArray[0]),
                    seq: parseInt(mnArray[9]),
                    meeting_date: mnArray[2].split('-').reverse().join('/'),
                    topic: mnArray[3],
                    outcome: mnArray[4],
                    nm_planned_time: mnArray[5].split(' ')[0].split('-').reverse().join('/'),
                    fb_mentor: mnArray[6],
                    mentor_name: mnArray[8],
                    mentor: mnArray[7]
                }

                if (mnView.fb_mentor.length > 0) {
                    this.menteeNoteView.push(mnView);
                    this.menteeNotePost.push(mnPost);
                } else {
                    this.menteeNoteView.splice(0, 0, mnView);
                    this.menteeNotePost.splice(0, 0, mnPost);
                }
            }
        }

        $("#form_modal").modal('show');
    }

    removeTraining(train) {

        let idx = this.addedTrainings.indexOf(train);
        if (idx > -1) {
            this.addedTrainings.splice(idx, 1);
            this.setTrainingDetails(this.addedTrainings)
        }
    }

    setAddedTrainings(plan) {
        this.addedTrainings = [];
        if (plan.training_details) {
            let trainings = plan.training_details.split(',');
            for (let i = 0; i < trainings.length; i++) {
                let trainData = trainings[i].split('|');
                this.addedTrainings.push({ train_id: trainData[0], train_name: trainData[1] })
            }
            this.setTrainingDetails(this.addedTrainings)
        }
    }

    updating = false;
    updateItemClicked() {
        this.updating = true;

        if (this.itemNo === 1) { //Strength -update
            let api = IVars.updStrength;
            let posData = {
                id: this.selectedStrength.strength_id,
                strength: this.strengthForm.get('strength').value
            }

            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.updStrengthSuccess);
                    this.updating = false;
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.updStrengthFail);
                this.updating = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to update Strength");
            })
        }

        else if (this.itemNo === 2) { //Area -update
            let api = IVars.updArea;
            let posData = {
                id: this.selectedArea.area_id,
                area_descr: this.areaOfDevForm.get('area').value
            }

            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.updAreaSuccess);
                    this.updating = false;
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.updAreaFail);
                this.updating = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to update Area of Development");
            })
        }

        else if (this.itemNo === 3) {// Action Plan
            let persNo = '';
            if (this.multiSelUser.length > 0)
                if (this.multiSelUser[0].employeeNo)
                    persNo = this.multiSelUser[0].employeeNo;


            // let str = this.actionPlanForm.get('startDate').value;
            // let strPost = '';
            // if (str.length === undefined) strPost = str.getFullYear() + (str.getMonth() < 9 ? '-0' : '-') + (str.getMonth() + 1) + (str.getDate() < 10 ? '-0' : '-') + str.getDate();
            // else strPost = str.split('T')[0];

            // let due = this.actionPlanForm.get('endDate').value;
            // let duePost = '';
            // if (due.length === undefined) duePost = due.getFullYear() + (due.getMonth() < 9 ? '-0' : '-') + (due.getMonth() + 1) + (due.getDate() < 10 ? '-0' : '-') + due.getDate();
            // else duePost = due.split('T')[0];

            let api = IVars.updActionPlan;
            let posData = {
                id: this.selectedPLan.act_id,
                desc: this.actionPlanForm.get('what').value,
                start: this.actionPlanForm.get('startDate').value,
                due: this.actionPlanForm.get('endDate').value,
                type: this.actionPlanForm.get('how').value,
                competency: this.actionPlanForm.get('competencyType').value,
                training: this.actionPlanForm.get('trainingName').value,
                mentor: persNo,
                mentee_note: this.menteeNotePost,
                status: this.menteeNoteForm.get('status').value
            }

            this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
                if (res.status === 'OK') {
                    this.notifier.notify('success', this.word.updActionSuccess);
                    this.updating = false;
                    this.menteeNotePost = [];
                    document.getElementById('modal-close-btn').click();

                    this.getIdpDetails();
                }
            }, err => {
                this.notifier.notify('error', this.word.updActionFail);
                this.updating = false;
                document.getElementById('modal-close-btn').click();
                console.log("Error - failed to update Action Plan");
            })
        }
    }

    deleteStrength(stren) {
        let api = IVars.delStrength;
        let posData = {
            id: stren.strength_id
        }
        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.getIdpDetails();
                this.notifier.notify('success', this.word.delStrengthSuccess);
            }
        }, err => {
            this.notifier.notify('error', this.word.delStrengthFail);

            console.log("Error - failed to delete the Strength");
        })
    }

    deleteAreaDev(area) {
        let api = IVars.delArea;
        let posData = {
            id: area.area_id
        }
        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.getIdpDetails();
                this.notifier.notify('success', this.word.delAreaSuccess);
            }
        }, err => {
            this.notifier.notify('error', this.word.delAreaFail);

            console.log("Error - failed to delete the Area of Development");
        })
    }

    actDeleting = false;
    deleteActionPlan() {
        this.actDeleting = true;
        let api = IVars.delActionPlan;
        let posData = {
            id: this.selectedPLan.act_id
        }
        this._POST_api_Service.POST_IDP_data(api, posData).subscribe(res => {
            if (res.status === 'OK') {
                this.getIdpDetails();
                this.notifier.notify('success', this.word.delActionSuccess);
                this.actDeleting = false;
                document.getElementById('modal-close-btn').click();
            }
        }, err => {
            this.actDeleting = false;
            document.getElementById('modal-close-btn').click();
            this.notifier.notify('error', this.word.delActionFail);

            console.log("Error - failed to delete the Action Plan");
        })
    }

    saveDraftNotifier() {

        this.notifier.notify('success', this.word.saveDraftMessage);

    }

    checkDisabled() {
        switch (this.itemNo) {
            case 1:
                if (this.strengthForm.invalid) return true;
                else return false;
            case 2:
                if (this.areaOfDevForm.invalid) return true;
                else return false;
            case 3:
                if (this.actionPlanForm.invalid || this.errDate) return true;
                else {
                    let actionHow = this.actionPlanForm.get('how').value;
                    let tName = this.actionPlanForm.get('trainingName').value;
                    let mName = this.actionPlanForm.get('mentorName').value;
                    if (actionHow == 1 && tName.length < 1) {
                        return true;
                    }
                    else if (actionHow == 2 && mName.length < 1) {
                        return true;
                    }
                    else
                        return false;
                }

            default:
                break;
        }
    }

    checkDisabledMenteeNote() {
        if (this.menteeNoteForm.invalid || this.errDateMn) return true;
        else return false;
    }

    checkDisabledFeedbackMentor() {
        if (this.feedbackMentorForm.invalid) return true;
        else return false;
    }

    checkActionStatusValid() {
        let notValid;
        this.idpActionPlans.forEach(plan => {
            if (plan.action_status === 'Pending') {
                notValid = true;
            }
        });
        return notValid;
    }

    progWidth = '0%';
    chkProgressWidth(status) {
        if (status == 1)
            return '0%';
        else if (status == 2)
            return '33.3%';
        else if (status == 3)
            return '66.6%';
        else
            return '100%';
    }

    checkStatus(status, step) {
        if (step == 1) {
            return true;
        }
        if (step == 2) {
            if (status == 2 || status == 3 || status == 4) {
                return true;
            }
            else
                return false;
        }
        if (step == 3) {
            if (status == 3 || status == 4) {
                return true;
            }
            else
                return false;
        }
        if (step == 4) {
            if (status == 4) {
                return true;
            }
            else
                return false;
        }
    }

    editMenteeNoteNum: number = 0;
    editModeMentee: boolean = false;
    editMenteeNote(num) {
        this.editModeMentee = true;

        this.editMenteeNoteNum = num;

        this.menteeNoteForm.patchValue({
            meetingDate: this.menteeNotePost[num].meeting_date,
            topic: this.menteeNotePost[num].topic,
            outcome: this.menteeNotePost[num].outcome,
            plannedTime: this.menteeNotePost[num].nm_planned_time.split(' ')[0],
        });
        $('#addMenteeNote').click();
    }

    deleteMenteeNote(num) {
        this.menteeNotePost.splice(num, 1)
        this.menteeNoteView.splice(num, 1)
    }

    openTextAreaFbMentor(fb) {
        this.feedbackMentorForm.patchValue({ fbMentor: fb })
    }

    feedbackMentorId;
    fbMentorId(id) {
        this.feedbackMentorId = id;
    }

    addFeedbackFromMentor() {

        let req = {
            mentee_note: [
                {
                    id: this.feedbackMentorId,
                    mentor_fb: this.feedbackMentorForm.get('fbMentor').value
                }
            ]
        }

        this._POST_api_Service.POST_IDP_data(INVars.mentorFeedback, req).subscribe(res => {
            if (res.status === 'OK') {

                $('#closeFbMentorModal').click();
                this.notifier.notify('success', this.word.addFeedbackMentor);

                let num = this.menteeNoteView.findIndex(x => x.id === this.feedbackMentorId)
                if (num >= 0) {
                    this.menteeNoteView[num].fb_mentor = this.feedbackMentorForm.get('fbMentor').value;
                }

                this.getIdpDetails();
                this.feedbackMentorForm.patchValue({ fbMentor: '' })

            }

        }, error => {
            console.log('[ERROR] cannot submit feedback from mentor ' + error);
        })
    }

    threeYearsPrev = [];
    prevYearsArray() {
        this._POST_api_Service.POST_IDP_data(IVars.getPrevYearYear, { pers_no: this.myidp_pers_no }).subscribe(res => {
            if (res.length > 0) {
                this.threeYearsPrev = res;
            } else this.threeYearsPrev = [];
        }, error => {
            console.log('ERROR' + error);
            this.threeYearsPrev = [];
        })
    }

    previewActionPlan;
    threeNumberPrev = [];
    copyPrevYear() {
        this.threeNumberPrev = [];
        let req = {
            in_year: this.copyActionPlanForm.get('year').value
        }

        this._POST_api_Service.POST_IDP_data(IVars.getPrevYearAction, req).subscribe(res => {
            this.previewActionPlan = res;

            if (res.length > 0) {
                for (let i = 0; i < res.length; i++) this.threeNumberPrev.push({
                    index: i,
                    descr: res[i].descr.substring(0, 35) + '...'
                });
            }

        }, error => {
            this.threeNumberPrev = [];
            console.log(error)
        })
    }

    previewActionPlanNum = [];
    postActionPlanNum;
    copyPrevYearNum() {
        this.previewActionPlanNum = [];
        let num = this.copyActionPlanForm.get('actionNum').value;

        if (this.previewActionPlan.length > 0) {
            this.postActionPlanNum = this.previewActionPlan[num];
            let y = this.previewActionPlan[num].training_details;
            let training = '';
            if (y) training = y.split('|')
            if (training.length > 1) training = training[1]
            this.previewActionPlanNum.push({
                descr: this.previewActionPlan[num].descr,
                action_status: this.previewActionPlan[num].action_status,
                competency: this.previewActionPlan[num].competency,
                how_bm: this.previewActionPlan[num].how_bm,
                how_en: this.previewActionPlan[num].how_en,
                mentor_name: this.previewActionPlan[num].mentor_name,
                act_type: this.previewActionPlan[num].act_type,
                training_details: training,
                start: this.previewActionPlan[num].start,
                due: this.previewActionPlan[num].due,
                startView: this.previewActionPlan[num].start.split('T')[0].split("-").reverse().join('/'),
                dueView: this.previewActionPlan[num].due.split('T')[0].split("-").reverse().join('/')
            });
        }
    }
    enableSubmission : boolean;
    checkCopyPrevAction() {
        this.actionPlanForm.patchValue({
            startDate: this.postActionPlanNum.start,
            endDate: this.postActionPlanNum.due,
        })
        this.enableSubmission = true;
        if(this.enableSubmission){
            if (this.postActionPlanNum.due < this.dateNow.toISOString()){
                $('#confirmationCopyAction').modal('show')
               // this.enableSubmission = false;
            } 
            else {
                
                this.submitPrevCopyAction();
               // this.enableSubmission = false;
            }
        }
        
    }

    submitPrevCopyAction() {
        let req = {
            competency: this.postActionPlanNum.competency,
            desc: this.postActionPlanNum.descr,
            due: this.actionPlanForm.get('endDate').value,
            id: this.formID,
            mentee_note: [],
            mentor: this.postActionPlanNum.mentor_id,
            start: this.actionPlanForm.get('startDate').value,
            training: this.postActionPlanNum.training_details ? this.postActionPlanNum.training_details.split("|")[0] : '',
            type: this.postActionPlanNum.act_type
        }
        if(this.enableSubmission){
        this._POST_api_Service.POST_IDP_data(IVars.addActionPlan, req).subscribe(res => {
            if (res.status === 'OK') {
                this.notifier.notify('success', this.word.addActionSuccess);
                this.copyActionPlanForm.patchValue({
                    year: null,
                    actionNum: null
                });
                this.previewActionPlanNum = [];
                this.getIdpDetails();
                $('#close-btn-copy-action').click();
            }
        }, error => {
            console.log(error)
        })
        }
        this.enableSubmission = false;  
    }

    errDateMn = false;
    compareDatesMn(startDate, endDate) {
        if (startDate.length && endDate.length) {
            let arrSt = startDate.split("/");
            let arrEn = endDate.split("/");

            let sDt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]))
            let eDt = new Date(Date.parse(arrEn[1] + '-' + arrEn[0] + '-' + arrEn[2]));

            if (sDt > eDt) this.errDateMn = true;
            else this.errDateMn = false;

        } else { this.errDateMn = false; }
    }

    countFbMentor = '0/500'
    countColorFbMentor = 'black'
    invalidLengthFbMentor = false;
    counterFbMentor() {
        let c = this.feedbackMentorForm.get('fbMentor').value.length
        this.countFbMentor = c + '/500';

        if (c > 500) {
            this.countColorFbMentor = 'red';
            this.invalidLengthFbMentor = true;
        } else {
            this.countColorFbMentor = 'black';
            this.invalidLengthFbMentor = false;
        }
    }

    checkFbMentor() {
        let c = this.feedbackMentorForm.get('fbMentor').value
        if (c && !this.invalidLengthFbMentor) $("#feedbackConfirmationModal").modal('show');

    }
}