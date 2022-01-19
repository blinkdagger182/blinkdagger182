import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchfilter',
    pure: false
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter || filter == undefined) {
            return items;
        }
        
        // return items.filter(item => console.log(item);
        return items.filter(item => item.name == filter);
    }
}
