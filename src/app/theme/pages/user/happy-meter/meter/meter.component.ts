import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
@Component({
    selector: 'happy-meter',
    templateUrl: './meter.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./meter.css']
})

export class MeterComponent implements OnInit {
    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        //private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
    }

    ngOnInit() {

    }

}