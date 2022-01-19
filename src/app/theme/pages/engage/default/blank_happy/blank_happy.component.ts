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
import { PagerService } from '../../shared/pager/pager.component';
import * as moment from 'moment';
import { BVars, LOB, lobArr } from './blank-happy-vars';


@Component({
    selector: 'app-e-blank-happy',
    templateUrl: './blank_happy.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./default.css']
})

export class EngageBlankHappyComponent implements OnInit, AfterViewInit {

    daysSelectionForm: FormGroup;
    LOBSelectionForm : FormGroup;
    CategorySelectionForm : FormGroup;

    LOBSelected = 1;
    CategorySelected = 1;
    daysSelected = 15;
    days = [15, 30, 60, 90, 180]
    loading = true; 
    loading1 = true;
    loading2 = true;
    loading3 = true; 
    nolob = false;
    noUnit = false;   

    advFilter = true;
    hideAdvFilter = true;
    filterData;
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    pageSize = 10;

    constructor(
        private formBuilder: FormBuilder,
        private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service,
        public datepipe: DatePipe, 
        private decimalPipe: DecimalPipe,
        private _script: ScriptLoaderService,
        private pagerService: PagerService,
    ) { }


    filterForm : FormGroup;
    tableData = [];
    myDate;
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
            this.loading1 = false;

            this.getTrackData();
        }, error => {
            console.log('[ERROR - Fail to get tracking filters] ' + error);
        })  

        this.LOBSelectionForm = new FormGroup({
            filterLob: new FormControl('', Validators.required),
        });

        this.daysSelectionForm = this.formBuilder.group({
            daysSelect: [15]
            // daysSelect: new FormControl('', Validators.required),
        })

        this.CategorySelectionForm = this.formBuilder.group({
            // filterCategory: ['0'],
            filterCategory: new FormControl('', Validators.required),
        });

        this.getSummaryDashboardData(1);

        this.getDashBoardData();

        this.getAdvFilterData();
        setInterval(() => {
            this.loading = true; 
            this.loading1 = true;
            this.loading2 = true;
            this.loading3 = true; 
            let trackFilterAPI = '/engagement/tracking/filter';
            this._GET_api_Service.GET_data( trackFilterAPI ).subscribe(res => {
                this.filterData = res.filter;
                this.loading = false;
                this.loading1 = false;

                this.getTrackData();
            }, error => {
                console.log('[ERROR - Fail to get tracking filters] ' + error);
            })  

            this.getSummaryDashboardData(1);

            this.getDashBoardData();

            this.getAdvFilterData();
        }, 3600000);
    }

    advFilterSwitched(checkFilter){
        this.advFilter = checkFilter;
        this.hideAdvFilter = !this.hideAdvFilter;

        if(checkFilter){
            this.LOBSelectionForm.patchValue({ filterLob: '' });
            this.daysSelectionForm.patchValue({ daysSelect: 15 });
        }
    }

    getScore(){
        let happy = this.summaryDt[3].total;
        let unhappy = this.summaryDt[5].total;
        let total = happy + this.summaryDt[4].total + unhappy;
        return ((happy - unhappy) / total) * 100;
    }
    fullLobDt; groupDt; stateDt;
    lobDt; divDt; unitDt;
    stLobDt; stdivDt; stUnitDt;
    stGroupDt;

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

    ngAfterViewInit() {
        this._script.loadScripts('app-e-blank-happy',
            [
                'assets/js/engage/dashboard.js',
                'assets/js/engage/filter-track.js',
            ]
        );
        
        $('body').removeAttr("class");
        $('body').addClass( "control-scroll m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-aside-left--fixed m-footer--push m-aside--offcanvas-default m-topbar--on m-brand--minimize m-aside-left--minimize" );
    }

    dashboardDt;
    summaryDt; 
    rowTrendDt; 
    lobTrendDt;
    lobPieDt;
    feelTypeDt;
    feelReasonDt;
    lobUpset = [];lobHappy = [];
    getDashBoardData(inverse = true) {
        let getDashBoardDataAPI = '/engagement/dashboard';
        let data = { days: this.daysSelected };

        this._POST_api_Service.POST_data(getDashBoardDataAPI, data).subscribe(data => {
            this.dashboardDt = data.dashboard;
            this.summaryDt = this.dashboardDt.summary;
            this.rowTrendDt = this.dashboardDt.row_trend;
            this.lobTrendDt = this.dashboardDt.lob_trend;
            this.lobPieDt = this.dashboardDt.lob;
            this.feelTypeDt = this.dashboardDt.type;
            this.feelReasonDt = this.dashboardDt.reason;

            //happy meter feel type doughnut chart function
            this.setFeelTypeChart();

            this.loading = false;
            // this.loading2 = false;
            
            this.daysSelectionForm.get('daysSelect').enable();
            this.LOBSelectionForm.get('filterLob').enable();

            this.lobUpset = [];
            this.lobHappy = [];
            for(var it = 0; it < this.filterData.lob.length; it++){
                this.lobHappy[it] =  {lob:this.filterData.lob[it].lob, total:0};
                this.lobUpset[it] =  {lob:this.filterData.lob[it].lob, total:0};
                // this.lobHappy[it].lob =  this.filterData.lob[it];
                // this.lobHappy[it].total =  0;
                // this.lobUpset[it].lob =  this.filterData.lob[it];
                // this.lobUpset[it].total =  0;
            }

            if(inverse)
                this.sortTopHappyUpset(this.daysSelected);
            // }
        }, err => {
            console.log('[ERROR] Fail to fetch Dashboard Data: ' + err);
        })
    }

    daysChanged() {
        this.loading = true;
        // this.loading2 = true;
        this.daysSelectionForm.get('daysSelect').disable();

        this.removeAndAppend();
        
        this.daysSelected = this.daysSelectionForm.get('daysSelect').value;
        console.log(this.daysSelected);
        // this.getSummaryDashboardData();
        this.getDashBoardData();
    }

    lobChanged() {
        this.loading = true;
        // this.loading2 = true;
        this.LOBSelectionForm.get('filterLob').disable();

        this.removeAndAppend();
        
        this.LOBSelected = this.LOBSelectionForm.get('filterLob').value;
        // this.getSummaryDashboardData();
        this.getDashBoardData();
    }

    categoryChanged() {
        // this.loading = true;
        this.loading2 = true;
        this.CategorySelectionForm.get('filterCategory').disable();

        // this.removeAndAppend();
        
        this.CategorySelected = this.CategorySelectionForm.get('filterCategory').value;
        this.getSummaryDashboardData(0);
        // this.getDashBoardData();
    }

    removeAndAppend(){
        // $('#rowChart1').remove();
        // $('#rowChart1_div').append('<canvas id="rowChart1">{{ rowTrendChart1 }}</canvas>');

        // $('#rowChart2').remove();
        // $('#rowChart2_div').append('<canvas id="rowChart2">{{ rowTrendChart2 }}</canvas>');

        $('#feelDonutChart').remove();
        $('#feelDonutChart_div').append('<canvas id="feelDonutChart">{{ feelTypeChart }}</canvas>');

        $('#happyChart').remove();
        $('#happyChart_div').append('<canvas id="happyChart" style="overflow: hidden;height: 44vh;width: 98%">{{ topChartHappy }}</canvas>');

        $('#upsetChart').remove();
        $('#upsetChart_div').append('<canvas id="upsetChart" style="overflow: hidden;height: 44vh;width: 98%">{{ topChartUpset }}</canvas>');
    }

    
    //set data for total trend line chart 
    rowTrendChart1 = [];
    rowTrendChart2 = [];
    setTotalTrendChart() {
        var originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
          draw: function() {
            var chart = this.chart;

            var happy = new Image();
            happy.src = './assets/app/media/img/emoji/hpy.svg';

            var neutral = new Image();
            neutral.src = './assets/app/media/img/emoji/neutral.svg';

            var sad = new Image();
            sad.src = './assets/app/media/img/emoji/upset.svg';

            var emoj = [sad,neutral,happy];

            // Get the object that determines the region to highlight.
            var yHighlightRange = chart.config.data.yHighlightRange;

            // If the object exists.
            if (yHighlightRange !== undefined) {
              if (yHighlightRange.begin.length == yHighlightRange.end.length)
                for (var yCount = 0; yCount < yHighlightRange.begin.length; yCount++) {
                  var ctx = chart.chart.ctx;

                  var yRangeBegin = yHighlightRange.begin[yCount];
                  var yRangeEnd = yHighlightRange.end[yCount];

                  var xaxis = chart.scales['x-axis-0'];
                  var yaxis = chart.scales['y-axis-0'];

                  var yRangeBeginPixel = yaxis.getPixelForValue(yRangeBegin);
                  var yRangeEndPixel = yaxis.getPixelForValue(yRangeEnd);

                  ctx.save();

                  // The fill style of the rectangle we are about to fill.
                  ctx.fillStyle = yHighlightRange.color[yCount];
                  // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
                  // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
                  ctx.fillRect(xaxis.left, Math.min(yRangeBeginPixel, yRangeEndPixel), xaxis.right - xaxis.left, Math.max(yRangeBeginPixel, yRangeEndPixel) - Math.min(yRangeBeginPixel, yRangeEndPixel));

                  var centerX = ((xaxis.right + xaxis.left) / 1.1);
                  var centerY = ((yRangeBeginPixel + yRangeEndPixel) / 2.3);

                  ctx.drawImage(emoj[yCount], centerX, centerY, 30, 30);

                  ctx.restore();
                } else {
                console.warn("yHighlightRange.begin and yHighlightRange.end are not the same length")
              }
            }

            // Apply the original draw function for the line chart.
            originalLineDraw.apply(this, arguments);
          }
        });

        let rowTrendDate = [];
        let rowUserTotalHappy = [];
        let rowUserTotalNeutral = [];
        let rowUserTotalUpset = [];
        let rowTrendTotalHappy = [];
        let rowTrendTotalNeutral = [];
        let rowTrendTotalUpset = [];

        var dtdum = this.initDate;
        dtdum.setDate(this.initDate.getDate()-1);
        var len = this.diff_weeks(dtdum,new Date());
        if(len > 20){
            dtdum.setDate(this.initDate.getDate()+35);
            len = this.diff_weeks(dtdum,new Date());
        }

        for(let i=0; i < len; i++ ){
            var dateo = this.datepipe.transform(dtdum, 'yyyy-MM-dd')
            rowTrendDate.push(this.datepipe.transform(dtdum, 'dd-MM-yy'));
            rowTrendTotalHappy.push((this.trendGroupedByWeekH[dateo]/this.groupedByWeek[dateo]*100).toFixed(0));
            rowTrendTotalNeutral.push((this.trendGroupedByWeekN[dateo]/this.groupedByWeek[dateo]*100).toFixed(0));
            rowTrendTotalUpset.push((this.trendGroupedByWeekU[dateo]/this.groupedByWeek[dateo]*100).toFixed(0));
            rowUserTotalHappy.push(this.trendGroupedByWeekH[dateo]);
            rowUserTotalNeutral.push(this.trendGroupedByWeekN[dateo]);
            rowUserTotalUpset.push(this.trendGroupedByWeekU[dateo]);

            dtdum.setDate(dtdum.getDate() + 7);
        }
        
        var ctx1 = document.getElementById('rowChart1');
        var ctx2 = document.getElementById('rowChart2');

        this.rowTrendChart1 = new Chart(ctx1, {
            type: 'line',
            tooltips: {
                enabled: true
            },
            data: {
                labels: rowTrendDate,
                datasets: [
                    {
                        label: 'Happy',
                        data: rowTrendTotalHappy,
                        borderColor: '#00A86B',
                        fill: false,
                        lineTension:0.1
                    },
                    {
                        label: 'Neutral',
                        data: rowTrendTotalNeutral,
                        borderColor: '#FFEE75',
                        fill: false,
                        lineTension:0.1
                    },
                    {
                        label: 'Upset',
                        data: rowTrendTotalUpset,
                        borderColor: '#fe5806',
                        fill: false,
                        lineTension:0.1
                    }
                ],
                // yHighlightRange: {
                //   begin: [0, 60, 80],
                //   end: [60, 80, 100],
                //   color: ['rgba(254, 132, 132, 0.08)','rgba(255, 247, 45, 0.08)','rgba(152, 251, 152, 0.08)']
                // }
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                          return data['datasets'][tooltipItem['datasetIndex']]['label'] + ': ' + data['datasets'][tooltipItem['datasetIndex']]['data'][tooltipItem['index']] + '%';
                        }
                    }
                },
                legend: {
                  display: true
                },
                title: {
                    display: true,
                    text: 'Weekly Scoring Trend'
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Percentage (%)'
                        },
                        display: true,
                        ticks: { 
                            beginAtZero: true,
                            // callback: function (value) {
                            //   return value + '%'; // convert it to percentage
                            // },
                        },
                    }],
                },
                maintainAspectRatio: false,
                spanGaps: true
            },
        });

        this.rowTrendChart2 = new Chart(ctx2, {
            type: 'line',
            tooltips: {
                enabled: true
            },
            data: {
                labels: rowTrendDate,
                datasets: [
                    {
                        label: 'Happy',
                        data: rowUserTotalHappy,
                        borderColor: '#00A86B',
                        fill: false,
                        lineTension:0.1
                    },
                    {
                        label: 'Neutral',
                        data: rowUserTotalNeutral,
                        borderColor: '#FFEE75',
                        fill: false,
                        lineTension:0.1
                    },
                    {
                        label: 'Upset',
                        data: rowUserTotalUpset,
                        borderColor: '#fe5806',
                        fill: false,
                        lineTension:0.1
                    }
                ],
                // yHighlightRange: {
                //   begin: [0, 60, 80],
                //   end: [60, 80, 100],
                //   color: ['rgba(254, 132, 132, 0.08)','rgba(255, 247, 45, 0.08)','rgba(152, 251, 152, 0.08)']
                // }
            },
            options: {
                legend: {
                  display: true
                },
                title: {
                    display: true,
                    text: 'Weekly Entries Trend'
                },
                scales: {
                    xAxes: [{
                    display: true
                  }],
                    yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Entries'
                    },
                    display: true,
                    ticks: { beginAtZero: true },
                  }],
                },
                maintainAspectRatio: false,
                spanGaps: true
            }
        });
    }

    //set data for feel type doughnut chart
    feelTypeChart = [];
    setFeelTypeChart(){
        Chart.pluginService.register({
          beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
              //Get ctx from string
              var ctx = chart.chart.ctx;

              //Get options from the center object in options
              var centerConfig = chart.config.options.elements.center;
              var txt = centerConfig.text;
              var val = centerConfig.value;
              var color = centerConfig.color || '#000';
              var sidePadding = centerConfig.sidePadding || 20;
              var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
              //Start with a base font of 30px
              ctx.font = "50px ";

              //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
              var stringWidth = ctx.measureText(txt).width;
              var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

              // Find out how much the font can grow in width.
              var widthRatio = elementWidth / stringWidth;
              var newFontSize = Math.floor(30 * widthRatio);
              var elementHeight = (chart.innerRadius * 2);

              // Pick a new font size so it will not be larger than the height of label.
              var fontSizeToUse = Math.min(newFontSize, elementHeight);

              //Set font settings to draw it correctly.
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
              var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 1.1);
              ctx.font = fontSizeToUse+"px ";
              ctx.fillStyle = color;

              //Draw text in center
              ctx.fillText(txt, centerX, centerY/1.3);
              ctx.fillStyle = '#FF5A00';
              ctx.fillText(val, centerX, centerY);
            }
          }
        });

        let feelType = []; let feelTotal = []; let feelColor = [];
        let vh = 0; let h = 0; let n = 0; let s = 0; let vs = 0;
        var ctx = document.getElementById('feelDonutChart');
        if(this.feelTypeDt.length > 0){
            for(let i=this.feelTypeDt.length-1; i>=0; i--){
                feelType.push(this.feelTypeDt[i].type);
                feelTotal.push(this.feelTypeDt[i].total);
                feelColor.push(this.getFeelColor(this.feelTypeDt[i].type));

                if(this.feelTypeDt[i].type.toUpperCase() == 'VERY HAPPY') vh = this.feelTypeDt[i].total;
                else if(this.feelTypeDt[i].type.toUpperCase() == 'HAPPY') h = this.feelTypeDt[i].total;
                else if(this.feelTypeDt[i].type.toUpperCase() == 'NEUTRAL') n = this.feelTypeDt[i].total;
                else if(this.feelTypeDt[i].type.toUpperCase() == 'UPSET') s = this.feelTypeDt[i].total;
                else if(this.feelTypeDt[i].type.toUpperCase() == 'VERY UPSET') vs = this.feelTypeDt[i].total;
            }
            let score = Math.floor(this.scoreCalculation(vh,h,n,s,vs));
            let ftms = score - 1;
            let ftme = 100 - score - 1;
            let feelTotalMeter = [ftms,1,ftme]; let feelColorMeter = ["rgba(0, 0, 0, 0)",'#333',"rgba(0, 0, 0, 0)"];

            var scoreText = 'Very Upset';
            if(score >= 80)
                scoreText = 'Very Happy';
            else if(score >= 60)
                scoreText = 'Happy';
            else if(score >= 40)
                scoreText = 'Neutral';
            else if(score >= 20)
                scoreText = 'Upset';

            var needleD = { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 }

            this.feelTypeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: feelType,
                    datasets: [
                        {
                            data: feelTotal,
                            backgroundColor: feelColor
                        },
                        //NEEDLE
                        { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 },
                        { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 },
                        { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 },
                        { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 },
                        { data: feelTotalMeter, backgroundColor: feelColorMeter, borderWidth: 0, hoverBackgroundColor: feelColorMeter, hoverBorderWidth: 0 },
                        // END NEEDLE
                    ]
                },
                options: {
                    maintainAspectRatio : false,
                    rotation: -Math.PI,
                    cutoutPercentage: 50,
                    circumference: Math.PI,
                    legend: {
                        position: 'left',
                        display: false
                    },
                    animation: {
                        animateRotate: false,
                        animateScale: true
                    },
                    elements: {
                        center: {
                            text: scoreText,
                            value: score,
                            color: '#FF6384', // Default is #000000
                            sidePadding: 20 // Defualt is 20 (as a percentage)
                        }
                    },
                    tooltips: {
                        filter: function (tooltipItem) {
                            return tooltipItem.datasetIndex === 0;
                        }
                    }
                }
            })

        } else {
            $('#feelDonutChart').remove();
            $('#feelDonutChart_div').append('<div id="feelDonutChart" style="text-align: center;padding: 70px 0;">No Data</div>');
        }
    }

    scoreCalculation(vh,h,n,s,vs){
        return (((vh+h)-(vs+s)+n)/(vh+h+n+s+vs))*100;
    }

    //set data for feel reason polarArea chart
    topChartHappy =[];    
    topChartUpset =[];    
    setTopFeelChart(topHappy,topUpset,totalHappy,totalUpset){
        var ctx1 = document.getElementById('happyChart');
        var ctx2 = document.getElementById('upsetChart');

        var happyLabel = [];var happyTotal = [];var happyColor = [];
        var upsetLabel = [];var upsetTotal = [];var upsetColor = [];
        for(var idx = 0; idx < this.lobHappy.length; idx++){
            happyLabel.push(this.lobHappy[idx].lob);
            happyTotal.push((this.lobHappy[idx].total/totalHappy*100).toFixed(0));
            upsetLabel.push(this.lobUpset[idx].lob);
            upsetTotal.push((this.lobUpset[idx].total/totalUpset*100).toFixed(0));

            if(idx == 0){
                happyColor.push('rgba(0, 168, 104, 0.9)');
                upsetColor.push('rgba(186, 0, 0, 0.9)');
            } else if(idx == 1){
                happyColor.push('rgba(80, 200, 120, 0.9)');
                upsetColor.push('rgba(254, 57, 57, 0.9)');
            } else {
                happyColor.push('rgba(152, 251, 152, 0.9)');
                upsetColor.push('rgba(254, 132, 132, 0.9)');
            }
        }

        var checkData = function (val) {
          return isNaN(val);
        }

        var barOptions_stacked = {
            maintainAspectRatio : false,
            responsive: false,
            tooltips: {
                enabled: true
            },
            hover: {
              animationDuration: 0
            },
            animation: {
                duration: 1,
                onComplete: function() {
                    var chartInstance = this.chart,
                      ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'start';
                    ctx.textBaseline = 'hanging';

                    this.data.datasets.forEach(function(dataset, i) {
                      var meta = chartInstance.controller.getDatasetMeta(i);
                      meta.data.forEach(function(bar, index) {
                        var data = dataset.data[index];
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                      });
                    });
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true,
                        stepSize: 10,
                        suggestedMax: 110,
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
                    barPercentage: 0.3,
                    categoryPercentage: 1.5,
                    stacked: true
                }]
            },
            legend:{
                display:false
            },
            pointLabelFontFamily : "Quadon Extra Bold",
            scaleFontFamily : "Quadon Extra Bold",
        };

        var dataset_happy = {
            labels: happyLabel,
            datasets: [
                {
                    data : happyTotal,
                    label : "Rating",
                    backgroundColor: happyColor,
                    borderColor: [
                        'rgba(0, 168, 104, 1)',
                        'rgba(80, 200, 120, 1)',
                        'rgba(152, 251, 152,1)'
                    ]
                },
            ]
        };

        var dataset_upset = {
            labels: upsetLabel,
            datasets: [
                {
                    data : upsetTotal,
                    label : "Rating",
                    backgroundColor: upsetColor,
                    borderColor: [
                        'rgba(186, 0, 0, 1)',
                        'rgba(254, 57, 57, 1)',
                        'rgba(254, 132, 132,1)'
                    ]
                },
            ]
        };
        // console.log(!happyTotal.some(checkData));
        if(!happyTotal.some(checkData)){
            this.topChartHappy = new Chart(ctx1, {
                                    type: 'horizontalBar',
                                    data: dataset_happy,
                                    options: barOptions_stacked
                                });
        } else {
            $('#happyChart').remove();
            $('#happyChart_div').append('<div id="happyChart" style="text-align: center;padding: 70px 0;">No Data</div>');
        }

        if(!upsetTotal.some(checkData)){
            this.topChartUpset = new Chart(ctx2, {
                                    type: 'horizontalBar',
                                    data: dataset_upset,
                                    options: barOptions_stacked
                                });
        } else {
            $('#upsetChart').remove();
            $('#upsetChart_div').append('<div id="upsetChart" style="text-align: center;padding: 70px 0;">No Data</div>');
        }
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

    trackData = [];
    errorOnTrackdata = false; groupedByWeek = {};
    trendGroupedByWeekH = {}; trendGroupedByWeekN = {}; trendGroupedByWeekU = {}; initDate;
    getSummaryDashboardData(first){
        type track = {
            meter: number, lob: string, logtime: string
        }
        let trackAry: track[] = [];
        let engageTrackingAPI =  '/engagement/tracking';
        var past = this.daysSelectionForm.get('daysSelect').value;
        var today = new Date().toJSON();
        var ago = new Date();
        var agol = new Date(ago.setDate(ago.getDate() - past)).toJSON();

        let posData = {
            lob: this.hideAdvFilter ? '' : this.LOBSelectionForm.get('filterLob').value,
            type: this.CategorySelectionForm.get('filterCategory').value,
            reason: "",
            from: this.hideAdvFilter ? '' : agol,
            to: this.hideAdvFilter ? '' : today
        }

        this._POST_api_Service.POST_data(engageTrackingAPI, posData).subscribe(data => {
            this.trackData = data.reverse();
            this.CategorySelectionForm.get('filterCategory').enable();
            this.loading2 = false;

            if(first == 1){
                var countsA = {};var countsH = {};var countsN = {};var countsU = {};
                for( let i=0; i < this.trackData.length; i++ ){
                    trackAry.push({
                        meter: data[i].meter, lob: data[i].lob, logtime: data[i].logtime
                    })
                    var date1 = new Date(data[i].logtime); date1.setHours(0,0,0,0);
                    countsA[String(date1.toJSON())] = (countsA[String(date1.toJSON())] || 0)+1;
                    if(data[i].meter == 4 || data[i].meter == 5)
                        countsH[String(date1.toJSON())] = (countsH[String(date1.toJSON())] || 0)+1;
                    if(data[i].meter == 3)
                        countsN[String(date1.toJSON())] = (countsN[String(date1.toJSON())] || 0)+1;
                    if(data[i].meter == 1 || data[i].meter == 2)
                        countsU[String(date1.toJSON())] = (countsU[String(date1.toJSON())] || 0)+1;
                }

                var datasCntA = [];var datasCntH = [];var datasCntN = [];var datasCntU = []; var firstDate = '';
                Object.keys(countsA).forEach(function(key) { datasCntA.push({ date: key, count: countsA[key] });  });
                Object.keys(countsH).forEach(function(key) { datasCntH.push({ date: key, count: countsH[key] }) });
                Object.keys(countsN).forEach(function(key) { datasCntN.push({ date: key, count: countsN[key] }) });
                Object.keys(countsU).forEach(function(key) { datasCntU.push({ date: key, count: countsU[key] }) });
                this.initDate = new Date(date1);

                this.groupedByWeek = this.accumulateCountByWeek(datasCntA);
                this.trendGroupedByWeekH = this.accumulateCountByWeek(datasCntH);
                this.trendGroupedByWeekN = this.accumulateCountByWeek(datasCntN);
                this.trendGroupedByWeekU = this.accumulateCountByWeek(datasCntU);

                //total trend line chart function
                this.setTotalTrendChart();
            }
        }, error => {
            this.loading2 = false;
            this.errorOnTrackdata = true;
            console.log('[ERROR - Fail to get tracking filter data] ' + error);
        })
        
    }

    getMonday(d) {
        var day = d.getDay();
        var diff = d.getDate() - day + (day === 0 ? -6 : 1);  
        return new Date(d.setDate(diff));
    }

    accumulateCountByWeek(obj){
        var groupedByWeek = obj.reduce((m, o) => {
            var monday = this.getMonday(new Date(o.date));
            var mondayYMD = monday.toISOString().slice(0,10);
            var found = m.find(e => e.date === mondayYMD);
            if (found) {
                found.count += o.count;
            } else {
                o.date = mondayYMD;
                m.push(o);
            }
            return m;
        }, []);
        var counts = {};
        for( let i=0; i < groupedByWeek.length; i++ ){
            counts[String(groupedByWeek[i].date)] = groupedByWeek[i].count;
        }
        return counts;
    }
    
    diff_weeks(dt2, dt1){
        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24 * 7);
        return Math.abs(Math.round(diff));
    }

    trackData2 = [];
    sortTopHappyUpset(day = 1) {
        var today = new Date().toJSON();
        if(!this.hideAdvFilter){
            var past = this.daysSelectionForm.get('daysSelect').value;
            day = past;        }

        var ago = new Date();
        var agol = new Date(ago.setDate(ago.getDate() - day)).toJSON();

        let posData = {
            lob: this.hideAdvFilter ? '' : this.LOBSelectionForm.get('filterLob').value,
            type: '',
            reason: "",
            from: agol,
            to: today
        }
        var totalHappy = 0;
        var totalUpset = 0;
        this._POST_api_Service.POST_data('/engagement/tracking', posData).subscribe(data => {
            if(data.length == 0 && this.hideAdvFilter){
                $('#feelDonutChart').remove();
                $('#feelDonutChart_div').append('<canvas id="feelDonutChart">{{ feelTypeChart }}</canvas>');
                if(day == 1){
                //     this.sortTopHappyUpset(5);
                // else if(day == 5)
                //     this.sortTopHappyUpset(10);
                // else if(day == 10)
                    this.daysSelected = 15;
                } else if(day == 15) {
                    this.daysSelected = 30;
                }
                this.getDashBoardData(false);
                this.sortTopHappyUpset(this.daysSelected);
            } else {
                this.trackData2 = data;

                if(day != 1){
                    let topDay=document.getElementsByClassName("topDay");
                    for(var i = 0; i < topDay.length; i++){
                        ( <HTMLElement>topDay[i]).innerText="(Last " + day + " Days)";
                    }
                } else {
                    let topDay=document.getElementsByClassName("topDay");
                    for(var i = 0; i < topDay.length; i++){
                        ( <HTMLElement>topDay[i]).innerText="(Today)";
                    }
                }

                this.trackData2.forEach((key : any, val: any) => {
                    if(key['meter_desc'] == 'Happy' || key['meter_desc'] == 'Very Happy'){
                        totalHappy++;
                        for(var itx=0; itx < this.lobHappy.length; itx++){
                            if(this.lobHappy[itx].lob == key['lob'])
                                this.lobHappy[itx].total++;
                        }
                    }
                    if(key['meter_desc'] == 'Upset' || key['meter_desc'] == 'Very Upset'){
                        totalUpset++;
                        for(var itx=0; itx < this.lobUpset.length; itx++){
                            if(this.lobUpset[itx].lob == key['lob'])
                                this.lobUpset[itx].total++;
                        }
                    }
                })

                this.lobHappy.sort(function(a, b){
                    return a.total-b.total
                })
                this.lobUpset.sort(function(a, b){
                    return a.total-b.total
                })
                this.setTopFeelChart(this.lobHappy.reverse(),this.lobUpset.reverse(),totalHappy,totalUpset);
            }
        }, error => {
            this.errorOnTrackdata = true;
            console.log('[ERROR - Fail to get tracking filter data] ' + error);
        })
    }

    expandCollapse(event: Event, type){
        if(type == 'expand'){
            ( <HTMLElement>( <HTMLElement>event.target).parentElement.nextSibling.nextSibling).style.display = 'block';
            ( <HTMLElement>( <HTMLElement>event.target ).parentElement).style.display = 'none';
        } else {
            ( <HTMLElement>( <HTMLElement>event.target).parentElement.previousSibling.previousSibling).style.display = 'block';
            ( <HTMLElement>( <HTMLElement>event.target ).parentElement).style.display = 'none';
        }
    }

    updateStartDt() {
        this.filterForm.patchValue({filterStart: $("#startDt").val() });
    }

    updateEndDt() {
        this.filterForm.patchValue({filterEnd: $("#endDt").val() });
    }

    errorOnTableData = false;
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
            this.tableData = data;
            this.loading3 = false;
            this.errorOnTableData = false;
            this.setPage(1);
            

        }, error => {
            this.loading3 = false;
            this.errorOnTableData = true;
            console.log('[ERROR - Fail to get tracking filter data] ' + error);
        })
        
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.tableData.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.tableData.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

            this.loading3 = true;
            this.getTrackData();
        }
        
    }

    downloading = false;
    download(){
        this.downloading = true;
        //change date format in CSV
        for(let i=0; i<this.tableData.length; i++) {
            this.tableData[i].logtime = moment(this.tableData[i].logtime).format('YYYY-MM-DD HH:mm:ss');
            this.tableData[i].comment = this.tableData[i].comment.replace('"',"'");
        }

        var csvData = this.ConvertToCSV(this.tableData);
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