import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-u-unauthorized-page',
    templateUrl: './unauthorized.html',
    //styleUrls: ['./hero-list.component.css']
})
export class UserUnauthorizedPageComponent implements OnInit {
    loading = true;
    user2Engage = false;
    user2Admin = false;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute, 
        private _router: Router,
    ) { 
        this.route.params.subscribe(params => {
            if(params.idx == 1) this.user2Engage = true;
            else this.user2Admin = true;
        });
    }

    ngOnInit() {
        this.loading = false;
    }

    redirectToAdmin() {
        localStorage.clear();
        this._router.navigate(['/admin']);
    }

    redirectToEngagement(){
        localStorage.clear();
        this._router.navigate(['/engagement']);
    }
}
