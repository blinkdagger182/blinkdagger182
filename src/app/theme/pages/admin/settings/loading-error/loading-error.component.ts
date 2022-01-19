import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-settings-loading-error',
    templateUrl: './loading-error.html',
    //styleUrls: ['./hero-list.component.css']
})
export class StgLoadingErrorComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
