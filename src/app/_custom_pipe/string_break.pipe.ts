import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'stringBreak' })
export class StringBreakPipe implements PipeTransform {
    transform(msg: string) {
        return msg.replace(/\n/g, '<br/>') || msg.replace(/\u21B5/g, '<br/>');
    }
}