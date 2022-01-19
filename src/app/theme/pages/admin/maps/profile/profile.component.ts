import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GlobalVariable } from "../../../../../../environments/environment";
import { ProfileVars } from "./profile-vars";
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';

declare var $: any;
export interface IOption {
    staffNo: string,
    name: string,
}

@Component({
    selector: 'app-a-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    encapsulation: ViewEncapsulation.None,

})
export class mapsProfileComponent implements OnInit {
    section: any = [];
    showUnit = true;
    showPost = true;
    showDtStart = true;
    showDtEnd = true;
    showAchievement = true;

    showTitle = true;
    showCompany = true;
    showDuration = true;
    showSpecial = true;
    showRole = true;
    showCountry = true;
    showIndustry = true;
    showPosition = true;

    showQualification = true;
    showBranch = true;
    showUniversity = true;
    showCertificate = true;
    showHiEduLvl = true;

    addSkillsetForm: FormGroup;
    edtSkillSetForm: FormGroup;
    addJobExpForm: FormGroup;
    updateJobExpForm: FormGroup;
    addPEForm: FormGroup;
    updatePrevEmploymentForm: FormGroup;

    addInterestForm: FormGroup;

    aboutMeForm: FormGroup;

    updFuncComForm: FormGroup;

    leaderComForm: FormGroup;

    replacementForm: FormGroup;

    traitsForm: FormGroup;

    tglFuncComFam = false; tglFuncComDesc = false; noDescData = false; descSelected = false;

    options: IOption[];

    private readonly notifier: NotifierService;

    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private _script: ScriptLoaderService,
        //private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver,
        notifierService: NotifierService,
    ) {
        this.notifier = notifierService;
    }

    currentUser;
    loading = true; loadingAbout = false; loadingInterest =  false; loadingSkillset = false; loadingEndorse = false; loadingPrev = false; 
    loadingFuncComp = false; loadingLeader = false; loadingReplacement = false; loadingTraits = false;
    data = [];//= {};
    data2 = [];//= {};
    data3 = [];//= {};
    data4 = [];//= {};
    data5 = [];//= {};
    data6 = [];//= {};

    APIGetImg = ProfileVars.APIGetImg;
    getProfileData = ProfileVars.getProfile;
    careerProfile = ProfileVars.careerProfile;
    updateAboutMe =  ProfileVars.updateAboutMe;
    getAboutMe = ProfileVars.getAboutMe;
    editAchievement = ProfileVars.editAchievement;
    getAllAccess = ProfileVars.getAllAccess;
    accessEdu = ProfileVars.accessEdu;
    accessExp = ProfileVars.accessExp;
    accessPrev = ProfileVars.accessPrev;
    accessAward = ProfileVars.accessAward;

    getPrev = ProfileVars.getPrev;
    addPrev = ProfileVars.addPrev;
    edtPrev = ProfileVars.edtPrev;
    deletePrev = ProfileVars.deletePrev;

    getSkillset = ProfileVars.getSkillset;
    searchSkillset = ProfileVars.searchSkillset;
    addSkillset = ProfileVars.addSkillset;
    edtSkillset = ProfileVars.edtSkillset;
    deleteSkillset = ProfileVars.deleteSkillset;
    getEndorseList = ProfileVars.getEndorseList;

    getInterest = ProfileVars.getInterest;
    searchInterest = ProfileVars.searchInterest;
    addInterest = ProfileVars.addInterest;
    deleteInterest = ProfileVars.deleteInterest;

    uploadApi = ProfileVars.uploadApi;
    removeUserResume = ProfileVars.removeUserResume;

    getFuncCluster = ProfileVars.getFuncCluster;
    funcFamily = ProfileVars.funcFamily;
    funcCompetency = ProfileVars.funcCompetency;
    addFuncComp = ProfileVars.addFuncComp;
    edtFuncComp = ProfileVars.edtFuncComp;
    deleteFuncComp = ProfileVars.deleteFuncComp;
    getFuncComp = ProfileVars.getFuncComp;

    getLeaderSucc = ProfileVars.getLeaderSucc;
    addLeader = ProfileVars.addLeader;
    edtLeader = ProfileVars.edtLeader;
    delLeader = ProfileVars.delLeader;
    getLeader = ProfileVars.getLeader;

    getSuccessor = ProfileVars.getSuccessor;
    searchSuccessor = ProfileVars.searchSuccessor;
    addSuccessor = ProfileVars.addSuccessor;
    delSuccessor = ProfileVars.delSuccessor;

    getTraits = ProfileVars.getTraits;
    addTraits = ProfileVars.addTraits;
    editTraits = ProfileVars.editTraits;
    delTraits = ProfileVars.delTraits;
    getTraitsRefresh = ProfileVars.getTraitsRefresh;

    uploadImage = ProfileVars.uploadImage;

    imgOptArrList: any;
    supervisorImg: any;
    profile = {};
    aboutMe = '';
    comClusOptDef = '-- Select Cluster --';
    comFuncFamily = '-- Select Family --';
    comFuncDesc = '-- Select Description --';
    funcFamOptDef = '-- Select Family --';
    comCompOptDef = '-- Select Competency --';
    successOptDef = '-- Select SUCCESS Competency --';
    traitsOptDef = '-- Select Traits --';

    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    urlImg = {
        front: GlobalVariable.BASE_API_URL + this.APIGetImg,
        key: GlobalVariable.API_KEY,
    }

    ngOnInit() {
        if(this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;
            
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.getImgOpt();
        this.getInterestData();
        this.getSkillsetData();
        this.getPrevData();
        this.getProfile();
        this.getFuncClusterList();
        this.getLeaderList();
        this.getTraitsList();

        this.addSkillsetForm = new FormGroup({
            skillTitle: new FormControl(null, Validators.required),//minLength(2)),
        });

        this.addSkillsetForm.setValue({
            skillTitle: "",
        });

        this.edtSkillSetForm = new FormGroup({
            skillTitleEdt: new FormControl(null, Validators.required),//minLength(2)),
        });

        this.edtSkillSetForm.setValue({
            skillTitleEdt: "",
        });

        this.addJobExpForm = new FormGroup({
            jobAchievement: new FormControl('', Validators.required),//minLength(2)),
        });

        this.addJobExpForm.setValue({
            jobAchievement: "",
        });

        this.updateJobExpForm = new FormGroup({
            jobExpStart: new FormControl(null, Validators.required),//minLength(2)),
            jobExpEnd: new FormControl(null, Validators.required),//minLength(2)),
            jobExpPost: new FormControl(null, Validators.required),//minLength(2)),
            jobExpUnit: new FormControl(null, Validators.required),//minLength(2)),
            jobExpAchievement: new FormControl(null, Validators.required),//minLength(2)),
        });

        this.updateJobExpForm.setValue({
            jobExpStart: "",
            jobExpEnd: "",
            jobExpPost: "",
            jobExpUnit: "",
            jobExpAchievement: "",
        });

        this.addPEForm = new FormGroup({
            peStart: new FormControl('', Validators.required),//minLength(2)),
            peEnd: new FormControl('', Validators.required),//minLength(2)),
            peEmployer: new FormControl('', Validators.required),//minLength(2)),
            pePosition: new FormControl('', Validators.required),//minLength(2)),
        });

        this.addPEForm.setValue({
            peStart: "",
            peEnd: "",
            peEmployer: "",
            pePosition: "",
        });

        this.updatePrevEmploymentForm = new FormGroup({
            previousStart: new FormControl(null, Validators.required),//minLength(2)),
            previousEnd: new FormControl(null, Validators.required),//minLength(2)),
            previousPosition: new FormControl(null, Validators.required),//minLength(2)),
            previousCompany: new FormControl(null, Validators.required),//minLength(2)),
        });

        this.updatePrevEmploymentForm.setValue({
            previousStart: "",
            previousEnd: "",
            previousPosition: "",
            previousCompany: "",
        });

        this.addInterestForm = new FormGroup({
            interestName: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addInterestForm.setValue({
            interestName: "",
        });

        this.aboutMeForm = new FormGroup({
            aboutMe: new FormControl(null, Validators.required),//minLength(2)),
        });

        this.aboutMeForm.setValue({
            aboutMe: "",
        });

        this.updFuncComForm = new FormGroup({
            updFuncComClusIdOpt: new FormControl(null, Validators.required),
            updFuncComFamOpt: new FormControl(null, Validators.required),
            updFuncComDescOpt: new FormControl(null, Validators.required)
        });

        this.leaderComForm = new FormGroup({
            leaderId: new FormControl(null, Validators.required),
        });

        this.leaderComForm.setValue({
            leaderId: "",
        });

        this.replacementForm = new FormGroup({
            repName: new FormControl(null, Validators.required),
        });

        this.replacementForm.setValue({
            repName: "",
        });

        this.traitsForm = new FormGroup({
            traitsId: new FormControl(null, Validators.required),
        });

        this.traitsForm.setValue({
            traitsId: "",
        });

    }
    resumeName = '';
    uploadTime = '';
    getProfile() {
        this.loading = true;
        this._GET_api_Service.GET_data(this.getProfileData).subscribe(data => {
            this.profile =  data.body[0];
            this.supervisorImg = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + data.body[0].supervisorImage+ "?api_key=" + GlobalVariable.API_KEY;
            this.getData();
            this.getAccess();
            this.aboutMe = data.body[0].about_me;
            if(data.body[0].resume.length > 0){
                this.resumeUrl = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + data.body[0].resume + "?api_key=" + GlobalVariable.API_KEY;
                this.resumeName =  data.body[0].resumeFileName;
                this.uploadTime =  data.body[0].resumeUploadTime;
            }
            // console.log('this.profile', this.profile);
        },
        error => {
            console.log('[ERROR Get Profile] ' + error);
        });
    }
    funcData = [];
    leaderData = [];
    successorsData1 = [];
    successorsData2 = [];
    successorsData3 = [];
    traitsData = [];
    getData() {
        this.data = [];
        this.data2 = [];
        this.data4 = [];
        this.data6 = [];
        this.funcData = [];
        this.leaderData = [];
        this._GET_api_Service.GET_data(this.careerProfile).subscribe(data => {
            for(let i=0; i<data.career.exprience.length; i++){
                this.data.push({
                    Achievements: data.career.exprience[i].Achievements,
                    End_Date: data.career.exprience[i].End_Date,
                    Org_Unit_Desc: data.career.exprience[i].Org_Unit_Desc,
                    Post_Desc: data.career.exprience[i].Post_Desc,
                    Start_Date: data.career.exprience[i].Start_Date,
                    id: data.career.exprience[i].id,
                    edit: true,
                    loading: false,
                });
            }; 
            this.funcData = data.career.functional;
            this.leaderData = data.career.leadership;
            this.traitsData = data.career.traits;

            for(let x=0; x<data.career.successors.length; x++){
                if(data.career.successors[x].type === 1){
                    this.successorsData1.push(data.career.successors[x])
                }
                else if(data.career.successors[x].type === 2){
                    this.successorsData2.push(data.career.successors[x])
                }
                else if(data.career.successors[x].type === 3){
                    this.successorsData3.push(data.career.successors[x])
                }
            }

            for(let i=0; i<data.career.education.length; i++){
                this.data2.push({
                    Branch_of_Study: data.career.education[i].Branch_of_Study,
                    Certificate: data.career.education[i].Certificate,
                    End_Date: data.career.education[i].End_Date,
                    HiEduLvl: data.career.education[i].HiEduLvl,
                    Qualification_Desc: data.career.education[i].Qualification_Desc,
                    Start_Date: data.career.education[i].Start_Date,
                    University: data.career.education[i].University,
                    color: this.getRandomColor(),
                });
            };

            for(let i=0; i<data.career.profCert.length; i++){
                this.data4.push({
                    End_Date: data.career.profCert[i].End_Date,
                    Qualification: data.career.profCert[i].Qualification,
                    Start_Date: data.career.profCert[i].Start_Date,
                    color: this.getRandomColor(),
                });
            };

            for(let i=0; i<data.career.award.length; i++){
                this.data6.push({
                    End_Date: data.career.award[i].End_Date,
                    Award: data.career.award[i].Award,
                    Start_Date: data.career.award[i].Start_Date,
                    color: this.getRandomColor(),
                });
            };
            
            this.loading = false;
        },
        error => {
            this.showAlert('alertError');
            this._alertService.error("Loading Job Failed");
            console.log('[ERROR Job experience] ' + error);
            this.loading = false;
        });
    }

    getImgOpt() {
        this._GET_api_Service.GET_Picture('/get/image/' + this.currentUser.body.image_url).subscribe(data => {
            if(data){
                this.imgOptArrList = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + this.currentUser.body.image_url + "?api_key=" + GlobalVariable.API_KEY;
            }
        },
        error => {
            this.imgOptArrList = '0';
           console.log('[ERROR Get Image]' + error); 
        });
    }



    addDPTrigger(){
        $('#dpImg').trigger('click'); 
    }

    imgProfilePic;
    dpChange(event) {
        let fileList: FileList = event.target.files;
        this.imgProfilePic = fileList;
        console.log(this.imgProfilePic) ;
        let form_Data = new FormData();
        form_Data.append('imgProfilePic', this.imgProfilePic[0], this.imgProfilePic[0].name);
        this._POST_api_Service.POST_ScreenShot(this.uploadImage, form_Data).subscribe(res => {
            console.log("res", res);
            if(res.results ===  true){
                this.imgOptArrList = ""
                setTimeout(function() {
                    this.getImgOpt();
                }.bind(this), 500); //wait 1 Seconds and hide
            }
        })
    }


    eduAccess = null;
    expAccess = null;
    prevAccess = null;
    awardAccess = null;
    getAccess() {
        this.eduAccess = null;
        this.expAccess = null;
        this.prevAccess = null;
        this.awardAccess = null;
        this._GET_api_Service.GET_data(this.getAllAccess).subscribe(data => {
            this.eduAccess = data[0].education;
            this.expAccess = data[0].experience;
            this.prevAccess = data[0].previous;
            this.awardAccess = data[0].award;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    prevData = [];
    getPrevData() {
        this.prevData = []
        this.loadingPrev = true
        this._GET_api_Service.GET_data(this.getPrev).subscribe(data => {
            for(let i=0; i<data.length; i++){
                this.prevData.push({
                    Employer: data[i].Employer,
                    End_Date: data[i].End_Date,
                    Position: data[i].Position,
                    Start_Date: data[i].Start_Date,
                    id: data[i].id,
                    temp_date: data[i].temp_date,
                    type: data[i].type,
                    color: this.getRandomColor(),
                });
            };
            this.loadingPrev =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    skillsetData = [];
    getSkillsetData(){
        this.skillsetData = []
        this.loadingSkillset = true
        this._GET_api_Service.GET_data(this.getSkillset).subscribe(data => {
            this.skillsetData = data.body;
            this.loadingSkillset =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    interestData = [];
    getInterestData(){
        this.interestData = []
        this.loadingInterest = true
        this._GET_api_Service.GET_data(this.getInterest).subscribe(data => {
            this.interestData = data.body;
            this.loadingInterest =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-a-profile',
            [
                'assets/js/user/profile/profile.js',
                'assets/demo/default/custom/components/forms/widgets/bootstrap-select.js',
            ]);
    }
    
    getRandomColor() {
        var color = Math.floor(0x1000000 * Math.random()).toString(16);
        return '#' + ('000000' + color).slice(-6);
      }

    itemColor = this.getRandomColor();

    submitAboutMe() {
        this.loadingAbout = true;
        this.toggleEditAbout = false;

        var abtme = this.aboutMe;
        if(this.aboutMeForm.get('aboutMe').value != '')
            abtme = this.aboutMeForm.get('aboutMe').value;

        this._POST_api_Service.POST_data(this.updateAboutMe, { aboutme: abtme }).subscribe(dataRes => {
            if(dataRes.results === true){
                this.aboutMe = abtme;
                this.edit = true;
                this.loadingAbout = false;
            }
            
        },
        error => {
            console.log('[ERROR Fail to update about] ' + error);
        });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    toggleEdit(index){
        for(let i=0; i<this.data.length; i++){
            if(i === index){
                this.data[i].edit = false;
            }
            // console.log('this.data[i].edit', this.data[i].edit === true);
        }
    }

    addAchievement(index){
        for(let i=0; i<this.data.length; i++){
            if(i === index){
                this.data[i].edit = true;
                this.data[i].loading = true;

                let dataPos ={
                    id: this.data[i].id,
                    achievements: $("#achievement").val().toString(),
                }
                this._POST_api_Service.POST_data(this.editAchievement, dataPos).subscribe(dataRes => {
                    this.getProfile();
                    this.edit = true;
                    this.data[i].loading = false;
                },
                error => {
                    console.log('[ERROR Fail to edit achievements] ' + error);
                });
            }
        }
        
    }
    edit =  true;
    toggleEditAbout = false;
    clickEditAbout() {
        this.toggleEditAbout =  true;
        this.edit = false;
        console.log('this.aboutMe', this.aboutMe);
    }

    scrollToElement($element): void {
        // console.log($element);
        $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

    submitAddPrev(){
        this.addPEForm.patchValue({peStart: moment($("#startDtAdd").val().toString(), 'DD-MM-YYYY').format()});
        this.addPEForm.patchValue({peEnd: moment($("#endDtAdd").val().toString(), 'DD-MM-YYYY').format()});
        let dataPos ={
            start: this.addPEForm.get('peStart').value,
            end: this.addPEForm.get('peEnd').value,
            employer: this.addPEForm.get('peEmployer').value,
            position: this.addPEForm.get('pePosition').value,
        }

        this._POST_api_Service.POST_data(this.addPrev, dataPos).subscribe(dataRes => {
            console.log('dataRes', dataRes)
            this.getPrevData();

            this.addPEForm.patchValue({peEmployer: ''});
            this.addPEForm.patchValue({pePosition: ''});
            this.addPEForm.patchValue({peStart: ''});
            this.addPEForm.patchValue({peEnd: ''});
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        );
    }

    submitEdtPrev(item){
        let dataPos ={
            id: item.id,
            start: moment($("#startDtEdt").val().toString(), 'DD-MM-YYYY').format(),
            end: item.End_Date === "Present" ? moment().format() : moment($("#endDtEdt").val().toString(), 'DD-MM-YYYY').format(),
            employer: this.updatePrevEmploymentForm.get('previousCompany').value === "" ? item.Employer : this.updatePrevEmploymentForm.get('previousCompany').value,
            position: this.updatePrevEmploymentForm.get('previousPosition').value === "" ? item.Position : this.updatePrevEmploymentForm.get('previousPosition').value,
        }

        this._POST_api_Service.POST_data(this.edtPrev, dataPos).subscribe(dataRes => {
            console.log('dataRes', dataRes);
            this.getPrevData();
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        );
    }

    submitDeletePrev(item){
        this._POST_api_Service.POST_data(this.deletePrev, {id: item.id}).subscribe(dataRes => {
            console.log('dataRes', dataRes);
            this.getPrevData();
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        );
    }


    selectedPrev = {
        Employer: '',
        Start_Date: '',
        End_Date: '',
        Position: '',
    };
    selPrev(item) {
        this.selectedPrev = item;
    }
    accessToggle(access){
        console.log(access);
        if(access === 'edu'){
            if(this.eduAccess === false){ this.eduAccess = 0; }
            else if(this.eduAccess === true){ this.eduAccess = 1; }

            let dataPos = {
                allow: this.eduAccess,
            }

            this._POST_api_Service.POST_data(this.accessEdu, dataPos).subscribe(dataRes => {
                console.log('dataRes', dataRes);
            },
                error => {
                    console.log('[ERROR + Fail to change access]', error);
                }
            );
            
        }
        else if(access === 'exp'){
            if(this.expAccess === false){ this.expAccess = 0; }
            else if(this.expAccess === true){ this.expAccess = 1; }

            let dataPos = {
                allow: this.expAccess,
            }

            this._POST_api_Service.POST_data(this.accessExp, dataPos).subscribe(dataRes => {
                console.log('dataRes', dataRes);
            },
                error => {
                    console.log('[ERROR + Fail to change access]', error);
                }
            );
        }
        else if(access === 'prev'){
            if(this.prevAccess === false){ this.prevAccess = 0; }
            else if(this.prevAccess === true){ this.prevAccess = 1; }

            let dataPos = {
                allow: this.prevAccess,
            }

            this._POST_api_Service.POST_data(this.accessPrev, dataPos).subscribe(dataRes => {
                console.log('dataRes', dataRes);
            },
                error => {
                    console.log('[ERROR + Fail to change access]', error);
                }
            );
        }
        else if(access === 'award'){
            if(this.awardAccess === false){ this.awardAccess = 0; }
            else if(this.awardAccess === true){ this.awardAccess = 1; }

            let dataPos = {
                allow: this.awardAccess,
            }

            this._POST_api_Service.POST_data(this.accessAward, dataPos).subscribe(dataRes => {
                console.log('dataRes', dataRes);
            },
                error => {
                    console.log('[ERROR + Fail to change access]', error);
                }
            );
        }
        
    }

    timer = null;
    text = '';
    onSkillsetKeyDown(event: any) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.text = '';
                this.text =  event.target.value;
                this.skillsetSearch(this.text);
            } else if(event.target.value.length < 1){
                this.text = '';
            }
        }, 500);
    }
    skillsetList = [];
    skillsetSearch(text){
        this.skillsetList = []
        this._POST_api_Service.POST_data(this.searchSkillset, {skillset: text}).subscribe(dataRes => {
            this.skillsetList = dataRes.body;
            console.log('this.skillsetList', this.skillsetList);
        },
            error => {
                console.log('[ERROR + Fail to search skillset]', error);
            }
        );
    }
    selectedSkillset(select) {
        for(let i=0; i<this.skillsetList.length; i++){
            if(this.skillsetList[i].name ===  select){
                console.log(this.skillsetList[i].name)
                this.selSkillset = {
                    name: this.skillsetList[i].name,
                    id: this.skillsetList[i].id,
                }
            }
        }
    } 

    selSkillset = { name: '', id: ''};
    submitAddSkillset() {
        let dataPost = {}
        if(this.selSkillset.id){
            dataPost = {
                skillID: this.selSkillset.id,
                skillName: this.selSkillset.name,
                skillPoint: $("#m_nouislider_skill_input").val(),
            } 
        } else if(!this.selSkillset.id){
            dataPost = {
                skillName: this.text,
                skillPoint: $("#m_nouislider_skill_input").val(),
            }
        }

        this._POST_api_Service.POST_data(this.addSkillset, dataPost).subscribe(dataRes => {
            if(dataRes.status === 0){
                this.getSkillsetData();
            }
        },
            error => {
                console.log('[ERROR + Fail to add skillset]', error);
            }
        );
    }

    onInterestKeyDown(event: any) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.text = '';
                this.text =  event.target.value
                this.interestSearch(this.text);
            } else if(event.target.value.length < 1){
                this.text = '';
            }
        }, 500);
    }
    interestList = [];
    interestSearch(text){
        this.interestList = []
        this._POST_api_Service.POST_data(this.searchInterest, {interestset: text}).subscribe(dataRes => {
            this.interestList = dataRes.body;
        },
            error => {
                console.log('[ERROR + Fail to search interest]', error);
            }
        );
    }

    selInterest = { name: '', id: ''};
    selectedInterest(user) {
        for(let i=0; i<this.interestList.length; i++){
            if(this.interestList[i].name ===  user){
                this.selInterest = {
                    name: this.interestList[i].name,
                    id: this.interestList[i].id,
                }
            }
        }
    } 

    submitAddInterest() {
        let dataPost = {}
        if(this.selInterest.id){
            dataPost = {
                interestID: this.selInterest.id,
                interestName: this.selInterest.name,
            } 
        } else if(!this.selInterest.id){
            dataPost = {
                interestName: this.text,
            }
        }

        this._POST_api_Service.POST_data(this.addInterest, dataPost).subscribe(dataRes => {
            if(dataRes.status === 0){
                this.getInterestData();
            }
        },
            error => {
                console.log('[ERROR + Fail to search interest]', error);
            }
        );
    }

    submitDeleteInterest(item) {
        this._POST_api_Service.POST_data(this.deleteInterest, {interestID: item}).subscribe(dataRes => {
            if(dataRes.status === 0){
                this.getInterestData();
            }
        },
            error => {
                console.log('[ERROR + Fail to delete interest]', error);
            }
        );
    }

    clearData() {
        this.selInterest = { name: '', id: ''};
        this.text = '';
        this.interestList = [];
        this.addInterestForm.patchValue({
            interestName: "",
        });
        this.skillsetList = [];
        this.addSkillsetForm.reset();
        this.addInterestForm.reset();
        this.replacementForm.reset();
        this.traitsForm.reset();
        this.traitsForm.patchValue({traitsId: this.traitsList[0].id});
        $('.m-bootstrap-select').selectpicker('refresh');
        this.updFuncComForm.patchValue({updFuncComClusIdOpt: this.clusterList[0].cluster_id});
        this.tglFuncComFam = false;
        this.tglFuncComDesc = false;
        this.descSelected = false;
        this.leaderComForm.patchValue({leaderId: this.leaderList[0].suc_id});
        this.descriptionToggle = false;
        this.replacementList = [];
    }

    endorseList = [];
    getEndorseListData(item) {
        this.endorseList = [];
        this.loadingEndorse = true;
        this._POST_api_Service.POST_data(this.getEndorseList, { skillID: item }).subscribe(dataRes => {
            if(dataRes.status === 0){
                this.endorseList = dataRes.body;
                this.loadingEndorse = false;
            }
        },
            error => {
                console.log('[ERROR + Fail to get endorse list]', error);
            }
        );
    } 

    edtId = null;
    setSkill(item) {
        this.edtId = item.skill_id;
        this.edtSkillSetForm.patchValue({skillTitleEdt: item.name});
        $("#m_nouislider_skill_edt_input").val(item.skill_point);
    }

    submitEdtSkill() {
        let dataPost = {
            skillID: this.edtId,
            skillPoint: $("#m_nouislider_skill_edt_input").val(),
        };
        this._POST_api_Service.POST_data(this.edtSkillset, dataPost).subscribe(dataRes => {
            console.log('dataRes', dataRes);
            if(dataRes.status === 0){
                this.getSkillsetData();
            }
        },
            error => {
                console.log('[ERROR + Fail to edit skillset]', error);
            }
        );
    }

    submitDeleteSkill() {
        this._POST_api_Service.POST_data(this.deleteSkillset, {skillID: this.edtId}).subscribe(dataRes => {
            if(dataRes.status === 0){
                this.getSkillsetData();
            }
        },
            error => {
                console.log('[ERROR + Fail to delete skillset]', error);
            }
        );
    }

    addImageTrigger(){
        $('#ssImg').trigger('click'); 
    }

    resume;
    resumeUrl = '';
    fileChange(event) {
        let fileList: FileList = event.target.files;
        this.resume = fileList;
        console.log(this.resume) ;
        let form_Data = new FormData();
        form_Data.append('resume', this.resume[0], this.resume[0].name);
        this._POST_api_Service.POST_ScreenShot(this.uploadApi, form_Data).subscribe(res => {
            console.log("res", res);
            if(res.results ===  true){
                this.resumeUrl = ""
                setTimeout(function() {
                    this.resumeUrl = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + res.image_url+ "?api_key=" + GlobalVariable.API_KEY;
                }.bind(this), 1000); //wait 1 Seconds and hide
                this.resumeName = res.resumeFileName;
                this.uploadTime = res.resumeUploadTime;
            }
        })
    }

    openPDF() {
        window.open(this.resumeUrl);
    }

    submitDeleteResume() {
        this._GET_api_Service.GET_data(this.removeUserResume).subscribe(dataRes => {
            if(dataRes.results ===  true){
                this.notifier.notify('success', 'Successfully Delete Resume !');
                // this.addImageTrigger();
                this.resumeUrl = ""
            }
            else {
                this.notifier.notify('error', 'Fail to delete resume');
            }
        },
            error => {
                console.log('[ERROR + Fail to delete resume]', error);
            }
        );
    }

    clusterList = [];
    funcCluster = {};
    getFuncClusterList(){
        this.clusterList = []
        this._GET_api_Service.GET_data(this.getFuncCluster).subscribe(data => {
            this.clusterList.push({cluster_id: 0, cluster: this.comClusOptDef});
            this.funcCluster = this.clusterList[0];
            this.updFuncComForm.patchValue({updFuncComClusIdOpt: this.clusterList[0].cluster_id})
            for (let j = 0; j < data.length; j = j + 1) {
                this.clusterList.push({cluster_id: data[j].cluster_id, cluster: data[j].cluster});
            }
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }
    
    funcFamList = [];
    funcChangeUpdCat() {

        this.tglFuncComFam = false;  this.tglFuncComDesc = false; this.descSelected = false;
        let funcFamData = [];
        this.funcFamList = [];
        this.funcCompList = [];
        let data2 = {
            clusterId: this.updFuncComForm.get('updFuncComClusIdOpt').value,
        }
        this._POST_api_Service.POST_data(this.funcFamily, data2).subscribe(data => {
            funcFamData = data;
            if (funcFamData.length > 0) {
                this.tglFuncComFam = true; this.tglFuncComDesc = false;
                this.noDescData = false; this.descSelected = false;

                if (funcFamData[0].family_id === '0') {
                    this.tglFuncComFam = false;
                }
                this.funcFamList.push({family_id: 0, family: this.funcFamOptDef});
                this.updFuncComForm.patchValue({updFuncComFamOpt: this.funcFamList[0].family_id})
                for (let j = 0; j < funcFamData.length; j = j + 1) {
                    this.funcFamList.push({family_id: funcFamData[j].family_id, family: funcFamData[j].family});
                }
            }
            else 
                this.tglFuncComFam = false;
        })
    }

    funcCompList = [];
    funcChangeFamily() {
        let funcCompData = [];
        this.funcCompList = [];
        let data2 = {
            familyId: this.updFuncComForm.get('updFuncComFamOpt').value,
        }
        this._POST_api_Service.POST_data(this.funcCompetency, data2).subscribe(data => {
            funcCompData = data;
            if (funcCompData.length > 0) {
                this.tglFuncComDesc = true; this.noDescData = false; this.descSelected = false;

                this.funcCompList.push({comp_id: 0, competency: this.comCompOptDef, description: ''});
                this.updFuncComForm.patchValue({updFuncComDescOpt: this.funcCompList[0].comp_id});
                for (let j = 0; j < funcCompData.length; j = j + 1) {
                    this.funcCompList.push({comp_id: funcCompData[j].comp_id, competency: funcCompData[j].competency, description: funcCompData[j].description});
                }
            }
            else if(funcCompData.length < 1) {
                this.tglFuncComDesc = false; this.noDescData = true;
                this.descSelected = false;
            }
        })
    }
    
    selectedComp = {};
    funcChangeCompDesc() {
        let compSelId = this.updFuncComForm.get('updFuncComDescOpt').value; 
        this.selectedComp = this.funcCompList.find(x => x.comp_id.toString() === compSelId)

        this.descSelected = true;
        $("#addComp").click();
    }

    onFuncComFormSubmit() {
        let dataAdd = {
            comp_id: this.updFuncComForm.get('updFuncComDescOpt').value,
            rate: $("#m_nouislider_comp_input").val(),
        }

        this._POST_api_Service.POST_data(this.addFuncComp, dataAdd).subscribe(dataFuncComRes => {
            if(dataFuncComRes.status === "OK"){
                this.notifier.notify('success', 'Successfully add new functional competancy !');
                this.getFuncCompData();
            } 
            else {
                this.notifier.notify('error', 'Fail to add functional competancy');
            }
        });
    }

    compId = '';
    cluster = '';
    family = '';
    comp = '';
    setComp(item){
        this.compId = item.id;
        this.cluster = item.cluster;
        this.family = item.family;
        this.comp = item.competency;
        $("#m_nouislider_comp_edt_input").val(item.rating);
    }

    submitEdtComp() {
        let dataPost = {
            id: this.compId,
            rate: $("#m_nouislider_comp_edt_input").val(),
        };
        this._POST_api_Service.POST_data(this.edtFuncComp, dataPost).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully edit functional competancy !');
                this.getFuncCompData();
            }
            else {
                this.notifier.notify('error', 'Fail to edit functional competancy');
            }
        },
            error => {
                console.log('[ERROR + Fail to edit competency]', error);
            }
        );
    }

    submitDeleteComp() {
        this._POST_api_Service.POST_data(this.deleteFuncComp, {id: this.compId}).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully delete functional competancy !');
                this.getFuncCompData();
            }
            else {
                this.notifier.notify('error', 'Fail to delete functional competancy !');
            }
        },
            error => {
                console.log('[ERROR + Fail to delete competency]', error);
            }
        );
    }

    getFuncCompData(){
        this.funcData = []
        this.loadingFuncComp = true
        this._GET_api_Service.GET_data(this.getFuncComp).subscribe(data => {
            this.funcData = data;
            this.loadingFuncComp =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    leaderList = [];
    defaultLeader = {};
    getLeaderList(){
        this.leaderList = []
        this._GET_api_Service.GET_data(this.getLeaderSucc).subscribe(data => {
            this.leaderList.push({suc_id: 0, name: '' , type: this.successOptDef, details: ''});
            this.defaultLeader = this.leaderList[0];
            this.leaderComForm.patchValue({leaderId: this.leaderList[0].suc_id})
            for (let j = 0; j < data.length; j = j + 1) {
                this.leaderList.push({suc_id: data[j].suc_id, name: data[j].name, type: data[j].type ,details: data[j].details});
            }
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        });
    }

    disableBtn = true;
    descriptionToggle = false;
    selDesc = {};
    leaderChange() {
        this.disableBtn = false;
        this.selDesc =  this.leaderList.find(leader => leader.suc_id == this.leaderComForm.get('leaderId').value);
        if(this.selDesc){
            this.descriptionToggle = true;
        }
        else {
            this.descriptionToggle = false;
        }
    }

    onLeaderSubmit() {
        let dataAdd = {
            suc_id: this.leaderComForm.get('leaderId').value,
            rate: $("#m_nouislider_leader_input").val(),
        }

        this._POST_api_Service.POST_data(this.addLeader, dataAdd).subscribe(dataFuncComRes => {
            if(dataFuncComRes.status === "OK"){
                this.notifier.notify('success', 'Successfully add new SUCCESS Competancy !');
                this.getLeaderData();
            } 
            else {
                this.notifier.notify('error', 'Fail to add SUCCESS Competancy !');
            }
        });
    }

    getLeaderData(){
        this.leaderData = []
        this.loadingLeader = true
        this._GET_api_Service.GET_data(this.getLeader).subscribe(data => {
            this.leaderData = data;
            this.loadingLeader =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    sucId = '';
    sucName = '';
    sucType = '';
    sucDetails = '';
    setLeader(item){
        this.sucId = item.id;
        this.sucName = item.name;
        this.sucType = item.type;
        this.sucDetails = item.details;
        $("#m_nouislider_leader_edt_input").val(item.rating);
    }

    submitEdtLeader() {
        let dataPost = {
            id: this.sucId,
            rate: $("#m_nouislider_leader_edt_input").val(),
        };
        this._POST_api_Service.POST_data(this.edtLeader, dataPost).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Updated SUCCESS Competancy !');
                this.getLeaderData();
            }
            else {
                this.notifier.notify('error', 'Fail to update SUCCESS Competancy !');
            }
        },
            error => {
                console.log('[ERROR + Fail to update competency]', error);
            }
        );
    }

    submitDeleteLeader() {
        this._POST_api_Service.POST_data(this.delLeader, {id: this.sucId}).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Deleted the SUCCESS Competancy !');
                this.getLeaderData();
            }
            else {
                this.notifier.notify('error', 'Fail to delete SUCCESS competency');
            }
        },
            error => {
                console.log('[ERROR + Fail to delete competency]', error);
            }
        );
    }

    onReplacementKeyDown(event: any) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.text = '';
                this.text =  event.target.value
                this.replacementSearch(this.text);
            } else if(event.target.value.length < 1){
                this.text = '';
                this.disableReplace = true;
            }
        }, 500);
    }
    replacementList = [];
    replacementSearch(text){
        this.replacementList = []
        this._POST_api_Service.POST_data(this.searchSuccessor, {text}).subscribe(dataRes => {
            this.replacementList = dataRes.results;
        },
            error => {
                console.log('[ERROR + Fail to search interest]', error);
            }
        );
        
    }

    selReplacement = { name: '', staffNo: ''};
    disableReplace = true;
    selectedReplacement(user) {
        for(let i=0; i<this.replacementList.length; i++){
            if(this.replacementList[i].name ===  user){
                this.selReplacement = {
                    name: this.replacementList[i].name,
                    staffNo: this.replacementList[i].staffNo,
                }
            }
        }
        this.disableReplace = false;
    }

    successorType = 0;
    onSuccessorSubmit() {
        let dataAdd = {
            suc_id: this.selReplacement.staffNo,
            type: this.successorType,
        }

        this._POST_api_Service.POST_data(this.addSuccessor, dataAdd).subscribe(dataFuncComRes => {
            if(dataFuncComRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Add New Replacement !');
                this.getReplacementData();
            }
            else {
                this.notifier.notify('error', 'Fail to add replacement');
            }
        });
    }

    getReplacementData(){
        this.successorsData1 = []
        this.successorsData2 = []
        this.successorsData3 = []
        this.loadingReplacement = true
        this._GET_api_Service.GET_data(this.getSuccessor).subscribe(data => {
            for(let x=0; x<data.length; x++){
                if(data[x].type === 1){
                    this.successorsData1.push(data[x])
                }
                else if(data[x].type === 2){
                    this.successorsData2.push(data[x])
                }
                else if(data[x].type === 3){
                    this.successorsData3.push(data[x])
                }
            }
            this.loadingReplacement =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    submitDeleteReplacement(id) {
        this._POST_api_Service.POST_data(this.delSuccessor, {id}).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Delete Replacement Nomination !');
                this.getReplacementData();
            }
            else {
                this.notifier.notify('error', 'Fail to delete replacement');
            }
        },
            error => {
                console.log('[ERROR + Fail to delete replacement]', error);
            }
        );
    }

    traitsList = []
    defaultTraits = {};
    getTraitsList(){
        this.traitsList = []
        this._GET_api_Service.GET_data(this.getTraits).subscribe(data => {
            this.traitsList.push({id: 0, name: this.traitsOptDef , rating: 0});
            this.defaultTraits = this.traitsList[0];
            this.traitsForm.patchValue({traitsId: this.traitsList[0].id})
            for (let j = 0; j < data.length; j = j + 1) {
                this.traitsList.push({id: data[j].id, name: data[j].name, rating: data[j].rating});
            }
            setTimeout(() => {
                $('.m-bootstrap-select').selectpicker('refresh');
                this.disableBtn = true;
              }, 500);
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        });
    }

    selTraitsId = ''
    traitsChange(){
        this.disableBtn = false;
    }

    onTraitsSubmit() {
        let dataAdd = {
            traits_id: this.traitsForm.get('traitsId').value,
            rate: $("#m_nouislider_traits_input").val(),
        }

        this._POST_api_Service.POST_data(this.addTraits, dataAdd).subscribe(dataFuncComRes => {
            if(dataFuncComRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Add New Traits !');
                this.getTraitsData();
            }
            else {
                this.notifier.notify('error', 'Fail to add traits');
            }
        });
    }

    getTraitsData(){
        this.traitsData = []
        this.loadingTraits = true
        this._GET_api_Service.GET_data(this.getTraitsRefresh).subscribe(data => {
            this.traitsData = data;
            this.loadingTraits =  false;
        },
        error => {
            console.log('[ERROR All Access] ' + error);
        })
    }

    traitId = '';
    traitName = '';
    setTraits(item){
        this.traitId = item.id;
        this.traitName = item.Name;
        $("#m_nouislider_traits_edt_input").val(item.rating);
    }

    submitEdtTraits() {
        let dataPost = {
            id: this.traitId,
            rate: $("#m_nouislider_traits_edt_input").val(),
        };
        this._POST_api_Service.POST_data(this.editTraits, dataPost).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully edit Trait !');
                this.getTraitsData();
            }
            else {
                this.notifier.notify('error', 'Fail to edit trait !');
            }
        },
            error => {
                console.log('[ERROR + Fail to edit traits]', error);
            }
        );
    }

    submitDeleteTraits() {
        this._POST_api_Service.POST_data(this.delTraits, {id: this.traitId}).subscribe(dataRes => {
            if(dataRes.status === "OK"){
                this.notifier.notify('success', 'Successfully Delete Traits !');
                this.getTraitsData();
            }
            else {
                this.notifier.notify('error', 'Fail to delete traits');
            }
        },
            error => {
                console.log('[ERROR + Fail to delete traits]', error);
            }
        );
    }

    checkCollapse(res) {
        if ($('#'+res).attr('aria-expanded') == 'true') {
            $('#'+res).next().hide();
        } else {
            $('#'+res).next().show();
        }
    }

    checkCollapse2(res) {
        console.log('abc');
        console.log(res);
        if ($('#'+res+'_head').attr('aria-expanded') == 'true') {
            $('#'+res+'_btn').hide();
        } else {
            $('#'+res+'_btn').show();
        }
    }
}