
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { ExorHistoryComponent } from './history.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        ExorHistoryComponent
    ],
    exports: [ExorHistoryComponent, RouterModule],
    // providers:[CountdownPipe]
})
export class ExOrHistoryModule { }
