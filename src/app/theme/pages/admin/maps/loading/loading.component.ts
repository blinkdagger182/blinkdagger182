import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-maps-loading',
    templateUrl: './loading.component.html',
    //styleUrls: ['./hero-list.component.css']
})
export class mapsLoadingComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
