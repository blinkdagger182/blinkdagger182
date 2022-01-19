import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from "rxjs/Rx";
import { Location } from  '@angular/common';

@Component({
    selector: 'meter-feel',
    templateUrl: './meter-feel.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../meter/meter.css']
})

export class MeterFeelComponent implements OnInit {

    feelNum;
    reasons;
    loading = true;
    // addNote;
    todayDate = new Date();

    constructor(
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private routers : Router, private _location : Location,
        private http: Http, private activeRoute: ActivatedRoute,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        this.activeRoute.params.subscribe(params => {
            if(params.idx){
                this.feelNum = params.idx;
            }
            else
                this.feelNum = 0;
        });
    }

    ngOnInit() {
        if(this.feelNum > 0){
            let api = '/happy/reason';
            let postData = {
                id : this.feelNum
            }
            this._POST_api_Service.POST_data(api,postData).subscribe(res => {
                this.loading = false;
                this.reasons = res;
            })
        }


    }

    btnBackClick() {
        this._location.back();
    }

    feelSelected(num){
        this.routers.navigate(['/meter-feel',num]);
    }

    meterClicked(){
        this.routers.navigate(['/happy-meter']);
    }

    getFeelText(){
        if(this.feelNum == 1)
            return 'Very Happy';
        else if(this.feelNum == 2)
            return 'Happy';
        else if(this.feelNum == 3)
            return 'Neutral';
        else if(this.feelNum == 4)
            return 'Upset';
        else if(this.feelNum == 5)
            return 'Very Upset';
    }

    getIcon(){
        if(this.feelNum > 0){
            if(this.feelNum == 1)
                return '/assets/app/media/img/emoji/v_hpy.svg';
            else if(this.feelNum == 2)
                return '/assets/app/media/img/emoji/hpy.svg';
            else if(this.feelNum == 3)
                return '/assets/app/media/img/emoji/neutral.svg';
            else if(this.feelNum == 4)
                return '/assets/app/media/img/emoji/upset.svg';
            else if(this.feelNum == 5)
                return '/assets/app/media/img/emoji/v_upset.svg';
        }
    }

    getClass(){
        if(this.feelNum > 0){
            if(this.feelNum == 1) return 'v_happy-btn';
            else if(this.feelNum == 2) return 'happy-btn';
            else if(this.feelNum == 3) return 'neutral-btn';
            else if(this.feelNum == 4) return 'upset-btn';
            else if(this.feelNum == 5) return 'v_upset-btn';
        }
    }

    getColor(){
        if(this.feelNum == 1) return '#2ECC71';
        else if(this.feelNum == 2) return '#00A6FB';
        else if(this.feelNum == 3) return '#FFD103';
        else if(this.feelNum == 4) return '#FF8811';
        else if(this.feelNum == 5) return '#EA2803';
    }

    // clicked_submit1(){
    //     this.addNote = false;
    // }
    // submitFeeling(feelNum,no){
    //     if(no == 1){
    //         console.log("No note")
    //     }
    //     else{
    //         console.log("yes note")
    //     }
    //     document.getElementById('cancel_btn').click();

    //     this.routers.navigate(['/feel-thank',feelNum]);
    // }

    // addNoteClicked(){
    //     this.addNote = true;
    // }

    // selectedReasons = [];
    selectedReasonIndex = -1;

    reasonClicked(reasonId, btn_index){
        $('#errReason').addClass('m--hide');

        let clickClass = this.getClickClass();

        $('#resBtn_'+this.selectedReasonIndex).removeClass(clickClass);

        if(btn_index != this.selectedReasonIndex){
            this.selectedReasonIndex = btn_index;
            $('#resBtn_'+btn_index).addClass(clickClass);
        }
        else{
            $('#resBtn_'+this.selectedReasonIndex).addClass(clickClass);
        }

        // if(!this.isInArray(btn_index, this.selectedReasons)){
        //     this.selectedReasons.push(btn_index);
        //     $('#resBtn_'+btn_index).addClass(clickClass);
        // }
        // else{
        //     this.remove(btn_index, this.selectedReasons);
        //     $('#resBtn_'+btn_index).removeClass(clickClass);
        // }
        
        
        // console.log(this.selectedReasons)
        console.log(this.selectedReasonIndex)
    }

    
    submit_feeling(){
        let happymeterAPI = '/happy/meter/add';
        let note = (document.getElementById("feel_note") as HTMLInputElement).value;

        if(this.selectedReasonIndex >= 0 && note.length > 0){
            // console.log("reason", this.reasons[this.selectedReasonIndex].id);
            // console.log("note", note)
            note = note.replace('"',"'");


            let posData = {
                type : this.feelNum,
                reason : this.reasons[this.selectedReasonIndex].id,
                remark : note
            }

            this._POST_api_Service.POST_data(happymeterAPI, posData).subscribe( res => {
                // console.log(res);

                document.getElementById('thank-btn').click();
            }, err => {
                console.log('[ERROR] Submit Happy Meter: ' + err);
            });
            
        }
        else{
            if( this.selectedReasonIndex < 0)
                $('#errReason').removeClass('m--hide');
            if( note.length <= 0)
                $('#errRemark').removeClass('m--hide');
        }
    }

    keyInRemark(){
        $('#errRemark').addClass('m--hide');
    }

    thanksCloseClicked(){
        this.routers.navigate(['/index']);
    }

    // isInArray(element, array) {
    //     return array.indexOf(element) > -1;
    // }

    // remove(element, array) {
    //     const index = array.indexOf(element);
    //     array.splice(index, 1);
    // }

    getClickClass(){
        if(this.feelNum == 1) return 'vh-click';
        else if(this.feelNum == 2) return 'h-click';
        else if(this.feelNum == 3) return 'n-click';
        else if(this.feelNum == 4) return 'u-click';
        else if(this.feelNum == 5) return 'vu-click';
    }
}