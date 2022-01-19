import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./faq.css']
})

export class FaqComponent implements OnInit {
    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        //private _POST_api_Service: POST_Service,
        //private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
    }

    modules = {
        // formula: true,
        // imageResize: {},
        // syntax: true,
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            ['bold', 'italic', 'underline'], //['bold', 'strike'],   // toggled buttons
            // ['blockquote', 'code-block'],          
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'align': [] }],

            // ['clean']       
        ],
        //   placeholder: 'Compose an epic...',
        //   theme: 'snow'
    }

    currentUser;
    loading = true;
    data: any[];
    data2: any[];
    data3: any[];
    data4: any[];
    data5: any[];
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        type TrackingData = {
            idx: number, q: string, a: string
        };
        let myarray: TrackingData[] = [];
        let myarray2 = [];
        let myarray3 = [];
        let myarray4 = [];
        let myarray5 = [];
        this._GET_api_Service.GET_data('/faq/all')
            .subscribe(data => {
                console.log(data)
                this.loading = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].category === 'Era') {
                        myarray.push({
                            idx: i, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'Extraordinaire') {
                        myarray2.push({
                            idx: i, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'EraApp') {
                        myarray3.push({
                            idx: i, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'JobAds') {
                        myarray4.push({
                            idx: i, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'TmMove') {
                        myarray5.push({
                            idx: i, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                }
                this.data = myarray;
                this.data2 = myarray2;
                this.data3 = myarray3;
                this.data4 = myarray4;
                this.data5 = myarray5;
            },
            error => {
                this.showAlert('alertError');
                this._alertService.error("Loading FAQ Failed");
                console.log('[ERROR - FAQ] ' + error);
                this.loading = false;
            })
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    selQnA = {};
    selectQnA(item) {
        this.selQnA = item;
    }

}