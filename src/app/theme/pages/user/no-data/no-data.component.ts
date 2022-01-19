import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-u-no-data',
    templateUrl: './no-data.html',
    //styleUrls: ['./hero-list.component.css']
})
export class UserNoDataComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
