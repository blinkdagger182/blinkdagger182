import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-admin-loading',
    templateUrl: './loading.html',
    //styleUrls: ['./hero-list.component.css']
})
export class AdmLoadingComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
