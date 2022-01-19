import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'subFilter',
    pure: false
})
export class SubFilterPipe implements PipeTransform {
  // transform(items: any[], id: number, name: string, status: string, idp_year : number ) {
    transform(items: any[], search: string ) {
        try {
            if (search && items && items.length) {
                return items.filter(item => {
                    
                    if (
                        item.name.toLowerCase().indexOf(search.toLowerCase()) === -1 && 
                        item.staff_no.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    ) {
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
