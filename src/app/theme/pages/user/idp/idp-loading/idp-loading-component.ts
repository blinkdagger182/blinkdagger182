import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { En, My } from '../lang-vars';


@Component({
    selector: 'idp-loading',
    templateUrl: './idp-loading.html',
    //styleUrls: ['./hero-list.component.css']
})
export class IDPLoadingComponent implements OnInit {
    loading = true;

    constructor(
        private route: ActivatedRoute
    ) { }

    word: any;
    ngOnInit() {
        let lang = localStorage.getItem('idpLang');
        if (lang) {
            if (lang === 'en') {
                this.word = En;
            }
            if (lang === 'my') {
                this.word = My;
            }
        }
        else {
            this.word = En;
            localStorage.setItem('idpLang', 'en');
        }

        this.loading = false;
    }
}
