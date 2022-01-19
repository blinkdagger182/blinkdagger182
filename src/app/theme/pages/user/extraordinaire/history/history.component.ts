import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vars } from '../extraordinaire-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { UserPagerService } from '../../pager/pager.component';
import { ExorSummaryComponent } from '../summary/summary.component';
import { HistoryVars } from './history-vars';
@Component({
    selector: 'app-u-exor-history-component',
    templateUrl: './history.component.html',
    //styleUrls: ['../approver.component.css']
})
export class ExorHistoryComponent implements OnInit {
    // links
    rBCast = Vars.rBCast;

    ads = GlobalVariable.ADS; broadcastMsg = Vars.broadcastMsg;
    loading = true;

    // new params
    summDataApprHist: any;


    constructor(
        private pagerService: UserPagerService,
        private route: ActivatedRoute,
        private routers: Router,
        private summData: ExorSummaryComponent
    ) { }

    ngOnInit() {
        this.summDataApprHist = this.summData.summDataApprHist;
        this.setPage(1);
        this.loading = false;
        //let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser')).userlevel; 
        //console.log("usrLoginLvl",usrLoginLvl);
        // if (usrLoginLvl<100){
        //     this.redirect('/settings/unauthorized');
        // }

    }

    exorShowDetails(idx) {
        this.routers.navigate(['/extraordinaire/details', idx]);
    }

    getStatusColor(status: number) {
        let ret: string;
        switch (status) {
            case 1: case 2: ret = 'info'; break;
            case 15: case 16: case 7: case 8: ret = 'danger'; break;
            case 17: ret = 'secondary'; break;
            case 3: ret = 'success'; break;
            case 6: ret = 'primary'; break;
            case 4: case 5: ret = 'warning'; break;
        }
        return ret;
    }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    private allItems: any[];// array of all items to be paged    
    pager: any = {};// pager object    
    pagedItems: any[];// paged items
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.summDataApprHist.length, page, HistoryVars.maxPerPage);
        this.pagedItems = this.summDataApprHist.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
