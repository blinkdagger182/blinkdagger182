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
    selector: 'survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.css'],
    encapsulation: ViewEncapsulation.None,

})
export class surveyComponent implements OnInit {


    constructor(private datePipe: DatePipe, private _GET_api_Service: GET_Service,
        private _POST_api_service : POST_Service, private routers : Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        
    }
    
    ngOnInit() {
        
    }

}