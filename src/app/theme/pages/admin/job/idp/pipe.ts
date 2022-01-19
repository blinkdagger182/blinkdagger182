import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], id: number, name: string, status: string, idp_year : number ) {
        try {
            if (items && items.length) {            
                return items.filter(item => {
                    if (id && item.id != id) {
                        return false;
                    }                    
                    if (name && item.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
                        return false;
                    }                   
                    if (status && item.text_en.toLowerCase().indexOf(status.toLowerCase()) === -1) {
                        return false;
                    }
                    if (idp_year && item.idp_year != idp_year) {
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
/*
@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        try {
            return items.sort((a, b) => { return b[sortedBy] - a[sortedBy] });
        } catch {
            return null;
        }
    }
}*/