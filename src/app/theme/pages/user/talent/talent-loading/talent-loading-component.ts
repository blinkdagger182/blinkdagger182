import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'talent-loading',
    templateUrl: './talent-loading.html',
})
export class TalentLoadingComponent implements OnInit {
    loading = true;

    constructor(
    ) { }

    ngOnInit() {
    
        this.loading = false;
    }
}
