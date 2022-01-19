import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-loading',
    templateUrl: './loading.html',
    //styleUrls: ['./hero-list.component.css']
})
export class UserLoadingComponent implements OnInit {
    loading = true;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loading = false;
    }
}
