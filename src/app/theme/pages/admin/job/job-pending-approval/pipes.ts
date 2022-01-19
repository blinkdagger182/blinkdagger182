import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'intextfilter',
    pure: false
})
export class IntExtPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter || filter == undefined) {
            return items;
        }
        
        // return items.filter(item => console.log(item);
        return items.filter(item => item.source == filter);
    }
}
