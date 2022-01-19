import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { POST_Service } from '../../../../api/post.service';
// import { Helpers } from '../../../../helpers';
// import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
    templateUrl: "./default.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class mapsDefaultComponent implements OnInit {
    constructor(private routers: Router, private _POST_api_Service: POST_Service) {
    }

    ngOnInit() {
        this.syncTokenMaps();
        let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser'));
        if (!usrLoginLvl) {
            this.redirect('/unauthorized');
        }
    }

      // token for MAPS
  syncTokenMaps() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let req = {
        staff_id: currentUser.userid,
        u_token: currentUser.token
    }

    this._POST_api_Service.POST_MAPS_data('/maps/facilitate/sync_token', req).subscribe(res => {
      if (res.status === 'OK') {//Do nothing
      }
    }, error => {
        console.log('[ERROR] cannot get token ' + error);
    })
  }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }
}