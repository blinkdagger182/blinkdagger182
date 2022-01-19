import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
// import { BlankVars } from './blank-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { GlobalVariable } from "../../../../../../environments/environment";
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { timestamp } from 'rxjs/operator/timestamp';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Chart } from 'chart.js';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import * as moment from 'moment';


@Component({
    selector: 'app-e-blank',
    templateUrl: './blank.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./default.css']
})

export class EngageBlankComponent implements OnInit, AfterViewInit {

    daysSelectionForm: FormGroup;
    advFilterForm : FormGroup;

    daysSelected = 15;
    days = [15, 30, 60, 90, 180]
    loading = true; 
    nolob = false;
    noUnit = false;   

    advFilter = false;
    hideAdvFilter = true;

    constructor(
        private _days_select: FormBuilder,
        private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service,
        public datepipe: DatePipe, 
        private decimalPipe: DecimalPipe,
        private _script: ScriptLoaderService,
    ) { }


    ngOnInit() {

        this.advFilterForm = new FormGroup({
            filterStart: new FormControl('', Validators.required),
            filterEnd: new FormControl('', Validators.required),
            filterGroup: new FormControl('', Validators.required),
            filterLob: new FormControl('', Validators.required),
            filterDiv: new FormControl('', Validators.required),
            filterUnit: new FormControl('', Validators.required),
            filterState: new FormControl('', Validators.required),
        });

        this.daysSelectionForm = this._days_select.group({
            daysSelect: [15]
        })

        if(this.loading){
            this.daysSelectionForm.get('daysSelect').disable();
        }

        this.getDashBoardData();

        this.getAdvFilterData();

    }

    advFilterSwitched(checkFilter){
        this.advFilter = checkFilter;
        this.hideAdvFilter = !this.hideAdvFilter;

        if(checkFilter){
            this.advFilterForm.patchValue({
                filterStart: '',
                filterEnd: '',
                filterGroup: '',
                filterLob: '',
                filterDiv: '',
                filterUnit: '',
                filterState: ''
            })
        }
    }

    getScore(){
        let happy = this.summaryDt[3].total;
        let unhappy = this.summaryDt[5].total;
        let total = happy + this.summaryDt[4].total + unhappy;
        return ((happy - unhappy) / total) * 100;
    }

    getIndexValue(val) {
        return val === null ? 0 : val; 
    }


    ngAfterViewInit() {
        this._script.loadScripts('app-e-blank',
            [
                'assets/js/engage/dashboard.js',
            ]
        );
    }

    fullLobDt; groupDt; stateDt;
    lobDt; divDt; unitDt;
    stLobDt; stdivDt; stUnitDt;
    stGroupDt;

    groupArray = ['TM Group', 'Subsidiary'];
    getAdvFilterData(){
        let advFilterAPI = "/engagement/dashboard/filter";

        let uniqLob = []; let uniqDiv = []; let uniqUnit = [];

        let tmgroup = []; let tmSub = []; let others = [];

        this._GET_api_Service.GET_data(advFilterAPI).subscribe(data => {
            this.groupDt = data.filter.group;
            this.stateDt = data.filter.state;
            this.fullLobDt = data.filter.lob;
            
            for(let i=0; i<this.fullLobDt.length; i++){

                if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1)){
                    uniqLob.push( this.fullLobDt[i].lob );
                }

                if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1)){
                    uniqDiv.push( this.fullLobDt[i].division );
                }

                if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1)){ 
                    uniqUnit.push( this.fullLobDt[i].unit );
                }    
                
            }

            this.stLobDt = uniqLob;
            this.stdivDt = uniqDiv;
            this.stUnitDt = uniqUnit;

            this.stGroupDt = this.groupDt;

            this.lobDt = this.stLobDt;
            this.divDt = this.stdivDt;
            this.unitDt = this.stUnitDt;

        }, err => {
            console.log('[ERROR] Fail to fetch Advance filter Data: ' + err);
        })
    }

    setLobData(){
        let uniqLob = [];
        let lob = this.advFilterForm.get('filterLob').value
        let div = this.advFilterForm.get('filterDiv').value
        let unit = this.advFilterForm.get('filterUnit').value
        let group = this.advFilterForm.get('filterGroup').value;

        if(!group.length) {
            if(div.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div && this.fullLobDt[i].unit === unit){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
            else if(div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div ){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
            else if(unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].unit === unit ){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
        }
        else {
            let groupId = this.getGroupId(group);
            
            if(div.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div && this.fullLobDt[i].unit === unit && this.fullLobDt[i].group_id === groupId){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
            else if(div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
            else if(unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].unit === unit && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
            else if(group.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].group_id === groupId ){
                        if ((uniqLob.indexOf( this.fullLobDt[i].lob) === -1))
                            uniqLob.push( this.fullLobDt[i].lob );
                    }
                }
            }
        }
        
        if(!lob.length && !div.length && !unit.length && !group.length) {
            this.lobDt = this.stLobDt; this.divDt = this.stdivDt; this.unitDt = this.stUnitDt;
        }
        else{
            this.lobDt = uniqLob;
            if(uniqLob.length === 1){
                this.advFilterForm.patchValue({filterLob: uniqLob[0]})
            }
        }

    }

    setDivData(){
        let uniqDiv = [];
        let lob = this.advFilterForm.get('filterLob').value
        let div = this.advFilterForm.get('filterDiv').value
        let unit = this.advFilterForm.get('filterUnit').value
        let group = this.advFilterForm.get('filterGroup').value;

        if(!group.length) {
            if(lob.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].unit === unit){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
            else if(lob.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob ){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
            else if(unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].unit === unit ){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
        }

        else {
            let groupId = this.getGroupId(group);

            if(lob.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].unit === unit && this.fullLobDt[i].group_id === groupId){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
            else if(lob.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
            else if(unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].unit === unit && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
            else if(group.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].group_id === groupId ){
                        if ((uniqDiv.indexOf( this.fullLobDt[i].division) === -1))
                            uniqDiv.push( this.fullLobDt[i].division );
                    }
                }
            }
        }
        
        if(!lob.length && !div.length && !unit.length && !group.length) {
            this.lobDt = this.stLobDt; this.divDt = this.stdivDt; this.unitDt = this.stUnitDt;
        }
        else{
            this.divDt = uniqDiv;
            if(uniqDiv.length === 1){
                this.advFilterForm.patchValue({filterDiv: uniqDiv[0]})
            }
        }
            
    }

    setUnitData(){
        let uniqUnit = [];
        let lob = this.advFilterForm.get('filterLob').value
        let div = this.advFilterForm.get('filterDiv').value
        let unit = this.advFilterForm.get('filterUnit').value
        let group = this.advFilterForm.get('filterGroup').value;

        if(!group.length) {
            if(lob.length && div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].division === div ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                        uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
            else if(lob.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                            uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
            else if(div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                            uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
        }
        else {
            let groupId = this.getGroupId(group);

            if(lob.length && div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].division === div && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                        uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
            else if(lob.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                            uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
            else if(div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div && this.fullLobDt[i].group_id === groupId ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                            uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
            else if(group){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].group_id === groupId ){
                        if ((uniqUnit.indexOf( this.fullLobDt[i].unit) === -1))
                            uniqUnit.push( this.fullLobDt[i].unit );
                    }
                }
            }
        }
        
        if(!lob.length && !div.length && !unit.length && !group.length) {
            this.lobDt = this.stLobDt; this.divDt = this.stdivDt; this.unitDt = this.stUnitDt;
        }
        else{
            this.unitDt = uniqUnit;
            if(uniqUnit.length === 1){
                this.advFilterForm.patchValue({filterUnit: uniqUnit[0]})
            }
        }
 
    }

    setGroupData() {
        let tempGroup = [];
        let lob = this.advFilterForm.get('filterLob').value
        let div = this.advFilterForm.get('filterDiv').value
        let unit = this.advFilterForm.get('filterUnit').value
        let group = this.advFilterForm.get('filterGroup').value;
        
        if(!group.length) {
            if(lob.length && div.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].division === div && this.fullLobDt[i].unit === unit){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                            tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }
            else if(lob.length && div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].division === div){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                            tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }
            else if(lob.length && unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob && this.fullLobDt[i].unit === unit){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                            tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }
            else if(lob.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].lob === lob ){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                            tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }
            else if(div.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].division === div ){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                            tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }
            else if(unit.length){
                for(let i=0; i<this.fullLobDt.length; i++){
                    if(this.fullLobDt[i].unit === unit ){
                        if ((tempGroup.indexOf( this.fullLobDt[i].group_id) === -1))
                        tempGroup.push( this.fullLobDt[i].group_id );
                    }
                }
            }

        }

        if(!lob.length && !div.length && !unit.length && !group.length) {
            this.lobDt = this.stLobDt; this.divDt = this.stdivDt; this.unitDt = this.stUnitDt;
            this.groupArray = this.groupArray;
        }
        else{
            // this.groupDt = uniqUnit;
            if(tempGroup.length === 1){
                
                if(tempGroup[0] === 1){
                    this.groupArray = ['TM Group'];
                    this.advFilterForm.patchValue({filterGroup: this.groupArray[0]})
                }
                else if(tempGroup[0] === 2){
                    this.groupArray = ['Subsidiary'];
                    this.advFilterForm.patchValue({filterGroup: this.groupArray[0]})
                }
                
            }
            else {
                this.groupArray = this.groupArray;
            }
        }
        

    }

    getGroupId(name) {
        if(name === 'TM Group')
            return 1;
        else if(name === 'Subsidiary')
            return 2;
    }

    groupChanged() {
        this.advFilterForm.patchValue({filterLob: ''})
        this.advFilterForm.patchValue({filterDiv: ''})
        this.advFilterForm.patchValue({filterUnit: ''})

        this.setLobData();      
        this.setDivData();
        this.setUnitData();
    }


    lobChanged(){        
        this.setDivData();
        this.setUnitData();
        // this.setGroupData();
    }

    divChanged(){
        this.setLobData();
        this.setUnitData();
        // this.setGroupData();
    }

    unitChanged(){ 
        this.setLobData();
        this.setDivData();
        // this.setGroupData();
    }

    advFilterResetClicked() {
        this.groupArray = ['TM Group', 'Subsidiary'];

        this.getAdvFilterData();

        this.advFilterForm.patchValue({
            filterStart: '',
            filterEnd: '',
            filterGroup: '',
            filterLob: '',
            filterDiv: '',
            filterUnit: '',
            filterState: ''
        })
    }

    advFilterClicked(){
        this.removeAndAppend();
        this.loading = true;

        let searchAPI = '/engagement/dashboard/search';
        let selectedGroup = this.advFilterForm.get('filterGroup').value;

        let posData = {
            from : !$("#startDt").val() || $("#startDt").val() === null ? '' : moment($("#startDt").val(), 'DD-MM-YYYY').format(),
            to : !$("#endDt").val() || $("#endDt").val() === null ? '' : moment($("#endDt").val(), 'DD-MM-YYYY').format(),
            group : (selectedGroup == '') ? 0 : (selectedGroup == 'TM Group') ? 1 : 2,
            lob : this.advFilterForm.get('filterLob').value,
            division : this.advFilterForm.get('filterDiv').value,
            unit : this.advFilterForm.get('filterUnit').value,
            state : this.advFilterForm.get('filterState').value
        }

        
        this._POST_api_Service.POST_data(searchAPI, posData).subscribe(resData => { 
            console.log(resData)

            this.dashboardDt = resData.dashboard;
            this.summaryDt = this.dashboardDt.summary;
            this.rowTrendDt = this.dashboardDt.row_trend;
            this.lobTrendDt = this.dashboardDt.lob_trend;
            this.lobPieDt = this.dashboardDt.lob;
            this.feelTypeDt = this.dashboardDt.type;
            this.feelReasonDt = this.dashboardDt.reason;

            //total trend line chart function
            this.setTotalTrendChart();

            //lob trend bar chart function
            // this.setLobTrendChart();

            //lob data pie chart function
            this.setLobDataChart();

            //happy meter feel type doughnut chart function
            this.setFeelTypeChart();

            //feel reason polarArea chart function
            this.setFeelReasonChart();

            this.loading = false;

        }, err => {
            console.log('[ERROR] Fail to fetch Dashboard Data: ' + err);
        })
    }

    dashboardDt;
    summaryDt; 
    rowTrendDt; 
    lobTrendDt;
    lobPieDt;
    feelTypeDt;
    feelReasonDt;
    getDashBoardData() {
        let getDashBoardDataAPI = '/engagement/dashboard';
        let data = { days: this.daysSelected };

        this._POST_api_Service.POST_data(getDashBoardDataAPI, data).subscribe(data => {
            // console.log(data.dashboard);
            this.dashboardDt = data.dashboard;
            this.summaryDt = this.dashboardDt.summary;
            this.rowTrendDt = this.dashboardDt.row_trend;
            this.lobTrendDt = this.dashboardDt.lob_trend;
            this.lobPieDt = this.dashboardDt.lob;
            this.feelTypeDt = this.dashboardDt.type;
            this.feelReasonDt = this.dashboardDt.reason;

            //total trend line chart function
            this.setTotalTrendChart();

            //lob trend bar chart function
            // this.setLobTrendChart();

            //lob data pie chart function
            this.setLobDataChart();

            //happy meter feel type doughnut chart function
            this.setFeelTypeChart();

            //feel reason polarArea chart function
            this.setFeelReasonChart();


            this.loading = false;
            
            this.daysSelectionForm.get('daysSelect').enable();
            
        }, err => {
            console.log('[ERROR] Fail to fetch Dashboard Data: ' + err);
        })
    }

    daysChanged() {
        
        this.loading = true;
        this.daysSelectionForm.get('daysSelect').disable();

        this.removeAndAppend();
        
        this.daysSelected = this.daysSelectionForm.get('daysSelect').value;
        this.getDashBoardData();
    }

    removeAndAppend(){
        $('#rowChart').remove();
        $('#rowChart_div').append('<canvas id="rowChart">{{ rowTrendChart }}</canvas>');

        $('#lobPieChart').remove();
        $('#lobPieChart_div').append('<canvas id="lobPieChart">{{ lobPieChart }}</canvas>');

        $('#feelDonutChart').remove();
        $('#feelDonutChart_div').append('<canvas id="feelDonutChart">{{ feelTypeChart }}</canvas>');

        $('#feelReason').remove();
        $('#feelReason_div').append('<canvas id="feelReason">{{ reasonChart }}</canvas>');
    }

    
    //set data for total trend line chart 
    rowTrendChart = [];
    setTotalTrendChart() {
        let rowTrendDate = []; let rowTrendTotal = [];
        for(let i=0; i < this.rowTrendDt.length; i++ ){
            rowTrendDate.push(this.datepipe.transform(this.rowTrendDt[i].date, 'dd-MM-yy'));
            rowTrendTotal.push(this.rowTrendDt[i].total);
        }
        
        var ctx = document.getElementById('rowChart');

        this.rowTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: rowTrendDate,
                datasets: [
                    {
                        label: 'Total',
                        data: rowTrendTotal,
                        borderColor: '#fd5806',
                        fill: false,
                        lineTension:0.1
                    }
                ]
            },
            options: {
                legend: {
                  display: false
                },
                scales: {
                    xAxes: [{
                    display: true
                  }],
                    yAxes: [{
                    display: true,
                    ticks: { beginAtZero: true },
                  }],
                },
                // maintainAspectRatio: false,
            }
        });
    }

    //set data for lob trend bar chart
    // setLobTrendChart() {
    // }

    //set data for lob pie chart
    lobPieChart = [];
    setLobDataChart(){
        let lobName = []; let lobTotal = []; let lobColor = [];
        // console.log(this.lobPieDt)

        for(let i=0; i<this.lobPieDt.length; i++){
            if(this.lobPieDt[i].lob != null){
                lobName.push(this.lobPieDt[i].lob);
                lobTotal.push(this.lobPieDt[i].total);
                // console.log(this.lobPieDt[i].lob)
                lobColor.push(this.getLobColor(this.lobPieDt[i].lob));
            }
        }
        var ctx = document.getElementById('lobPieChart');

        this.lobPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: lobName,
                datasets: [
                    {
                        data: lobTotal,
                        backgroundColor: lobColor
                    }
                ]
            },
            options: {
                legend: {
                    position: 'left'
                },
                responsive : true,
                animation: {
					animateScale: true,
					animateRotate: true
				},
            }
        })
    }

    //set data for feel type doughnut chart
    feelTypeChart = [];
    setFeelTypeChart(){
        let feelType = []; let feelTotal = []; let feelColor = [];

        for(let i=0; i<this.feelTypeDt.length; i++){
            feelType.push(this.feelTypeDt[i].type);
            feelTotal.push(this.feelTypeDt[i].total);
            feelColor.push(this.getFeelColor(this.feelTypeDt[i].type));
        }

        var ctx = document.getElementById('feelDonutChart');

        this.feelTypeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: feelType,
                datasets: [
                    {
                        data: feelTotal,
                        backgroundColor: feelColor
                    }
                ]
            },
            options: {
                rotation: -Math.PI,
                cutoutPercentage: 30,
                circumference: Math.PI,
                legend: {
                    position: 'left'
                },
                animation: {
                    animateRotate: false,
                    animateScale: true
                }
            }
        })
    }

    //set data for feel reason polarArea chart
    reasonChart =[];    
    setFeelReasonChart(){
        let reason = []; let total = []; let color = [];
        let type1 = []; let type2 = []; let type3 = []; let type4 = []; let type5 = [];
        for(let i=0; i<this.feelReasonDt.length; i++){
            reason.push(this.feelReasonDt[i].reason);
            total.push(this.feelReasonDt[i].total);
            color.push(this.getReasonColor(this.feelReasonDt[i].reason));

            type1.push(this.feelReasonDt[i].type_1);
            type2.push(this.feelReasonDt[i].type_2);
            type3.push(this.feelReasonDt[i].type_3);
            type4.push(this.feelReasonDt[i].type_4);
            type5.push(this.feelReasonDt[i].type_5);
        }

        var ctx = document.getElementById('feelReason');

        // this.reasonChart = new Chart(ctx, {
        //     type: 'horizontalBar',
        //     data: {
        //         labels: reason,
        //         datasets: [
        //             {
        //                 label: 'Total',
        //                 backgroundColor: color,
        //                 data: total
        //             }
        //         ]
        //     },
        //     options: {
        //         legend: { display: false },
        //     }
        // });

        let chartDataSet = [];

        var barOptions_stacked = {
            tooltips: {
                enabled: true
            },
            // hover :{
            //     animationDuration:0
            // },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true,
                        suggestedMax: 10,
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11
                    },
                    scaleLabel:{
                        display:false
                    },
                    gridLines: {
                    }, 
                    stacked: true
                }],
                yAxes: [{
                    gridLines: {
                        display:false,
                        color: "#fff",
                        zeroLineColor: "#fff",
                        zeroLineWidth: 0
                    },
                    ticks: {
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11
                    },
                    stacked: true
                }]
            },
            legend:{
                display:false
            },
            
            
            pointLabelFontFamily : "Quadon Extra Bold",
            scaleFontFamily : "Quadon Extra Bold",
        };

        this.reasonChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: reason,
                datasets: [
                    {
                        data : type1,
                        label : "Very Happy",
                        backgroundColor : '#2ECC71'
                    },
                    {
                        data : type2,
                        label : "Happy",
                        backgroundColor : '#00A6FB'
                    },
                    {
                        data : type3,
                        label : "Neutral",
                        backgroundColor : '#FFD103'
                    },
                    {
                        data : type4,
                        label : "Upset",
                        backgroundColor : '#FF8811'
                    },
                    {
                        data : type5,
                        label : "Very Upset",
                        backgroundColor : '#EA2803'
                    },
                ]
            },
            options: barOptions_stacked,
        });
        
    }
  
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getFeelColor(feel){
        let type = feel.toUpperCase();
        if(type == 'VERY HAPPY') return '#2ECC71';
        else if(type == 'HAPPY') return '#00A6FB';
        else if(type == 'NEUTRAL') return '#FFD103';
        else if(type == 'UPSET') return '#FF8811';
        else if(type == 'VERY UPSET') return '#EA2803';
        else return this.getRandomColor();
    }

    getReasonColor(reason){
        // console.log(reason)
        let res = (reason)? reason.slice(0,8).toLowerCase() : 'null';
        let bkColor;
        switch(res){
            case 'people a' :
                bkColor = '#FF4081'; 
            break;
            case 'team wor' :
                bkColor = '#2690e6'; 
            break;
            case 'leadersh' :
                bkColor = '#CE93D8'; 
            break;
            case 'subordin' : 
                bkColor = '#FF5252'; 
            break;
            case 'work env' :
                bkColor = '#9FA8DA'; 
            break;
            case 'reward &' :
                bkColor = '#81D4FA'; 
            break;
            case 'learning' :
                bkColor = '#3ace4f';
            break;
            case 'null' :
                bkColor = '#8a8b8e';
            break;
            default:
                bkColor = this.getRandomColor();
        }
        return bkColor;
    }

    getLobColor(lob){
        console.log(lob)
        let lobname = lob.toUpperCase();
        let bkColor;
        switch(lobname){
            case 'CENTRAL FUNCTION' :
                bkColor = '#FF4081'; 
            break;
            case 'TM GLOBAL' :
                bkColor = '#2690e6'; 
            break;
            case 'CX' :
                bkColor = '#CE93D8'; 
            break;
            case 'TM ONE' :
                bkColor = '#FF5252'; 
            break;
            case 'UNIFI' :
                bkColor = '#9FA8DA'; 
            break;
            case 'ITNT' :
                bkColor = '#81D4FA'; 
            break;
            case 'MMU' :
                bkColor = '#536DFE'; 
            break;
            case 'SUPPORT BUSINESS' :
                bkColor = '#69F0AE'; 
            break;
            case 'CORPORATE CENTRE' :
                bkColor = '#FFAB91'; 
            break;  
            case 'GOVERNMENT' :
                bkColor = '#EEFF41'; 
            break;
            default:
                bkColor = this.getRandomColor();
        }
        return bkColor;
    }
}