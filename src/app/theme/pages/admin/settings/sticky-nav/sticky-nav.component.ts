import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vars } from '../settings-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';

@Component({
    selector: 'app-sticky-nav-component',
    templateUrl: './sticky-nav.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgStickyNavComponent implements OnInit {
    // links
    rJobUser = Vars.rJobUser; rClosedAds = Vars.rClosedAds; rBCast = Vars.rBCast;
    rFeedBack = Vars.rFeedBack; rVerSkills = Vars.rVerSkills; rVersioning = Vars.rVersioning;

    title1 = Vars.title1;
    jobUser = Vars.jobUser; closed = Vars.closed; ads = GlobalVariable.ADS; broadcastMsg = Vars.broadcastMsg;
    feedBack = Vars.feedBack; verifySkillsets = Vars.verifySkillsets; appVersioning = Vars.appVersioning; faqMngt = Vars.faqMngt;
    loading = true;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute,
        private routers: Router
    ) { }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    ngOnInit() {
        this.loading = false;
        let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser')).userlevel;
        if (usrLoginLvl < 100) {
            this.redirect('/settings/unauthorized');
        }
        /* this.heroes$ = this.route.paramMap.pipe(
           switchMap(params => {
             // (+) before `params.get()` turns the string into a number
             this.selectedId = +params.get('id');
             return this.service.getHeroes();
           })
         );*/
    }
}
