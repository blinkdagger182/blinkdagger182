import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';

// ...
import { PagerService } from '../pager/pager.component';
import { FilterPipe, SortByPipe } from './job-adv-prof-pipes';

@NgModule({
    imports: [
        // Modules
        //BrowserModule,
    ],

    declarations: [
        // Components &amp; directives
        FilterPipe, SortByPipe
    ],

    providers: [PagerService],

    exports: [
        // ...
        FilterPipe, SortByPipe
    ],
})
export class SharedJobAdvPipeModule { }