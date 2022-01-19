import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vars } from '../settings-vars';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.html',
    //styleUrls: ['./hero-list.component.css']
})
export class StgUnauthorizedComponent implements OnInit {
    title1 = Vars.title1;
    feedBack = Vars.feedBack;
    loading = true;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loading = false;
        /* this.heroes$ = this.route.paramMap.pipe(
           switchMap(params => {
             // (+) before `params.get()` turns the string into a number
             this.selectedId = +params.get('id');
             return this.service.getHeroes();
           })
         );*/
    }
}
