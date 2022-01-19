import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

    constructor(private _router: Router,
        private _authService: AuthenticationService,
        private _route: ActivatedRoute) {
    }

    ngOnInit(): void {

        let loginType = 'user';
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.isAdmin == true) loginType = 'admin';
        else if (currentUser && currentUser.isEngagement == true) loginType = 'engage';
        else loginType = 'user';

        Helpers.setLoading(true);
        // reset login status
        this._authService.logout();

        if (loginType === 'admin')
            this._router.navigate(['/admin']);
        else if(loginType === 'engage')
            this._router.navigate(['/engagement']);
        else {
            localStorage.clear();
            this._router.navigate(['/welcome']);
        }
    }
}