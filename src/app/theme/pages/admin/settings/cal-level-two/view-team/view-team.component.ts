import { Component, OnInit } from '@angular/core';
import { CLTVars } from './../cal-level-two-vars';
import { GlobalVariable } from "../../../../../../../environments/environment";
import { GET_Service } from '../../../../../api/get.service';
import { POST_Service } from '../../../../../api/post.service';
import { data, post } from 'jquery';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./../cal-level-two.component.css']
})
export class ViewTeamComponent implements OnInit {

  title1 = CLTVars.title1;
  vttitle2 = CLTVars.vttitle2;

  dataGetFlSupv;
  showTC;
  filteredData;
  nineBoxFilteredData;
  filterVals;
  filterComponent;

  loading = true;
  downloadCell = true;

  constructor(private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service) { }

  ngOnInit() {
    this.getTalentRole();
    this.getFilteredComp();
    this.getFilteredUsers();
    this.getNineGridUsers(); 
    this.loading = false;  
  }

  // calling to get talent role either HCBD or TCM
  getTalentRole() {
    this.showTC = JSON.parse(localStorage.getItem('talentRole'));
    return this.showTC;
  }
  // calling supervisor name filtered data from main page
  getFilteredComp() {
    this.filterComponent = JSON.parse(localStorage.getItem('filterComponent'));
    return this.filterComponent;
  }

  // calling filtered data from main page
  getFilteredUsers() {
    this.filteredData = JSON.parse(localStorage.getItem('filteredData'));
    return this.filteredData;
  }

  // calling nineBoxFilteredData from main page
  getNineGridUsers() {
    this.nineBoxFilteredData = JSON.parse(localStorage.getItem('nineBoxFilteredData'));
    return this.nineBoxFilteredData;
  }

  // to show the number at 9 grid box
  getCellNum(num) {
    let index = this.nineBoxFilteredData.findIndex(item => + item.cell === num)
    return index >= 0 ? this.nineBoxFilteredData[index].number: 0;
  }

  // to get data when click particular at 1 box at 9 grid box
  particularBoxData;
  nameOfCell;
  viewFromPBox
  particularBox(box, name) {
    if (this.showTC === true) {
      this.viewFromPBox = CLTVars.postGetParticularCellNGridBoxfrmTCM;
    } else if (this.showTC === false) {
      this.viewFromPBox = CLTVars.postGetParticularCellNGridBoxfrmHCBD;
    }

    let postData = {
      cell: box,
      filter: [ JSON.parse(localStorage.getItem('filterVals')) ]
    }
    this._POST_api_Service.POST_TC_data(this.viewFromPBox, postData).subscribe(dataRes => {
      this.particularBoxData = dataRes;
      this.modifyparticularBoxData(this.particularBoxData);
      
      if (this.particularBoxData) {
        this.nameOfCell = name;
        $('#particular-box').click();
      }
      this.downloadCell = false;
    },
    error => {
      console.log('[ERROR] cannot get the particular box cell: ' + error);
    })  
  }

   // Azrina add header for report download 1/9/2020
   mparticularBoxData = [];
   modifyparticularBoxData(data) {
    
     this.mparticularBoxData = [];
    
     type modifiedData = {
       "Staff ID": string, 
       "Staff Name": string, 
       "Band": string, 
       "LOB": string, 
       "Position": string,
       "Potential": string,
       "Performance": string  
     }
 
     let mData : modifiedData[] = []; 
 
     for (let i = 0; i < data.length; i++) {
       mData.push({
         "Staff ID": data[i].staff_no, 
         "Staff Name": data[i].name,
         "Band": data[i].job_grad,
         "LOB": data[i].lob_desc, 
         "Position": data[i].empsgroup,
         "Potential": data[i].potential,
         "Performance": data[i].performance
       });  
     }
       this.mparticularBoxData = mData;
    }
 

  //Azrina add 25/8/2020
  
  downloadParticularBox() {
    this.downloadCell = true;
    var csvData = this.ConvertToCSV(this.mparticularBoxData);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type:  'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    let todayDate = new Date();
    let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
    a.download = 'Talent_View_Team_Result_' + dateToday + '.csv';
    a.click();
    this.downloadCell = false;
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
