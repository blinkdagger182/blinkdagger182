import { Component, OnInit, ComponentFactoryResolver, } from '@angular/core';
import { tcReportVars } from './tc-report-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { data, post } from 'jquery';
import { PagerService } from '../../job/shared/pager/pager.component';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Http, Response } from '@angular/http';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { AuthRoutingModule } from '../../../../../auth/auth-routing.routing';

@Component({
  selector: 'app-tc-report.component',
  templateUrl: './tc-report.component.html',
//   styleUrls: ['./app-tc-report.component.css']
})
export class TCReportComponent implements OnInit {

  title1 = tcReportVars.title1;
  title2 = tcReportVars.title2;
  loading = true;
  downloadAsess = true; 
  downloadTrack = true; 
  downloadCal = true; 
  downloadEmpData = true;
  
  constructor(private _GET_api_Service: GET_Service, 
              private _POST_api_Service: POST_Service,
              private _script: ScriptLoaderService,
              private pagerService: PagerService,
              private cfr: ComponentFactoryResolver,
              private http: Http, 
              private activeRoute: ActivatedRoute, 
              private routers: Router,) 
              { }

              ngOnInit() {

                this.getAsessResult();
                this.getAsessTrack();
                this.getTalentCal();
                this.getEmployeesNotEligible();

            }

              assessTcData = []
              getAsessResult() {
                this._GET_api_Service.GET_TC_DATA(tcReportVars.getTCAsessmentResult).subscribe(data => {
                  this.assessTcData = data;
                  this.modifyAssessmentResult(this.assessTcData);
                  // console.log('Report Assessment', this.assessTcData);
                  this.loading = false;
                  this.downloadAsess = false;
                },
                error => {
                  console.log('[ERROR] cannot get Report Assessment ' + error);
                })
              }

               //Add header for Talent Potential Assessment Result
               mAssessmentResult = [];
               modifyAssessmentResult(dataAssess) {
               
               this.mAssessmentResult = [];
               
               type modifiedData = {
                 "Pernr No": string, 
                 "Name": string, 
                 "Band": string, 
                 "Position": string
                 "Unit": string,
                 "Dept": string,
                 "Lob": string,
                 "Pers Area": string,
                 "Supevisor's Name": string,
                 "HOD's Name": string,
                 "Grow Performaance 2017": string,
                 "Grow Performaance 2018": string,
                 "Grow Performance 2019": string,
                 "Average Grow Performance Result": string  
                 "Talent Potential Assessment Result": string,
                 "Talent Potential Assessment Score (TPAS) Q1": string,
                 "TPAS Q2": string,
                 "TPAS Q3": string,
                 "TPAS Q4": string,
                 "TPAS Q5": string,
                 "TPAS Q6": string,  
                 "TPAS Q7": string,
                 "TPAS Q8": string,
                 "TPAS Q9": string,
                 "TPAS Q10": string,
                 "Talent Box Grid Placement (1-9) Manager": string,
                 "Talent Box Grid Placement (1-9) GM": string,  
                 "Talent Box Grid Placement (1-9) EVP": string,
                 "1st Level Supervisor Review Result": string,
                 "1st Level Supervisor Review Remark": string, 
                 "Last Changed by Supervisor": string, 
                 "GM Calibration Result": string, 
                 "GM Calibration Remark": string,
                 "Last Changed by GM": string, 
                 "EVP/Chief/Head Calibration Result": string, 
                 "EVP/Chief/Head Calibration Remark": string,
                 "Last Changed by EVP": string,
                 "Status": string
               }
           
               let mData : modifiedData[] = []; 
           
               for (let i = 0; i < dataAssess.length; i++) {
                 mData.push({
                   "Pernr No": (dataAssess[i].pers_no == null) ? "" : dataAssess[i].pers_no, 
                   "Name": (dataAssess[i].name == null) ? "" : dataAssess[i].name,
                   "Band": (dataAssess[i].job_grad == null) ? "" : dataAssess[i].job_grad,
                   "Position": (dataAssess[i].position == null) ? "" : dataAssess[i].position,
                   "Unit": (dataAssess[i].unit == null) ? "" : dataAssess[i].unit,
                   "Dept": (dataAssess[i].divisioin == null) ? "" : dataAssess[i].divisioin,
                   "Lob": (dataAssess[i].lob == null) ? "" : dataAssess[i].lob,
                   "Pers Area": (dataAssess[i].perssubarea_des == null) ? "" : dataAssess[i].perssubarea_des,
                   "Supevisor's Name": (dataAssess[i].supervisor_name == null) ? "" : dataAssess[i].supervisor_name,
                   "HOD's Name": (dataAssess[i].hod_name == null) ? "" : dataAssess[i].hod_name,
                   "Grow Performaance 2017": (dataAssess[i].perf_2017 == null) ? "" : dataAssess[i].perf_2017,
                   "Grow Performaance 2018": (dataAssess[i].perf_2018 == null) ? "" : dataAssess[i].perf_2018,
                   "Grow Performance 2019": (dataAssess[i].perf_2019 == null) ? "" : dataAssess[i].perf_2019,
                   "Average Grow Performance Result": (dataAssess[i].avg_perf == null) ? "" : dataAssess[i].avg_perf, 
                   "Talent Potential Assessment Result": (dataAssess[i].total_tpas == null) ? "" : dataAssess[i].total_tpas, 
                   "Talent Potential Assessment Score (TPAS) Q1": (dataAssess[i].tpas_01 == null) ? "" : dataAssess[i].tpas_01, 
                   "TPAS Q2": (dataAssess[i].tpas_02 == null) ? "" : dataAssess[i].tpas_02, 
                   "TPAS Q3": (dataAssess[i].tpas_03 == null) ? "" : dataAssess[i].tpas_03,
                   "TPAS Q4": (dataAssess[i].tpas_04 == null) ? "" : dataAssess[i].tpas_04, 
                   "TPAS Q5": (dataAssess[i].tpas_05 == null) ? "" : dataAssess[i].tpas_05, 
                   "TPAS Q6": (dataAssess[i].tpas_06 == null) ? "" : dataAssess[i].tpas_06,   
                   "TPAS Q7": (dataAssess[i].tpas_07 == null) ? "" : dataAssess[i].tpas_07, 
                   "TPAS Q8": (dataAssess[i].tpas_08 == null) ? "" : dataAssess[i].tpas_08, 
                   "TPAS Q9": (dataAssess[i].tpas_09 == null) ? "" : dataAssess[i].tpas_09, 
                   "TPAS Q10": (dataAssess[i].tpas_10 == null) ? "" : dataAssess[i].tpas_10, 
                   "Talent Box Grid Placement (1-9) Manager": (dataAssess[i].box_place_mgr == null) ? "" : dataAssess[i].box_place_mgr, 
                   "Talent Box Grid Placement (1-9) GM": (dataAssess[i].box_place_gm == null) ? "" : dataAssess[i].box_place_gm, 
                   "Talent Box Grid Placement (1-9) EVP": (dataAssess[i].box_place_evp == null) ? "" : dataAssess[i].box_place_evp,
                   "1st Level Supervisor Review Result": (dataAssess[i]['1st_lvl_cal_rslt'] == null) ? "" : dataAssess[i]['1st_lvl_cal_rslt'],
                   "1st Level Supervisor Review Remark": (dataAssess[i]['1st_lvl_cal_rmk'] == null) ? "" : dataAssess[i]['1st_lvl_cal_rmk'],
                   "Last Changed by Supervisor": (dataAssess[i]['1st_lvl_cal_by'] == null) ? "" : dataAssess[i]['1st_lvl_cal_by'],
                   "GM Calibration Result": (dataAssess[i]['2nd_lvl_cal_rslt'] == null) ? "" : dataAssess[i]['2nd_lvl_cal_rslt'], 
                   "GM Calibration Remark": (dataAssess[i]['2nd_lvl_cal_rmk'] == null) ? "" : dataAssess[i]['2nd_lvl_cal_rmk'],
                   "Last Changed by GM": (dataAssess[i]['2nd_lel_cal_by'] == null) ? "" : dataAssess[i]['2nd_lel_cal_by'], 
                   "EVP/Chief/Head Calibration Result": (dataAssess[i]['3rd_lvl_cal_rslt'] == null) ? "" : dataAssess[i]['3rd_lvl_cal_rslt'],
                   "EVP/Chief/Head Calibration Remark": (dataAssess[i]['3rd_lvl_cal_rmk'] == null) ? "" : dataAssess[i]['3rd_lvl_cal_rmk'],
                   "Last Changed by EVP": (dataAssess[i]['3rd_lvl_cal_by'] == null) ? "" : dataAssess[i]['3rd_lvl_cal_by'],
                   "Status": (dataAssess[i].status == null) ? "" : dataAssess[i].status
                 });  
               }
                 this.mAssessmentResult = mData;
                //  console.log('this.mAssessmentResult', this.mAssessmentResult);
               }
           

              downloadTPAR() {
                this.downloadAsess = true;
                var csvData = this.ConvertToCSV(this.mAssessmentResult);
                var a = document.createElement("a");
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                var blob = new Blob([csvData], { type:  'text/csv' });
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                let todayDate = new Date();
                let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
                a.download = 'Talent_Potential_Assessment_Result_' + dateToday + '.csv';
                a.click();
                this.downloadAsess = false;
                return 'success';
            }

              
              assessTrackData = [];
              assessSubTrackData =[];
              assessTrackSub;
              assetTrackDataSubordinates;
             
              getAsessTrack() {

                  this._GET_api_Service.GET_TC_DATA(tcReportVars.getTCAssessmentTrack).subscribe(data => {
                  this.assessTrackData = data;
                  this.modifyAssessmentTracking(this.assessTrackData);
                  this.loading = false;
                  this.downloadTrack = false;
                },
                error => {
                  console.log('[ERROR] cannot get Report Assessment Tracking' + error);
                })
              }
             
              //Add header for Talent Potential Assessment Tracking
              mAssessmentTracking = [];
              modifyAssessmentTracking(dataTrack) {
              
              this.mAssessmentTracking = [];
              
              type modifiedData = {
                "Pernr No": string, 
                "Supervisor Name": string, 
                "Band": string, 
                "Position": string
                "Unit": string,
                "Dept": string,
                "Lob": string,
                "Pers Area": string,
                "Pers Sub Area": string,
                "Subordinates Name": string,
                "Subordinates Band": string,
                "Subordinates Position": string,
                "Status": string  
              }
          
              let mData : modifiedData[] = []; 
          
              for (let i = 0; i < dataTrack.length; i++) {
                mData.push({
                  "Pernr No": (dataTrack[i].pers_no == null) ? "" : dataTrack[i].pers_no, 
                  "Supervisor Name": (dataTrack[i].supv_name == null) ? "" : dataTrack[i].supv_name,
                  "Band": (dataTrack[i].band == null) ? "" : dataTrack[i].band,
                  "Position": (dataTrack[i].position == null) ? "" : dataTrack[i].position,
                  "Unit": (dataTrack[i].unit == null) ? "" : dataTrack[i].unit,
                  "Dept": (dataTrack[i].division == null) ? "" : dataTrack[i].division,
                  "Lob": (dataTrack[i].lob == null) ? "" : dataTrack[i].lob,
                  "Pers Area": (dataTrack[i].persarea_desc == null) ? "" : dataTrack[i].persarea_desc,
                  "Pers Sub Area": (dataTrack[i].perssubarea_des == null) ? "" : dataTrack[i].perssubarea_des,
                  "Subordinates Name": (dataTrack[i].subr_name == null) ? "" : dataTrack[i].subr_name,
                  "Subordinates Band":  (dataTrack[i].subr_band == null) ? "" : dataTrack[i].subr_band,
                  "Subordinates Position":  (dataTrack[i].subr_position == null) ? "" : dataTrack[i].subr_position,
                  "Status":  (dataTrack[i].status == null) ? "" : dataTrack[i].status
                      
                });  
              }
                this.mAssessmentTracking = mData;
                // console.log('this.mAssessmentTracking', this.mAssessmentTracking);
            }

              downloadTPATrack() {
                this.downloadTrack = true;
                var csvData = this.ConvertToCSV(this.mAssessmentTracking);
                var a = document.createElement("a");
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                var blob = new Blob([csvData], { type:  'text/csv' });
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                let todayDate = new Date();
                let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
                a.download = 'Talent_Potential_Assessment_Tracking_' + dateToday + '.csv';
                a.click();
                this.downloadTrack = false;
                return 'success';
            }
           

              talentCalData = []
              getTalentCal() {
                this._GET_api_Service.GET_TC_DATA(tcReportVars.getTCCalibrationTrack).subscribe(data => {
                  this.talentCalData = data;
                  this.modifyTalentCalTracking(this.talentCalData);
                  // console.log('Report Talent Calibration Tracking', this.talentCalData);
                  this.loading = false;
                  this.downloadCal = false;
                },
                error => {
                  console.log('[ERROR] cannot get Report Talent Calibration Tracking ' + error);
                })
              }

                //Add header for Talent Calibration Tracking  
                // Add Pernr employee, Supervisor Name & Band 10/9/2020
                // Add GM Name & EVP name 1/10/2020
                mTalentCalTracking = [];
                modifyTalentCalTracking(dataTCTrack) {
                
                this.mTalentCalTracking = [];
                
                type modifiedData = {
                  "Pernr No": string,
                  "Name": string, 
                  "Position": string,
                  "Band": string,
                  "Unit": string,
                  "Dept": string,
                  "Lob": string,
                  "Pers Area": string,
                  "Pers Sub Area": string,
                  "Supervisor Name": string,
                  "HCBD Name": string,
                  "Manager Calibration Status": string,
                  "GM Calibration Status": string,
                  "GM Name": string,
                  "EVP Calibration": string,
                  "EVP Name": string  
                }
            
                let mData : modifiedData[] = []; 
            
                for (let i = 0; i < dataTCTrack.length; i++) {
                  mData.push({
                    "Pernr No": (dataTCTrack[i].pers_no == null) ? "" : dataTCTrack[i].pers_no,
                    "Name": (dataTCTrack[i].name == null) ? "" : dataTCTrack[i].name, 
                    "Position": (dataTCTrack[i].position == null) ? "" : dataTCTrack[i].position,
                    "Band": (dataTCTrack[i].job_grad == null) ? "" : dataTCTrack[i].job_grad,
                    "Unit": (dataTCTrack[i].unit == null) ? "" : dataTCTrack[i].unit,
                    "Dept": (dataTCTrack[i].divisioin == null) ? "" : dataTCTrack[i].divisioin,
                    "Lob": (dataTCTrack[i].lob == null) ? "" : dataTCTrack[i].lob,
                    "Pers Area": (dataTCTrack[i].persarea_desc == null) ? "" : dataTCTrack[i].persarea_desc,
                    "Pers Sub Area": (dataTCTrack[i].perssubarea_des == null) ? "" : dataTCTrack[i].perssubarea_des,
                    "Supervisor Name": (dataTCTrack[i].supervisor_name == null) ? "" : dataTCTrack[i].supervisor_name,
                    "HCBD Name":  (dataTCTrack[i].hcbd_name == null) ? "" : dataTCTrack[i].hcbd_name, 
                    "Manager Calibration Status":  (dataTCTrack[i].mgr_cal_status == null) ? "" : dataTCTrack[i].mgr_cal_status, 
                    "GM Calibration Status":  (dataTCTrack[i].gm_cal_status == null) ? "" : dataTCTrack[i].gm_cal_status, 
                    "GM Name":  (dataTCTrack[i].gm_name == null) ? "" : dataTCTrack[i].gm_name,
                    "EVP Calibration":  (dataTCTrack[i].evp_cal_status == null) ? "" : dataTCTrack[i].evp_cal_status,
                    "EVP Name":  (dataTCTrack[i].evp_name == null) ? "" : dataTCTrack[i].evp_name
                                 
                  });  
                }
                  this.mTalentCalTracking = mData;
                  // console.log('this.mTalentCalTracking', this.mTalentCalTracking);
                }
  

             downloadTCalTrack() {
              this.downloadCal = true;
              var csvData = this.ConvertToCSV(this.mTalentCalTracking);
              var a = document.createElement("a");
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              var blob = new Blob([csvData], { type:  'text/csv' });
              var url = window.URL.createObjectURL(blob);
              a.href = url;
              let todayDate = new Date();
              let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
              a.download = 'Talent_Calibration_Tracking_' + dateToday + '.csv';
              a.click();
              this.downloadCal = false;
              return 'success';
           }

           employeeNEforTCData =[]
           getEmployeesNotEligible(){
            this._GET_api_Service.GET_TC_DATA(tcReportVars.getEmployeeNotEligible).subscribe(data => {
              this.employeeNEforTCData = data;
              this.modifyEmployeeNotEligibleTC(this.employeeNEforTCData)
              // console.log('Report Employee Not Eligible', this.employeeNEforTCData);
              this.loading = false;
              this.downloadEmpData = false;
            },
            error => {
              console.log('[ERROR] cannot get Report Employee Not Eligible for TC ' + error);
            })
          }

           //Add header for Employee Not Eligible For Talent Classification
           mEmployeeNotEligibleTC = [];
           modifyEmployeeNotEligibleTC(dataEmpNEligibleTC) {
           
           this.mEmployeeNotEligibleTC = [];
           
           type modifiedData = {
             "Pernr No": string, 
             "Name": string, 
             "Band": string, 
             "Position": string
             "Unit": string,
             "Dept": string,
             "Lob": string,
             "Pers Area": string,
             "Pers Sub Area": string,
             "Supervisor's Name": string
            //  "HOD's Name": string
            }
       
           let mData : modifiedData[] = []; 
       
           for (let i = 0; i < dataEmpNEligibleTC.length; i++) {
             mData.push({
               "Pernr No": (dataEmpNEligibleTC[i].Pers_No == null) ? "" : dataEmpNEligibleTC[i].Pers_No, 
               "Name": (dataEmpNEligibleTC[i].Name == null) ? "" : dataEmpNEligibleTC[i].Name, 
               "Band": (dataEmpNEligibleTC[i].Job_Grad == null) ? "" : dataEmpNEligibleTC[i].Job_Grad, 
               "Position": (dataEmpNEligibleTC[i].position == null) ? "" : dataEmpNEligibleTC[i].position,
               "Unit": (dataEmpNEligibleTC[i].unit == null) ? "" : dataEmpNEligibleTC[i].unit,
               "Dept": (dataEmpNEligibleTC[i].division == null) ? "" : dataEmpNEligibleTC[i].division,
               "Lob": (dataEmpNEligibleTC[i].lob == null) ? "" : dataEmpNEligibleTC[i].lob,
               "Pers Area": (dataEmpNEligibleTC[i].PersArea_Desc == null) ? "" : dataEmpNEligibleTC[i].PersArea_Desc,
               "Pers Sub Area": (dataEmpNEligibleTC[i].PersSubArea_Des == null) ? "" : dataEmpNEligibleTC[i].PersSubArea_Des,
               "Supervisor's Name":  (dataEmpNEligibleTC[i].supervisor_name == null) ? "" : dataEmpNEligibleTC[i].supervisor_name
              //  "HOD's Name":  (dataEmpNEligibleTC[i].mgr_cal_status == null) ? "" : dataEmpNEligibleTC[i].mgr_cal_status
                                          
             });  
           }
             this.mEmployeeNotEligibleTC = mData;
            //  console.log('this.mEmployeeNotEligibleTC', this.mEmployeeNotEligibleTC);
           }


            downloadEmpNotEligible() {
                this.downloadEmpData = true;
                var csvData = this.ConvertToCSV(this.mEmployeeNotEligibleTC);
                var a = document.createElement("a");
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                var blob = new Blob([csvData], { type:  'text/csv' });
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                let todayDate = new Date();
                let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
                a.download = 'Employee_Not_Eligible_For_TC_' + dateToday + '.csv';
                a.click();
                this.downloadEmpData = false;
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
          }