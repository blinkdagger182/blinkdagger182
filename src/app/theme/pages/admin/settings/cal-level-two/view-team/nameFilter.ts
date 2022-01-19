import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class NameFilterPipe implements PipeTransform {
    transform(items: any[], name: string) {
        try {
            if (name && items && items.length) {
                return items.filter(item => {                   
                    if (item.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
                        return false;
                    }
                    return true;
                })
            }
            else {
                return items;
            }
        } catch {
            return null;
        }
    }
}