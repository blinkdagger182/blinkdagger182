import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nomination-loading',
    templateUrl: 'nomination-loading.component.html',
})
export class NominationLoadingComponent implements OnInit {
    loading = true;

    constructor(
    ) { }

    ngOnInit() {
    
        this.loading = false;
    }

}
