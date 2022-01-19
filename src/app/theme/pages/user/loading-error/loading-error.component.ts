import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-u-loading-error',
    templateUrl: './loading-error.html',
    //styleUrls: ['./hero-list.component.css']
})
export class UserLoadingErrorComponent implements OnInit {
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }
}
