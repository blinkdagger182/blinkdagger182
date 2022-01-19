import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-u-unauthorized',
    templateUrl: './unauthorized.html',
    //styleUrls: ['./hero-list.component.css']
})
export class UserUnauthorizedComponent implements OnInit {
    loading = true;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loading = false;
    }
}
