import { Component, OnInit, ComponentFactoryResolver, } from '@angular/core';
import { tcmVars } from './tcm-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { data, post } from 'jquery';
// import { PagerService } from '../../../shared/pager/pager.component';
import { PagerService } from '../../job/shared/pager/pager.component';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Http, Response } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-tcm.component',
  templateUrl: './tcm.component.html',
  styleUrls: ['./tcm.component.css']
})
export class TCMComponent implements OnInit {

  title1 = tcmVars.title1;
  title2 = tcmVars.title2;
  pageSize = tcmVars.pageSize;
  private allItems: any[];
 
  filteredData = [];
  nineBoxFilteredData = [];
  infoForCalibration;

  showNineGridTab = false;
  empty = true;
  showTable = false;
  showInfo = false;
  showEmpDetail = false;
  loading = true;
  showCalGmBtn = false;
  showCalEvpBtn = false;
  showCalSpBtn = false;
  selectDeptMult = false;
  selectUnitMult = false;
  selectSupvMult = false;
  selectStfIdMult = false;
  
  filterForm: FormGroup;
  calibrateForm: FormGroup;

  constructor(private _GET_api_Service: GET_Service, 
              private _POST_api_Service: POST_Service,
              private _script: ScriptLoaderService,
              private pagerService: PagerService,
              private cfr: ComponentFactoryResolver,
              private http: Http, 
              private activeRoute: ActivatedRoute, 
              private routers: Router,) { }

              ngOnInit() {

                this.flGetState();
                this.flGetBand();
                this.flGetLob();
                this.flGetNGridBox();
            
                this.filterForm = new FormGroup({
                  filterState: new FormControl(null, Validators.required),
                  filterLob: new FormControl(null, Validators.required),
                  filterDepartment: new FormControl(null, Validators.required),
                  filterUnit: new FormControl(null, Validators.required),
                  filterSupervisor: new FormControl(null, Validators.required),
                  filterStaffId: new FormControl(null, Validators.required),
                  filterBand: new FormControl(null, Validators.required),
                  filterNineGridBox: new FormControl(null, Validators.required)
                });
            
                this.calibrateForm = new FormGroup({
                  tcIdNew: new FormControl(null, Validators.required),
                  justification: new FormControl(null, Validators.required)
                });
              }
            
              // filter by state
              flStateData = []
              flGetState() {
                this._GET_api_Service.GET_TC_DATA(tcmVars.getFilterByState).subscribe(data => {
                  this.flStateData = data.state;
                  console.log('filter state data', this.flStateData);
                },
                error => {
                  console.log('[ERROR] cannot get filer state ' + error);
                })
              }
            
              // filter by lob
              flLobData = []
              flLobUserData;
              alllob;
              lobId;
              // lobClicked = false;
              flGetLob() {
                this._GET_api_Service.GET_data_withID(tcmVars.getFilterByLob + '?roleLevel=3').subscribe(data => {
                  this.flLobData = data.lob;
                  console.log('get lob', this.flLobData);
                  this.loading = false;
                  // this.lobClicked = true;
                  },
                error => {
                  console.log('[ERROR] cannot get filter lob ' + error);
                });
              }

              // filter by department
              flDepartmentData = [];
              flGetDepartment() {
                this._GET_api_Service.GET_data_withID(tcmVars.getFilterByDepartment + '?lob=' + this.filterForm.get('filterLob').value).subscribe(dataRes => {
                  this.flDepartmentData = dataRes.department;
                  console.log('department data', this.flDepartmentData);
                },
                error => {
                  console.log('[ERROR] cannot get filter department ' + error);
                });
              }
                
              // filter by unit
              flUnitData = [];
              depSearchClicked = false;
              flGetUnit() {
                this.selectDeptMult = true;
                this.depSearchClicked = true;
                this._GET_api_Service.GET_data_withID(tcmVars.getFilterByUnit + '?dept=' + this.filterForm.get('filterDepartment').value).subscribe(dataRes => {
                  this.flUnitData = dataRes.unit;
                  console.log('unit data', this.flUnitData);
                  if (dataRes) {
                    this.selectDeptMult = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot get filter unit ' + error);
                });
              }

              // filter by supervisor
              flSupervisorData = [];
              unitSearchClicked = false;
              flGetSupervisor() {
                this.unitSearchClicked = true;
                this._GET_api_Service.GET_data_withID(tcmVars.getFilterBySupervisor + '?lob=' + this.filterForm.get('filterLob').value).subscribe(dataRes => {
                  this.flSupervisorData = dataRes.supervisor;
                  console.log('supervisor data', this.flSupervisorData);
                  if (dataRes) {
                    this.selectUnitMult = false;
                   }
                },
                error => {
                  console.log('[ERROR] cannot get filter supervisor ' + error);
                });
              }
              

              // filter by staff id
              flStaffIdData = [];
              supvSearchClicked = false;
              flGetStaffId() {
                this.selectSupvMult = true;
                this.supvSearchClicked = true;
                this._GET_api_Service.GET_data_withID(tcmVars.getFilterByStaffId + '?supv=' + this.filterForm.get('filterSupervisor').value).subscribe(dataRes => {
                  this.flStaffIdData = dataRes.staff_id;
                  console.log('staff id data', this.flStaffIdData);
                  if (dataRes) {
                    this.selectSupvMult = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot get filter staff id ' + error);
                });
              }
              // filter by band
              flBandData = [];
              flGetBand() {
                this._GET_api_Service.GET_TC_DATA(tcmVars.getFilterByBand).subscribe(dataRes => {
                  this.flBandData = dataRes.band;
                  console.log('band data', this.flBandData);
                },
                error => {
                  console.log('[ERROR] cannot get filter band ' + error);
                });
              }
            
              // filter by nine grid box
              flNineGridBoxData = [];
              flGetNGridBox() {
                this._GET_api_Service.GET_TC_DATA(tcmVars.getFilterByNGridBox).subscribe(dataRes => {
                  this.flNineGridBoxData = dataRes.n_grid_box;
                  console.log('nine grid box data', this.flNineGridBoxData);
                },
                error => {
                  console.log('[ERROR] cannot get filter nine grid box ' + error);
                });
              }
              
              
            
              // submit the filter
              submitFilter(type, viewTeam) {
                this.loading = true;
                let dataPost = {};
            
                if (type === 0) {
                  dataPost = {
                    state: null,
                    lob: null,
                    department: null,
                    unit: null,
                    supervisor: null,
                    staff_id: null,
                    band: null,
                    n_grid_box: null
                  };
                  this.filterForm.patchValue({
                    filterState: null,
                    filterLob: null,
                    filterDepartment: null,
                    filterUnit: null,
                    filterSupervisor: null,
                    filterStaffId: null,
                    filterBand: null,
                    filterNineGridBox: null
                  });
                  this.flDepartmentData = []
                  this.flUnitData = [];
                  this.flSupervisorData = [];
                  this.flStaffIdData = [];
                  this.setPage(1);
                  this.loading = false;
            
                  this.depSearchClicked = false;
                  this.unitSearchClicked = false;
                  this.supvSearchClicked = false;
                             
                } else if (type === 1) {
                  dataPost = {
                    state: this.filterForm.get('filterState').value,
                    lob: this.filterForm.get('filterLob').value,
                    department: this.filterForm.get('filterDepartment').value,
                    unit: this.filterForm.get('filterUnit').value,
                    supervisor: this.filterForm.get('filterSupervisor').value,
                    staff_id: this.filterForm.get('filterStaffId').value,
                    band: this.filterForm.get('filterBand').value,
                    n_grid_box: this.filterForm.get('filterNineGridBox').value
                  }
                }

                //Reset form
                else if (type === 2) {
                this.filterForm.setValue({
                    filterState: "",
                    filterLob: "",
                    filterDepartment: "",
                    filterUnit: "",
                    filterSupervisor: "",
                    filterStaffId: "",
                    filterBand: "",
                    filterNineGridBox: ""
                });
                this.flDepartmentData = []
                this.flUnitData = [];
                this.flSupervisorData = [];
                this.flStaffIdData = [];
                this.setPage(1);
                this.loading = false;
                this.showTable = false;
                this.depSearchClicked = false;
                this.unitSearchClicked = false;
                this.supvSearchClicked = false;

                this.filterForm.patchValue({
                  filterState: null,
                  filterLob: null,
                  filterDepartment: null,
                  filterUnit: null,
                  filterSupervisor: null,
                  filterStaffId: null,
                  filterBand: null,
                  filterNineGridBox: null
                  });
                }
            
                this._POST_api_Service.POST_TC_data(tcmVars.postCalibrateListFilters, dataPost).subscribe(dataPost => {
                  this.filteredData = dataPost;
                  console.log('filteredData', this.filteredData)
                 
                  if (this.filteredData.length) {
                    console.log('filtered data (true)', this.filteredData);
                    this.loading = false;
                    this.empty = false;
                    this.showTable = true;
                    this.showInfo = false;
                    this.showEmpDetail = false;
                    this.setPage(1);
            
                    if (viewTeam === 'on') {
                      this.getNineGridFilter();
                     
                    }
                  } else {
                    console.log('filtered data (false)', this.filteredData);
                    this.loading = false;
                    this.empty = true;
                  }
                },
                error => {
                  console.log('[ERROR] Fail to submit filter: ' + error);
                 
                }); 
              }
            
              // Get info info employee (when click on eye icon)
              employeeDetailId;
              employeeDetailStaffNo;
              showPlaceNineGridEmp;
              placeNineGrid;
              infoCalibrationEmp(emp) {
                this.loading = true;
                this.employeeDetailId = emp.id;
                this.employeeDetailStaffNo = emp.staff_no;
            
                if (emp.cell_cal_gm) {
                  this.placeNineGrid = emp.cell_cal_gm;
                } else if (emp.cell_cal_mgr) {
                  this.placeNineGrid = emp.cell_cal_mgr;
                } else if (emp.cell_ass) {
                  this.placeNineGrid = emp.cell_ass;
                } else {
                  this.placeNineGrid = "0";
                }
            
                console.log('placeNineGrid', this.placeNineGrid);
            
                console.log('the employee id to get calibration detail', this.employeeDetailId);
                console.log('the employee staff no to get calibration detail', this.employeeDetailStaffNo);
            
                this._GET_api_Service.GET_data_withID(tcmVars.getInfoEmployeeForCalibration + '?id=' + this.employeeDetailId).subscribe(data => {
                  this.infoForCalibration = data;
                  console.log('detail of employee for calibration', this.infoForCalibration);
                  if (this.infoForCalibration) {
                    this.loading = false;
                    this.empty = false;
                    this.showEmpDetail = true;
                    this.showInfo = false;
                    this.showTable = false;
                    this.basicDetailEmpInfo();
                  }
                },
                error => {
                  console.log('[ERROR Fail to get detail of user for calibration: ' + error);
                });
              }
            
              // back to search table
              backToSearchTable() {
                this.showTable = true;
                this.showEmpDetail = false;
              }
            
              // submit the filter and get 9 frid box
              getNineGridFilter() {
                this.loading = true;
                let dataPost = {
                  state: this.filterForm.get('filterState').value,
                  lob: this.filterForm.get('filterLob').value,
                  department: this.filterForm.get('filterDepartment').value,
                  unit: this.filterForm.get('filterUnit').value,
                  supervisor: this.filterForm.get('filterSupervisor').value,
                  staff_id: this.filterForm.get('filterStaffId').value,
                  band: this.filterForm.get('filterBand').value,
                  n_grid_box: this.filterForm.get('filterNineGridBox').value
                }
            
                this._POST_api_Service.POST_TC_data(tcmVars.postGetNineGridBoxFilter, dataPost).subscribe(dataPost => {
                  this.nineBoxFilteredData = dataPost;
            
                  if (this.nineBoxFilteredData.length) {
                    console.log('to show 9 grid data (true)', this.nineBoxFilteredData);
                    this.empty = false;
                    this.loading = false;
                    this.showTable = false;
                    this.showInfo = true;
                    this.showEmpDetail = false;
                  } else {
                    console.log('to show 9 grid data (false)', this.nineBoxFilteredData);
                    this.loading = false;
                    this.empty = true;
                  } 
                },
                error => {
                  console.log('[ERROR] Fail to get 9 grid box after filter: ' + error);
                });
              }
            
              // get detail of employee at 4 tab
              BasicDetailOfEmployee;
              showFourTab = false;
              basicDetailEmpInfo() {
                this.loading = true;
                let dataPost = {
                  staff_id: this.employeeDetailStaffNo
                }
            
                this._POST_api_Service.POST_TC_data(tcmVars.postGetDetailBasicInfo, dataPost).subscribe(dataPost => {
                  this.BasicDetailOfEmployee = dataPost;
                  console.log('get emp detail of basic info', this.BasicDetailOfEmployee);
                  if (this.BasicDetailOfEmployee) {
                    this.showFourTab = true;
                    this.loading = false;
                    this.getImgOpt();
                  } else {
                    this.loading = false;
                    this.empty = true;
                  }
                },
                error => {
                  console.log('[ERROR] Fail to get basic info detail of employee: ' + error);
                })
              }
            
              // get image
              profileImg;
              imgOptArrList;
              getImgOpt() {
                this.loading = true;
                let imgUrl = GlobalVariable.BASE_API_URL + '/get/image' + "/" + this.BasicDetailOfEmployee.personalInfo[0].image_url + "?api_key=" + GlobalVariable.API_KEY;
            
                this._GET_api_Service.GET_PictureByUrl(imgUrl).subscribe(data => {
                    if(data){
                      this.imgOptArrList = GlobalVariable.BASE_API_URL + tcmVars.getImg + "/" + this.BasicDetailOfEmployee.personalInfo[0].image_url + "?api_key=" + GlobalVariable.API_KEY;
                    } else {
                      this.imgOptArrList = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                    }
            
                    this.profileImg = this.imgOptArrList;
                    this.loading = false;
                },
                error => {
                  console.log('[ERROR] Fail to get image: ' + error);
                  this.imgOptArrList = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                  this.profileImg = this.imgOptArrList;
                  console.log('[ERROR Get Image]' + error); 
                  this.loading = false;
                });
              }
            
              // to show the number at 9 grid box
              getCellNum(num) {
                let index = this.nineBoxFilteredData.findIndex(item => + item.cell === num)
                return index >= 0 ? this.nineBoxFilteredData[index].number: 0;
              }
            
              

              // revert status
              subRevertName;
              subRevertId;
              revertModal(emp, type) {
                this.subRevertName = emp.name;
                this.subRevertId = emp.id;
                console.log('subrevertname', this.subRevertName)
                console.log('subrevertid', this.subRevertId);
                if (this.subRevertName) {

                  if (type === 'frmMgr') {
                    $('#confirmation-revert-frm-Mgr').click();
                  } else if (type === 'frmGm') {
                    $('#confirmation-revert-frm-Gm').click();
                  } else if (type === 'frmEvp') {
                    $('#confirmation-revert-frm-Evp').click();
                  }
                }
              }

  
              revertFromMgr() {
                this.loading = true;
                this._POST_api_Service.POST_IDP_data(tcmVars.postRevertFromMgr, { id: this.subRevertId }).subscribe(dataRes => {
                  if (dataRes.status === 'OK') {
                    this.submitFilter(1, 'off');
                    this.loading = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot revert ' + error);
                })
              }

              revertFromGm() {
                this.loading = true;
                this._POST_api_Service.POST_IDP_data(tcmVars.postRevertFromGm, { id: this.subRevertId }).subscribe(dataRes => {
                  if (dataRes.status === 'OK') {
                    this.submitFilter(1, 'off');
                    this.loading = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot revert ' + error);
                })
              }

              revertFromEvp() {
                this.loading = true;
                this._POST_api_Service.POST_IDP_data(tcmVars.postRevertFromEvp, { id: this.subRevertId }).subscribe(dataRes => {
                  if (dataRes.status === 'OK') {
                    this.submitFilter(1, 'off');
                    this.loading = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot revert ' + error);
                })
              }
            
              // open modal for calibrate GM
              employeeDetailName;
              employeeDetailAss;
              employeeDetailCalMgr;
              employeeDetailCalGm;
              editCalibrateGm(emp) {
                this.loading = true;
                this.showCalEvpBtn = false;
                this.employeeDetailId = emp.id;
                this.employeeDetailStaffNo = emp.staff_no;
                this.employeeDetailAss = emp.cell_ass;
                this.employeeDetailName = emp.name;
                this.employeeDetailCalMgr = emp.cell_cal_mgr;
                this.employeeDetailCalGm = emp.cell_cal_gm;
                if (this.employeeDetailName) {
                  if (this.employeeDetailCalGm) {
                    this.calibrateForm.patchValue({ tcIdNew: this.employeeDetailCalGm })
                  } else {
                    this.calibrateForm.patchValue({ tcIdNew: this.employeeDetailCalMgr })
                  }
                  this.showCalGmBtn = true;
                  $('#calibrate-for-gm').click();
                  this.loading = false;
                } else {
                  console.log('[ERROR] employee detail name undefined');
                }
              }
            
              // open modal for calibrate EVP
              employeeDetailCalEvp;
              editCalibrateEvp(emp) {
                this.loading = true;
                this.showCalGmBtn = false;
                this.employeeDetailId = emp.id;
                this.employeeDetailStaffNo = emp.staff_no;
                this.employeeDetailAss = emp.cell_ass;
                this.employeeDetailCalMgr = emp.cell_cal_mgr;
                this.employeeDetailName = emp.name;
                this.employeeDetailCalGm = emp.cell_cal_gm;
                this.employeeDetailCalEvp = emp.cell_cal_evp;
                if (this.employeeDetailName) {
                  if (this.employeeDetailCalEvp) {
                    this.calibrateForm.patchValue({ tcIdNew: this.employeeDetailCalEvp })
                  } else {
                    this.calibrateForm.patchValue({ tcIdNew: this.employeeDetailCalGm })
                  }
                  this.showCalEvpBtn = true;
                  $('#calibrate-for-gm').click();
                  this.loading = false;
                } else {
                  console.log('[ERROR] employee detail name undefined');
                }
              }
            
              // calibrate GM
              calibrateFormSave(type) {
                this.loading = true;
            
                let postData = {
                  id: this.employeeDetailId,
                  tcIdNew: this.calibrateForm.get('tcIdNew').value,
                  justification: this.calibrateForm.get('justification').value,
                  roleLevel: type
                }  
                console.log ("postData", postData);
                this._POST_api_Service.POST_IDP_data(tcmVars.postCalibrateGm, postData).subscribe(dataRes => {
                  if (dataRes.status === 'OK') {
                    this.submitFilter(1, 'off');
                    this.showCalEvpBtn = false;
                    this.showCalGmBtn = false;
                    if (type === 2) {
                      this.getHistoryCal(2);
                    } else if (type === 3) {
                      this.getHistoryCal(3);
                    }
                  }
                  console.log ("dataRes", dataRes);
                },
                error => {
                  console.log('[ERROR Fail to change talent location]' + error);
                });
              }
            
               // after calibrate to show the history (URS 2.2)
               historyDataAfterCal = {};
               getHistoryCal(type) {
                this._GET_api_Service.GET_data_withID(tcmVars.getHistoryAfterCalibrate + '?id=' + this.employeeDetailId + '&roleLevel=' + type).subscribe(data => {
                  this.historyDataAfterCal = data[0]
                  console.log(this.historyDataAfterCal);
                  if (this.historyDataAfterCal) {
                    $('#calibrate-history').click();
                    this.loading = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot get the data after calibrate history ' + error);
                })
              }
            
              // open modal confirmation before submit calibration
              submitEvpMsg = false;
              submitCompleteMsg = false;
              openModalSubmit(type) {
                if (type === 'evpSubmit') {
                  this.submitEvpMsg = true;
                  this.submitCompleteMsg = false;
                  $('#submit-calibration-hcbd').click();
                } else if (type === 'complete') {
                  this.submitCompleteMsg = true;
                  this.submitEvpMsg = false;
                  $('#submit-calibration-hcbd').click();
                }
              }
            
              // submit calibrate to EVP if GM and Complete process if EVP
              submitCalibrate(type) {
                this.loading = true;
                let postData = {
                  roleLevel: type,
                  filter: [
                    {
                      state: this.filterForm.get('filterState').value,
                      lob: this.filterForm.get('filterLob').value,
                      department: this.filterForm.get('filterDepartment').value,
                      unit: this.filterForm.get('filterUnit').value,
                      supervisor: this.filterForm.get('filterSupervisor').value,
                      staff_id: this.filterForm.get('filterStaffId').value,
                      band: this.filterForm.get('filterBand').value,
                      n_grid_box: this.filterForm.get('filterNineGridBox').value
                    }
                  ]
                }
            
                this._POST_api_Service.POST_TC_data(tcmVars.postSubmitCalibrateGmEvp, postData).subscribe(dataRes => {
                  if (dataRes.status === 'OK') {
                    this.loading = false;
                    this.submitFilter(1, 'off');
                    this.submitCompleteMsg = false;
                    this.submitEvpMsg = false;
                  }
                },
                error => {
                  console.log('[ERROR] cannot submit calibrate' + error);
                })
              }
            
              // to get data when click particular at 1 box at 9 grid box
              particlarBoxData;
              nameOfCell;
              particularBox(box, name) {
                let filterAll = {
                  state: this.filterForm.get('filterState').value,
                  // lob: this.flLobUserData.lob,
                  lob: this.filterForm.get('filterLob').value,
                  department: this.filterForm.get('filterDepartment').value,
                  unit: this.filterForm.get('filterUnit').value,
                  supervisor: this.filterForm.get('filterSupervisor').value,
                  staff_id: this.filterForm.get('filterStaffId').value,
                  band: this.filterForm.get('filterBand').value,
                  n_grid_box: this.filterForm.get('filterNineGridBox').value
                }
            
                let postData = {
                  cell: box,
                  filter: [ filterAll ]
                }
            
                this._POST_api_Service.POST_TC_data(tcmVars.postGetParticularCellNGridBox, postData).subscribe(dataRes => {
                  this.particlarBoxData = dataRes;
                  console.log(this.particlarBoxData);
            
                  if (this.particlarBoxData) {
                    this.nameOfCell = name;
                    $('#particular-box').click();
                  }
                },
                error => {
                  console.log('[ERROR] cannot get the particular box cell: ' + error);
                })  
              }

              pager: any = {}; pagedItems: any[];
              setPage(page: number) {
                // get pager object from service
                this.pager = this.pagerService.getPager(this.filteredData.length, page, this.pageSize);
                // get current page of items
                this.pagedItems = this.filteredData.slice(this.pager.startIndex, this.pager.endIndex + 1);
              }

        }
            
            
            