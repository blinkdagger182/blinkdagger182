import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
// import { Helpers } from '../../../../helpers';
// import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
    templateUrl: "./default.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class EngageDefaultComponent implements OnInit {

    constructor(private routers: Router) {
    }

    ngOnInit() {
        let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser'));
        if (!usrLoginLvl) {
            this.redirect('/unauthorized');
        }
    }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }
}