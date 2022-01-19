import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.html',
    //styleUrls: ['./hero-list.component.css']
})
export class AdminUnauthorizedComponent implements OnInit {
    loading = true;
    admin2Engage = false;
    admin2User = false;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute,
        private _router: Router,
    ) { 
        this.route.params.subscribe(params => {
            if(params.idx == 1) this.admin2User = true;
            else this.admin2Engage = true;
        });
    }

    ngOnInit() {
        this.loading = false;
    }

    redirectToEngagement(){
        localStorage.clear();
        this._router.navigate(['/engagement']);
    }

    redirectToUser(){
        localStorage.clear();
        this._router.navigate(['/welcome']);
    }
}
