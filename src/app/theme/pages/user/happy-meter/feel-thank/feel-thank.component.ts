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
    selector: 'feel-thank',
    templateUrl: './feel-thank.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../meter/meter.css']
})

export class FeelThankComponent implements OnInit {

    feelNum;

    constructor(
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private routers : Router,
        private http: Http, private activeRoute: ActivatedRoute,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        this.activeRoute.params.subscribe(params => {
            if(params.idx){
                this.feelNum = params.idx;
            }
        });
    }

    ngOnInit() {
        
    }


    getIcon(){
        if(this.feelNum == 1)
            return '/assets/app/media/img/logos/vhpy.png';
        else if(this.feelNum == 2)
            return '/assets/app/media/img/logos/hpy.png';
        else if(this.feelNum == 3)
            return '/assets/app/media/img/logos/ntrl.png';
        else if(this.feelNum == 4)
            return '/assets/app/media/img/logos/upst.png';
        else if(this.feelNum == 5)
            return '/assets/app/media/img/logos/vupst.png';
    }
    
}