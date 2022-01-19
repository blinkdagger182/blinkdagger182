import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeAgoPipe } from 'time-ago-pipe';
import { StringBreakPipe } from '../_custom_pipe/string_break.pipe'

@NgModule({
    imports: [CommonModule],
    declarations: [TimeAgoPipe, StringBreakPipe],
    exports: [TimeAgoPipe, StringBreakPipe]
})
export class SharedModule { }