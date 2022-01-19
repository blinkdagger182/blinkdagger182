import { Component, OnInit, Type } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MyLang } from './var/malay-lang-vars';
import { EnLang } from './var/english-lang-vars';
import { MapsVars } from './var/maps-vars';
import { GlobalVariable } from "../../../../../environments/environment";
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any

@Component({
    selector: 'maps-app',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css'],
})

export class MapsComponent implements OnInit {

    myChecked: boolean = true;
    loading: boolean = true;
    loadingEv: boolean = true;
    evData: boolean = false;
    subListEmpty: boolean = true;
    goalSettingTab: boolean = true;
    teamOverviewTab: boolean = false;
    activityTab: boolean = true;
    env_prod: boolean = false;
    loadingFbMain: boolean = false; // feedback all 3 feedbacks
    loadingAct = false; // loading for activity
    loadingAch = false; // loading for achievement
    loadingFb = false; // loading for feedback

    showEmptyAct: boolean = false // empty for activity
    showEmptyAch: boolean = false // empty for achievement
    showEmptyFb: boolean = false; // empty for feedback
    showEmptyFbView: boolean = false; // empty for view fb request

    supTabTeamOv: boolean = true; // supervisor click own "view" button at team overview 
    showTmOvrvwRoleThree: boolean = false; // showing tab for role 3 (supervisor is NE) because have own form and subordinate

    jobResForm: FormGroup;
    sigInvForm: FormGroup;
    sendForm: FormGroup;
    searchForReqFbForm: FormGroup;
    giveFbForm: FormGroup;
    appraiseForm: FormGroup;
    revertRemarkForm: FormGroup;
    activityForm: FormGroup;
    achievementForm: FormGroup;
    acknowledgmentCommentForm: FormGroup;

    env = GlobalVariable.ENV_NAME;

    userProfile;
    roleNum = 1; // 1 - Empl & NE // 2 - Empl & Exec // 3 - Supv & NE // 4 - Supv & Exec
    feedbackName;
    cursorType = 'default';
    rateZero = 0;
    userName = '';
    pager: any = {};
    word: any;
    errMsg = '';
    errMsgUnexpected = 'Unexpected Error, please contact developer.'

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        ]
    }

    ktOptionsJr = [
        {
            name: 'People',
            name_bh: 'Anggota',
            value: 1
        },
        {
            name: 'Customer',
            name_bh: 'Pelanggan',
            value: 2
        },
        {
            name: 'Business',
            name_bh: 'Perniagaan',
            value: 3
        }
    ];

    ktOptionsSi = [
        {
            name: 'Stretch Assignment',
            name_bh: 'Tugasan Tambahan',
            value: 1
        },
        {
            name: 'Cross Functional',
            name_bh: 'Fungsi Bersilang',
            value: 2
        },
        {
            name: 'Innovation',
            name_bh: 'Inovasi',
            value: 3
        }
    ];

    dayMy = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
    dayEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    monthMy = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    monthEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sebtember', 'October', 'November', 'December']

    constructor(
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private _location: Location,
    ) { }

    ngOnInit() {
        if (this.env === 'prod') this.env_prod = true;
        else this.env_prod = false;

        this.userProfile = JSON.parse(localStorage.getItem('currentUser'));
        this.userName = this.userProfile.body.name;
        this.feedbackName = this.userName;

        let lang = localStorage.getItem('lang');
        if (lang) {
            if (lang === 'my') {
                this.myChecked = true;
                this.word = MyLang;
            }
            if (lang === 'en') {
                this.myChecked = false;
                this.word = EnLang;
            }
        } else {
            this.myChecked = true;
            this.word = MyLang;
            localStorage.setItem('lang', 'my');
        }

        if (this.roleNum < 3) this.getFbTabDataEmp();

        this.acknowledgmentCommentForm = new FormGroup({
            commentAcknowledgement: new FormControl(''),

        });

        this.jobResForm = new FormGroup({
            seq: new FormControl(null, Validators.required),
            perspective: new FormControl(1, Validators.required),
            kpi: new FormControl('', Validators.required),
            metric: new FormControl('', Validators.required),
            tgt: new FormControl(0, Validators.required),
            wt: new FormControl(0, Validators.required),
            task: new FormControl('', Validators.required),
            due_date: new FormControl(new Date().toISOString().split("T")[0], Validators.required),
            completion: new FormControl(0, Validators.required),
        });

        this.sigInvForm = new FormGroup({
            seq: new FormControl(null, Validators.required),
            perspective: new FormControl(1, Validators.required),
            kpi: new FormControl('', Validators.required),
            metric: new FormControl('', Validators.required),
            tgt: new FormControl(0, Validators.required),
            wt: new FormControl(0, Validators.required),
            task: new FormControl('', Validators.required),
            due_date: new FormControl(new Date().toISOString().split("T")[0], Validators.required),
            completion: new FormControl(0, Validators.required)
        });

        this.sendForm = new FormGroup({
            comment: new FormControl('', Validators.required),
            checkFaceToFace: new FormControl(null, Validators.required),
            ratingEnd: new FormControl(null, Validators.required)
        });

        this.searchForReqFbForm = new FormGroup({
            text: new FormControl(null, Validators.required),
            message: new FormControl(null, Validators.required)
        });

        this.giveFbForm = new FormGroup({
            feedback: new FormControl(null, Validators.required),
            rating: new FormControl(null, Validators.required)
        });

        this.appraiseForm = new FormGroup({
            ratingAppr: new FormControl(null, Validators.required),
            feedbackAppr: new FormControl(null, Validators.required)
        });

        this.revertRemarkForm = new FormGroup({ remark: new FormControl(null, Validators.required) })

        this.activityForm = new FormGroup({
            activity: new FormControl(null, Validators.required),
            detail: new FormControl('', Validators.required),
            kpi: new FormControl('', Validators.required),
            file: new FormControl(null, Validators.required)
        })

        this.achievementForm = new FormGroup({
            title: new FormControl(null, Validators.required),
            detail: new FormControl('', Validators.required),
            kpi: new FormControl('', Validators.required),
            file: new FormControl(null, Validators.required)
        })

        this.checkRole();
        //this.getSession();
    }

    // role checking
    checkRole() {
        let role = JSON.parse(localStorage.getItem('roleMaps'));
        this.roleNum = role.role_lvl;

        switch (role.role_lvl) {
            case 1: this.ifEmployee(); // 1 - Empl & NE
                break;
            case 2: this.ifEmployee(); // 2 - Empl & Exec
                break;
            case 3: this.ifSupervisor(); 
            //this.getEvForm(); // 3 - Supv & NE
                break;
            case 4: this.ifSupervisor(); this.teamOverviewTab = true; this.showTmOvrvwRoleThree = true; // 4 - Supv & Exec
                break;
        }
    }

    // for language BM or English
    langChange(id) {
        let selectedLang = id.value;
        if (selectedLang === 'my') {
            this.word = MyLang;
            localStorage.setItem('lang', 'my');
            this.myChecked = true;
        }
        if (selectedLang === 'en') {
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
            this.myChecked = false;
        }
        document.getElementById('lang_close').click();
    }

    // to call API for activity when click feedback tab as employee/NE
    getActTabDataEmp() {
        if (this.kpiList.length === 0) this.getKpiList(this.userProfile.body.gemsId, null) // call kpi list
        if (this.activityList.length === 0) this.getActivityList(this.userProfile.body.gemsId) // call api get activity list
    }

    // to call API for achievement when click feedback tab as employee/NE
    getAchTabDataEmp() {
        if (this.kpiList.length === 0) this.getKpiList(this.userProfile.body.gemsId, null) // call kpi list
        if (this.achievementList.length === 0) this.getAchievementList(this.userProfile.body.gemsId) // call api get achievement
    }

    // to call API for feedback when click feedback tab as employee/NE
    getFbTabDataEmp() {
        if (this.viewFbList.length === 0) this.viewFbReq(0, 'emp'); // my feedback and view feedback request
        if (this.viewFbGiverList.length === 0) this.viewFbGiver(); // pending feedback
    }

    // to call API for feedback when click feedback tab as supervisor/appraiser/reviewer
    getFbTabDataSup() {
        if (this.viewFbList.length === 0) this.viewFbReq(0, 'sup'); // my feedback and view feedback request
        if (this.viewFbGiverList.length === 0) this.viewFbGiver(); // pending feedback
        if (this.viewFbAsSupvList.length === 0) this.viewFbAsSupv(); // view subordinates' feedback
    }

    // click view button self in team overview tab
    viewBtnSelf() {
        this.supTabTeamOv = true; // show the related tab for supervisor
        this.viewFbReq(0, 'sup'); // view feedback request from other to self
        this.feedbackNameTitle(0, 0); // show self name
    }

    // click view button subordinates in team overview tab
    persNoSupvView; // supervisor click view subordinates and save persno number
    viewBtnEmp(staffNo, subLvl, persNo, name) {
        this.getEvFormListSv(staffNo,subLvl,persNo);
        this.persNoSupvView = persNo;
        this.supTabTeamOv = false; // hide not related tab for employee
        //this.getEvFormSupv(staffNo, subLvl); // call maps form view as supervisor
        this.viewFbReq(persNo, 'emp'); // view feedback request from other to subordinate
        this.feedbackNameTitle(name, persNo); // show subordinate name
        this.getKpiList(persNo, null); // get kpi list subordinate
        this.getActivityList(persNo); // get activity list subordinate
        this.myactivityTabClick(); // get main tab (my tab) to view subordinates activities
    }

    // condition for testing employee or supervisor 
    ifEmployee() { ///
        //this.getEvForm();
        this.getEvFormList()
    }

    // condition for testing employee or supervisor
    ifSupervisor() {
        this.getSubordinateList();
        this.getEvaluator();
    }

    // to get screen width
    windowWidth = window.innerWidth;
    mediaWidth() {
        this.windowWidth = window.innerWidth;
    }

    // button on progress bar blue
    scrollValue: number = 0
    widthBar;
    scrolllLeft() {
        if (this.windowWidth > 1500) this.widthBar = 900
        else if (this.windowWidth > 1200 && this.windowWidth < 1501) this.widthBar = window.innerWidth
        else if (this.windowWidth > 1000 && this.windowWidth < 1201) this.widthBar = window.innerWidth + 300
        else this.widthBar = window.innerWidth + 600

        if (this.scrollValue > -1 && this.scrollValue <= this.widthBar) this.scrollValue = this.scrollValue - 80
        else if (this.scrollValue < 0) this.scrollValue = 0
        else if (this.scrollValue > this.widthBar) this.scrollValue = 800
        this.valueScroll()
    }
    scrollRight() {
        if (this.windowWidth > 1500) this.widthBar = 1000
        else if (this.windowWidth > 1200 && this.windowWidth < 1501) this.widthBar = window.innerWidth
        else if (this.windowWidth > 1000 && this.windowWidth < 1201) this.widthBar = window.innerWidth + 300
        else this.widthBar = window.innerWidth + 600

        if (this.scrollValue > -1 && this.scrollValue <= this.widthBar) this.scrollValue = this.scrollValue + 80
        else if (this.scrollValue < 0) this.scrollValue = 0
        this.valueScroll()
    }
    valueScroll() {
        $('#containerBlue').scrollLeft(this.scrollValue)
    }

    // session for form
    goalSetSession: boolean = false;
    midYrSession: boolean = false;
    endYrSession: boolean = false;
    publishDate: boolean = false;
    testPublishDate: boolean = false; //testing purposes
    getSession(year) {
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETSession).subscribe(res => {
            let date = new Date().toISOString();

            let testDate = '2021-10-30T16:00:00.000Z'
            this.publishDate = false;
            for (let i = 0; i < res.length; i++){
                if (res[i].year === year){
                    if (date > res[i].s_date_goalstg) this.goalSetSession = true;
                    if (date > res[i].s_date_midyear) this.midYrSession = true;
                    if (date > res[i].s_date_endyear) this.endYrSession = true;
                    if (date > res[i].date_pub_stage) this.publishDate = true;

                }
            }



            
            //for testing purposes
            if (testDate >= res[0].date_pub_stage) this.testPublishDate = true;


        }, error => {
            console.log('[ERROR] cannot get session ' + error)
        })
    }

    // to get form list for the employee

    employeeFormList;
    empFormDueDate;
    empFormLastModf;
    getEvFormList(){
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETFormList + this.userProfile.userid).subscribe(res => {
            if (res){
            this.employeeFormList = res;
            
            for (let i = 0; i < this.employeeFormList.length ; i++){
                if (this.employeeFormList[i].dflt == 1){
                    this.getEvForm(this.employeeFormList[i].year);
                }
                if (res.due_date) this.employeeFormList[i].due_date = this.employeeFormList[i].due_date.split("T")[0].split('-').reverse().join('/');
                if (res.last_updated_on) this.employeeFormList[i].last_updated_on = this.employeeFormList[i].last_updated_on.split("T")[0].split('-').reverse().join('/');
            
            }
            
            }
        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // to get form list for the supervisor
    svFormYear;
    svRevertFormYear;
    employeeFormListAfter;
    getEvFormListSv(staffNo,subLvl,persNo){
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETFormList + staffNo).subscribe(res => {
            if (res){
            this.employeeFormList = res;
           this.subLevelView = subLvl;

            for (let i = 0; i < this.employeeFormList.length ; i++){
                if (this.employeeFormList[i].dflt == 1){
                    this.getEvFormSupv(staffNo,subLvl,this.employeeFormList[i].year,persNo);
                }
                if (res.due_date) this.employeeFormList[i].due_date = this.employeeFormList[i].due_date.split("T")[0].split('-').reverse().join('/');
                if (res.last_updated_on) this.employeeFormList[i].last_updated_on = this.employeeFormList[i].last_updated_on.split("T")[0].split('-').reverse().join('/');
            
            }
            

            }
        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // to get evaluation MAPS form for employee
    EmpEvFormZero = ['1', '2', '3'];
    EmpEvFormOne = ['2', '3'];
    evMapsForm;
    evMapsFormName = null;
    evMapsFormFormId = null;
    evMapsFOrmDueDate = null;
    evMapsFormLastModf = null;
    jobResList = [];
    sigInvList = [];
    empProgBar = 1;
    showRemark = false;
    acceptanceIndicator;
    yearChoose;
    currentFormID;
    empStaffNo;
    getEvForm(year) {
        //this.loading = true;
        let data = {
            staff_id: this.userProfile.userid ,
            year: year,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId
        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm ,data).subscribe(res => {

            if (res) {
                
                this.evMapsForm = res;
                this.yearChoose = res.year;
                this.currentFormID = res.maps_form_id;
                this.empStaffNo =res.staff_id;
                if (res.name) this.evMapsFormName = res.name;
                if (res.jr) this.jobResList = res.jr;
                if (res.si) this.sigInvList = res.si;
                if (res.due_date) this.evMapsFOrmDueDate = res.due_date.split("T")[0].split('-').reverse().join('/');
                if (res.last_updated_on) this.evMapsFormLastModf = res.last_updated_on.split("T")[0].split('-').reverse().join('/');
                if (res.status_id) this.empProgBar = res.status_id;
                if (res.maps_form_id) this.evMapsFormFormId = res.maps_form_id;
                if ((this.empProgBar === 1 && res.sv_rv_rmk) || (this.empProgBar === 3 && res.midyr_sv_rv_rmk) || (this.empProgBar === 5 && res.endyr_sv_rv_rmk)) this.showRemark = true;
                if (this.empProgBar > 2 && this.evMapsFormFormId) this.getOverallRating(this.evMapsFormFormId)
                if (res.status_id > 2) this.getCompetency();
                 this.acceptanceIndicator = res.agree;
                 this.getSession(year);
                //console.log(this.acceptanceIndicator);

                setTimeout(() => {
                    if (res.comment != null) $(".evMapsFormComment").html(res.comment);
                    if (res.sv_cmt) $(".evMapsFormSvComment").html(res.sv_cmt);
                    if (res.midyr_ee_cmt) $(".evMapsFormMidYrComment").html(res.midyr_ee_cmt);
                    if (res.midyr_sv_cmt) $(".evMapsFormMidYrSvComment").html(res.midyr_sv_cmt);
                    if (res.endyr_ee_cmt) $(".evMapsFormEndYrComment").html(res.endyr_ee_cmt);
                    if (res.endyr_sv_cmt) $(".evMapsFormEndYrSvComment").html(res.endyr_sv_cmt);
                    if (res.f_revr_cmt) $(".evMapsFormReviewerComment").html(res.f_revr_cmt);
                    if (res.f_revr_cmt_2) $(".evMapsFormReviewerComment2").html(res.f_revr_cmt_2);

                }, 3000);

                this.getImgOpt();
            }

        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // to get competency list by ev form id
    compeList = [];
    getCompetency() {
        // this.loading = true;
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETCompetencyList + this.evMapsFormFormId).subscribe(res => {

            if (res) {
                this.compeList = res.cc_tmt
                this.cursorType = 'default'
            }

        }, error => {
            console.log('[ERROR] cannot get competency ' + error);
        })
    }

    // to get evaliation MAPS form for supervisor
    authNoEmpSv;
    empStaffNoOnSupv;
    subLevelView: number = 0; // 1 - direct (appraisee to appraiser) // 2 - indirect (appraisee to reviewer) // 3 - special (appraiser & reviewer same person)
    getEvFormSupv(staffNo, subLvl,year,persNo) {
        this.compeList = []
        this.evData = true;
        this.loadingEv = true;
        this.svFormYear = year;
        this.authNoEmpSv = persNo;
        this.empStaffNoOnSupv = staffNo;

        let data = {
            staff_id: staffNo,
            year: year,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm ,data).subscribe(res => {

            if (res) {
                this.getSession(year);
                this.evMapsForm = res;
                this.subLevelView = res.subord_lvl;
                if (res.name) this.evMapsFormName = res.name;
                if (res.jr) this.jobResList = res.jr;
                if (res.si) this.sigInvList = res.si;
                if (res.status_id) this.empProgBar = res.status_id;
                if (res.maps_form_id) this.evMapsFormFormId = res.maps_form_id;
                if (this.empProgBar > 2 && this.evMapsFormFormId) this.getOverallRating(this.evMapsFormFormId);
                this.acceptanceIndicator = res.agree;

                this.getImgOpt();

                setTimeout(() => {
                    if (res.comment) $(".evMapsFormComment").html(res.comment);
                    if (res.sv_cmt) $(".evMapsFormSvComment").html(res.sv_cmt);
                    if (res.midyr_ee_cmt) $(".evMapsFormMidYrComment").html(res.midyr_ee_cmt);
                    if (res.midyr_sv_cmt) $(".evMapsFormMidYrSvComment").html(res.midyr_sv_cmt);
                    if (res.endyr_ee_cmt) $(".evMapsFormEndYrComment").html(res.endyr_ee_cmt);
                    if (res.endyr_sv_cmt) $(".evMapsFormEndYrSvComment").html(res.endyr_sv_cmt);
                    if (res.f_revr_cmt) $(".evMapsFormReviewerComment").html(res.f_revr_cmt);
                    if (res.f_revr_cmt_2) $(".evMapsFormReviewerComment2").html(res.f_revr_cmt_2);
                }, 3000);

                if (res.status_id > 3) this.getCompetency();
                if (this.evMapsForm) this.loadingEv = false;
            }

        }, error => {
            console.log('[ERROR] cannot get supervisor evaluation form ' + error);
        })
    }

    // to get image of employee and evaluator
    profileImgEmp;
    profileImgEva;
    getImgOpt() {
        let evalOne = GlobalVariable.BASE_API_URL + MapsVars.GETImg + this.evMapsForm.eval1[0].img_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(evalOne).subscribe(data => {
            if (data) this.profileImgEmp = evalOne;
            else this.profileImgEmp = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            this.loading = false;
        },
            error => {
                this.profileImgEmp = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this.loading = false;
            });
        let evalTwo = GlobalVariable.BASE_API_URL + MapsVars.GETImg + this.evMapsForm.eval2[0].img_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(evalTwo).subscribe(data => {
            if (data) this.profileImgEva = evalTwo;
            else this.profileImgEva = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            this.loading = false;
        },
            error => {
                this.profileImgEva = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this.loading = false;
            });
    }

    // get goal library
    goalLibList = [];
    goalLibBool = false;
    goalLibrary() {
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETGoalLibrary).subscribe(res => {
            if (res) {
                this.goalLibBool = true;
                if (res.goal_lib) this.goalLibList = res.goal_lib;
                if (this.goalLibList) $('#goalLibraryBtn').click();
            }
        }, error => {
            console.log('[ERROR] Cannot get goal library ' + error);
        })
    }
    numCat;
    jobFamGLib = []
    chooseCatGLib(num) {
        this.numJobFam = null;
        this.numCat = num;
        this.jobFamGLib = this.goalLibList[num].job_fam;
        this.goalGLib = []
    }
    numJobFam;
    goalGLib = [];
    chooseJobFamGLib(num) {
        this.numJobFam = num
        this.goalGLib = this.jobFamGLib[num].goal;
    }
    chooseGoalGLib(num) {
        if (this.myChecked) {

            this.jobResForm.patchValue({
                kpi: this.goalGLib[num].name_bh,
                metric: this.goalGLib[num].metric_bh
            })
            this.counterKpiJr();

        } else {

            this.jobResForm.patchValue({
                kpi: this.goalGLib[num].name,
                metric: this.goalGLib[num].metric
            })
            this.counterKpiJr();

        }
    }

    // counter for limit character
    countJr = '0/1000'
    countColorJr = 'black'
    counterKpiJr() {
        let c = this.jobResForm.get('kpi').value.length
        this.countJr = c + '/1000';

        if (c > 1000) this.countColorJr = 'red';
        else this.countColorJr = 'black';
    }
    countSi = '0/1000'
    countColorSi = 'black'
    counterKpiSi() {
        let c = this.sigInvForm.get('kpi').value.length
        this.countSi = c + '/1000';

        if (c > 1000) this.countColorSi = 'red';
        else this.countColorSi = 'black';
    }
    countInitJr = '0/100'
    countColorInitJr = 'black'
    counterInitJr() {
        let c = this.jobResForm.get('task').value.length
        this.countInitJr = c + '/100';

        if (c > 100) this.countColorInitJr = 'red';
        else this.countColorInitJr = 'black';
    }
    countInitSi = '0/100'
    countColorInitSi = 'black'
    counterInitSi() {
        let c = this.sigInvForm.get('task').value.length
        this.countInitSi = c + '/100';

        if (c > 100) this.countColorInitSi = 'red';
        else this.countColorInitSi = 'black';
    }
    countComment = '0/1000'
    countColorComment = 'red'
    counterComment() {
        let c = this.sendForm.get('comment').value;
        if (c !== '' && c !== null) {
            c = c.length;
            this.countComment = c + '/1000';
            if (c > 50 && c < 1000) this.countColorComment = 'black';
            else this.countColorComment = 'red';
        } else this.countComment = '0/1000';
    }
    
    counterCommentAcknowledgment() {
        let c = this.acknowledgmentCommentForm.get('commentAcknowledgement').value;
        if (c !== '' && c !== null) {
            c = c.length;
            this.countComment = c + '/1000';
            if (c > 60 && c < 1000) this.countColorComment = 'black';
            else this.countColorComment = 'red';
        } else this.countComment = '0/1000';
    }
    countRevert = '0/160' // revert textarea
    countColorRevert = 'black'
    counterRevert() {
        let c = this.revertRemarkForm.get('remark').value.length
        this.countRevert = c + '/160';

        if (c > 160) this.countColorRevert = 'red';
        else this.countColorRevert = 'black';
    }
    countActDet = '0/1000' // activity detail textarea
    countColorActDet = 'black'
    counterActDet() {
        let c = this.activityForm.get('detail').value;
        if (c !== '' && c !== null) {
            c = c.length;
            this.countActDet = c + '/1000';
            if (c > 1000) this.countColorActDet = 'red';
            else this.countColorActDet = 'black';
        } else this.countActDet = '0/1000'
    }
    countAchDet = '0/1000' // achievement detail textarea
    countColorAchDet = 'black'
    counterAchDet() {
        let c = this.achievementForm.get('detail').value;
        if (c !== '' && c !== null) {
            c = c.length;
            this.countAchDet = c + '/1000';
            if (c > 1000) this.countColorAchDet = 'red';
            else this.countColorAchDet = 'black';
        } else this.countAchDet = '0/1000'
    }

    // condition for button post in modal form job responsibility
    postCond: Boolean = false; // to open send button for using post API
    editCond: Boolean = false; // to open send button for using edit API
    editSeq;
    deliverJrList = [] // list of deliverable job responsible
    postJobResBtn() {

        this.counterKpiJr();

        if (this.jobResList.length > 11) {

            $('#maxKpiBtn').click();

        } else {

            this.postCond = true;
            this.editCond = false;

            $('#jobResModalBtn').click();

        }
    }

    // open deliverable form at new modal
    newDeliverableBool: boolean = false; // to open button new deliverable
    editDelivarableBool: boolean = false; // to open button from edit deliverable
    openNewDJrModal() {

        this.invalidCharDe = false;
        this.invalidLengthDe = false;
        this.newDeliverableBool = true;
        this.editDelivarableBool = false;

        this.jobResForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });

        this.counterInitJr();
        $('#addDeliverJrModalBtn').click();
    }

    // add deliverables for job responsibility from edit deliverable button
    addDeliverableJr() {
        let de = {
            seq: this.deliverJrList[this.editDJrNum].seq,
            task: this.jobResForm.get('task').value,
            due_date: this.jobResForm.get('due_date').value,
            completion: parseInt(this.jobResForm.get('completion').value),
        }

        this.deliverJrList.splice(this.editDJrNum, 1, de)

        this.jobResForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });
    }

    // save deliverables for job responsibility
    saveDeliverableJr() {

        let seqDe;
        if (this.deliverJrList.length > 0) seqDe = this.deliverJrList[this.deliverJrList.length - 1].seq + 1;
        else seqDe = 1

        let de = {
            seq: seqDe,
            task: this.jobResForm.get('task').value,
            due_date: this.jobResForm.get('due_date').value,
            completion: parseInt(this.jobResForm.get('completion').value),
        }

        this.deliverJrList.push(de);

        this.jobResForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        })
    }

    // checking for number only for Jr
    invalidCharKpi: boolean = false; // to open error msg if kpi is empty
    invalidLengthKpi: boolean = false; // to open error msg if kpi characters is more than 1000
    invalidLengthMt: boolean = false; // to open error msg if metrik characters is more than 200
    invalidValueWt: boolean = false; // to open error msg if weightage is more than 50
    checkCharacterJr(type) {

        let targetJr = this.jobResForm.get('tgt').value;
        let wtJr = this.jobResForm.get('wt').value;
        let kpiJr = this.jobResForm.get('kpi').value;
        let met = this.jobResForm.get('metric').value;

        if (kpiJr === '' || met === '' || targetJr === 0 || targetJr === null || targetJr === '' || wtJr === 0 || wtJr === null || wtJr === '') {

            this.invalidCharKpi = true;
            this.invalidLengthKpi = false;
            this.invalidLengthMt = false;
            this.invalidValueWt = false;

        } else {

            if (kpiJr.length > 1000) {

                this.invalidCharKpi = false;
                this.invalidLengthKpi = true;
                this.invalidLengthMt = false;
                this.invalidValueWt = false;

            } else if (met.length > 200) {

                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = true;
                this.invalidValueWt = false;

            } else if (parseInt(wtJr) > 50) {
                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = false;
                this.invalidValueWt = true;
            } else {

                switch (type) {
                    case 'postJr': this.postJobRes();
                        break;
                    case 'editJr': this.editJobRes();
                        break;
                }

                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = false;
                this.invalidValueWt = false;
                // $('#closeModalJr').click();

            }
        }
    }

    // check delivarable character less than 100 and not empty
    invalidCharDe: boolean = false;
    invalidLengthDe: boolean = false;
    checkCharacterDeliverJr(type) {
        let taskJr = this.jobResForm.get('task').value;
        let completionJr = this.jobResForm.get('completion').value;

        if (taskJr === '' || completionJr === null) {

            this.invalidCharDe = true;
            this.invalidLengthDe = false;

        } else {

            if (taskJr.length > 100) {

                this.invalidLengthDe = true;
                this.invalidCharDe = false;

            } else {

                switch (type) {

                    case 'addDeliverJr': this.addDeliverableJr();
                        break;
                    case 'saveDeliverJr': this.saveDeliverableJr();
                        break;

                }
                this.invalidCharDe = false;
                this.invalidLengthDe = false;
                $('#closeModalAddDJr').click();

            }
        }
    }

    // to edit jr deliverable
    editDJrNum = 0
    editDeliverJr(num) {

        this.newDeliverableBool = false;
        this.editDelivarableBool = true;

        this.editDJrNum = num;

        this.jobResForm.patchValue({
            task: this.deliverJrList[num].task,
            due_date: this.deliverJrList[num].due_date,
            completion: this.deliverJrList[num].completion
        });

        this.counterInitJr();
        $('#addDeliverJrModalBtn').click();
    }

    // to delete jr deliverable
    deleteDeliverJr(num) {

        this.deliverJrList.splice(num, 1)

        this.jobResForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });
    }

    // to post job responsibility 
    postDataJr;
    postJobRes() {
        if (this.jobResList.length > 0) {
            this.postDataJr = {
                form_id: this.currentFormID,
                seq: this.jobResList[this.jobResList.length - 1].seq + 1,
                perspective: parseInt(this.jobResForm.get('perspective').value),
                kpi: this.jobResForm.get('kpi').value,
                metric: this.jobResForm.get('metric').value,
                tgt: this.jobResForm.get('tgt').value,
                wt: this.jobResForm.get('wt').value,
                deliverable: this.deliverJrList,
                staff_id: this.empStaffNo
            }
        } else {
            this.postDataJr = {
                form_id: this.currentFormID,
                seq: 1,
                perspective: parseInt(this.jobResForm.get('perspective').value),
                kpi: this.jobResForm.get('kpi').value,
                metric: this.jobResForm.get('metric').value,
                tgt: this.jobResForm.get('tgt').value,
                wt: this.jobResForm.get('wt').value,
                deliverable: this.deliverJrList,
                staff_id: this.empStaffNo

            }
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTJobRes, this.postDataJr).subscribe(res => {

            if (res.status === "OK") {

                this.cursorType = 'wait';
                this.refreshJr();
                this.deliverJrList = [];

                this.jobResForm.patchValue({
                    perspective: 1,
                    kpi: '',
                    metric: '',
                    tgt: 0,
                    wt: 0,
                    task: '',
                    due_date: new Date().toISOString().split("T")[0],
                    completion: 0,
                });

                this.goalLibList = [];

            } else console.log('something error, please contact developer')


        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg.code) {
                if (this.myChecked) this.errMsg = MyLang.invalidTgtWt;
                else this.errMsg = EnLang.invalidTgtWt;
            } else {
                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;
            }

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    refreshJr() {

        let data = {
            staff_id:this.userProfile.userid,
            year: this.yearChoose,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm , data).subscribe(res => {
            if (res.jr) {
                this.jobResList = res.jr;
                this.cursorType = 'default'
            }
        })
    }

    // condition for button edit in modal form job responsibility
    editJobResBtn(num) {
        this.deliverJrList = [];
        this.postCond = false;
        this.editCond = true;

        let data = {
            form_id: this.currentFormID,
            seq: num
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETJobResBySeq , data).subscribe(res => {
            this.editSeq = res;
            let editDeliverJrList = res.deliverable;

            if (editDeliverJrList.length > 0) {

                for (let i = 0; i < editDeliverJrList.length; i++) {
                    this.deliverJrList.push({
                        seq: editDeliverJrList[i].seq,
                        task: editDeliverJrList[i].task,
                        due_date: editDeliverJrList[i].due_date.split("T")[0],
                        completion: editDeliverJrList[i].completion
                    });
                }

            }

            if (this.editSeq) {
                this.jobResForm.patchValue({
                    perspective: this.editSeq.perspective,
                    kpi: this.editSeq.kpi,
                    metric: this.editSeq.metric,
                    tgt: this.editSeq.tgt,
                    wt: this.editSeq.wt,
                });

                $('#jobResModalBtn').click();

            } else console.log('MAPS form for this sequence is not found. Please contect developer!')

        }, error => {
            console.log('[ERROR] cannot get maps form job responsibility by sequence ' + error);
        })
    }

    // when click cancel after click edit pencil button - to clear form after cancel
    cancelEditJr() {
        this.jobResForm.patchValue({
            perspective: 1,
            kpi: '',
            metric: '',
            tgt: 0,
            wt: 0,
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0,
        });
        this.deliverJrList = []
    }

    // to edit job responsibility 
    editJobRes() {

        let postData = {
            form_id: this.currentFormID,
            seq: this.editSeq.jr_seq,
            perspective: parseInt(this.jobResForm.get('perspective').value),
            kpi: this.jobResForm.get('kpi').value,
            metric: this.jobResForm.get('metric').value,
            tgt: this.jobResForm.get('tgt').value,
            wt: this.jobResForm.get('wt').value,
            deliverable: this.deliverJrList,
            staff_id: this.empStaffNo
        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTJobRes, postData).subscribe(res => {
            if (res.status === "OK") {
                this.cursorType = 'wait';
                this.refreshJr();
                this.deliverJrList = [];
                this.jobResForm.patchValue({
                    perspective: 1,
                    kpi: '',
                    metric: '',
                    tgt: 0,
                    wt: 0,
                    task: '',
                    due_date: new Date().toISOString().split("T")[0],
                    completion: 0,
                });

                this.goalLibList = [];
            } else {
                console.log('something error, please contact developer')
            }
        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg.code) {
                if (this.myChecked) this.errMsg = MyLang.invalidTgtWt;
                else this.errMsg = EnLang.invalidTgtWt;
            } else {
                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;
            }

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to open modal confirmation before delete job res
    seqNumDeleteJr;
    deleteJobResBtn(num) {
        this.seqNumDeleteJr = num;
        $('#deteleJobResBtn').click();
    }

    // to delete job responsible
    deleteJobRes() {

        let data = {
            form_id: this.currentFormID,
            seqs: [this.seqNumDeleteJr],
            staff_id: this.empStaffNo
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTDeleteJobRes, data).subscribe(res => {
            if (res.status === 'OK') {
                this.cursorType = 'wait';
                this.refreshJr();
            } else {
                console.log('something error, please contact developer')
            }
        }, error => {
            console.log('[ERROR] cannot delete this job responsibility ' + error);
        });
    }

    // condition for button post in modal form job responsibility
    deliverSiList = [];
    postSigInvBtn() {

        this.counterKpiSi();

        if (this.sigInvList.length > 2) {

            $('#maxSiBtn').click();

        } else {

            this.postCond = true;
            this.editCond = false;
            $('#sigInvModalBtn').click();
        }
    }

    // open deliverable form at new modal
    openNewDSiModal() {

        this.invalidCharDe = false;
        this.invalidLengthDe = false;
        this.newDeliverableBool = true;
        this.editDelivarableBool = false;

        this.sigInvForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });

        this.counterInitSi();
        $('#addDeliverSiModalBtn').click();
    }

    // add deliverables for significant involvement
    addDeliverableSi() {
        let de = {
            seq: this.deliverSiList[this.editDSiNum].seq,
            task: this.sigInvForm.get('task').value,
            due_date: this.sigInvForm.get('due_date').value,
            completion: parseInt(this.sigInvForm.get('completion').value),
        }

        this.deliverSiList.splice(this.editDSiNum, 1, de)

        this.sigInvForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });
    }

    // save deliverables for job responsibility
    saveDeliverableSi() {

        let seqDe;
        if (this.deliverSiList.length > 0) seqDe = this.deliverSiList[this.deliverSiList.length - 1].seq + 1;
        else seqDe = 1

        let de = {
            seq: seqDe,
            task: this.sigInvForm.get('task').value,
            due_date: this.sigInvForm.get('due_date').value,
            completion: parseInt(this.sigInvForm.get('completion').value),
        }

        this.deliverSiList.push(de);

        this.sigInvForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        })
    }

    // checking for number only for Si
    checkCharacterSi(type) {

        let targetSi = this.sigInvForm.get('tgt').value;
        let wtSi = this.sigInvForm.get('wt').value;
        let kpiSi = this.sigInvForm.get('kpi').value;
        let met = this.sigInvForm.get('metric').value;

        if (kpiSi === '' || met === '' || targetSi === 0 || targetSi === null || targetSi === '' || wtSi === 0 || wtSi === null || wtSi === '') {

            this.invalidCharKpi = true;
            this.invalidLengthKpi = false;
            this.invalidLengthMt = false;
            this.invalidValueWt = false;

        } else {

            if (kpiSi.length > 1000) {

                this.invalidCharKpi = false;
                this.invalidLengthKpi = true;
                this.invalidLengthMt = false;
                this.invalidValueWt = false;

            } else if (met.length > 200) {

                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = true;
                this.invalidValueWt = false;

            } else if (parseInt(wtSi) > 50) {

                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = false;
                this.invalidValueWt = true;

            } else {

                switch (type) {

                    case 'postSi': this.postSigInv();
                        break;

                    case 'editSi': this.editSigInv();
                        break;
                }

                this.invalidCharKpi = false;
                this.invalidLengthKpi = false;
                this.invalidLengthMt = false;
                this.invalidValueWt = false;
                $('#closeModalSi').click();

            }
        }
    }

    // check delivarable character less than 100 and not empty
    checkCharacterDeliverSi(type) {
        let completionSi = this.sigInvForm.get('completion').value;
        let taskSi = this.sigInvForm.get('task').value;

        if (taskSi === '' || completionSi === null) {

            this.invalidCharDe = true;
            this.invalidLengthDe = false;

        } else {

            if (taskSi.length > 100) {

                this.invalidLengthDe = true;
                this.invalidCharDe = false;

            } else {

                switch (type) {

                    case 'addDeliverSi': this.addDeliverableSi();
                        break;
                    case 'saveDeliverSi': this.saveDeliverableSi();
                        break;

                }

                this.invalidCharDe = false;
                this.invalidLengthDe = false;
                $('#closeModalAddDSi').click();

            }
        }
    }

    // to edit si deliverable
    editDSiNum = 0;
    editDeliverSi(num) {

        this.newDeliverableBool = false;
        this.editDelivarableBool = true;

        this.editDSiNum = num;

        this.sigInvForm.patchValue({
            task: this.deliverSiList[num].task,
            due_date: this.deliverSiList[num].due_date,
            completion: this.deliverSiList[num].completion
        });

        this.counterInitSi();
        $('#addDeliverSiModalBtn').click();
    }

    // to delete si deliverable
    deleteDeliverSi(num) {

        this.deliverSiList.splice(num, 1)

        this.sigInvForm.patchValue({
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0
        });
    }

    // to post significant involvement
    postDataSi;
    postSigInv() {

        if (this.sigInvList.length > 0) {
            this.postDataSi = {
                form_id: this.currentFormID,
                seq: this.sigInvList[this.sigInvList.length - 1].seq + 1,
                perspective: parseInt(this.sigInvForm.get('perspective').value),
                kpi: this.sigInvForm.get('kpi').value,
                metric: this.sigInvForm.get('metric').value,
                tgt: this.sigInvForm.get('tgt').value,
                wt: this.sigInvForm.get('wt').value,
                deliverable: this.deliverSiList,
                staff_id: this.empStaffNo
            }
        } else {
            this.postDataSi = {
                form_id: this.currentFormID,
                seq: 1,
                perspective: parseInt(this.sigInvForm.get('perspective').value),
                kpi: this.sigInvForm.get('kpi').value,
                metric: this.sigInvForm.get('metric').value,
                tgt: this.sigInvForm.get('tgt').value,
                wt: this.sigInvForm.get('wt').value,
                deliverable: this.deliverSiList,
                staff_id: this.empStaffNo
            }
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTSignificantInv, this.postDataSi).subscribe(res => {

            if (res.status === "OK") {

                this.cursorType = 'wait';
                this.refreshSi();
                this.deliverSiList = [];

                this.sigInvForm.patchValue({
                    perspective: 1,
                    kpi: '',
                    metric: '',
                    tgt: 0,
                    wt: 0,
                    task: '',
                    due_date: new Date().toISOString().split("T")[0],
                    completion: 0,
                });

            } else console.log('something error, please contact developer')

        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg.code) {
                if (this.myChecked) this.errMsg = MyLang.invalidTgtWt;
                else this.errMsg = EnLang.invalidTgtWt;
            } else {
                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;
            }

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    refreshSi() {
        
        let data = {
            staff_id:this.userProfile.userid,
            year: this.yearChoose,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm , data).subscribe(res => {
            if (res.si) {
                this.sigInvList = res.si;
                this.cursorType = 'default'
            }
        })
    }

    // condition for button edit in modal form significant involvement
    editSigInvBtn(num) {
        this.deliverSiList = [];
        this.postCond = false;
        this.editCond = true;

        let data = {
            form_id: this.currentFormID,
            seq: num
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETSigInvBySeq , data).subscribe(res => {
            this.editSeq = res;
            let editDeliverSiList = res.deliverable;

            if (editDeliverSiList.length > 0) {

                for (let i = 0; i < editDeliverSiList.length; i++) {
                    this.deliverSiList.push({
                        seq: editDeliverSiList[i].seq,
                        task: editDeliverSiList[i].task,
                        due_date: editDeliverSiList[i].due_date.split("T")[0],
                        completion: editDeliverSiList[i].completion
                    })
                }
            }

            if (this.editSeq) {

                this.sigInvForm.patchValue({
                    perspective: this.editSeq.perspective,
                    kpi: this.editSeq.kpi,
                    metric: this.editSeq.metric,
                    tgt: this.editSeq.tgt,
                    wt: this.editSeq.wt,
                });

                $('#sigInvModalBtn').click();

            } else console.log('MAPS form for this sequence is not found. Please contect developer!')

        }, error => {
            console.log('[ERROR] cannot get maps form significant involvement by sequence ' + error);
        })
    }

    // when click cancel after click edit pencil button - to clear form after cancel
    cancelEditSi() {
        this.sigInvForm.patchValue({
            perspective: 1,
            kpi: '',
            metric: '',
            tgt: 0,
            wt: 0,
            task: '',
            due_date: new Date().toISOString().split("T")[0],
            completion: 0,
        });
        this.deliverSiList = []
    }

    // to edit significant involvement
    editSigInv() {

        let postData = {
            form_id: this.currentFormID,
            seq: this.editSeq.si_seq,
            perspective: parseInt(this.sigInvForm.get('perspective').value),
            kpi: this.sigInvForm.get('kpi').value,
            metric: this.sigInvForm.get('metric').value,
            tgt: this.sigInvForm.get('tgt').value,
            wt: this.sigInvForm.get('wt').value,
            deliverable: this.deliverSiList,
            staff_id: this.empStaffNo

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTSignificantInv, postData).subscribe(res => {
            if (res.status === "OK") {
                this.cursorType = 'wait';
                this.refreshSi();
                this.deliverSiList = [];
                this.sigInvForm.patchValue({
                    perspective: 1,
                    kpi: '',
                    metric: '',
                    tgt: 0,
                    wt: 0,
                    task: '',
                    due_date: new Date().toISOString().split("T")[0],
                    completion: 0,
                });

                this.goalLibList = [];
            } else {
                console.log('something error, please contact developer')
            }
        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg.code) {
                if (this.myChecked) this.errMsg = MyLang.invalidTgtWt;
                else this.errMsg = EnLang.invalidTgtWt;
            } else {
                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;
            }

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to open modal confirmation before delete significant inv
    seqNumDeleteSi;
    deleteSigInvBtn(num) {
        this.seqNumDeleteSi = num;
        $('#deteleSigInvBtn').click();
    }

    // to delete significant inv
    deleteSigInv() {

        let data = {
            form_id: this.currentFormID,
            seqs: [this.seqNumDeleteSi],
            staff_id: this.empStaffNo
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTDeleteSigInv, data).subscribe(res => {
            if (res.status === 'OK') {
                this.cursorType = 'wait';
                this.refreshSi();
            } else {
                console.log('something error, please contact developer')
            }
        }, error => {
            console.log('[ERROR] cannot delete this job responsibility ' + error);
        });
    }

    // to show kpi list for link to activity and achievement
    kpiList = []
    getKpiList(num, view) {
        let persno = parseInt(num)
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETKpiList + persno).subscribe(res => {
            this.kpiList = [];
            let wd = this.windowWidth / 10;
            for (let item of res.kpi) {
                let k = '';
                if (item.kpi) {
                    if (item.kpi.length > wd) k = item.kpi.substring(0, wd) + '...';
                    else k = item.kpi;
                }
                this.kpiList.push({
                    form_id: item.form_id,
                    id: item.id,
                    kpi: k,
                    metric: item.metric,
                    perspective: item.perspective,
                    seq: item.seq,
                    tgt: item.tgt,
                    wt: item.wt
                });
            }
            if (view !== null) this.viewDetailActivityModal(view)
        }, error => {
            console.log('[ERROR] cannot get kpi list: ' + error);
        })
    }

    callAgainKpiList() {
        this.getKpiList(this.userProfile.body.gemsId, null);
    }

    stringToHTML(str) {
        let dom = str.innerHTML;
        return dom;
    };

    //// ACTIVITY FUNCTION START ////
    // to show activity list when click feedback tab because activity will show first
    activityList = [];
    getActivityList(persNo) {
        this.activityList = [];
        this.loadingAct = true;
        this.showEmptyAct = true;

        let api; let pers;
        if (this.supTabTeamOv && this.roleNum > 2) {
            pers = '';
            if (persNo === 'myAct') api = MapsVars.GETMyActivityListSupv;
            else api = MapsVars.GETActivityListSupv;
        } else {
            api = MapsVars.GETActivityList;
            pers = persNo;
        }

        this._GET_api_Service.GET_MAPS_data(api + pers).subscribe(res => {

            if (res) {
                this.showEmptyAct = false;

                for (let i = 0; i < res.activity.length; i++) {
                    this.activityList.push({
                        id: res.activity[i].id,
                        subor_name: res.activity[i].subor_name,
                        pers_no: res.activity[i].pers_no,
                        activity: res.activity[i].activity,
                        created_on_my: this.dayMy[(new Date(res.activity[i].created_on)).getDay() - 1] + ', '
                            + (new Date(res.activity[i].created_on)).getDate() + ' '
                            + this.monthMy[new Date(res.activity[i].created_on).getMonth()] + ' '
                            + (new Date(res.activity[i].created_on)).getFullYear(),
                        created_on_en: this.dayEn[(new Date(res.activity[i].created_on)).getDay() - 1] + ', '
                            + (new Date(res.activity[i].created_on)).getDate() + ' '
                            + this.monthEn[new Date(res.activity[i].created_on).getMonth()] + ' '
                            + (new Date(res.activity[i].created_on)).getFullYear(),
                        htmlDetAct: "detailsActivityHtmlMain" + i
                    })

                    setTimeout(() => {
                        $("#detailsActivityHtmlMain" + i).html(res.activity[i].details);
                    }, 500);

                    if (res.activity.length === this.activityList.length) this.loadingAct = false;
                }
            }
        }, error => {
            this.loadingAct = false;
            this.showEmptyAct = true;
        })
    }

    // get time for add activity for normal
    timeNow = '';
    getModalAddActivity() {
        let date = new Date();
        if (this.myChecked) this.timeNow = this.dayMy[date.getDay() - 1] + ', ' + date.getDate() + ' ' + this.monthMy[date.getMonth()] + ' ' + date.getFullYear();
        else this.timeNow = this.dayEn[date.getDay() - 1] + ', ' + date.getDate() + ' ' + this.monthEn[date.getMonth()] + ' ' + date.getFullYear();
        this.callAgainKpiList();
        $('#addActivityBtn').click();
    }

    // to open modal for view detail activity
    activityDetailList = []; // view details respond
    activityDetailAttList = []; // attachments for view details respond
    viewDetailActivityModal(id) {

        this.activityDetailList = [];
        this.activityDetailAttList = [];
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETActivityById + id).subscribe(res => {

            if (res) {

                if (this.roleNum === 4 && this.supTabTeamOv && !this.subReqAct) {

                    this.activityDetailList.push({
                        activity: res.activity,
                        created_on: new Date(res.created_on).toDateString()
                    });

                } else {

                    let num = this.kpiList.findIndex(item => item.id === res.kpi_id);

                    if (num >= 0) {
                        this.activityDetailList.push({
                            activity: res.activity,
                            created_on: new Date(res.created_on).toDateString(),
                            kpi_id: this.kpiList[num].kpi,
                            metric: this.kpiList[num].metric,
                        });
                    } else {
                        this.activityDetailList.push({
                            activity: res.activity,
                            created_on: new Date(res.created_on).toDateString(),
                            kpi_id: '-',
                            metric: '-',
                        });
                    }


                }

                this.activityDetailAttList = res.att;

                $('#viewDetailActivityBtn').click();

                setTimeout(() => {
                    $("#detailsActivityHtml").html(res.details);
                }, 500);
            }
        }, error => {
            console.log('[ERROR] cannot edit activity: ' + error);
        })
    }

    // to open modal for edit activity
    editActiId: number = 0; // variable for activity id to edit
    isEditActivity: number = 0 // condition if 0 = normal mode, if 1 = edit mode.
    editActivityModal(id) {
        this.filesActivityView = [];
        this.filesActivityAll = [];
        this.isEditActivity = 1;
        this.editActiId = id;
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETActivityById + id).subscribe(res => {

            if (res) {

                this.activityForm.patchValue({
                    activity: res.activity,
                    detail: res.details,
                    kpi: res.kpi_id ? res.kpi_id : ''
                })
                this.timeNow = '';

                for (let i = 0; i < res.att.length; i++) {

                    this.filesActivityView.push({
                        name: res.att[i].name.split("_")[1],
                        type: res.att[i].type,
                        img: res.att[i].file
                    });

                    this.filesActivityAll.push({
                        name: res.att[i].name,
                        size: res.att[i].size,
                        type: res.att[i].type
                    })

                }
                $('#addActivityBtn').click();
            }

        }, error => {
            console.log('[ERROR] cannot edit activity: ' + error);
        })
    }

    // submit activity with form
    submitActivity() {
        let kpi = this.activityForm.get('kpi').value;

        $('#closeModalAddActivity').click();

        let ownActiv; let kpiId;
        if (this.roleNum < 3) {
            ownActiv = 1;
            kpiId = parseInt(kpi);
        } else {
            ownActiv = 2;
            if (this.roleNum === 3) kpiId = parseInt(kpi);
            else kpiId = null;
        }

        let req = {
            kpi_id: kpiId,
            activity: this.activityForm.get('activity').value,
            details: this.activityForm.get('detail').value,
            own: ownActiv
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTSaveActivity, req).subscribe(res => {

            if (res) {

                if (res.activity_id && this.filesActivityAll.length > 0) {

                    let req = {
                        activity_id: res.activity_id,
                        files: this.filesActivityAll
                    }

                    this._POST_api_Service.POST_MAPS_data(MapsVars.POSTActivityAttachmentUpload, req).subscribe(resUpload => {

                        if (resUpload) {

                            if (this.roleNum === 4) this.getActivityList('myAct');
                            else this.getActivityList(this.userProfile.body.gemsId);

                            this.clearKpiValue();

                        }
                    }, error => {
                        console.log('[ERROR] cannot save the attachment activity: ' + error);
                    })
                } else {

                    if (this.roleNum === 4) this.getActivityList('myAct');
                    else this.getActivityList(this.userProfile.body.gemsId);

                    this.clearKpiValue();

                }
            }
        }, error => {
            console.log('[ERROR] cannot save activity: ' + error);
        })

    }

    clearKpiValue() {
        this.activityForm.patchValue({
            activity: null,
            detail: null,
            kpi: ''
        });
        this.filesActivityAll = [];
        this.filesActivityView = [];

        this.achievementForm.patchValue({
            title: null,
            detail: null,
            kpi: ''
        });

        this.filesAchievementAll = [];
        this.filesAchievementView = [];
    }

    openNewTabAttch(link) {
        window.open(link);
    }

    // triggering when to upload attachment file from computers for activity
    filesActivityAll = []; // for send to API
    filesActivityView = []; // for view at front-end
    attchActivityTrigger() {
        if (this.filesActivityAll.length < 3) $('#activityAtt').trigger('click');
        else {
            if (this.myChecked) this.errMsg = MyLang.fileAttchErr2;
            else this.errMsg = EnLang.fileAttchErr2;

            if (this.errMsg) $('#erroApiBtn').click()
        }
    }

    // after click the selected file
    fileAttachmentActivity;
    imgLinkAct = ''
    fileUploadActivity(event) {
        this.fileAttachmentActivity = event.target.files;

        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
            this.imgLinkAct = event.target.result
        }

        if (this.fileAttachmentActivity[0].size < 1000000) this.postAttachActivity();
        else {
            if (this.myChecked) this.errMsg = MyLang.fileAttchErr1;
            else this.errMsg = EnLang.fileAttchErr1;

            if (this.errMsg) $('#erroApiBtn').click()
        }
    }

    // submit to api the file to upload the database to get database path and get the activity_id
    postAttachActivity() {

        let form_Data = new FormData();
        form_Data.append('filetoupload', this.fileAttachmentActivity[0], this.fileAttachmentActivity[0].name);

        this._POST_api_Service.POST_ScreenShot_MAPS(MapsVars.POSTUploadActivityAttachment, form_Data).subscribe(res => {

            if (res.files) {
                this.filesActivityAll.push(res.files[0])
                this.filesActivityView.push({
                    name: res.files[0].name.split("_")[1],
                    type: res.files[0].type,
                    img: this.imgLinkAct
                })
            }

        }, error => {

            let errObj = JSON.parse(error._body)

            if (errObj.message) this.errMsg = errObj.message;
            else this.errMsg = this.errMsgUnexpected;

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to remove the selected file
    removeAttachActivity(num) {
        this.filesActivityAll.splice(num, 1)
        this.filesActivityView.splice(num, 1)
    }

    // submit edit activity with form
    submitEditActivity() {

        $('#closeModalAddActivity').click();

        let reqAtt = {
            activity_id: this.editActiId,
            files: this.filesActivityAll
        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTActivityAttachmentUpload, reqAtt).subscribe(resUpload => {

            if (resUpload) {
                this.filesActivityAll = [];
                this.filesActivityView = [];

                let ownActiv;
                if (this.roleNum < 3) ownActiv = 1;
                else ownActiv = 2;

                let req = {
                    id: this.editActiId,
                    kpi_id: parseInt(this.activityForm.get('kpi').value),
                    activity: this.activityForm.get('activity').value,
                    details: this.activityForm.get('detail').value,
                    own: ownActiv
                }

                this._POST_api_Service.POST_MAPS_data(MapsVars.POSTEditActivity, req).subscribe(res => {
                    if (res.status === "OK!") {
                        this.clearKpiValue();
                        if (this.roleNum === 4) this.getActivityList('myAct');
                        else this.getActivityList(this.userProfile.body.gemsId);
                    }

                }, error => {
                    console.log('[ERROR] cannot save activity: ' + error);
                })
            }

        }, error => {
            console.log('[ERROR] cannot save the attachment activity: ' + error);
        })
    }

    // delete confirmation for activity
    activityId;
    deleteActivityModal(id) {
        this.activityId = id;
        $('#deleteActivityModalBtn').click();
    }

    // confirm to delete activity
    deleteActivity() {
        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTDeleteActivity, { ids: [this.activityId] }).subscribe(res => {
            if (res.status === "OK") {
                if (this.roleNum === 4) this.getActivityList('myAct');
                else this.getActivityList(this.userProfile.body.gemsId);
            }

        }, error => {
            console.log('[ERROR] cannot delete activity: ' + error);
        })
    }

    // tab functionality at activity supervisor
    myAct: boolean = true;
    subReqAct: boolean = false;
    styleMyAct = '#01A8C6'
    styleSubReqAct = 'black';
    myactivityTabClick() {
        this.myAct = true; this.subReqAct = false;
        this.styleMyAct = '#01A8C6'; this.styleSubReqAct = 'black';
    }
    activitySubReqTabClick() {
        this.myAct = false; this.subReqAct = true;
        this.styleMyAct = 'black'; this.styleSubReqAct = '#01A8C6';
    }
    //// ACTIVITY FUNCTION END ////


    //// ACHIEVEMENT FUNCTION START ////
    // to show activity list when click feedback tab because activity will show first
    achievementList = [];
    getAchievementList(persNo) {
        this.achievementList = [];
        this.loadingAch = true;
        this.showEmptyAch = true;

        let api; let pers;
        if (this.supTabTeamOv && this.roleNum > 2) {
            pers = '';
            if (persNo === 'myAch') api = MapsVars.GETMyAchievementListSupv;
            else api = MapsVars.GETAchievementListSupv;
        } else {
            api = MapsVars.GETAchievementList;
            pers = persNo;
        }

        this._GET_api_Service.GET_MAPS_data(api + pers).subscribe(res => {

            if (res) {
                this.showEmptyAch = false;

                for (let i = 0; i < res.achievem.length; i++) {
                    this.achievementList.push({
                        id: res.achievem[i].id,
                        subor_name: res.achievem[i].subor_name,
                        pers_no: res.achievem[i].pers_no,
                        title: res.achievem[i].title,
                        created_on_my: this.dayMy[(new Date(res.achievem[i].created_on)).getDay() - 1] + ', '
                            + (new Date(res.achievem[i].created_on)).getDate() + ' '
                            + this.monthMy[new Date(res.achievem[i].created_on).getMonth()] + ' '
                            + (new Date(res.achievem[i].created_on)).getFullYear(),
                        created_on_en: this.dayEn[(new Date(res.achievem[i].created_on)).getDay() - 1] + ', '
                            + (new Date(res.achievem[i].created_on)).getDate() + ' '
                            + this.monthEn[new Date(res.achievem[i].created_on).getMonth()] + ' '
                            + (new Date(res.achievem[i].created_on)).getFullYear(),
                        htmlDetAch: "detailsAchievementHtmlMain" + i
                    })

                    setTimeout(() => {
                        document.getElementById("detailsAchievementHtmlMain" + i).innerHTML = res.achievem[i].details;
                    }, 500);

                    if (res.achievem.length === this.achievementList.length) this.loadingAch = false;
                }
            }
        }, error => {
            this.loadingAch = false;
            this.showEmptyAch = true;
        })
    }

    // get time for add achievement
    getModalAddAchievement() {
        let date = new Date();
        if (this.myChecked) this.timeNow = this.dayMy[date.getDay() - 1] + ', ' + date.getDate() + ' ' + this.monthMy[date.getMonth()] + ' ' + date.getFullYear();
        else this.timeNow = this.dayEn[date.getDay() - 1] + ', ' + date.getDate() + ' ' + this.monthEn[date.getMonth()] + ' ' + date.getFullYear();
        this.callAgainKpiList();
        $('#addAchievementBtn').click();

    }

    // triggering when to upload attachment file from computers for achievement
    filesAchievementAll = []; // for send to API
    filesAchievementView = []; // for view at front-end
    attchAchievementTrigger() {
        if (this.filesAchievementAll.length < 3) {
            $('#achievementAtt').trigger('click');
        } else {
            if (this.myChecked) this.errMsg = MyLang.fileAttchErr2;
            else this.errMsg = EnLang.fileAttchErr2;

            if (this.errMsg) $('#erroApiBtn').click()
        }
    }

    // after click the selected file
    fileAttachmentAchievement;
    imgLinkAch = ''
    fileUploadAchievement(event) {
        this.fileAttachmentAchievement = event.target.files;

        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
            this.imgLinkAch = event.target.result
        }

        if (this.fileAttachmentAchievement[0].size < 1000000) this.postAttachAchievement();
        else {
            if (this.myChecked) this.errMsg = MyLang.fileAttchErr1;
            else this.errMsg = EnLang.fileAttchErr1;

            if (this.errMsg) $('#erroApiBtn').click()
        }
    }

    // submit to api the file to upload the database to get database path and get the achievement_id
    postAttachAchievement() {

        let form_Data = new FormData();
        form_Data.append('filetoupload', this.fileAttachmentAchievement[0], this.fileAttachmentAchievement[0].name);

        this._POST_api_Service.POST_ScreenShot_MAPS(MapsVars.POSTUploadAchievementAttachment, form_Data).subscribe(res => {

            if (res.files) {
                this.filesAchievementAll.push(res.files[0])
                this.filesAchievementView.push({
                    name: res.files[0].name.split("_")[1],
                    type: res.files[0].type,
                    img: this.imgLinkAch
                })
            }

        }, error => {

            let errObj = JSON.parse(error._body)

            if (errObj.message) this.errMsg = errObj.message;
            else this.errMsg = this.errMsgUnexpected;

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to remove the selected file
    removeAttachAchievement(num) {
        this.filesAchievementAll.splice(num, 1)
        this.filesAchievementView.splice(num, 1)
    }

    // to open modal for edit achievement
    editAchiId: number = 0; // variable for achievement id to edit
    isEditAchievement: number = 0 // condition if 0 = normal mode, if 1 = edit mode.
    editAchievementModal(id) {
        this.filesAchievementView = [];
        this.filesAchievementAll = [];
        this.isEditAchievement = 1;
        this.editAchiId = id;
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETAchievementById + id).subscribe(res => {

            if (res) {
                this.achievementForm.patchValue({
                    title: res.title,
                    detail: res.details,
                    kpi: res.kpi_id ? res.kpi_id : ''
                })
                this.timeNow = '';

                for (let i = 0; i < res.att.length; i++) {

                    this.filesAchievementView.push({
                        name: res.att[i].name.split("_")[1],
                        type: res.att[i].type,
                        img: res.att[i].file
                    });

                    this.filesAchievementAll.push({
                        name: res.att[i].name,
                        size: res.att[i].size,
                        type: res.att[i].type
                    })

                }

                $('#addAchievementBtn').click();
            }

        }, error => {
            console.log('[ERROR] cannot edit achievement: ' + error);
        })
    }

    // submit edit activity with form
    submitEditAchievement() {

        $('#closeModalAddAchievement').click();

        let reqAtt = {
            achievem_id: this.editAchiId,
            files: this.filesAchievementAll
        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTAchievementAttachmentUpload, reqAtt).subscribe(resUpload => {

            if (resUpload) {
                this.filesAchievementAll = [];
                this.filesAchievementView = [];

                let ownActiv;
                if (this.roleNum < 3) ownActiv = 1;
                else ownActiv = 2;

                let req = {
                    id: this.editAchiId,
                    kpi_id: parseInt(this.achievementForm.get('kpi').value),
                    title: this.achievementForm.get('title').value,
                    details: this.achievementForm.get('detail').value,
                    own: ownActiv
                }

                this._POST_api_Service.POST_MAPS_data(MapsVars.POSTEditAchievement, req).subscribe(res => {
                    if (res.status === "OK!") {
                        this.clearKpiValue();
                        if (this.roleNum === 4) this.getAchievementList('myAch');
                        else this.getAchievementList(this.userProfile.body.gemsId);
                    }

                }, error => {
                    console.log('[ERROR] cannot save achievement: ' + error);
                })
            }

        }, error => {
            console.log('[ERROR] cannot save the attachment achievement: ' + error);
        })


    }

    // submit achievement with form
    submitAchievement() {
        let kpi = this.achievementForm.get('kpi').value;

        $('#closeModalAddAchievement').click();

        let ownActiv; let kpiId;
        if (this.roleNum < 3) {
            ownActiv = 1;
            kpiId = parseInt(kpi);
        } else {
            ownActiv = 2;
            if (this.roleNum === 3) kpiId = parseInt(kpi);
            else kpiId = null;
        }

        let req = {
            kpi_id: kpiId,
            title: this.achievementForm.get('title').value,
            details: this.achievementForm.get('detail').value,
            own: ownActiv
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTSaveAchievement, req).subscribe(res => {

            if (res) {

                if (res.achievem_id && this.filesAchievementAll.length > 0) {

                    let req = {
                        achievem_id: res.achievem_id,
                        files: this.filesAchievementAll
                    }

                    this._POST_api_Service.POST_MAPS_data(MapsVars.POSTAchievementAttachmentUpload, req).subscribe(resUpload => {

                        if (resUpload) {

                            if (this.roleNum === 4) this.getAchievementList('myAch');
                            else this.getAchievementList(this.userProfile.body.gemsId);

                            this.clearKpiValue();
                        }
                    }, error => {
                        console.log('[ERROR] cannot save the attachment achievement: ' + error);
                    });

                } else {

                    if (this.roleNum === 4) this.getAchievementList('myAch');
                    else this.getAchievementList(this.userProfile.body.gemsId);

                    this.clearKpiValue();

                }
            }
        }, error => {
            console.log('[ERROR] cannot save achievement: ' + error);
        })

    }

    // to open modal for view detail achievement
    achievementDetailList = []; // view details respond
    achievementDetailAttList = []; // attachments for view details respond
    viewDetailAchievementModal(id) {

        this.achievementDetailList = [];
        this.achievementDetailAttList = [];
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETAchievementById + id).subscribe(res => {

            if (res) {

                if (this.roleNum === 4 && this.supTabTeamOv && !this.subReqAch) {

                    this.achievementDetailList.push({
                        title: res.title,
                        created_on: new Date(res.created_on).toDateString()
                    });

                } else {

                    let num = this.kpiList.findIndex(item => item.id === res.kpi_id);
                    this.achievementDetailList.push({
                        title: res.title,
                        created_on: new Date(res.created_on).toDateString(),
                        kpi_id: this.kpiList[num].kpi,
                        metric: this.kpiList[num].metric,
                    });

                }

                this.achievementDetailAttList = res.att;

                $('#viewDetailAchievementBtn').click();

                setTimeout(() => {
                    document.getElementById("detailsAchievementHtml").innerHTML = res.details;
                }, 500);
            }
        }, error => {
            console.log('[ERROR] cannot edit achievement: ' + error);
        })
    }

    // delete confirmation for achievement
    achievementId;
    deleteAchievementModal(id) {
        this.achievementId = id;
        $('#deleteAchievementModalBtn').click();
    }

    // confirm to delete achievement
    deleteAchievement() {
        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTDeleteAchievement, { ids: [this.achievementId] }).subscribe(res => {
            if (res.status === "OK") {
                if (this.roleNum === 4) this.getAchievementList('myAch');
                else this.getAchievementList(this.userProfile.body.gemsId);
            }

        }, error => {
            console.log('[ERROR] cannot delete achievement: ' + error);
        })
    }

    // tab functionality at achievement supervisor
    myAch: boolean = true;
    subReqAch: boolean = false;
    styleMyAch = '#01A8C6'
    styleSubReqAch = 'black';
    myachievementTabClick() {
        this.myAch = true; this.subReqAch = false;
        this.styleMyAch = '#01A8C6'; this.styleSubReqAch = 'black';
    }
    achievementSubReqTabClick() {
        this.myAch = false; this.subReqAch = true;
        this.styleMyAch = 'black'; this.styleSubReqAch = '#01A8C6';
    }
    //// ACHIEVEMENT FUNCTION END ////


    //// FEEDBACK FUNCTION START ////
    // feedback name when click team overview view button
    feedbackNamePersNo;
    feedbackNameTitle(x, perno) {
        this.feedbackNamePersNo = perno;
        if (x === 0) this.feedbackName = this.userName;
        else this.feedbackName = x;
    }

    // to view feedback request
    viewFbList = [];
    viewFbReq(num, view) {
        this.loadingFb = true;
        this.viewFbList = [];

        let staffNo;
        if (num === 0) staffNo = this.userProfile.body.gemsId;
        else staffNo = num;

        let apiReq;
        switch (view) {
            case 'emp': apiReq = MapsVars.GETViewFeedbackRequest;
                break;
            case 'sup': apiReq = MapsVars.GETViewFeedbackRequestSupv;
                break;
        }

        this._GET_api_Service.GET_MAPS_data(apiReq + staffNo).subscribe(res => {

            this.showEmptyFb = true;

            if (res.length > 0) {

                for (let i = 0; i < res.length; i++) {

                    let subImg = GlobalVariable.BASE_API_URL + MapsVars.GETImg + res[i].image_url + "?api_key=" + GlobalVariable.API_KEY;

                    this._GET_api_Service.GET_PictureByUrl(subImg).subscribe(data => {

                        if (data) {
                            this.viewFbList.push({
                                created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                feedback: res[i].feedback,
                                feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: subImg,
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                rff_name: res[i].rff_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbList.length) {
                                this.loadingFb = false;
                                this.findIndexViewFbList();
                            }

                        } else {

                            this.viewFbList.push({
                                created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                feedback: res[i].feedback,
                                feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                rff_name: res[i].rff_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbList.length) {
                                this.loadingFb = false;
                                this.findIndexViewFbList();
                            }

                        }

                    }, error => {

                        this.viewFbList.push({
                            created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                + (new Date(res[i].created_on)).getDate() + ' '
                                + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                + (new Date(res[i].created_on)).getFullYear(),
                            created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                + (new Date(res[i].created_on)).getDate() + ' '
                                + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                + (new Date(res[i].created_on)).getFullYear(),
                            feedback: res[i].feedback,
                            feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                + (new Date(res[i].feedback_on)).getDate() + ' '
                                + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                + (new Date(res[i].feedback_on)).getFullYear(),
                            feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                + (new Date(res[i].feedback_on)).getDate() + ' '
                                + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                + (new Date(res[i].feedback_on)).getFullYear(),
                            form_id: res[i].form_id,
                            id: res[i].id,
                            image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                            message: res[i].message,
                            no_of_star: res[i].no_of_star,
                            rating: res[i].rating,
                            req_fb_from: res[i].req_fb_from,
                            req_id: res[i].req_id,
                            sta_name: res[i].sta_name,
                            status: res[i].status,
                            rff_name: res[i].rff_name,
                            htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                        });

                        if (res.length === this.viewFbList.length) {
                            this.loadingFb = false;
                            this.findIndexViewFbList();
                        }

                    });
                }
            } else this.loadingFb = false;
        }, error => {
            console.log('[ERROR] cannot view fb request ' + error);
        })
    }

    // to find index to show empty list
    findIndexViewFbList() {
        this.myfeedbackTabClick();

        let index = this.viewFbList.findIndex(item => item.status === 1);
        if (index === -1) this.showEmptyFb = true;
        else this.showEmptyFb = false;

        let indexView = this.viewFbList.findIndex(item => item.status === 0);
        if (indexView === -1) this.showEmptyFbView = true;
        else this.showEmptyFbView = false;

    }

    // to show html text innerHTML for my feedback
    htmlMyFb() {
        for (let item of this.viewFbList) {
            if (item.feedback && item.status === 1) setTimeout(() => {
                document.getElementById("htmlFeedbackMsg" + item.id).innerHTML = item.feedback;
            }, 500);
        }
    }
    // to show html text innerHTML for my feedback request
    htmlFbReq() {
        for (let item of this.viewFbList) {
            if (item.message && item.status === 0) setTimeout(() => {
                document.getElementById("htmlFeedbackMsg" + item.id).innerHTML = item.message;
            }, 500);
        }
    }

    // to view feedback pending
    viewFbGiverList = [];
    viewFbGiver() {
        this.loadingFb = true;
        this.viewFbGiverList = [];

        this._GET_api_Service.GET_MAPS_data(MapsVars.GETViewFeedbackGiver + this.userProfile.body.gemsId).subscribe(res => {

            if (res.length > 0) {

                for (let i = 0; i < res.length; i++) {

                    let subImg = GlobalVariable.BASE_API_URL + MapsVars.GETImg + res[i].image_url + "?api_key=" + GlobalVariable.API_KEY;

                    this._GET_api_Service.GET_PictureByUrl(subImg).subscribe(data => {

                        if (data) {

                            this.viewFbGiverList.push({
                                created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                feedback: res[i].feedback,
                                feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: subImg,
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                reqstor_name: res[i].reqstor_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbGiverList.length) {
                                this.loadingFb = false;
                                if (this.givFb) this.htmlPendingFb();
                                this.callNotificationBadgeFbGiverList()
                            }

                        } else {

                            this.viewFbGiverList.push({
                                created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].created_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                    + (new Date(res[i].created_on)).getFullYear(),
                                feedback: res[i].feedback,
                                feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                    + (new Date(res[i].feedback_on)).getDate() + ' '
                                    + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                    + (new Date(res[i].feedback_on)).getFullYear(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                reqstor_name: res[i].reqstor_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbGiverList.length) {
                                this.loadingFb = false;
                                if (this.givFb) this.htmlPendingFb();
                                this.callNotificationBadgeFbGiverList()
                            }

                        }

                    }, error => {

                        this.viewFbGiverList.push({
                            created_on_my: this.dayMy[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                + (new Date(res[i].created_on)).getDate() + ' '
                                + this.monthMy[new Date(res[i].created_on).getMonth()] + ' '
                                + (new Date(res[i].created_on)).getFullYear(),
                            created_on_en: this.dayEn[(new Date(res[i].created_on)).getDay() - 1] + ', '
                                + (new Date(res[i].created_on)).getDate() + ' '
                                + this.monthEn[new Date(res[i].created_on).getMonth()] + ' '
                                + (new Date(res[i].created_on)).getFullYear(),
                            feedback: res[i].feedback,
                            feedback_on_my: this.dayMy[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                + (new Date(res[i].feedback_on)).getDate() + ' '
                                + this.monthMy[new Date(res[i].feedback_on).getMonth()] + ' '
                                + (new Date(res[i].feedback_on)).getFullYear(),
                            feedback_on_en: this.dayEn[(new Date(res[i].feedback_on)).getDay() - 1] + ', '
                                + (new Date(res[i].feedback_on)).getDate() + ' '
                                + this.monthEn[new Date(res[i].feedback_on).getMonth()] + ' '
                                + (new Date(res[i].feedback_on)).getFullYear(),
                            form_id: res[i].form_id,
                            id: res[i].id,
                            image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                            message: res[i].message,
                            no_of_star: res[i].no_of_star,
                            rating: res[i].rating,
                            req_fb_from: res[i].req_fb_from,
                            req_id: res[i].req_id,
                            sta_name: res[i].sta_name,
                            status: res[i].status,
                            reqstor_name: res[i].reqstor_name,
                            htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                        });

                        if (res.length === this.viewFbGiverList.length) {
                            this.loadingFb = false;
                            if (this.givFb) this.htmlPendingFb();
                            this.callNotificationBadgeFbGiverList()
                        }

                    });
                }
            } else this.loadingFb = false;
        }, error => {
            console.log('[ERROR] cannot view fb giver ' + error);
        })
    }

    // badge notification
    notiBadge = [];
    callNotificationBadgeFbGiverList() {
        this.notiBadge = [];
        for (let item of this.viewFbGiverList) {
            if (item.status === 0) this.notiBadge.push(item)
        }
    }

    // to show html text innerHTML for pending feedback
    htmlPendingFb() {
        for (let item of this.viewFbGiverList) {
            if (item.message && item.status === 0) setTimeout(() => {
                document.getElementById("htmlFeedbackMsg" + item.id).innerHTML = item.message;
            }, 500);
        }
    }

    // to view subordinates' feedback as supervisor
    viewFbAsSupvList = [];
    viewFbAsSupv() {
        this.loadingFb = true;
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETViewFeedbackAsSupervisor).subscribe(res => {

            if (res.length > 0) {

                for (let i = 0; i < res.length; i++) {

                    let subImg = GlobalVariable.BASE_API_URL + MapsVars.GETImg + res[i].image_url + "?api_key=" + GlobalVariable.API_KEY;

                    this._GET_api_Service.GET_PictureByUrl(subImg).subscribe(data => {

                        if (data) {

                            this.viewFbAsSupvList.push({
                                created_on: new Date(res[i].created_on).toDateString(),
                                feedback: res[i].feedback,
                                feedback_on: new Date(res[i].feedback_on).toDateString(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: subImg,
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                rff_name: res[i].rff_name,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                subor_name: res[i].subor_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbAsSupvList.length) this.loadingFb = false;

                        } else {

                            this.viewFbAsSupvList.push({
                                created_on: new Date(res[i].created_on).toDateString(),
                                feedback: res[i].feedback,
                                feedback_on: new Date(res[i].feedback_on).toDateString(),
                                form_id: res[i].form_id,
                                id: res[i].id,
                                image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                                message: res[i].message,
                                no_of_star: res[i].no_of_star,
                                rating: res[i].rating,
                                req_fb_from: res[i].req_fb_from,
                                req_id: res[i].req_id,
                                rff_name: res[i].rff_name,
                                sta_name: res[i].sta_name,
                                status: res[i].status,
                                subor_name: res[i].subor_name,
                                htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                            });

                            if (res.length === this.viewFbAsSupvList.length) this.loadingFb = false;

                        }

                    }, error => {

                        this.viewFbAsSupvList.push({
                            created_on: new Date(res[i].created_on).toDateString(),
                            feedback: res[i].feedback,
                            feedback_on: new Date(res[i].feedback_on).toDateString(),
                            form_id: res[i].form_id,
                            id: res[i].id,
                            image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                            message: res[i].message,
                            no_of_star: res[i].no_of_star,
                            rating: res[i].rating,
                            req_fb_from: res[i].req_fb_from,
                            req_id: res[i].req_id,
                            rff_name: res[i].rff_name,
                            sta_name: res[i].sta_name,
                            status: res[i].status,
                            subor_name: res[i].subor_name,
                            htmlFbMsg: "htmlFeedbackMsg" + res[i].id
                        });

                        if (res.length === this.viewFbAsSupvList.length) this.loadingFb = false;

                    });
                }
            }
        }, error => {
            console.log('[ERROR] cannot view fb giver ' + error);
        })
    }

    // to show html text innerHTML for all feedback as supervisor
    htmlAllFbSupv() {
        for (let item of this.viewFbAsSupvList) {
            if (item.feedback && item.status === 1) setTimeout(() => {
                document.getElementById("htmlFeedbackMsg" + item.id).innerHTML = item.feedback;
            }, 500);
        }
    }

    // get time for feedback
    requestorName;
    requestorId;
    getModalFb(type, id, name) {
        this.timeNow = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        this.requestorId = id;
        this.requestorName = name;

        switch (type) {
            case 'req': $('#reqFeedbackBtn').click();
                break;
            case 'give': $('#giveFeedbackBtn').click();
                break;
        }
    }

    // submit feedback
    submitGiveFeedback() {
        this.loadingFb = true;
        let req = {
            id: this.requestorId,
            feedback: this.giveFbForm.get('feedback').value,
            rating: this.giveFbForm.get('rating').value
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTGiveFeedback, req).subscribe(res => {

            if (res.status === 'OK') {
                this.viewFbGiverList = [];
                this.viewFbGiver();
            }

        }, error => {
            console.log('[ERROR] cannot post feedback to requestor ' + error);
        });
    }

    // get search staff 
    staffList = [];
    staffListMsg: boolean = false;
    loadingSearch: boolean = false;
    getSearchStaff() {
        this.loadingSearch = true;
        this.staffListMsg = false;

        if (this.searchForReqFbForm.get('text').value.length < 3) {

            this.staffListMsg = true;
            this.staffList = [];
            this.loadingSearch = false;

        } else {

            this.staffListMsg = false;
            this._POST_api_Service.POST_MAPS_data(MapsVars.POSTGetSearchStaffByStaffId, { text: this.searchForReqFbForm.get('text').value }).subscribe(res => {

                if (res) this.loadingSearch = false;
                this.staffList = res;

            }, error => {
                console.log('[ERROR] cannot get search staff ' + error);
            });

        }

    }

    // choosed staff for req feedback
    choosedStaff = [];
    choosedName(id, search) {

        let sameName = this.choosedStaff.findIndex(item => item.pers_no === id);

        if (sameName === -1) this.choosedStaff.push({
            pers_no: id,
            search: search
        });

        if (this.myChecked === true) this.exampleFb = '<p>Kita telah berkerja dengan baik dalam tugasan ini. Untuk itu saya ingin mendapatkan maklum balas anda terhadap sumbangan, pencapaian dan apa yang perlu dipertingkatkan bagi memperbaiki prestasi saya pada masa hadapan .</p><br><p>Yang ikhlas,</p>';
        else this.exampleFb = '<p>We have successfully working together in this task. For that, I want to request your feedback about compliments, achievements or anything that can be consider for improving my performance in future.</p><br><p>Best regards,</p>';

        let textReq;
        if (this.roleNum < 3 || this.supTabTeamOv) textReq = this.exampleFb + '<p>' + this.userName + '</p>';
        else {
            if (this.myChecked === true) textReq = this.exampleFb + '<p>' + this.userName + ' bagi pihak ' + this.feedbackName + '</p>';
            else textReq = this.exampleFb + '<p>' + this.userName + ' on behalf of ' + this.feedbackName + '</p>';
        }

        this.searchForReqFbForm.patchValue({ message: textReq });
    }

    // remove the search name by clicking the choosedName
    removeChoosedName(id) {
        let removeIndex = this.choosedStaff.findIndex(item => item.pers_no === id);
        if (removeIndex > -1) this.choosedStaff.splice(removeIndex, 1);
    }

    // to submit request feedback from employee after choosing the staff and writing the message
    choosedStaffArray = []
    exampleFb;
    submitReqFeedback() {
        this.loadingFb = true;
        if (this.choosedStaff.length > 0) for (let i = 0; i < this.choosedStaff.length; i++) this.choosedStaffArray.push(this.choosedStaff[i].pers_no)

        let apiReq;
        if (this.roleNum < 3) apiReq = MapsVars.POSTRequestFeedback;
        else {
            if (this.supTabTeamOv) apiReq = MapsVars.POSTRequestFeedbackSup;
            else {
                apiReq = MapsVars.POSTRequestFeedbackSupOnBehalf;

            }
        }

        let req;
        if (this.roleNum < 3 || this.supTabTeamOv) {
            req = {
                req_fb_from: this.choosedStaffArray,
                message: this.searchForReqFbForm.get('message').value
            }
        } else {
            req = {
                sub_pn: this.feedbackNamePersNo,
                req_fb_from: this.choosedStaffArray,
                message: this.searchForReqFbForm.get('message').value
            }
        }

        this._POST_api_Service.POST_MAPS_data(apiReq, req).subscribe(res => {
            if (res.status === 'OK') {
                this.searchForReqFbForm.patchValue({ text: null });
                this.staffList = []
                this.viewFbList = [];
                this.choosedStaff = [];
                this.choosedStaffArray = [];
                if (this.roleNum < 3) this.viewFbReq(0, 'emp');
                else {
                    if (this.supTabTeamOv) this.viewFbReq(0, 'sup');
                    else this.viewFbReq(this.persNoSupvView, 'emp');
                }
            }
        }, error => {
            console.log('[ERROR] cannot submit request feedback ' + error);
        })
    }

    // tab functionality at feedback supervisor
    myFb: boolean = true;
    reqFb: boolean = false;
    givFb: boolean = false;
    subReqFb: boolean = false;
    styleMyFb = '#01A8C6'
    styleReq = 'black';
    styleGive = 'black';
    styleSubReqFb = 'black';
    myfeedbackTabClick() {
        this.htmlMyFb();
        this.myFb = true; this.reqFb = false; this.givFb = false; this.subReqFb = false;
        this.styleMyFb = '#01A8C6'; this.styleReq = 'black'; this.styleGive = 'black'; this.styleSubReqFb = 'black';
    }
    feedbackReqTabClick() {
        this.htmlFbReq();
        this.myFb = false; this.reqFb = true; this.givFb = false; this.subReqFb = false;
        this.styleMyFb = 'black'; this.styleReq = '#01A8C6'; this.styleGive = 'black'; this.styleSubReqFb = 'black';
    }
    feedbackGiveTabClick() {
        this.htmlPendingFb();
        this.myFb = false; this.reqFb = false; this.givFb = true; this.subReqFb = false;
        this.styleMyFb = 'black'; this.styleReq = 'black'; this.styleGive = '#01A8C6'; this.styleSubReqFb = 'black';
    }
    feedbackSubReqTabClick() {
        this.htmlAllFbSupv();
        this.myFb = false; this.reqFb = false; this.givFb = false; this.subReqFb = true;
        this.styleMyFb = 'black'; this.styleReq = 'black'; this.styleGive = 'black'; this.styleSubReqFb = '#01A8C6';
    }
    //// FEEDBACK FUNCTION END ////

    // to get subordinate for supervisor
    subordinatesList = [];
    resList;
    getSubordinateList() {
        this.loading = true;

        let data = {
            auth_no: this.userProfile.body.gemsId
        }
        this._POST_api_Service.POST_MAPS_data(MapsVars.GETSubordinates , data).subscribe(res => {
            if (res.length > 0) {

                this.subListEmpty = false;
                this.resList = res;

                for (let i = 0; i < this.resList.length; i++) {

                    let subImg = GlobalVariable.BASE_API_URL + MapsVars.GETImg + this.resList[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                    this._GET_api_Service.GET_PictureByUrl(subImg).subscribe(data => {

                        if (data) {
                            this.subordinatesList.push({
                                id: this.resList[i].id,
                                num: this.resList[i].num,
                                image_url: subImg,
                                name: this.resList[i].name,
                                pers_no: this.resList[i].pers_no,
                                post_desc: this.resList[i].post_desc,
                                primary_ic: this.resList[i].primary_ic,
                                staff_no: this.resList[i].staff_no,
                                stat_id: this.resList[i].stat_id,
                                stat_name: this.resList[i].stat_name,
                                stat_name_bh: this.resList[i].stat_name_bh,
                                subord_lvl: this.resList[i].subord_lvl
                            });

                            if (this.resList.length === this.subordinatesList.length) {
                                this.sortSubList()
                                this.loading = false;
                            }

                        } else {
                            this.subordinatesList.push({
                                id: this.resList[i].id,
                                num: this.resList[i].num,
                                image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                                name: this.resList[i].name,
                                pers_no: this.resList[i].pers_no,
                                post_desc: this.resList[i].post_desc,
                                primary_ic: this.resList[i].primary_ic,
                                staff_no: this.resList[i].staff_no,
                                stat_id: this.resList[i].stat_id,
                                stat_name: this.resList[i].stat_name,
                                stat_name_bh: this.resList[i].stat_name_bh,
                                subord_lvl: this.resList[i].subord_lvl
                            });

                            if (this.resList.length === this.subordinatesList.length) {
                                this.sortSubList()
                                this.loading = false;
                            }

                        }
                    }, error => {
                        this.subordinatesList.push({
                            id: this.resList[i].id,
                            num: this.resList[i].num,
                            image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                            name: this.resList[i].name,
                            pers_no: this.resList[i].pers_no,
                            post_desc: this.resList[i].post_desc,
                            primary_ic: this.resList[i].primary_ic,
                            staff_no: this.resList[i].staff_no,
                            stat_id: this.resList[i].stat_id,
                            stat_name: this.resList[i].stat_name,
                            stat_name_bh: this.resList[i].stat_name_bh,
                            subord_lvl: this.resList[i].subord_lvl
                        });

                        if (this.resList.length === this.subordinatesList.length) {
                            this.sortSubList()
                            this.loading = false;
                        }

                    });
                }

            } else this.loading = false;
        }, error => {
            console.log('[ERROR] cannot get subordinate list data ' + error);
        });
    }

    // to show image of evaluator at top of subordinate list
    showEvaluatorFb: boolean = false;
    evaluatorImgSupv;
    getEvaluator() {

        let img = GlobalVariable.BASE_API_URL + MapsVars.GETImg + JSON.parse(localStorage.getItem('currentUser')).body.image_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {
            if (data) this.evaluatorImgSupv = img;
            else this.evaluatorImgSupv = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
        },
            error => {
                this.evaluatorImgSupv = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            });


    }

    sortSubList() {
        this.subordinatesList.sort((a, b) => (a.num > b.num) ? 1 : -1);
        this.setPage(1)
    }

    // get basic info when click image profile on subordinates list
    subordinatesDetails = [];
    subordinatesDetailsImg;
    postBasicInfo(staffNo, img) {
        this.subordinatesDetails = [];

        let data = {
            staff_id: staffNo,
            year: this.yearChoose
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTBasicInfo, data).subscribe(res => {

            this.subordinatesDetails = res.personalInfo;
            this.subordinatesDetailsImg = img;

            if (this.subordinatesDetails) $('#subordinatesListBtn').click();

        }, error => {
            console.log('[ERROR] cannot get basic info ' + error);
        })
    }

    // check min 3 goals before submit goal setting (state_id: 1)
    invalidLengthComment: boolean = false;
    checkingSendSupv() {

        let cmt = this.sendForm.get('comment').value;

        if (cmt.length > 50 && cmt.length < 1000) {

            this.invalidLengthComment = false;

            if (this.jobResList.length > 2) {

                if (this.empProgBar === 1) {

                    if (this.sendForm.get('checkFaceToFace').value && this.sendForm.get('comment').value) $('#confirmSendSupBtn').click();
                    else $('#compulsaryFtfBtn').click();

                } else this.checkingAppraisRat();

            } else $('#minKpiBtn').click();

        } else this.invalidLengthComment = true;
    }

    // send to supervisor and submit goal setting (state_id: 1)
    sendToSupv() {

        let ftfValue;

        if (this.sendForm.get('checkFaceToFace').value) ftfValue = 1;
        else ftfValue = 0;

        let req = {
            form_id: this.currentFormID,
            comment: this.sendForm.get('comment').value,
            f_t_f: ftfValue
        }

        if (ftfValue === 1) {
            this._POST_api_Service.POST_MAPS_data(MapsVars.POSTCommentEv, req).subscribe(res => {

                if (res.status === 'OK') {

                    $('#successSubmitSupBtn').click();
                    this.getEvForm(this.yearChoose);

                    this.sendForm.patchValue({
                        comment: '',
                        checkFaceToFace: null
                    })
                }
            }, error => {
                console.log('[ERROR] cannot sent to supervisor ' + error);
            })
        }
    }

    // paging for supervisor team overview
    pagedItems: any[];
    totalItems: number;
    currentPage: number = 1;
    pageSize: number = 9;
    startPage: number;
    endPage: number;
    setPage(page: number) {
        this.pager = this.getPager(this.subordinatesList.length, page, this.pageSize);
        this.pagedItems = this.subordinatesList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    // pager default page (9 items per page)
    getPager(totalItems, currentPage, pageSize) {

        let totalPages = Math.ceil(totalItems / pageSize);
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        if (totalPages <= 10) {
            this.startPage = 1;
            this.endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                this.startPage = 1;
                this.endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                this.startPage = totalPages - 9;
                this.endPage = totalPages;
            } else {
                this.startPage = currentPage - 5;
                this.endPage = currentPage + 4;
            }
        }

        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        let pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);

        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: this.startPage,
            endPage: this.endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    // condition modal for employee open
    condEmpModalAppraisMid(num, type) {
        if (this.empProgBar === 3) this.viewModalApprais(num, type, 1)
        else this.viewModalApprais(num, type, 0)
    }
    condSupModalAppraisMid(num, type) {
        if (this.empProgBar === 4) this.viewModalApprais(num, type, 1)
        else this.viewModalApprais(num, type, 0)
    }
    condEmpModalAppraisEnd(num, type) {
        if (this.empProgBar === 5) this.viewModalApprais(num, type, 1)
        else this.viewModalApprais(num, type, 0)
    }
    condSupModalAppraisEnd(num, type) {
        if (this.empProgBar === 6) this.viewModalApprais(num, type, 1)
        else this.viewModalApprais(num, type, 0)
    }

    // get data before view modal for appraise
    viewDetailData = []
    viewDetailDeliverData = []
    viewDetailJustData = []
    apprId;
    apprType;
    viewModalApprais(num, type, view) {
        this.viewDetailData = [];
        this.viewDetailDeliverData = [];
        this.viewDetailJustData = [];
        this.apprType = type;
        this.apprId = num;

        let apiReq;
        if (this.empProgBar < 5) apiReq = MapsVars.POSTGetMidYearAppraiseeSupv;
        if (this.empProgBar > 4) apiReq = MapsVars.POSTGetEndYearAppraiseeSupv;

        let req = {
            id: num,
            type: type
        }

        this._POST_api_Service.POST_MAPS_data(apiReq, req).subscribe(res => {

            if (res) this.viewDetailData.push(res);
            if (res.deliverable) this.viewDetailDeliverData = res.deliverable;
            if (res.justification) this.viewDetailJustData = res.justification;

            if (this.empProgBar === 3) this.appraisRat = res.midyr_ee_rat;
            if (this.empProgBar === 4) this.appraisRat = res.midyr_sv_rat;
            if (this.empProgBar === 5) this.appraisRat = res.endyr_ee_rat;
            if (this.empProgBar === 6) this.appraisRat = res.endyr_sv_rat;

            if (this.empProgBar === 3) this.appraiseForm.patchValue({
                ratingAppr: res.midyr_ee_rat,
                feedbackAppr: res.midyr_ee_fb
            });

            if (this.empProgBar === 4) this.appraiseForm.patchValue({
                ratingAppr: res.midyr_sv_rat,
                feedbackAppr: res.midyr_sv_fb
            });

            if (this.empProgBar === 5) this.appraiseForm.patchValue({
                ratingAppr: res.endyr_ee_rat,
                feedbackAppr: res.endyr_ee_fb
            });

            if (this.empProgBar === 6) this.appraiseForm.patchValue({
                ratingAppr: res.endyr_sv_rat,
                feedbackAppr: res.endyr_sv_fb
            });

            if (this.viewDetailData.length > 0) {

                if (view === 0) {

                    if (type === 'CC') $('#viewDetailCcBtn').click()
                    else $('#viewDetailJrSiBtn').click()

                } else {

                    if (type === 'CC') $('#appraiseeOpenCompBtn').click();
                    else $('#appraiseeOpenBtn').click();
                }
            }
        }, error => {
            console.log('[ERROR] cannot view detail ' + error);
        })
    }

    // to check the mid year appraisee modal to be full inserted before proceed
    errorMidYrApp: boolean = false;
    appraiseeCheck(type) {
        let rat = this.appraiseForm.get('ratingAppr').value;
        let fb = this.appraiseForm.get('feedbackAppr').value;

        if (rat > 0) {

            if (type === 'cc' && (rat == 2 || rat == 3)) {

                this.postApprais();
                $('#closeModalApprcc').click();

            } else {

                if (fb !== '' && fb && fb !== null) {
                    this.postApprais();

                    switch (type) {
                        case 'jrsi': $('#closeModalApprjrsi').click();
                            break;
                        case 'cc': $('#closeModalApprcc').click();
                            break;
                    }
                } else this.errorMidYrApp = true;
            }

        } else this.errorMidYrApp = true;
    }
    postApprais() {
        if (this.empProgBar === 3) this.postMidYearApp();
        if (this.empProgBar === 4) this.postMidYearAppSupv();
        if (this.empProgBar === 5) this.postEndYearApp();
        if (this.empProgBar === 6) this.postEndYearAppSupv();
    }

    // to post mid year appraisee for employee
    postMidYearApp() {

        let req = {
            id: this.apprId,
            midyr_ee_rat: this.appraiseForm.get('ratingAppr').value,
            midyr_ee_fb: this.appraiseForm.get('feedbackAppr').value,
            type: this.apprType
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTPostMidYearAppraisee, req).subscribe(res => {
            if (res.status === 'OK') {

                this.errorMidYrApp = false;
                this.appraiseForm.patchValue({ feedbackAppr: null });
                this.appraisRat = 0;
                this.cursorType = 'wait';
                if (this.apprType === 'CC') this.getCompetency();
                else this.getEvFormAfter();


            }

        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg.code) this.errMsg = errObj.msg.code;
            else {
                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;
            }
            console.log('[ERROR] ', this.errMsg)

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to post mid year appraisee for supervisor
    postMidYearAppSupv() {

        let req = {
            id: this.apprId,
            midyr_sv_rat: this.appraiseForm.get('ratingAppr').value,
            midyr_sv_fb: this.appraiseForm.get('feedbackAppr').value,
            type: this.apprType
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTPostMidYearAppraiseeSupervisor, req).subscribe(res => {
            this.errorMidYrApp = false;
            this.appraiseForm.patchValue({ feedbackAppr: null });
            this.appraisRat = 0;
            this.cursorType = 'wait';
            if (this.apprType === 'CC') this.getCompetency();
            else this.getEvFormAfterSupv();

        }, error => {
            let errObj = JSON.parse(error._body)

            if (errObj.msg) this.errMsg = errObj.msg;
            else this.errMsg = this.errMsgUnexpected;
            console.log('[ERROR] ', this.errMsg)

            if (this.errMsg) $('#erroApiBtn').click()
        })
    }

    // to post end year appraisee for employee
    postEndYearApp() {

        let req = {
            id: this.apprId,
            endyr_ee_rat: this.appraiseForm.get('ratingAppr').value,
            endyr_ee_fb: this.appraiseForm.get('feedbackAppr').value,
            type: this.apprType
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTPOSTEndYearAppraisee, req).subscribe(res => {
            this.errorMidYrApp = false;
            this.appraiseForm.patchValue({ feedbackAppr: null });
            this.appraisRat = 0;
            this.cursorType = 'wait'
            if (this.apprType === 'CC') this.getCompetency();
            else this.getEvFormAfter();

        }, error => {
            console.log('[ERROR] cannot post mid year appraisee ' + error);
        })
    }

    // to post mid year appraisee for supervisor
    postEndYearAppSupv() {

        let req = {
            id: this.apprId,
            endyr_sv_rat: this.appraiseForm.get('ratingAppr').value,
            endyr_sv_fb: this.appraiseForm.get('feedbackAppr').value,
            type: this.apprType
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTPostEndYearAppraiseeSupervisor, req).subscribe(res => {
            this.errorMidYrApp = false;
            this.appraiseForm.patchValue({ feedbackAppr: null });
            this.appraisRat = 0;
            this.cursorType = 'wait'
            if (this.apprType === 'CC') this.getCompetency();
            else this.getEvFormAfterSupv();

        }, error => {
            console.log('[ERROR] cannot post mid year appraisee ' + error);
        })
    }

    // get back data for jr, si or cc to load data back for employee
    getEvFormAfter() {

        let data = {
            staff_id:this.userProfile.userid,
            year: this.yearChoose,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm ,data).subscribe(res => {

            if (res) this.evMapsForm = res;
            if (res.subord_lvl) this.subLevelView = res.subord_lvl;
            if (res.jr) this.jobResList = res.jr;
            if (res.si) this.sigInvList = res.si;
            this.cursorType = 'default';

        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // get back data for jr, si or cc to load data back for supervisor
    getEvFormAfterSupv() {

        let data = {
            staff_id: this.evMapsForm.staff_id,
            year: this.svFormYear,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm ,data).subscribe(res => {

            if (res.status_id) this.empProgBar = res.status_id;
            if (res.subord_lvl) this.subLevelView = res.subord_lvl;

            if (res.jr) this.jobResList = res.jr;
            if (res.si) this.sigInvList = res.si;
            this.cursorType = 'default';
            this.acceptanceIndicator = res.agree;



        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // to change status - to immediate action to get subordinates change the status, no need refresh
    getEvFormAfterSupvChangeStatus() {
        this.loadingEv = true;

        let changeStatus = this.subordinatesList.findIndex(item => item.id === this.evMapsFormFormId)
        let data = {
            staff_id: this.evMapsForm.staff_id,
            year: this.svFormYear,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.GETEvaluationForm ,data).subscribe(res => {
            if (res) {
                this.loadingEv = false;
                this.evMapsForm = res;
                this.empProgBar = res.status_id;
                if (res.subord_lvl) this.subLevelView = res.subord_lvl;
                
                if (this.empProgBar > 2 && this.evMapsFormFormId) this.getOverallRating(this.evMapsFormFormId);
                if (changeStatus >= 0) {
                    this.subordinatesList[changeStatus].stat_name = res.status;
                    this.subordinatesList[changeStatus].stat_name_bh = res.status_bh;
                }

                setTimeout(() => {
                    if (res.comment) $(".evMapsFormComment").html(res.comment);
                    if (res.sv_cmt) $(".evMapsFormSvComment").html(res.sv_cmt);
                    if (res.midyr_ee_cmt) $(".evMapsFormMidYrComment").html(res.midyr_ee_cmt);
                    if (res.midyr_sv_cmt) $(".evMapsFormMidYrSvComment").html(res.midyr_sv_cmt);
                    if (res.endyr_ee_cmt) $(".evMapsFormEndYrComment").html(res.endyr_ee_cmt);
                    if (res.endyr_sv_cmt) $(".evMapsFormEndYrSvComment").html(res.endyr_sv_cmt);
                    if (res.f_revr_cmt) $(".evMapsFormReviewerComment").html(res.f_revr_cmt);
                    if (res.f_revr_cmt_2) $(".evMapsFormReviewerComment2").html(res.f_revr_cmt_2);

                }, 3000);
            }
        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // invalid length checking
    invalidLengthRevert: boolean = false;
    revertCheckingLength() {
        let rem = this.revertRemarkForm.get('remark').value

        if (rem.length > 160) this.invalidLengthRevert = true;
        else {
            this.invalidLengthRevert = false;
            this.revertForm();
        }
    }

    // to revert back to employee
    remarkErrMsg: boolean = false;
    revertForm() {
        this.remarkErrMsg = false;

        let rem = this.revertRemarkForm.get('remark').value

        if (rem && rem !== null && rem !== '') this.remarkErrMsg = false;
        else this.remarkErrMsg = true;

        if (this.remarkErrMsg === false) {

            $('#closeRevert').click()

            let req = {
                id: this.evMapsFormFormId,
                progress: this.empProgBar,
                remark: this.revertRemarkForm.get('remark').value,
                year: this.svFormYear,
                auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId
            }

            this._POST_api_Service.POST_MAPS_data(MapsVars.POSTRevertForm, req).subscribe(res => {
                if (res.status === 'OK') {
                    this.getEvFormAfterSupvChangeStatus();
                    $('#successRevertBtn').click();
                    this.remarkErrMsg = false;
                }

            }, error => {
                let errObj = JSON.parse(error._body)

                if (errObj.msg) this.errMsg = errObj.msg;
                else this.errMsg = this.errMsgUnexpected;

                if (this.errMsg) $('#erroApiBtn').click()
            })
        }
    }

    // check face to face
    checkingftf() {
        let cmt = this.sendForm.get('comment').value;
        let ratVal = this.sendForm.get('ratingEnd').value;

        if (this.sendForm.get('checkFaceToFace').value && this.sendForm.get('comment').value && cmt.length > 50 && cmt.length < 1000 && this.empProgBar == 2 ) {
            $('#supervisorApproveBtn').click();
        }else if(this.sendForm.get('checkFaceToFace').value && this.sendForm.get('comment').value && cmt.length > 50 && cmt.length < 1000 && ratVal != null && ratVal != 0){
            $('#supervisorApproveBtn').click();
        }else $('#compulsaryFtfBtn').click();

    }

    // to approve the maps form for process next state
    progressFtf;
    reqApprove;
    approveMaps() {

        let req = {
            id: this.evMapsFormFormId,
            comment: this.sendForm.get('comment').value,
            f_t_f: 1,
            progress: this.empProgBar,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId,
            year: this.svFormYear


        }

        let reqEnd = {
            id: this.evMapsFormFormId,
            comment: this.sendForm.get('comment').value,
            f_t_f: 1,
            progress: this.empProgBar,
            sv_rat: this.sendForm.get('ratingEnd').value,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId,
            year: this.svFormYear
        }
        if (this.empProgBar === 2) this.reqApprove = req;
        else this.reqApprove = reqEnd;

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTMapsApprove, this.reqApprove).subscribe(res => {
            if (res.status === 'OK')
                $('#successSubmitEmpBtn').click();

            this.sendForm.patchValue({
                ratingEnd: null,
                checkFaceToFace: 0,
                comment: ''

            })

            this.getEvFormAfterSupvChangeStatus();

        }, error => {
            console.log('[ERROR] cannot approve ' + error);
        })
    }


    approveFinal() {
        if (this.sendForm.get('ratingEnd').value) {

            let ftfValue: number;

            if (this.sendForm.get('checkFaceToFace').value) ftfValue = 1;
            else ftfValue = 0;

            let req = {
                id: this.evMapsFormFormId,
                comment: this.sendForm.get('comment').value,
                conf: 1,
                rat: this.sendForm.get('ratingEnd').value,
                auth_no: this.authNoEmpSv
            }

            this._POST_api_Service.POST_MAPS_data(MapsVars.POSTPostEndYearReviewer, req).subscribe(res => {
                if (res.status === 'OK') {
                    this.getEvFormAfterSupvChangeStatus();
                }
            }, error => {
                console.log('[ERROR] cannot post for final reviewer from reviewer 2 ' + error);
            })

        } else $('#compulsaryFtfBtn').click();

    }

    // check all rating mid year appraisee are completed before proceed submit to supervisor
    jrRat;
    siRat;
    ccRat;
    checkingAppraisRat() {

        if (this.empProgBar === 3) {
            this.jrRat = this.jobResList.findIndex(item => item.midyr_ee_rat === null);
            this.siRat = this.sigInvList.findIndex(item => item.midyr_ee_rat === null);
            this.ccRat = this.compeList.findIndex(item => item.midyr_ee_rat === null);
        } else if (this.empProgBar === 4) {
            this.jrRat = this.jobResList.findIndex(item => item.midyr_sv_rat === null);
            this.siRat = this.sigInvList.findIndex(item => item.midyr_sv_rat === null);
            this.ccRat = this.compeList.findIndex(item => item.midyr_sv_rat === null);
        } else if (this.empProgBar === 5) {
            this.jrRat = this.jobResList.findIndex(item => item.endyr_ee_rat === null);
            this.siRat = this.sigInvList.findIndex(item => item.endyr_ee_rat === null);
            this.ccRat = this.compeList.findIndex(item => item.endyr_ee_rat === null);
        } else if (this.empProgBar === 6) {
            this.jrRat = this.jobResList.findIndex(item => item.endyr_sv_rat === null);
            this.siRat = this.sigInvList.findIndex(item => item.endyr_sv_rat === null);
            this.ccRat = this.compeList.findIndex(item => item.endyr_sv_rat === null);
        }

        if (this.jrRat === -1 && this.siRat === -1 && this.ccRat === -1) {

            let ftf = this.sendForm.get('checkFaceToFace').value;
            let cmt = this.sendForm.get('comment').value;
            let ratVal = this.sendForm.get('ratingEnd').value;

            if (ftf && cmt !== null && cmt !== '' && cmt.length > 50 && cmt.length < 1000 && ratVal !== null && ratVal !== 0) {

                $('#confirmSendSupBtn').click();

            } else $('#compulsaryFtfBtn').click();

        } else {
            $('#reminderToCompleteBtn').click();
        }
    }

    // send to supervisor
    sendToSupvr() {

        let session: number;
        if (this.empProgBar === 3) session = 1;
        if (this.empProgBar === 5) session = 2;

        let req = {
            form_id: this.evMapsFormFormId,
            comment: this.sendForm.get('comment').value,
            f_t_f: 1,
            session: session,
            ee_rat: this.sendForm.get('ratingEnd').value,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId
        }

        this._POST_api_Service.POST_MAPS_data(MapsVars.POSTSupvRev, req).subscribe(res => {
            if (res.status === 'OK') {
                $('#successSubmitSupBtn').click();
                this.getEvForm(this.yearChoose);

                this.sendForm.patchValue({
                    comment: '',
                    checkFaceToFace: null,
                    ratingEnd: 0
                })
            }
        }, error => {
            console.log('[ERROR] cannot sent to supervisor ' + error);
        })
    }

    // show rating description when click the rating (not satisfy - excellent)
    appraisRat = 0
    ratingDesc() {
        this.appraisRat = this.appraiseForm.get('ratingAppr').value;
    }
    finRat = 0
    finalRatDesc() {
        this.finRat = this.sendForm.get('ratingEnd').value;
    }
    proposEmpRat = 0;
    proposEvOneRat = 0;
    proposEvTwoRat = 0;
    overalRatObj = []
    getOverallRating(num) {
        this.overalRatObj = []
        this._GET_api_Service.GET_MAPS_data(MapsVars.GETReviewerRatingAll + num).subscribe(res => {
            this.overalRatObj.push(res)
            if (res.endyr_ee_rat) this.proposEmpRat = res.endyr_ee_rat;
            if (res.endyr_sv_rat) this.proposEvOneRat = res.endyr_sv_rat;
            if (res.f_revr_rat) this.proposEvTwoRat = res.f_revr_rat;
        }, error => {
            console.log('[ERROR] cannot get overall rating ' + error);
        })

    }

    //Confirmation on final rating by employee

    confirmationModal(num) {
        if (num === 1) {
            this.awkAgreeModal = true;
            this.invalidLengthCommentAck = false;

        }else {
        this.awkAgreeModal = false;
        this.invalidLengthCommentAck = true;
        }

        $('#successProcessBtn').click();
    }

    //Final rating acknowledgement for employee
    awkAgreeModal: boolean = true;
    invalidLengthCommentAck: boolean = false;
    postDataAcknoledge;
    awknowledge(num) {

        let cmt = this.acknowledgmentCommentForm.get('commentAcknowledgement').value;

        if(num == 0){
            let post = {
                form_id: this.evMapsFormFormId,
                ack: num,
                disack_rsn: this.acknowledgmentCommentForm.get('commentAcknowledgement').value,
                auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId,
                year: this.yearChoose
            }
            this.postDataAcknoledge = post;

        }else {
            let post = {
                form_id: this.evMapsFormFormId,
                ack: num,
                disack_rsn: "agree",
                auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId,
                year: this.yearChoose
            }
            this.postDataAcknoledge = post;
        }
        

       // this.awkAgreeModal = true;
        if( (cmt.length > 60 && cmt.length < 1000 && cmt != null && cmt != '') || num == 1 ){
            this._POST_api_Service.POST_MAPS_data(MapsVars.POSTAwknowledgementEmp, this.postDataAcknoledge).subscribe(res => {
                if (res.status === 'OK') {
                    this.getEvForm(this.yearChoose)
                    $('#successProcessModal').modal('hide');
                }
            }, error => {
                console.log('[ERROR] cannot submit awknowledgement ' + error);
            })
        }else {
            this.invalidLengthCommentAck = true;
        }
        
    }

    //limit kpi rating feedback appraisee / appraiser
    countRatApp = '0/500'
    countColorRatApp = 'black'
    counterFeedbackRatAppr() {
        let c = this.appraiseForm.get('feedbackAppr').value.length
        this.countRatApp = c + '/500';

        if (c > 500) this.countColorRatApp = 'red';
        else this.countColorRatApp = 'black';
    }

}


