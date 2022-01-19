import { NgModule } from '@angular/core';
import { PagerService } from './pager.component';

@NgModule({
    imports: [
        // Modules
        //BrowserModule,
    ],

    declarations: [PagerService],

    providers: [
        // Services
    ],

    exports: [PagerService],
})
export class PagerModule { }