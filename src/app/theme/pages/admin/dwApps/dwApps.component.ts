import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

@Component({
    selector: 'app-dwApps',
    templateUrl: './dwApps.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./dwApps.css', '../../../../../assets/welcome/css/styles.css']
})
export class dwAppsComponent implements OnInit {
    constructor(private _script: ScriptLoaderService) {
    }

    currentUser;
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-dwApps',
            [
                // 'assets/welcome/js/jquery-3.3.1.min.js',
                'assets/welcome/js/bootstrap.min.js',
                'assets/welcome/js/popper.min.js',
                'assets/welcome/js/tilt.jquery.js',
                'assets/welcome/js/owl.carousel.min.js',
                'assets/welcome/js/jquery.validate.min.js',
                'assets/welcome/js/additional-methods.min.js',
                'assets/welcome/js/contact.js',
                'assets/welcome/js/script.js',
                'assets/welcome/js/scroll.js',
            ]);
    }

    goAndroid() {
        window.location.href = 'http://bit.ly/2LQSG5J​';
    }

    goIOS() {
        window.location.href = 'itms-services://?action=download-manifest&url=https://bit.ly/2NK2a4n';
    }
}