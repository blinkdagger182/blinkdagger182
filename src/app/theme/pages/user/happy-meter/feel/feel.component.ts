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
@Component({
    selector: 'meter-feel',
    templateUrl: './feel.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../meter/meter.css']
})

export class FeelComponent implements OnInit {

    // feelNum;
    reasons;
    loading = true;
    addNote;
    todayDate = new Date();

    constructor(
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private routers : Router,
        private http: Http, private activeRoute: ActivatedRoute,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        // this.activeRoute.params.subscribe(params => {
        //     if(params.idx){
        //         this.feelNum = params.idx;
        //     }
        //     else
        //         this.feelNum = 0;
        // });
    }

    ngOnInit() {
        // if(this.feelNum > 0){
        //     let api = '/happy/reason';
        //     let postData = {
        //         id : this.feelNum
        //     }
        //     this._POST_api_Service.POST_data(api,postData).subscribe(res => {
        //         this.loading = false;
        //         this.reasons = res;
        //     })
        // }


    }

    feelSelected(num){
        this.routers.navigate(['/meter-feel',num]);
    }

    meterClicked(){
        // this.routers.navigate(['/happy-meter']);
    }

    // getIcon(){
    //     if(this.feelNum > 0){
    //         if(this.feelNum == 1)
    //             return '/assets/app/media/img/logos/v_happy.png';
    //         else if(this.feelNum == 2)
    //             return '/assets/app/media/img/logos/happy.png';
    //         else if(this.feelNum == 3)
    //             return '/assets/app/media/img/logos/neutral.png';
    //         else if(this.feelNum == 4)
    //             return '/assets/app/media/img/logos/upset.png';
    //         else if(this.feelNum == 5)
    //             return '/assets/app/media/img/logos/v_upset.png';
    //     }
    // }

    // getClass(){
    //     if(this.feelNum > 0){
    //         if(this.feelNum == 1) return 'v_happy-btn';
    //         else if(this.feelNum == 2) return 'happy-btn';
    //         else if(this.feelNum == 3) return 'neutral-btn';
    //         else if(this.feelNum == 4) return 'upset-btn';
    //         else if(this.feelNum == 5) return 'v_upset-btn';
    //     }
    // }

    // getColor(){
    //     if(this.feelNum == 1) return '#26c281';
    //     else if(this.feelNum == 2) return '#fc766a';
    //     else if(this.feelNum == 3) return '#4caed8';
    //     else if(this.feelNum == 4) return '#a676ff';
    //     else if(this.feelNum == 5) return '#f0577c';
    // }

    clicked_submit1(){
        this.addNote = false;
    }
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

    addNoteClicked(){
        this.addNote = true;
    }

    // selectedReasons = [];
    // reasonClicked(reasonId, btn_index){
    //     let clickClass = this.getClickClass();

    //     if(!this.isInArray(btn_index, this.selectedReasons)){
    //         this.selectedReasons.push(btn_index);
    //         $('#resBtn_'+btn_index).addClass(clickClass);
    //     }
    //     else{
    //         this.remove(btn_index, this.selectedReasons);
    //         $('#resBtn_'+btn_index).removeClass(clickClass);
    //     }


    //     console.log(this.selectedReasons)

    // }

    // isInArray(element, array) {
    //     return array.indexOf(element) > -1;
    // }

    // remove(element, array) {
    //     const index = array.indexOf(element);
    //     array.splice(index, 1);
    // }

    // getClickClass(){
    //     if(this.feelNum == 1) return 'vh-click';
    //     else if(this.feelNum == 2) return 'h-click';
    //     else if(this.feelNum == 3) return 'n-click';
    //     else if(this.feelNum == 4) return 'u-click';
    //     else if(this.feelNum == 5) return 'vu-click';
    // }
}