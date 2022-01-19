import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnLang, MyLang } from '../language/language-vars';


@Component({
    selector: 'job-loading',
    templateUrl: './job-loading.html',
    //styleUrls: ['./hero-list.component.css']
})
export class JobLoadingComponent implements OnInit {
    loading = true;

    constructor(
        //private service: HeroService,
        private route: ActivatedRoute
    ) { }

    word: any;
    ngOnInit() {
        let lang = localStorage.getItem('lang');
        if (lang) {
            if (lang === 'en') {
                this.word = EnLang;
            }
            if (lang === 'my') {
                this.word = MyLang;
            }
        }
        else {
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
        }

        this.loading = false;
    }
}
