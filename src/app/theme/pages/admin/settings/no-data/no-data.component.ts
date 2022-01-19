import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-settings-no-data',
    templateUrl: './no-data.html',
    //styleUrls: ['./hero-list.component.css']
})
export class StgNoDataComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
