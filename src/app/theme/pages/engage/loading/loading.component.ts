import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-engage-loading',
    templateUrl: './loading.html',
    //styleUrls: ['./hero-list.component.css']
})
export class EngageLoadingComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
