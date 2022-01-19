import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
// import { Helpers } from '../../../../helpers';
// import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    // selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body.disable-asidebar-pad",
    selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.disable-asidebar-pad",
    templateUrl: "./default.component.html",
    styleUrls: [ './default.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserDefaultComponent implements OnInit {

    constructor(private routers: Router) {
    }

    headPadding = '';

    imgTimeZone;
    ngOnInit() {

        let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser'));
        if (!usrLoginLvl) {
            this.redirect('/unauthorized');
        }

        // if(this.routers.url !== '/index' && this.routers.url !== '/features' && this.routers.url !== '/user-job' && this.routers.url !== '/user-job/search-job') {
        //     this.headPadding = "addPadding"
        // }
        // else {
        //     this.headPadding = '';
        // }
    }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }
}