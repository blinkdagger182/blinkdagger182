import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-e-unauthorized-page',
    templateUrl: './unauthorized.html',
    //styleUrls: ['./hero-list.component.css']
})
export class EngageUnauthorizedPageComponent implements OnInit {
    loading = true;
    engage2Admin = false;
    engage2User = false;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute, 
        private _router: Router,
    ) { 
        this.route.params.subscribe(params => {
            if(params.idx == 1) this.engage2User = true;
            else this.engage2Admin = true;
        });
    }

    ngOnInit() {
        this.loading = false;
    }

    redirectToAdmin() {
        localStorage.clear();
        this._router.navigate(['/admin']);
    }

    redirectToUser(){
        localStorage.clear();
        this._router.navigate(['/welcome']);
    }
}
