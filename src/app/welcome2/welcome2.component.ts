import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../_services/script-loader.service';

@Component({
    selector: 'app-welcome2',
    templateUrl: './welcome2.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./frontpage/css/style.css', './frontpage/css/skins/default.css',]
})
export class Welcome2Component implements OnInit {
    constructor(private _script: ScriptLoaderService, ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-welcome2',
            [
                //'assets/frontpage/css/style.css','assets/frontpage/css/skins/default.css',
                'assets/frontpage/js/jquery.js', 'assets/frontpage/js/jquery.easing.min.js',
                'assets/frontpage/js/jquery.malihu.PageScroll2id.min.js', 'assets/frontpage/js/jquery.mb.YTPlayer.min.js',
                'assets/frontpage/js/jquery.sticky.js', 'assets/frontpage/js/waypoints.min.js',
                'assets/frontpage/js/jquery.counterup.min.js', 'assets/frontpage/js/jquery.stellar.js',
                'assets/frontpage/js/owl.carousel.min.js', 'assets/frontpage/js/wow.min.js',
                'assets/frontpage/js/jquery.validate.min.js', 'assets/frontpage/js/jquery.ajaxchimp.min.js',
                'assets/frontpage/js/custom.js'
                /*    //'./frontpage/js/jquery.js', 
                    './frontpage/js/jquery.easing.min.js',
                    './frontpage/js/jquery.malihu.PageScroll2id.min.js', './frontpage/js/jquery.mb.YTPlayer.min.js',
                    './frontpage/js/jquery.sticky.js', './frontpage/js/waypoints.min.js',
                    './frontpage/js/jquery.counterup.min.js', './frontpage/js/jquery.stellar.js',
                    './frontpage/js/owl.carousel.min.js', './frontpage/js/wow.min.js',
                    //'./frontpage/js/jquery.validate.min.js', 
                    './frontpage/js/jquery.ajaxchimp.min.js',
                    './frontpage/js/custom.js'*/
            ]);
    }
}