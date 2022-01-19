import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalVariable } from "../../../../../environments/environment";
import { NotifierService } from 'angular-notifier';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import * as moment from 'moment';


@Component({
    selector: 'app-track',
    templateUrl: './tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tracking-css.css']
})
export class TrackingComponent implements OnInit {

    loading = true; loading2 = true;

    filterForm : FormGroup;
    filterData;

    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    pageSize = 20;

    constructor(
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private _script: ScriptLoaderService, private pagerService: PagerService,
    ){

    }

    trackData = [];
    ngOnInit() {

        this.filterForm = new FormGroup({
            filterLob: new FormControl('', Validators.required),
            filterType: new FormControl('', Validators.required),
            filterReason: new FormControl('', Validators.required),
            filterStart: new FormControl('', Validators.required),
            filterEnd: new FormControl('', Validators.required),
        });

        var today = moment(new Date()).format('DD-MM-YYYY');

        this.filterForm.patchValue({filterStart: today});
        this.filterForm.patchValue({filterEnd: today});

        let trackFilterAPI = '/engagement/tracking/filter';
        this._GET_api_Service.GET_data( trackFilterAPI ).subscribe(res => {

            this.filterData = res.filter;
            this.loading = false;

            this.getTrackData();
            
        }, error => {
            console.log('[ERROR - Fail to get tracking filters] ' + error);
        })  
        
    }

    updateStartDt() {
        this.filterForm.patchValue({filterStart: $("#startDt").val() });
    }

    updateEndDt() {
        this.filterForm.patchValue({filterEnd: $("#endDt").val() });
    }

    errorOnTrackdata = false;
    getTrackData(){
        let engageTrackingAPI =  '/engagement/tracking';

        let startDt =  moment(this.filterForm.get('filterStart').value, 'DD-MM-YYYY').format();
        // console.log('start :', startDt)
        let endDt =  moment(this.filterForm.get('filterEnd').value, 'DD-MM-YYYY').format();
        // console.log('start :', endDt)

        let posData = {
            lob: this.filterForm.get('filterLob').value,
            type: this.filterForm.get('filterType').value,
            reason: this.filterForm.get('filterReason').value,
            // from:  !$("#startDt").val() || $("#startDt").val() === null ? '' : moment($("#startDt").val(), 'DD-MM-YYYY').format(),
            from:  this.filterForm.get('filterStart').value === '' ? '' : startDt,
            // to: !$("#endDt").val() || $("#endDt").val() === null ? '' : moment($("#endDt").val(), 'DD-MM-YYYY').format(),
            to: this.filterForm.get('filterEnd').value === '' ? '' : endDt,
        }

        // console.log(posData)
        this._POST_api_Service.POST_data(engageTrackingAPI, posData).subscribe(data => {
            this.trackData = data;
            this.loading2 = false;
            this.errorOnTrackdata = false;
            this.setPage(1);
            

        }, error => {
            this.loading2 = false;
            this.errorOnTrackdata = true;
            console.log('[ERROR - Fail to get tracking filter data] ' + error);
        })
        
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-track',
            [
                'assets/js/engage/filter-track.js',
            ]
        );
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.trackData.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.trackData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    errDate = false;
    searchSubmit(){
        if($("#startDt").val() && $("#endDt").val()){

            let stDt : any = $("#startDt").val();
            let enDt : any = $("#endDt").val();
            
            stDt =  stDt.split('-');
            enDt = enDt.split('-');
            
            var new_startDt = new Date(stDt[2],stDt[1],stDt[0]);
            var new_endDt = new Date(enDt[2],enDt[1],enDt[0]);

            if(new_endDt < new_startDt) this.errDate = true;
            else this.errDate = false;
        }
        
        if(!this.errDate){

            this.loading2 = true;
            this.getTrackData();
        }
        
    }

    downloading = false;
    download(){
        this.downloading = true;
        //change date format in CSV
        for(let i=0; i<this.trackData.length; i++) {
            this.trackData[i].logtime = moment(this.trackData[i].logtime).format('YYYY-MM-DD HH:mm:ss');
            this.trackData[i].comment = this.trackData[i].comment.replace(/"/g,"'");
            //this.trackData[i].comment = this.trackData[i].comment.replace('"',"'");
        }

        var csvData = this.ConvertToCSV(this.trackData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob(["\uFEFF"+csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'HappyMeter_Tracking_' + dateToday + '.csv';
        a.click();
        this.downloading = false;
        return 'success';
        
    }

    /** :start DOWNLOAD CSV  */
    downloadCSV = true;
    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = ''; var row = "";

        for (var index in objArray[0]) {
            // if ((index !== 'st_date2') && (index !== 'end_date2')) {
                row += index + ',';//Now convert each value to string and comma-separated
            // }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                //line += '"' + array[i][index] + '"';
                // if ((index !== 'st_date2') && (index !== 'end_date2')) {
                    line += '"' + array[i][index] + '"';
                // }
            }
            str += line + '\r\n';
        }
        return str;
    }


    getColor(id){
        if(id == 5) return '#2ECC71';
        else if(id == 4) return '#00A6FB';
        else if(id == 3) return '#FFD103';
        else if(id == 2) return '#FF8811';
        else if(id == 1) return '#EA2803';
    }

}