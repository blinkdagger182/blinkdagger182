import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], termAdvId: string, termPosName: string, termCompany: string,
        termLOB: string, termDepartment: string) {
        try {
            if (items && items.length) {
                // 3
                return items.filter(item => {
                    if (termAdvId && item.pos_id.toLowerCase().indexOf(termAdvId.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termPosName && item.pos_name.toLowerCase().indexOf(termPosName.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termCompany && item.company.toLowerCase().indexOf(termCompany.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termLOB && item.lob.toLowerCase().indexOf(termLOB.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termDepartment && item.dep.toLowerCase().indexOf(termDepartment.toLowerCase()) === -1) {
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
        //console.log('sortedBy', sortedBy);
        try {
            return items.sort((a, b) => { return b[sortedBy] - a[sortedBy] });
        } catch {
            return null;
        }
    }
}*/