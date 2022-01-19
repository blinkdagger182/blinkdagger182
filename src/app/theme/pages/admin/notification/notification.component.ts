import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { POST_Service } from '../../../api/post.service';
import { GlobalVariable } from "../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    encapsulation: ViewEncapsulation.None,

})
export class NotificationComponent implements OnInit {

    imgAPIUrl = GlobalVariable.BASE_API_URL + '/get/image';
    apiKey = GlobalVariable.API_KEY;
    total;
    constructor(private datePipe: DatePipe, private _GET_api_Service: GET_Service,
        private _POST_api_service : POST_Service, private routers : Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        
    }

    loading = true;
    data: any[];
    noti_imgSrc;
    user_img: boolean;
    updClickNotiAPI = '/notification/mark/click';
    
    ngOnInit() {

        type TrackingData = {
            idx: number, app: string, category: string, class: string, click: number, 
            created_by: string, creator_name: string, datetime: string, description: string,
            id: number, image_src: string, img_exist: boolean, read: number, success: number, 
            target_userid: string, title: string, type: string
        };
        let myarray: TrackingData[] = [];
        this._GET_api_Service.GET_data('/notification/get').subscribe(data => {
            this.loading = false;
            console.log(data)

            for (let i = 0; i < data.body.length; i++) {

                if (data.body[i].image_url)
                    this.user_img = true;
                else
                    this.user_img = false;

                this.noti_imgSrc = this.imgAPIUrl + '/' + data.body[i].image_url + '?api_key=' + this.apiKey;

                myarray.push({
                    idx: i, app: data.body[i].app, category: data.body[i].category, class: data.body[i].class, click: data.body[i].click, 
                    created_by: data.body[i].created_by, creator_name: data.body[i].creator_name, datetime: data.body[i].datetime, description: data.body[i].description,
                    id: data.body[i].id, image_src: this.noti_imgSrc, img_exist: this.user_img, read: data.body[i].read, success: data.body[i].success, 
                    target_userid: data.body[i].target_userid, title: data.body[i].title, type: data.body[i].type
                });
            }

            this.data = myarray;
            // console.log(this.data)
            this.total = this.data.length;

        },
        error => {
            this.showAlert('alertError');
            this._alertService.error("Loading Notifications Failed");
            console.log('[ERROR - Notifications] ' + error);
            this.loading = false;
        })
        
    }

    // notificationClick(noti_Id, created_by, noti_class){
    //     let posId = {
    //         notificationID : noti_Id
    //     }

    //     this._POST_api_service.POST_data(this.updClickNotiAPI, posId).subscribe(res => {
    //         if(noti_class === 'Circle'){
    //             this.routers.navigate(['/other-profile', created_by]);
    //         }
    //         else if(noti_class === 'AdvTracker'){
    //             this.routers.navigate(['/user-job/tracking']);
    //         }
    //         else if(noti_class === 'Job'){
    //             this.routers.navigate(['/user-job']);
    //         }
    //         else{
    //             this.routers.navigate(['/index']);
    //         }

    //     },
    //     error => {
    //         console.log('[ERROR - Notifications] ' + error);
    //     })
    // }

    checkType(notiType){
        return (notiType == 'like' || notiType == 'job' ) ? false : true;
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    now : any = new Date();
    before;
    older_24Hrs(date){
        this.before = new Date(date);
        return ( ( this.now - this.before ) > ( 1000 * 60 * 60 * 24 )  ) ? true : false;
    }

}