import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

@Component({
    selector: 'app-dwApps',
    templateUrl: './dwApps.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./dwApps.css', '../../default/blank/assets/css/styles.css']
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
                'assets/blank/js/additional-methods.min.js',
                'assets/blank/js/bootstrap.min.js',
                'assets/blank/js/contact.js',
                'assets/blank/js/jquery-3.3.1.min.js',
                'assets/blank/js/jquery.validate.min.js',
                'assets/blank/js/owl.carousel.min.js',
                'assets/blank/js/popper.min.js',
                'assets/blank/js/script.js',
                'assets/blank/js/scroll.js',
                'assets/blank/js/tilt.jquery.js',
            ]);
    }

    goAndroid() {
        window.location.href = 'http://bit.ly/2DE3MMz';
    }

    goIOS() {
        window.location.href = 'itms-services://?action=download-manifest&url=https://bit.ly/2NK2a4n​';
    }
}