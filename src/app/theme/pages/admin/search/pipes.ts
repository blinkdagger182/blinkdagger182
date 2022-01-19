import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], pers_no: string, staff_no: string, name: string,  company_desc: string, lob_desc: string, skill_matched: number) {
        try {
            if (items && items.length) {            
                return items.filter(item => {
                    if (pers_no && item.pers_no.toLowerCase().indexOf(pers_no.toLowerCase()) === -1) {
                        return false;
                    }
                    if (staff_no && item.staff_no.toLowerCase().indexOf(staff_no.toLowerCase()) === -1) {
                        return false;
                    }                   
                    if (name && item.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
                        return false;
                    }                   
                    if (company_desc && item.company_desc.toLowerCase().indexOf(company_desc.toLowerCase()) === -1) {
                        return false;
                    }
                    if (lob_desc && item.lob_desc.toLowerCase().indexOf(lob_desc.toLowerCase()) === -1) {
                        return false;
                    }
                    if (skill_matched && item.skill_matched != skill_matched) {
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
