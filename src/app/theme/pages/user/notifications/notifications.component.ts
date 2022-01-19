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
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    encapsulation: ViewEncapsulation.None,

})
export class NotificationsComponent implements OnInit {

    imgAPIUrl = GlobalVariable.BASE_API_URL + '/get/image';
    apiKey = GlobalVariable.API_KEY;
    total;
    constructor(private datePipe: DatePipe, private _GET_api_Service: GET_Service,
        private _POST_api_service : POST_Service, private routers : Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        
    }

    loading = true;
    notifications: any[];
    noti_imgSrc;
    user_img: boolean;
    updClickNotiAPI = '/notification/mark/click';
    
    ngOnInit() {

      type TrackingData = {
          idx: number, app: string, category: string, class: string, click: number, 
          created_by: string, creator_name: string, datetime: string, description: string,
          id: number, image_src: string, img_exist: boolean, read: number, success: number, 
          target_userid: string, title: string, type: string,
      };
      let myarray: TrackingData[] = [];
      this._GET_api_Service.GET_data('/notification/get').subscribe(data => {
          this.loading = false;

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

          this.notifications = myarray;
          // console.log(this.data)
          this.total = this.notifications.length;

      },
      error => {
          this.showAlert('alertError');
          this._alertService.error("Loading Notifications Failed");
          console.log('[ERROR - Notifications] ' + error);
          this.loading = false;
      })

      localStorage.setItem('tabMode', JSON.stringify('noti')); // to save mode

        
    }

    notificationClick(index){
        let msg = this.notifications[index]
        console.log(msg)
        let posId = {
            "notificationID" : msg.id
        }
        this.notifications[index].click = 1;

        this._POST_api_service.POST_data(this.updClickNotiAPI, posId).subscribe(res => {
            switch(msg.app){
                case 'TeamUp':{
                  switch(msg.class){
                    case 'Circle':{
                      // open friend profile with msg.Category
                      this.routers.navigate(['/circle', msg.category]);
                      break;
                    }
                    case 'Job':{
                      // open lob list with msg.Category 
                      this.routers.navigate(['/user-job']);
                      break;
                    }
                    case 'Extraordinaire':{
                      // open extradrdinaire with msg.Category 
                      // this.routers.navigate(['/extraordinaire']);
                      document.getElementById('extra-btn').click();
                      break;
                    }
                    case 'AdvTracker':{
                      // open tracking page
                      this.routers.navigate(['/user-job/tracking']);
                      break;
                    }
                  
                    case 'Profile':{
                      // open own profile
                      this.routers.navigate(['/profile']);
                      break;
                    }
                    case 'Comment':{
                      // open related comment
                      this.routers.navigate(['/user-job/comments', msg.category]);
                      break;
                    }
                    case 'HappyMeter':{
                      // open own profile
                      this.routers.navigate(['/happy-meter']);
                      break;
                    }
                    case 'Birthday':{
                      // open list of birthday who wish you
                      break;
                    }
                    case 'Wish':{
                      break;
                    }
                    case 'Url':{
                      window.open(msg.category);
                      break;
                    }
                    case 'harrison':{
                      // open own profile
                      window.open(msg.category);
                      break;
                    }
                    case 'functional':{
                      // open own profile
                      this.routers.navigate(['/user-job/tracking'], { queryParams: { node: 2, id: msg.category } });
                      break;
                    }
                    case 'talent':{
                      // open own profile
                      this.routers.navigate(['/user-job/tracking'], { queryParams: { node: 1, id: msg.category } });
                      break;
                    }
                    default:{
                      // open notification page
                      this.routers.navigate(['/notifications']);
                      break;
                    }
                  }
                  break;
                }
                default:{
                  // open notification page
                  this.routers.navigate(['/notifications']);
                  break;
                }
            }
        },
        error => {
            console.log('[ERROR - Notifications] ' + error);
        })
    }

    checkType(notiType){
        return (notiType == 'like' || notiType == 'job' || notiType == 'extraordinaire' || notiType == 'comment' || notiType == 'happymeter' || notiType == 'birthday' || notiType == 'video' ) ? false : true;
    }

    //navClick(){
       
     // this.routers.navigate(['/interview-tracking']);
  //  }

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