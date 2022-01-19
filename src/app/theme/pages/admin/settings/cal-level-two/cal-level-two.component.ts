import { Component, OnInit } from '@angular/core';
import { CLTVars } from './cal-level-two-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { data, post } from 'jquery';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cal-level-two',
  templateUrl: './cal-level-two.component.html',
  styleUrls: ['./cal-level-two.component.css']
})
export class CalLevelTwoComponent implements OnInit {

  title1 = CLTVars.title1;
  title2 = CLTVars.title2;

  filteredData = [];

  infoForCalibration;

  showNineGridTab = false;
  empty = true;
  showTable = false;
  showEmpDetail = false;
  loading = true;
  loadingFl = true;
  showCalGmBtn = false;
  showCalEvpBtn = false;
  selectDeptMult = false;
  selectUnitMult = false;
  selectSupvMult = false;
  selectStfIdMult = false;

  showInputDept = true;

  unitSearchClicked = false;

  filterComponent = ['All']

  filterForm: FormGroup;
  calibrateForm: FormGroup;
  narrowFilterForm: FormGroup;
  
  showTC = false;
  downloadAll = false;

    
  constructor(
    private router:Router, 
    private _GET_api_Service: GET_Service, 
    private _POST_api_Service: POST_Service,
    private datePipe: DatePipe
    ) { }

  ngOnInit() {
    this.checkLevel();
    this.flGetState();
    this.flGetBand();
    this.flGetNGridBox();
    this.boxMatrix();
    
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

  // check role 
  checkLevel() {
    let userRole = JSON.parse(localStorage.getItem('currentUser')).job_role;
    if (userRole) {
      let roleArr = userRole.split(",");
      for (let i = 0; i < roleArr.length; i++) {
        if (roleArr[i] === '6') {
          this.showTC = true;
        }
      }
    }
    this.toCallLob();
    localStorage.setItem('talentRole', JSON.stringify(this.showTC)); // to save role
  }

  toCallLob() {
    if (this.showTC === true) {
      this.flGetLobTC();
    } else {
      this.flGetLob();
    }
  }

  // input click
  outsideDept() {
    if (this.selectUnitMult === true) {
      this.selectUnitMult = true;
    } else if (this.selectSupvMult === true) {
      this.selectSupvMult = true;
    } else if (this.selectStfIdMult === true) {
      this.selectStfIdMult = true;
    } else {
      this.closeDropdownFilter() 
    }
  }

  outsideUnit() {
    if (this.selectDeptMult === true) {
      this.selectDeptMult = true;
    } else if (this.selectSupvMult === true) {
      this.selectSupvMult = true;
    } else if (this.selectStfIdMult === true) {
      this.selectStfIdMult = true;
    } else {
      this.closeDropdownFilter() 
    }
  }

  outsideSupv() {
    if (this.selectDeptMult === true) {
      this.selectDeptMult = true;
    } else if (this.selectUnitMult === true) {
      this.selectUnitMult = true;
    } else if (this.selectStfIdMult === true) {
      this.selectStfIdMult = true;
    } else {
      this.closeDropdownFilter() 
    }
  }

  outsideStaffId() {
    if (this.selectDeptMult === true) {
      this.selectDeptMult = true;
    } else if (this.selectUnitMult === true) {
      this.selectUnitMult = true;
    } else if (this.selectSupvMult === true) {
      this.selectSupvMult = true;
    } else {
      this.closeDropdownFilter() 
    }
  }

  inputDeptClick() {
    this.selectDeptMult = true;
    this.selectUnitMult = false;
    this.selectSupvMult = false;
    this.selectStfIdMult = false;
  }
  inputUnitClick() {
    this.selectDeptMult = false;
    this.selectUnitMult = true;
    this.selectSupvMult = false;
    this.selectStfIdMult = false;
    this.unitSearchClicked = true;
  }
  inputSupvClick() {
    this.selectDeptMult = false;
    this.selectUnitMult = false;
    this.selectSupvMult = true;
    this.selectStfIdMult = false;
  }
  inputStaffIdClick() {
    this.selectDeptMult = false;
    this.selectUnitMult = false;
    this.selectSupvMult = false;
    this.selectStfIdMult = true;
  }

  // show choose dropdown
  dataGetFlDept;
  dataGetFlUnit;
  dataGetFlSupv;
  dataGetFlStId;
  dataGetFlSupvPersNo;

  getFlDept(emp) {
    this.dataGetFlDept = emp.org_unit_desc;
  }
  getFlUnit(emp) {
    this.dataGetFlUnit = emp.sub_org_desc;
  }
  getFlSupv(emp) {
    this.dataGetFlSupv = emp.search;
    this.dataGetFlSupvPersNo = emp.pers_no;
    this.filterComponent[0] = this.dataGetFlSupv;
  }
  getFlStId(emp) {
    this.dataGetFlStId = emp.search;
  }

  // close dropdown
  closeDropdownFilter() {
    this.selectDeptMult = false;
    this.selectUnitMult = false;
    this.selectSupvMult = false;
    this.selectStfIdMult = false;
  }
  
  // filter by state
  flStateData = []
  flGetState() {
    this._GET_api_Service.GET_TC_DATA(CLTVars.getFilterByState).subscribe(dataRes => {
      this.flStateData = dataRes.state;
    },
    error => {
      console.log('[ERROR] cannot get filer state ' + error);
    })
  }

  // filter by lob
  flLobData = []
  flGetLob() {
    this.closeDropdownFilter();
    this._GET_api_Service.GET_TC_DATA(CLTVars.getFilterByLob).subscribe(dataRes => {
      this.flLobData = dataRes.default;
     
      if (this.flLobData) {

        this.filterForm.setValue({
          filterState: null,
          filterLob: this.flLobData[0].lob,
          filterDepartment: null,
          filterUnit: null,
          filterSupervisor: null,
          filterStaffId: null,
          filterBand: null,
          filterNineGridBox: null
        });

        this.flGetDepartment();
        this.loading = false;
        this.loadingFl = false;
       }
    },
    error => {
      console.log('[ERROR] cannot get filter lob ' + error);
    });
  }

  // Azrina add 24/8/2020
  flLobDataTC = []
  flGetLobTC() {
      this.closeDropdownFilter();
      this._GET_api_Service.GET_TC_DATA(CLTVars.getFilterByLob).subscribe(dataRes => {
      if (dataRes.lob.length === 0) {
        this.flLobDataTC = dataRes.default;
      } else {
        this.flLobDataTC = dataRes.lob;
      }
      
      if (this.flLobDataTC) {

        this.filterForm.setValue({
          filterState: null,
          filterLob: this.flLobDataTC[0].lob,
          filterDepartment: null,
          filterUnit: null,
          filterSupervisor: null,
          filterStaffId: null,
          filterBand: null,
          filterNineGridBox: null
        });

        this.flGetDepartment();
        this.loading = false;
        this.loadingFl = false;
      }
    },
    error => {
      console.log('[ERROR] cannot get filter lob ' + error);
    });
  }


  // filter by department
  flDepartmentData = [];
  flGetDepartment() {
    this._GET_api_Service.GET_data_withID(CLTVars.getFilterByDepartment + '?lob=' + this.filterForm.get('filterLob').value).subscribe(dataRes => {
      this.flDepartmentData = dataRes.department;
    },
    error => {
      console.log('[ERROR] cannot get filter department ' + error);
    });
  }

  // filter by unit
  flUnitData = [];
  flGetUnit() {
    this.showInputDept = false;
    this.closeDropdownFilter();
    this._GET_api_Service.GET_data_withID(CLTVars.getFilterByUnit + '?dept=' + this.filterForm.get('filterDepartment').value).subscribe(dataRes => {
      this.flUnitData = dataRes.unit;
    },
    error => {
      console.log('[ERROR] cannot get filter unit ' + error);
    });
  }

  // filter by supervisor
  flSupervisorData = [];
  nullSV = false;
  flGetSupervisor(e) {
    if (e.length > 2) {
      this.nullSV = false;
      this._POST_api_Service.POST_IDP_data(CLTVars.postGetSupervisor, { text: e }).subscribe(dataRes => {
        this.flSupervisorData = dataRes;
      });
    } else {
      this.flSupervisorData = [];
      this.nullSV = true;
    }
  }

  // filter by employee (before is Staff Id)
  flEmployeeData = [];
  nullEmp = false;
  flGetEmployee(e) {
    if (e.length > 2) {
      this.nullEmp = false;
      this._POST_api_Service.POST_IDP_data(CLTVars.postGetStaffId, { text: e }).subscribe(dataRes => {
        this.flEmployeeData = dataRes;
      })
    } else {
      this.flEmployeeData = [];
      this.nullEmp = true;

    }
  }
  // filter by band
  flBandData = [];
  flGetBand() {
    this._GET_api_Service.GET_TC_DATA(CLTVars.getFilterByBand).subscribe(dataRes => {
      this.flBandData = dataRes.band;
    },
    error => {
      console.log('[ERROR] cannot get filter band ' + error);
    });
  }

  // filter by nine grid box
  flNineGridBoxData = [];
  flGetNGridBox() {
    this._GET_api_Service.GET_TC_DATA(CLTVars.getFilterByNGridBox).subscribe(dataRes => {
      this.flNineGridBoxData = dataRes.n_grid_box;
    },
    error => {
      console.log('[ERROR] cannot get filter nine grid box ' + error);
    });
  }
  
  // reset all
  submitResetAll() {
    if (this.showTC === true) {
      this.filterForm.setValue({
        filterState: null,
        filterLob: this.flLobDataTC[0].lob,
        filterDepartment: null,
        filterUnit: null,
        filterSupervisor: null,
        filterStaffId: null,
        filterBand: null,
        filterNineGridBox: null
      });
    } else {
      this.filterForm.setValue({
        filterState: null,
        filterLob: this.flLobData[0].lob,
        filterDepartment: null,
        filterUnit: null,
        filterSupervisor: null,
        filterStaffId: null,
        filterBand: null,
        filterNineGridBox: null
      });
    }

    this.flUnitData = [];
    // this.flStaffIdData = [];

    this.dataGetFlDept = '';
    this.dataGetFlUnit = '';
    this.dataGetFlSupv = '';
    this.dataGetFlStId = '';

    this.filterComponent = ['All'] // [0]=supervisor
    localStorage.setItem('filterComponent', JSON.stringify(this.filterComponent)); // to save filtered data component at local 
  
    this.empty = true;
  }

  // submit the filter
  filterVals;
  viewFrom;
  ableBtnEvp = false;
  ableBtnComp = false;
  submitFilter(viewTeam, viewType) { // viewTeam = [0: to open 9 grid new window, 1: not open new window]; viewType = ['hcbd': view from TalentHCBD, 'tcm': view from TalentMGMT]
    this.loadingFl = true;
    this.ableBtnEvp = false;
    this.ableBtnComp = false;
    this.unitSearchClicked = false;
    this.closeDropdownFilter();

    if (this.nullSV === true && this.nullEmp === false) {
      this.filterVals = {
        state: this.filterForm.get('filterState').value,
        lob: this.filterForm.get('filterLob').value,
        department: this.filterForm.get('filterDepartment').value,
        unit: this.filterForm.get('filterUnit').value,
        supervisor: null,
        staff_id: this.filterForm.get('filterStaffId').value,
        band: this.filterForm.get('filterBand').value,
        n_grid_box: this.filterForm.get('filterNineGridBox').value
      }
    } else if (this.nullEmp === true && this.nullSV === false) {
      this.filterVals = {
        state: this.filterForm.get('filterState').value,
        lob: this.filterForm.get('filterLob').value,
        department: this.filterForm.get('filterDepartment').value,
        unit: this.filterForm.get('filterUnit').value,
        supervisor: this.filterForm.get('filterSupervisor').value,
        staff_id: null,
        band: this.filterForm.get('filterBand').value,
        n_grid_box: this.filterForm.get('filterNineGridBox').value
      }
    } else if (this.nullSV === true && this.nullEmp === true) {
      this.filterVals = {
        state: this.filterForm.get('filterState').value,
        lob: this.filterForm.get('filterLob').value,
        department: this.filterForm.get('filterDepartment').value,
        unit: this.filterForm.get('filterUnit').value,
        supervisor: null,
        staff_id: null,
        band: this.filterForm.get('filterBand').value,
        n_grid_box: this.filterForm.get('filterNineGridBox').value
      }
    } else {
      this.filterVals = {
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

    localStorage.setItem('filterVals', JSON.stringify(this.filterVals)); // to save filtered values at local 
    localStorage.setItem('filterComponent', JSON.stringify(this.filterComponent)); // to save filtered data component at local 

    if (viewType === 'hcbd') {
      this.viewFrom = CLTVars.postCalibrateListFiltersfrmHCBD;
    } else if (viewType === 'tcm') {
      this.viewFrom =  CLTVars.postCalibrateListFiltersfrmTCM;
    } 

    this._POST_api_Service.POST_TC_data(this.viewFrom, this.filterVals).subscribe(result => {
      localStorage.setItem('filteredData', JSON.stringify(result)); // to save filtered results at local storage
      this.filteredData = result;
      this.postDownloadCalReport();

      if (this.filteredData.length > 0) {
        this.getFilteredDataImg();
        this.loadingFl = false;
        this.empty = false;
        this.showTable = true;
        this.showEmpDetail = false;

        if (viewTeam === 1) {
          window.open('/admin/settings/view-team', '', 'width=1024,height=900')
        }

        let ableEvp = this.filteredData.findIndex(item => item.state_id === 5 || item.state_id === 6);
        let ableComp = this.filteredData.findIndex(item => item.state_id === 7 || item.state_id === 8);
        if (ableEvp >= 0) {
          this.ableBtnEvp = true;
        } else {
          this.ableBtnEvp = false;
        }
        if (ableComp >= 0 ) {
          this.ableBtnComp = true;
        } else {
          this.ableBtnComp = false;
        }
               
      } else {
        this.loadingFl = false;
        this.empty = true;
      }
    },
    error => {
      console.log('[ERROR] Fail to submit filter: ' + error);
    }); 
    
    this.getNineGridFilter();
  }

    // get filtered data with image
  getFilteredDataImg() {
    for (let i= 0; i < this.filteredData.length; i++) {
      let subImg = GlobalVariable.BASE_API_URL + '/get/image' + "/" + this.filteredData[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
      let defaultImg = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';

      this._GET_api_Service.GET_PictureByUrl(subImg).subscribe(data => {
        if (data) {
          this.filteredData[i].image_url = subImg;
        } else {
          this.filteredData[i].image_url = defaultImg;
        }
        localStorage.setItem('filteredData', JSON.stringify(this.filteredData)); // to save filtered results with image at local storage

      }, error => {
        this.filteredData[i].image_url = defaultImg;
        localStorage.setItem('filteredData', JSON.stringify(this.filteredData)); // to save filtered results with image at local storage
      })

    }
  }

  // submit the filter and get 9 grid box
  nineBoxFilteredData = [];
  viewFromNGrid;
  getNineGridFilter() {
    if (this.showTC === true) {
      this.viewFromNGrid =  CLTVars.postGetNineGridBoxFilterfrmTCM;
    } else if (this.showTC === false) {
      this.viewFromNGrid = CLTVars.postGetNineGridBoxFilterfrmHCBD;
    } 

    this._POST_api_Service.POST_TC_data(this.viewFromNGrid, this.filterVals).subscribe(dataPost => {
      localStorage.setItem('nineBoxFilteredData', JSON.stringify(dataPost)); // to save nine grid result num at local storage
      this.nineBoxFilteredData = dataPost; 

      if (this.nineBoxFilteredData.length) {
      } 
    },
    error => {
      console.log('[ERROR] Fail to get 9 grid box after filter: ' + error);
    });
  }

  // Get info info employee (when click on eye icon)
  employeeDetailId;
  employeeDetailStaffNo;
  showPlaceNineGridEmp;
  placeNineGrid;
  infoCalibrationEmp(emp) {
    this.loadingFl = true;
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

    this._GET_api_Service.GET_data_withID(CLTVars.getInfoEmployeeForCalibration + '?id=' + this.employeeDetailId).subscribe(data => {
      this.infoForCalibration = data;

      if (this.infoForCalibration) {
        this.loadingFl = false;
        this.empty = false;
        this.showEmpDetail = true;
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

  // get detail of employee at 4 tab
  basicDetailOfEmployee;
  showFourTab = false;
  basicDetailEmpInfo() {
    this.loadingFl = true;
    let dataPost = {
      staff_id: this.employeeDetailStaffNo
    }

    this._POST_api_Service.POST_TC_data(CLTVars.postGetDetailBasicInfo, dataPost).subscribe(dataPost => {
      this.basicDetailOfEmployee = dataPost;
      
      if (this.basicDetailOfEmployee) {
        this.showFourTab = true;
        this.loadingFl = false;
        this.getImgOpt();
      } else {
        this.loadingFl = false;
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
    this.loadingFl = true;
    let imgUrl = GlobalVariable.BASE_API_URL + '/get/image' + "/" + this.basicDetailOfEmployee.personalInfo[0].image_url + "?api_key=" + GlobalVariable.API_KEY;

    this._GET_api_Service.GET_PictureByUrl(imgUrl).subscribe(data => {
        if(data){
          this.imgOptArrList = GlobalVariable.BASE_API_URL + CLTVars.getImg + "/" + this.basicDetailOfEmployee.personalInfo[0].image_url + "?api_key=" + GlobalVariable.API_KEY;
        } else {
          this.imgOptArrList = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
        }

        this.profileImg = this.imgOptArrList;
        this.loadingFl = false;
    },
    error => {
      this.imgOptArrList = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
      this.profileImg = this.imgOptArrList;
      this.loadingFl = false;
    });
  }

  // revert to supervisor
  subRevertName;
  subRevertId;
  revertModal(emp, type) {
    this.subRevertName = emp.name;
    this.subRevertId = emp.id;
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

  revertBtn(revertToState) {
    if (revertToState === 3) {
      this.revertFrmMGR();
    } else if (revertToState === 5) {
      this.revertFrmGM();
    } else if (revertToState === 7) {
      this.revertFrmMEVP();
    } 
  }
  revertFrmMGR() {
    this.loadingFl = true;
    this._POST_api_Service.POST_IDP_data(CLTVars.postRevertFromMgr, { id: this.subRevertId }).subscribe(dataRes => {
      if (dataRes.status === 'OK') {
        if (this.showTC === true) {
          this.submitFilter(0, 'tcm');
        } else {
          this.submitFilter(0, 'hcbd');
        }
      }
    },
    error => {
      console.log('[ERROR] cannot revert ' + error);
    })
  }  
  
  revertFrmGM() {
    this.loadingFl = true;
    this._POST_api_Service.POST_IDP_data(CLTVars.postRevertFromGM, { id: this.subRevertId }).subscribe(dataRes => {
      if (dataRes.status === 'OK') {
        if (this.showTC === true) {
          this.submitFilter(0, 'tcm');
        } else {
          this.submitFilter(0, 'hcbd');
        }
      }
    },
    error => {
      console.log('[ERROR] cannot revert ' + error);
    })
  }

  revertFrmMEVP() {
    this.loadingFl = true;
    this._POST_api_Service.POST_IDP_data(CLTVars.postRevertFromEvp, { id: this.subRevertId }).subscribe(dataRes => {
      if (dataRes.status === 'OK') {
        if (this.showTC === true) {
          this.submitFilter(0, 'tcm');
        } else {
          this.submitFilter(0, 'hcbd');
        }
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
  employeeDetailTalentName;
  employeeDetailCalTalentName;
  modalCalibrateTitle;
  editCalibrateGm(emp) {
    this.loadingFl = true;
    this.showCalEvpBtn = false;
    this.employeeDetailId = emp.id;
    this.employeeDetailStaffNo = emp.staff_no;
    this.employeeDetailAss = emp.cell_ass;
    this.employeeDetailName = emp.name;
    this.employeeDetailTalentName = emp.name_ass;
    this.employeeDetailCalMgr = emp.cell_cal_mgr;
    this.employeeDetailCalGm = emp.cell_cal_gm;
    this.employeeDetailCalTalentName = emp.name_cal_mgr;
    this.modalCalibrateTitle = "GENERAL MANAGER CALIBRATION";
    if (this.employeeDetailName) {
      if (this.employeeDetailCalGm) {
        let boxIndex = this.boxMatricData.findIndex(item => item.cell === this.employeeDetailCalGm);
        if (boxIndex >= 0) {
          this.calibrateForm.patchValue({ tcIdNew: this.boxMatricData[boxIndex].id })
        }
      } else {
        let boxIndex = this.boxMatricData.findIndex(item => item.cell === this.employeeDetailCalMgr);
        if (boxIndex >= 0) {
          this.calibrateForm.patchValue({ tcIdNew: this.boxMatricData[boxIndex].id })
        }
      }
      this.showCalGmBtn = true;
      $('#calibrate-for-gm').click();
      this.loadingFl = false;
    } else {
      console.log('[ERROR] employee detail name undefined');
    }
  }

  // open modal for calibrate EVP
  employeeDetailCalEvp;
  editCalibrateEvp(emp) {
    this.loadingFl = true;
    this.showCalGmBtn = false;
    this.employeeDetailId = emp.id;
    this.employeeDetailStaffNo = emp.staff_no;
    this.employeeDetailAss = emp.cell_ass;
    this.employeeDetailCalMgr = emp.cell_cal_mgr;
    this.employeeDetailName = emp.name;
    this.employeeDetailCalGm = emp.cell_cal_gm;
    this.employeeDetailCalEvp = emp.cell_cal_evp;
    this.employeeDetailTalentName = emp.name_ass;
    this.employeeDetailCalTalentName = emp.name_cal_mgr;
    this.modalCalibrateTitle = "EVP/CHIEF/HEAD CALIBRATION";
    if (this.employeeDetailName) {
      if (this.employeeDetailCalEvp) {
        let boxIndex = this.boxMatricData.findIndex(item => item.cell === this.employeeDetailCalEvp);
        if (boxIndex >= 0) {
          this.calibrateForm.patchValue({ tcIdNew: this.boxMatricData[boxIndex].id })
        }
      } else {
        let boxIndex = this.boxMatricData.findIndex(item => item.cell === this.employeeDetailCalGm);
        if (boxIndex >= 0) {
          this.calibrateForm.patchValue({ tcIdNew: this.boxMatricData[boxIndex].id })
        }
      }
      this.showCalEvpBtn = true;
      $('#calibrate-for-gm').click();
      this.loadingFl = false;
    } else {
      console.log('[ERROR] employee detail name undefined');
    }
  }

  // get box matrix
  boxMatricData;
  boxMatrix() {
    this._GET_api_Service.GET_TC_DATA(CLTVars.getNineBoxList).subscribe(data => {
      this.boxMatricData = data;
    },
    error => {
      console.log('[ERROR] cannot get nine box list ' + error);
    })
  }

  // calibrate GM
  modalHistoryName;
  calibrateFormSave(type) {
    this.loadingFl = true;

    let postData = {
      id: this.employeeDetailId,
      tcIdNew: this.calibrateForm.get('tcIdNew').value,
      justification: this.calibrateForm.get('justification').value,
      roleLevel: type
    }  

    this._POST_api_Service.POST_IDP_data(CLTVars.postCalibrateGm, postData).subscribe(dataRes => {
      if (dataRes.status === 'OK') {
        if (this.showTC === true) {
          this.submitFilter(0, 'tcm');
        } else {
          this.submitFilter(0, 'hcbd');
        }
        this.calibrateForm.reset();
        this.showCalEvpBtn = false;
        this.showCalGmBtn = false;
        
        if (type === 2) {
          this.getHistoryCal(2);
          this.modalHistoryName = "General Manager Calibration Result";
        } else if (type === 3) {
          this.getHistoryCal(3);
          this.modalHistoryName = "EVP/Chief/Head Calibration Result";
        }
      }
    },
    error => {
      console.log('[ERROR Fail to change talent location]' + error);
    });
  }

   // after calibrate to show the history (URS 2.2)
   historyDataAfterCal = {};
   getHistoryCal(type) {
    this._GET_api_Service.GET_data_withID(CLTVars.getHistoryAfterCalibrate + '?id=' + this.employeeDetailId + '&roleLevel=' + type).subscribe(data => {
      this.historyDataAfterCal = data[0]
      if (this.historyDataAfterCal) {
        $('#calibrate-history').click();
        this.loadingFl = false;
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
    let showEvp = this.filteredData.findIndex(item => item.state_id === 5 || item.state_id === 6);
    let showComp = this.filteredData.findIndex(item => item.state_id === 7 || item.state_id === 8);
    if (showEvp >= 0 && type === 'evpSubmit') {
      this.submitEvpMsg = true;
      this.submitCompleteMsg = false;
      $('#submit-calibration-hcbd').click();
    } else if (showComp >= 0 && type === 'complete') {
      this.submitCompleteMsg = true;
      this.submitEvpMsg = false;
      $('#submit-calibration-hcbd').click();
    } 
  }

  // submit calibrate to EVP if GM and Complete process if EVP
  submitCalibrate(type) {
    this.loadingFl = true;
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

    this._POST_api_Service.POST_TC_data(CLTVars.postSubmitCalibrateGmEvp, postData).subscribe(dataRes => {
      if (dataRes.status === 'OK') {
        this.loadingFl = false;
        if (this.showTC === true) {
          this.submitFilter(0, 'tcm');
        } else {
          this.submitFilter(0, 'hcbd');
        }
        this.submitCompleteMsg = false;
        this.submitEvpMsg = false;
      }
    },
    error => {
      console.log('[ERROR] cannot submit calibrate' + error);
    })
  }

  // download IPD Form
  idpSummary;
  downloading = true;
  downloading2 = true;
  downloading3 = true;
  image_url;
  imgDataUrl;
  titlePdf: String;
  docDefinition;
  loading2 = false;
  idpDetails;
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
  flexible;
  location;
  funct;
  reason;
  due;
  submit_on;approve_on;complete_on;review_on;
  mobilityErr;
  selMobFunctions = [];
  theDate;userId;totalActionPlan;totalAPCompl;traindet;
  detailList = [];
  summaryList = [];
  summaryIdp;
  detailList_name;
  idp_submit_on;
  idp_approve_on;
  idp_review_on;
  idp_complete_on;

  getUserIDPForm(item) {
    this.loading2 = true;
    this.idpDetails = item;
  
    let posData = { id: item };

    this._POST_api_Service.POST_IDP_data(CLTVars.getIdpDetails, posData).subscribe(res => {
      this.loading = false;
      this.idpSummary = res.summary;
      this.idpStrengths = this.idpSummary.strength;
      this.idpArea = this.idpSummary.area;
      this.idpActionPlans = this.idpSummary.action;
      this.idpMobilty = this.idpSummary.mobility;
      this.myidp_aspiration=this.idpSummary.details[0].aspiration;
      this.myidp_idp_name=this.idpSummary.idp[0].idp_name;
      this.myidp_mobility=this.idpSummary.idp[0].mobility;
      this.myidp_ownerName=this.idpSummary.details[0].ownerName;
      this.myidp_reptToName=this.idpSummary.details[0].reptToName;
      this.myidp_text_en=this.idpSummary.details[0].text_en;
      this.myidp_pers_no=this.idpSummary.details[0].pers_no;
      this.myidp_staff_no=this.idpSummary.details[0].staff_no;

      if (this.idpMobilty.length > 0) {
        this.mobilityErr = false;
        this.flexible=this.idpSummary.mobility[0].flexible;
        this.location=this.idpSummary.mobility[0].location;
        this.funct=this.idpSummary.mobility[0].funct;   
        this.selMobFunctions = this.funct.split('|');          
        this.reason=this.idpSummary.mobility[0].reason;
        this.due=this.idpSummary.mobility[0].due;
      }

      if (this.idpSummary.idp[0].mobility=== 1 && this.idpMobilty && this.idpMobilty.length < 1 ) {
        this.mobilityErr = true; 
      }

      this.submit_on=this.idpSummary.details[0].submit_on;
      this.approve_on=this.idpSummary.details[0].approve_on;
      this.complete_on=this.idpSummary.details[0].complete_on;
      this.review_on=this.idpSummary.details[0].review_on;               
      this.image_url=this.idpSummary.details[0].image_url;   
      let theUrl = `${CLTVars.getImg}/${this.image_url}`;
      this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
      let profilePictureSend = this._GET_api_Service.GET_Picture(theUrl);
      this.totalAPCompl = this.idpActionPlans.filter(t=>t.action_status == 'Complete');
      this.totalActionPlan = this.idpActionPlans.length < 1 ? '' : '('+this.totalAPCompl.length+'/'+this.idpActionPlans.length+' Completed)';
         
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
              background: function(page) {
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
                        } 
                      ],
                    }
                  ];
                }
              },
              header: {},
              footer: function(currentPage, pageCount) {
                return {
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
                logoEra: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAAAyCAYAAABbPiUzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH4gkQDDUGiBm7IAAAEMxJREFUeNrtnHlwXdV9xz/fc58kywvekI2x8Qa2LEs2YAeIGcwSII4d1mYoJTOhCTB0QqZJ03SgQ6dNmiadLGQmZULTUrrQEuoSTIwxyQxgY9nEGGwhL7LlFeNFtjG2LMva3tO799c/7pP0nt67T0+2ZNyZfmfe6Oqec885v/M75/zWe8X/IxKNN187FrOnicXuIZHYhNlPicXeABJgjKYJrdlz3sajT3tCLlScumk+lgzuc5On/Kr0wYeLkjvqSKxd3WgnTyxH+ieKimoILBABo9dsOi9jin3ak3KhQs4IzBbEKucWFX/hDopvX0zxrYvGxF99+aHO99YvsdOnl+Lcvxw75u9ovPlaBIxe8/7gjmmgGqqZXwnOAHAKW5YUdiBDqZ4k0u4FeAaz3tk1qEQWipa7J5McUgJeQHB49FDgtdJvfPtzQ/7wy911LJEgWfM+8eUvk9xcs99aW5/H8543+EjOkcSnkRY8CbzwGQ+Ql5oTwBM9ZQK5AIAJr+7OO76zZtbGq2anuAJyqcbMF86VODEUUSqpWOAhM4kk4EskBB3IOuRiCeGniEgx1GBWdf2gMuX4vZeD88L+lLaAXLi4JLADw6dp5PDq4T946rLYvM9ktWFtbXSuX0d8xTKSO+q209HxHJ631HOxY41qI6EkEjgZOFLXoNTClcJ567p26fdlCKNsWaY87Dez3ruyMnzKCYcNB6ZLVCDKJaZLXApcLDFCYgjgSRZIdCJ8QYdEC+K4YL/ETmT1gl0QHJNz1jWo8rcHjmnH7pnZvduREEGJxMWICRITBOMQoySKJWLWHJviRld8ZcTPnil248ZHtmunm0isWUV85fLA37t7U9yPr2qJJTsCBWkM6mJMOkPCeykGmkSTxAGJ3ZLtl1NcGMO8DkqXHuwfs96dU4mciAWB8z2VS9yFWCRRKTE2ZAqZx13GtWWXpVa0RCuyA4J1iGWC9RKtADNXnxvDjtx1BXJe1+4dKulqxK0S1wlmIMokGyYoIm0i7XSMormLGP79H0NRUZ/9BJ8cJ/HGb4n/7jU6Gj6izSVIyg+Z4TLnoPfOSttxCYkTcrwr7HnBm/LowPmM/e99hTHr3TmVuOJiLJmolPQw4kuCyUQxIevacpf1MCv9KGxBrBL8HLO1cgQzVu08S0bNDHeRrBRpkeBhiRtSOyglO3vL0fDaGocw5P7HKH3oT/rVZ9BwmPZ/f5aWVSs548VD2gtnVvr9FsleFHxPjqNjlu7G9dX5+jlVAKVBZ+fXQSsMvg1MDkutQBL6ddoOB+4GXsLpLzBK9942q9+MarhzJuY8gCrQc8ALiDuAUX3PuMCVEptR3r9OfR88DzdiBDp33W046FHEPwBjT/3RzPyq+/qqKoCxJn1P8AgwJLNGSiPoE4UyNaPpMsH3cRoG9sN9t5UnLn+rMK2x4c5ysIQw3QH8BOgXty0p3PAxuClT+67c2Yl/9Ah+3RY6a96nc0cdnceP0q5ODBsIdftLQJ3BDyOZ9fuQUaOAp4AHIdcuzGJCAmgETgIngCawDiAJFAFjgUuAstS118dAS4DvgHbtnzj/ReibWYeWTOGieCvNQ4bdC/wCmFDYnBhAJ5Ag4YrctEnFrmxc7prxOEHDIZJbaun8YCP+rvp44sTHiURnnIQLSHoBpoIYFSPcAPmqOuBrEr/Jyax3ZleBWYlJfyX4Sm5GkerDAoxdiDeANRi7kX2C0QYWBwICzBySUwliBDAeuBrji4jbgDF5BjsMeGJqQ83aD2+ZcXj62/ndO/KGctoLrhf6WciovLs6DuwAqwG2AAcxztBS9IQ3fcYilQ7tYVBbG/7Bj0huriH5wSb8fXuag8aT9SQSb/vinRbnN3a4JCicLJfOAYtihw0VTAMWAUuAoblqKRQ7d+ZklteeJBgWewB4jLyr3/YBzwDL3tm0/eDCayqzu+mxZQxoT/2OG2xzBEtBC0F/A9wYzQGqQHcnh5Y+k2/mD99RDhaMR/p7YGqeqklgNdhzGGuCzvgJr2SIgcF7UzwuO/W4Ro/GmpvxP9pHsraGztoa/P37Gu100zbr7Fwt6W08r47iklMiQEGQJqcKl+UhH4Nfgb4B/G0EwxywMItZ62ZX4YsK4ElFcDo1oDeAv5Sj1gK4Yf5s5m/cXuAgof76WVhMCdAqsD3As6BFEYQ6YLGXSPwr0BE9JHM49wiwME/Xp4AfYfYsUhMYrqiYmB8w8uU9NC4cGSDeTLz+6o2d69eVBkcOH7fTp2vN91dJqsbzdqq4+ExPcwEXr9lYMN290bD4ciiOtYM9Ey5c7srNVqZm7yyjCPGnwIzoSWGFiccEDUFSXFtb1+9BVqwP1fH6G2cBOgg8CVYJTIp4ZDbh8XkgV+HBJTMxaSbwiKKObeMU4s8tsP+UI8CCLC8BYDj3y+Dokd3WcLhMztXguT3yittTpYAx5hwYlI6Jv9sHwLF7ytsR1UQwCxiaway1FVVIzAfuy9N+Ldh3gAYFcM3m/jMqHRVrd7LjxgocbEa8Bnw9Vz31KCc5mYWZwN0PTInoqhP4qQX2X3IKxi3LrayMWbeRxpuuaScWW9kjZgwzY2z1wDAo9+ACinAn81Rp772zYgYPCV0ccRy1YPYDSXtlCa7ZnN/xWChmr61n580VQWplPUpuOVmCNCqqDTk3DriXaM1qNcYvkfzxr+TXKscMIlOikCJ4ZFS5wYHu42JtRSWIcuCLedpcCfzWFwPGqC7MWlMPcBBoi6jiCNX/LBxcUo6hBUTbUy0YTwNNl/zmwvDw54CAKCvcgA+6maWgGUJGRdklZ8x4DtGx4CxkVIHoIDyuooYcpWY54HZCuywXfg9Uy/mDNe5zhuRKCeVyDrLpADZ2M8vcyBGgJT0evCxsANsQJOODOeZSInYPobqds3NDo4EFEc/5wDLkWse/sncwx36uGI8xLaLsE6A+BlBdPgew2cCVEZUDYKVE64K6QSX4UkKG5UIcaIoouxwiCT1qUI0/qItsIDCN0LOTC/uBwzEAeQammzBGRojnk0C17w9eysbOmyognPQoF1gj2PHeNw8srgDZXOCiiOdqZXZgwooPz3psm+aFMbz0YKEEzuX2ond50F3E/ex4FoBVEG3XbseClhiABZRILAxN8Jy+ke1ge52DDVdWdoc0QteK9QozFHDt0kMjXQRYzNDVURNmsF/okxxFwrgKRUYQ3g/w+r2tNsytQM4hiaJEB50lJSMItbWRhC6wIhgIP203gbdEtGbAFnDWtYonAnPzNFULioN53azM4Kll/GsRAYKsZdBzozRAfyDj83nIr/UsaM+6KxsKVEXMQByojSlR8JxtmzCSlrLLMOcQ/kSwhYmSkpsl5hAa5SMIna9eb3J6ExjpEsz9SJRy1AJsH710N7HqGVWAqggNzqjmbwFeVNfWUJdXi1SIXN2PdqsnGdfWsxvp2WnhH4nwrJ4HNiJiwAngnQg/9iVEy6sTwO7xy/cVxKj1lVU0O3DYWFnwINJDwCywTzML7CjwEUDMFUEQMA8ozvPAValfGtKcln0eBmHcS72fVmZLebAHs43T3sqMGO+9fRaEci4ilsH+FLF9Yl1lZRhzhArQU8AXoO/g7HnAHrATADHfp1jKewQOAM4i+Jj+sPE/yjHpRUUGaA5ZQdFubDcLWgvpJHU6zDb4N+C6Cyj7dVss2RaHUBkpA2amz83A45xIX0c4gVkDswBHtLlhwGakPglaW1EFYUztx8B1gzABZwsf2OJ7oTiLgaaR4bW4YNZUp8GbMh43R8MVb+ZImpFGAhURz7cC2yeu6NstFmAS+qrCoy8fmoCNhAHLk4SGeiYK0SoyMQLsEXLaWNaEsXP0S6HZESP0p0XZKAFwnFDA5xhV31C+upmEGT1pAbsx3kC8jjjl/Mi+JtKdvJOFY4TGZF5Uz6jCwVSMR1HenJS1wN8B63Fqyxx2GrHdwjiXOpSds6LQvno4os9DqR8QMquCaEP0Y+ABjANdh3rKNMrQL6DLhrKcK0tp9dLLujXK8E+ASBi0KrAWPAUAsWTAtDXZztddYcZTOdEpAXsI3TR54Y50YJNL7xHMyLOo1gFfQ3wIID/gyvd39NV0n/jw9qmUlJZUgsZE9F1vaV6bGHBFnvYOmVEr0Zw59kE+LCVKTsOUTdEJnmUjfZrbvLlELDSDrR4dfRrDwWVDLhLcQ6TmZ8cNngQ+dEHAvJqByxIeM34src2tkTRgbCWUW0AYv5qcZ+IPgbVdv63wcP35wukWVyQXqcX6GFtN+TNp35w0HYWe7nza8HIZ7zoLmFc7sDn4Z5paipzTnIjiOLB17EvXgkK568gSbBnb8VCyvT3JBQhJY8jQYjPQBFZ/6Yr8Tufii4Zj6Hqig36tBr8G/PkDzKiQBsbmoeEEsEd6ofuGI0u5yNhnH3vF+WzlTxVTCRWMXDhMmmCOgiX9GPBZok/13Ri119QO1smiKXloyDLoHdEhCYDmG+rPLs98MLH/8+UQKkZR7qmdhFlM+SE3hoiAH4DBJkLtdMBxaPEVABUWTcN2sAyD3pGV75BxDBbuAT2fMIPQGI5yB20xUUhY+FKiI+Mpb/egeAkgyEuDYWwxMg16R5Zhl3EilK6vrOSCg3OlBnkEs22NFRZ7G0cY7siFBGb7rts8SEdgUayUyGgBrYbVlf0606B3hC74KFxqsb7S0T8FiPGEDtxsGCcw9kx4vaDjewTRNmYr6NggUjHOomiAY8ph0DvyG45XyveHcOFhOlGe9jCcUJCnnTDSELUF471lxsBC0wnjY9mw3Aa9E+Rznn3GUFXqHa0LAinlooo8IXApaCmwuXzyKIc8HxgcWtxNQ5Ryt41kPMugd8AGQh9grvGXIf4MbPj6uVW8OzdScTpvMLM+Pe1mfXvaU2iBSEXkItCU964eBJntIwtpUM5S2IKXbdDHgNXAt4jIrBHch/QJ8CM59/GGq6pCn15WfoVl5lrkfA0117VF18n9CuxwjNndr/ZnohXYPmllwQmoH6eeGZWjrFTiARlrN86rbA8TXHolvGQlvvR+1TSzftf7xSYmYSyIOIBPA/Vly7IN+hjYFtBawjfscjG7GPim4DqMl5CtBxoIX91JW5WFvgXZB/pS4sQMol/nOQb0J43pAKEBPSqi/H5EE/AfqXqdBbUaPXYHXGbwuKKzhw8ZdjBXQQzUBvwzcGs46JxuWkeYRLkA1IQ4IawFSCC6P4UQvmydPrYu9Oy67j89ORgZeR2ZmVDqajZ9RCPAovLr9oD16WlPwwmgmmgVegjoW8i+jDgKykjYUdoL492UdYcluqlLOxUsRn7bDmCjLLdBHzMMma1B+kfQE4TfQsmHUeHvvOZgFAZjm5MKTjszCIS9ALqPaO0SQhFRVmCz54IOgxVk6BA9cDfvqgOpE/gJZs+BXZCO2wLgG2y1fhzFt+zaBsZG4BcXCN2rwKrHv5Jb5jqAm3bWQSjYHgf+GuxIYW0XOjGD47HphdNA/aSV/XxLRPjCfk74ovuZ/j08oNgBfNdwzVEVuv1Sl++qA2jG7MeE36F4OtVAG/83cJgIwZwPqYV6BvFd4KvAKqC5v+2cA5rBlpvxx+ZczfA8dniWuFg3uyoUiBYI5yZLzEfMF8ySmEj4TaZYl/wv7AszYb101TzPF2YKSMG2lDKT0fdbIvjmZa/vPqvjbF1lVdcHr0ZL+qzE5ySqJBsnx1Cp53NHkbnuOVT2HJ8DMok2iZMSdRJvOawajzOOgEuWR3+N4H8BSXG4y1DFapwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDktMTZUMTI6NTM6MDYtMDQ6MDCUlkS5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTA5LTE2VDEyOjUzOjA2LTA0OjAw5cv8BQAAAABJRU5ErkJggg==',
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
              myContent = [
                {
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
                        ul: [
                          { //ul[0]
                            table: {
                              body: [
                                [{ text: 'Career Aspiration', style: 'header' }]
                              ]
                            }, 
                            layout: 'noBorders'
                          },
                          {  //ul[1]
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
                            }, 
                            layout: 'noBorders',
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
                            }, 
                            layout: 'noBorders',
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
                            }, 
                            layout: 'noBorders',
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
                            }, 
                            layout: 'noBorders',
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
                          }         
                        ]
                      }
                    ]
                  }
                ];

              // Populate - aspiration (ul[2])              
              if (this.idpSummary.details[0].aspiration) {
                myContent[1].columns[1].ul[2] =  [{ text: `${this.idpSummary.details[0].aspiration}`, style: 'lst_data' },];
              }

              // Populate - strength (ul[6])
              if (res.summary.strength.length) {
                let strengthList = {
                  type: 'none',
                  ul: [
                  ]
                };
                let num = 1;
                res.summary.strength.forEach(function(myVal) {
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
                res.summary.area.forEach(function(myVal) {
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
                  ul: []
                };
                let num = 1;
                //let nmbr = 0;
                // var appendString;
                res.summary.action.forEach(function(myVal) {                                             
                  let myRow = [];
                  let traindet = myVal.training_details;
                  var appendString='';
                    if (traindet) {
                      var str_array = traindet.split(',');
                      var  x;
                      for (x of str_array) {
                        x = x.trim();
                        appendString += x.substring(x.lastIndexOf("|") + 1) + ', ';
                      }
                      appendString = appendString.trim();
                      appendString = appendString.substring(0, appendString.length-1);
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
                  myContent[1].columns[1].ul[18] =[    
                    { width: 100, text: `Flexible to be mobile?`, style: 'lst_title2' },{ text: `Yes`, style: 'lst_data2' },
                    { width: 100, text: `Willing to work in other locations?`, style: 'lst_title2' },{ text: `${this.idpSummary.mobility[0].location.replace('|',', ')}`, style: 'lst_data2' },
                    { width: 100, text: `Willing to explore in other function?`, style: 'lst_title2' },{ text: `${this.idpSummary.mobility[0].funct.replace('|',', ')}`, style: 'lst_data2' }]
                } else if (this.idpSummary.mobility[0].flexible == 0) {
                  myContent[1].columns[1].ul[18] = [
                    { width: 100, text: `Flexible to be mobile?`, style: 'lst_title2' },{ text: `No`, style: 'lst_data2' },
                    { width: 100, text: `Why`, style: 'lst_title2' },{ text: `${this.idpSummary.mobility[0].reason}`, style: 'lst_data2' },
                    { width: 100, text: `Until when`, style: 'lst_title2' },{ text: `${moment(this.idpSummary.mobility[0].due).format("DD-MM-YYYY")}`, style: 'lst_data2' }]
                }                  
              }

              this.docDefinition.content.push(myContent);
              this.downloadIDPForm();
            
            }, 1500);
    }, error => {
      this.loading2 = false;
      console.log('[ERROR] Fail to fetch idp details: ' + error);
    });
  }
  downloadIDPForm() {
    pdfMake.createPdf(this.docDefinition).download(this.titlePdf);
    this.imgDataUrl = '';  
  }

  // download user career profile
  cpSummary;
  cpExperience;
  cpEducation;
  cpProfile;
  cpPrevWork;
  cpAward;
  cpProfCert;
  cpProfileName;
  cpProfileAge;
  cpProfilePosition;
  cpProfileStaff_No;
  cpProfilePost_Desc;
  cpProfileimage_url;
  cpProfilePersNo;
  cpProfileRept_To_Name;
  cpProfileUnit;
  cpProfileBirth_Date;
  cpPrevWorkEmployer;
  userCP: any;
  titleCPPdf: String;
  docCPDefinition;

  getUserCareerProfile(itemCP){
    this.userCP = itemCP;
    let dataCP = {
      staffNo : itemCP,
    }

    this._POST_api_Service.POST_IDP_data(CLTVars.postCareerProfile, dataCP).subscribe(res => {
      this.cpSummary= res.career;
      this.cpProfile = this.cpSummary.profile;
      this.cpProfileName = this.cpProfile[0].Name;
      this.cpProfileAge = this.cpProfile[0].Age;
      this.cpProfilePosition = this.cpProfile[0].Post_Desc;
      this.cpProfileStaff_No = this.cpProfile[0].Staff_No;
      this.cpProfileimage_url = this.cpProfile[0].image_url;
      this.cpProfilePersNo = this.cpProfile[0].Pers_no;
      this.cpProfileRept_To_Name = this.cpProfile[0].Rept_To_Name;
      this.cpProfileUnit = this.cpProfile[0].Sub_Org_Unit_Desc;
      this.cpProfileBirth_Date = this.cpProfile[0].Birth_Date;
      this.cpEducation = this.cpSummary.education;
      this.cpPrevWork = this.cpSummary.previous;
      this.cpExperience = this.cpSummary.exprience;
      this.cpAward = this.cpSummary.award;
      this.cpProfCert = this.cpSummary.profCert;
    
      let theUrl = `${CLTVars.getImg}/${this.cpProfileimage_url}`;
      this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
      let profilePictureSend = this._GET_api_Service.GET_Picture(theUrl);
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
      this.titleCPPdf = `CAREER PROFILE_${this.cpProfile[0].Staff_No}.pdf`;
      setTimeout(() => {
        this.downloading3 = false;
        let profile_img = this.imgDataUrl;
        let myCP_Name = this.cpProfileName;
        let myCP_reptToName = this.cpProfileRept_To_Name === null || this.cpProfileRept_To_Name === '' ? '-' : this.cpProfileRept_To_Name;
        let myCP_pers_no = this.cpProfilePersNo;
        let myCP_staff_no = this.cpProfileStaff_No;
        let myCP_birthdate = this.cpProfileBirth_Date;
        let myCP_position = this.cpProfilePosition;
        let myCP_age = this.cpProfileAge;

        this.docCPDefinition = {
          pageSize: 'A4',
          pageMargins: [20, 90],
          watermark: { text: `By: ${this.userId}@${this.theDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
          background: function(page) {
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
                          [{ text: `${myCP_Name}`, style: 'profile_name' }],
                          [{ columns: [{ text: `Personnel No `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_pers_no} `, style: 'blackSize10' },] }],
                          [{ columns: [{ text: `Staff ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_staff_no} `, style: 'blackSize10' },] }],
                          [{ columns: [{ text: `Position  `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_position} `, style: 'blackSize10' },] }],
                          [{ columns: [{ text: `Reporting To `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_reptToName} `, style: 'blackSize10' },] }],
                          [{ columns: [{ text: `Birth Date `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_birthdate} `, style: 'blackSize10' },] }],
                          [{ columns: [{ text: `Age `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_age} `, style: 'blackSize10' },] }],
                        ]
                      },
                      layout: 'noBorders',
                      margin: [20, 105, 0, 0]
                    }
                  ]
                }
              ]
            }
          },
          header: {},
          footer: function(currentPage, pageCount) {
            return {
              text: 'Page : ' + currentPage.toString() + ' / ' + pageCount,
              color: 'gray',
              bold: 'true',
              alignment: 'right',
              fontSize: 11,
              margin: 20
            }
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
          }

          // Populate the header of the PDF 
          this.docCPDefinition.header = {
            table: {
              widths: ['auto', '*', 'auto'],
              //headerRows: 1,
              body: [
                [{ rowSpan: 3, image: 'logoEra', fit: [80, 80], margin: [0, 7, 0, 10], bold: true }, { rowSpan: 3, text: `EMPLOYEE CAREER PROFILE`, style: 'era_title' }, { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                [{ text: `` }, '', ''],
                [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                [{ colSpan: 3, text: '', fillColor: '#ff3300' }]
              ]
            },
            layout: 'noBorders',
            margin: [20, 20, 20, 40]
          };

          // Populate the content of PDF
          let myCPContent;
          this.docCPDefinition.content = [];

          // We invoke another request to convert the blob to Base64
          myCPContent = [
            { // 0.
              table: {
                widths: [350],
                body: [
                  [{ text: '' }]
                ]
              },
              layout: 'noBorders',
              margin: [0, 20, 0, 5]
            },
            { // 1.
              columns: [
                {
                  width: 165,
                  alignment: 'center',
                  table: {
                    width: ['auto'],
                    body: [
                      [{ image: profile_img, width: 95, height: 95 }],
                      [{ text: `\n` }],
                      [{ text: `${myCP_Name}`, style: 'profile_name' }],
                      [{ columns: [{ text: `Personnel No `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_pers_no} `, style: 'blackSize10' },] }],
                      [{ columns: [{ text: `Staff ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_staff_no} `, style: 'blackSize10' },] }],
                      [{ columns: [{ text: `Position  `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_position} `, style: 'blackSize10' },] }],
                      [{ columns: [{ text: `Reporting To `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_reptToName} `, style: 'blackSize10' },] }],
                      [{ columns: [{ text: `Birth Date `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_birthdate} `, style: 'blackSize10' },] }],
                      [{ columns: [{ text: `Age `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myCP_age} `, style: 'blackSize10' },] }],           
                    ]
                  },
                  layout: 'noBorders',
                },
                {
                  width: 'auto', margin: 5,
                  type: 'none',
                  ul: [
                    {   //ul[0]
                      table: {
                        body: [
                          [{ text: 'JOB EXPERIENCE', style: 'header' }]
                        ]
                      }, 
                      layout: 'noBorders',
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
                          [{ text: 'EDUCATION BACKGROUND', style: 'header' }]
                        ]
                      }, 
                      layout: 'noBorders',
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
                          [{ text: 'PROFESSIONAL QUALIFICATION', style: 'header' }]
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
                          [{ text: 'PREVIOUS WORKING EXPERIENCE', style: 'header' }]
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
                          [{ text: 'AWARDS / MERIT', style: 'header' }]
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
                    }
                  ]
                }
              ]
            }
          ];
           // Populate - JOB EXPERIENCE (ul[2])
          if (this.cpExperience.length) {
            let cpExperienceList = {
              type: 'none',
              ul: []
            };
            let num = 1;
            this.cpExperience.forEach(function (myVal) {
              
              let dp:DatePipe = new DatePipe('en-US');
              let dateJoinStr = dp.transform(new Date(), 'dd-MM-yyyy');
      
              let myRow = [];
              var n = (num < 10) ? ('0' + num++) : num++;
              myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Position ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Post_Desc}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Company ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Org_Unit_Desc}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Date Join ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Start_Date}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Date End ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.End_Date}`, style: 'lst_data' }] });
             
              myRow.push({ text: '\n' });
              cpExperienceList.ul.push(myRow);
            });
            myCPContent[1].columns[1].ul[2] = cpExperienceList;
          }

          // Populate - EDUCATION BACKGROUND (ul[6])
          if (this.cpEducation.length) {
            let eduBackList = {
              type: 'none',
              ul: [ ]
            };
            let num = 1;
            this.cpEducation.forEach(function (myVal) {
              var n = (num < 10) ? ('0' + num++) : num++;
              let myRow = [];
              myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Institution ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.University}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Educational level ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Qualification_Desc}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Branch of Study ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Branch_of_Study}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Certificate ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Certificate}`, style: 'lst_data' }] });
              myRow.push({ text: '\n' });

              eduBackList.ul.push(myRow);
            });
            myCPContent[1].columns[1].ul[6] = eduBackList;
          }  

          //Populate - Prof Qualification (ul[10])
          if (this.cpProfCert.length) {
            let cpProfCertList = {
              type: 'none',
              ul: [ ]
            };
            let num = 1;
            this.cpProfCert.forEach(function (myVal) {
              var n = (num < 10) ? ('0' + num++) : num++;
              let myRow = [];
              myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Cert Name ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Qualification}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Cert Issuer ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Start_Date}`, style: 'lst_data' }] });
              // myRow.push({ columns: [{ width: 100, text: 'Cert Year ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.certYear}`, style: 'lst_data' }] });
              myRow.push({ text: '\n' });
              cpProfCertList.ul.push(myRow);
            });
            myCPContent[1].columns[1].ul[10] = cpProfCertList;
          }

          // Populate - Previous EXPERIENCE (ul[2])
          if (this.cpPrevWork.length) {
            let cpPrevWorkList = {
              type: 'none',
              ul: [ ]
            };
            let num = 1;
            this.cpPrevWork.forEach(function (myVal) {
              
              let dp:DatePipe = new DatePipe('en-US');
              let dateJoinStr = dp.transform(new Date(), 'dd-MM-yyyy');
      
              let myRow = [];
              var n = (num < 10) ? ('0' + num++) : num++;
              myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Position ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Position}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Company ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Employer}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Date Join ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Start_Date}`, style: 'lst_data' }] });
              myRow.push({ columns: [{ width: 100, text: 'Date End ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.End_Date}`, style: 'lst_data' }] });
              
              myRow.push({ text: '\n' });
              cpPrevWorkList.ul.push(myRow);
            });

            myCPContent[1].columns[1].ul[14] = cpPrevWorkList;
          }

          //Populate - Awards/Merit (ul[16])
          if (this.cpAward.length) {
            let cpAwardList = {
              type: 'none',
              ul: [ ]
          };
          let num = 1;
          this.cpAward.forEach(function (myVal) {
            var n = (num < 10) ? ('0' + num++) : num++;
            let myRow = [];
            myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Award ' }], style: 'lst_title_no' }, { width: 5, text: ':', style: 'lst_data' }, { text: `${myVal.Award}`, style: 'lst_data' }] });
            myRow.push({ columns: [{ width: 100, text: 'Awarded On ', style: 'lst_title' }, { width: 5, text: ':', style: 'lst_data' }, { text: `${myVal.End_Date} / ${myVal.Start_Date}`, style: 'lst_data' }] });
            myRow.push({ text: '\n' });
            cpAwardList.ul.push(myRow);
            
          });

          myCPContent[1].columns[1].ul[18] = cpAwardList;
         }

        this.docCPDefinition.content.push(myCPContent);
        this.downloadCPForm();
      }, 1500)
    }, error => {
      this.loading2 = false;
      console.log('[ERROR] Fail to fetch Career Profile details: ' + error);
    });
  }
  downloadCPForm() {
     pdfMake.createPdf(this.docCPDefinition).download(this.titleCPPdf);
     this.imgDataUrl = '';  
  }


  //Azrina add post download report 3/9/2020
  // filterRepVals;
  filteredDataRep = [];
  postDownloadCalReport() {
      this.loadingFl = true;
      this.unitSearchClicked = false;
      this.closeDropdownFilter();
     
      let postData = {
        state: this.filterForm.get('filterState').value,
        lob: this.filterForm.get('filterLob').value,
        department: this.filterForm.get('filterDepartment').value,
        unit: this.filterForm.get('filterUnit').value,
        supervisor: this.filterForm.get('filterSupervisor').value,
        staff_id: this.filterForm.get('filterStaffId').value,
        band: this.filterForm.get('filterBand').value,
        n_grid_box: this.filterForm.get('filterNineGridBox').value
      } 
             
      this._POST_api_Service.POST_TC_data(CLTVars.postDownloadReport, this.filterVals).subscribe(postData => {
        localStorage.setItem('filteredData', JSON.stringify(postData)); // to save filtered results at local storage
        this.filteredDataRep = postData;
        this.modifyFilterData(this.filteredDataRep)
  
        if (this.filteredDataRep.length > 0) {
          this.getFilteredDataImg();
          this.loadingFl = false;
          this.empty = false;
          this.showTable = true;
          this.showEmpDetail = false;
                   
        } else {
          this.loadingFl = false;
          this.empty = true;
        }
      },
      error => {
        console.log('[ERROR] Fail to submit filter: ' + error);
      }); 
      this.getNineGridFilter();
    }
  

  // Add filter header for report download 1/9/2020
  mFilteredData = [];
  modifyFilterData(data){
    
    this.mFilteredData = [];

    type modifiedData = {
      "PersNo": string,
      "Staff ID": string, 
      "Staff Name": string, 
      "Supervisor PersNo": string,
      "Supervisor Name": string,
      "Comp Desc": string,
      "Lob Desc": string,
      "Division": string,
      // "Dept": string,
      "Unit": string,
      "Band": string, 
      "Box_Ass No": string, 
      "Assessment Result": string, 
      "Box_Sp No": string, 
      "Supervisor Review": string,
      "Box_GM No": string, 
      "General Manager Calibration": string,
      "Box_EVP No": string,
      "EVP Calibration": string  
    }

    let mData : modifiedData[] = []; 

    for (let i = 0; i < data.length; i++) {
      mData.push({
        "PersNo": (data[i].pers_no == null) ? "" : data[i].pers_no, 
        "Staff ID": (data[i].staff_no == null) ? "" : data[i].staff_no, 
        "Staff Name": (data[i].name == null) ? "" : data[i].name,
        "Supervisor PersNo": (data[i].supv_pers_no == null) ? "" : data[i].supv_pers_no,
        "Supervisor Name": (data[i].supv_name == null) ? "" : data[i].supv_name, 
        "Comp Desc": data[i].company_desc,
        "Lob Desc": data[i].lob_desc,
        "Division": data[i].division,
        // "Dept": data[i].dept,
        "Unit": (data[i].unit == null) ? "" : data[i].unit, 
        "Band": data[i].job_grad,
        "Box_Ass No": (data[i].cell_ass == null) ? "" : data[i].cell_ass,
        "Assessment Result": (data[i].name_ass == null) ? "Not Complete" : data[i].name_ass, 
        "Box_Sp No": (data[i].cell_cal_mgr == null) ? "" : data[i].cell_cal_mgr,
        "Supervisor Review": (data[i].name_cal_mgr == null) ? "Not Complete" : data[i].name_cal_mgr,
        "Box_GM No": (data[i].cell_cal_gm == null) ? "" : data[i].cell_cal_gm,
        "General Manager Calibration": (data[i].name_cal_gm == null) ? "Not Complete" : data[i].name_cal_gm,
        "Box_EVP No": (data[i].cell_cal_evp == null) ? "" : data[i].cell_cal_evp,
        "EVP Calibration": (data[i].name_cal_evp == null) ? "Not Complete" : data[i]. name_cal_evp
      });  
    }
    this.mFilteredData = mData;
   }
  

  //Azrina add 26/8/2020
  
  downloadFilteredData() {
    this.downloadAll = true;
    var csvData = this.ConvertToCSV(this.mFilteredData);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type:  'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    let todayDate = new Date();
    let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
    a.download = 'Talent_Calibration_Result_' + dateToday + '.csv';
    a.click();
    this.downloadAll = false;
    return 'success';
  }

  downloadCSV = true;
  ConvertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = ''; var row = "";

      for (var index in objArray[0]) {
          if ((index !== 'st_date2') && (index !== 'end_date2')) {
              row += index + ',';//Now convert each value to string and comma-separated
          }
      }
      row = row.slice(0, -1);
      //append Label row with line break
      str += row + '\r\n';

      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
              if (line != '') line += ','
              //line += '"' + array[i][index] + '"';
              if ((index !== 'st_date2') && (index !== 'end_date2')) {
                  line += '"' + array[i][index] + '"';
              }
          }
          str += line + '\r\n';
      }
      return str;
  }

  // update route hilman 1/9/2020
  routeStaffName;
  routeStaffNo;
  routeStaffId;
  routeStaffEmpNo;
  updateSp(emp) {
    console.log('emp',emp);
    this.routeStaffName = emp.name; 
    this.routeStaffNo = emp.staff_no;
    this.routeStaffId = emp.id;
    this.routeStaffEmpNo = emp.pers_no;
    if (this.routeStaffId) {
      $('#route-to-new-Sp').click();
    }
  }

  getSupvRouteData = []
  selectRoute = false;
  getSupvforRoute(e) {
    this.selectRoute = true;
    this._POST_api_Service.POST_IDP_data(CLTVars.postGetSupervisor, { text: e}).subscribe(dataRes => {
      this.getSupvRouteData = dataRes;
      console.log('checksini', this.getSupvRouteData);
    });
  }

  persnoSVRoute;
  nameSVRoute;
  searchSVRoute;
  getRoute(emp) {
    this.selectRoute = false;
    this.persnoSVRoute = emp.pers_no;
    this.nameSVRoute = emp.name;
    this.searchSVRoute = emp.search;
  }

  submitRoute() {
    this.selectRoute = false;
    this.searchSVRoute = '';
    let data = {
      id: this.routeStaffId,
      supv_empno: this.persnoSVRoute,
      supv_name: this.nameSVRoute
    }
    this._POST_api_Service.POST_IDP_data(CLTVars.postRerouteSp, data).subscribe(dataRes => {

      if (dataRes.status === "OK") {
        $('#success-route').click();
      }
    })
  }
}


