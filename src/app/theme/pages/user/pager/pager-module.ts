import { NgModule } from '@angular/core';
import { UserPagerService } from './pager.component';

@NgModule({
    imports: [
        // Modules
        //BrowserModule,
    ],

    declarations: [UserPagerService],

    providers: [
        // Services
    ],

    exports: [UserPagerService],
})
export class UserPagerModule { }