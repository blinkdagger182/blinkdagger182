import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'u-countdown',
    pure: true
})

export class UserCountdownPipe implements PipeTransform {
    transform(text: string, args: number) {
        let maxLength = args || 0;
        let length = text.length;

        return (maxLength - length);
    }
}