import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], id: number, name: string, level: string, area: string, institution: string, cgpa: string, termDtStart: Date, termDtEnd : Date, status: string ) {
        try {
            if (items && items.length) {
                // 3
                return items.filter(item => {
                    if (id && item.internID != id) {
                        return false;
                    }
                    if (name && item.full_name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
                        return false;
                    }
                    if (level && item.educational_level.toLowerCase().indexOf(level.toLowerCase()) === -1) {
                        return false;
                    }
                    if (area && item.area_of_study.toLowerCase().indexOf(area.toLowerCase()) === -1) {
                        return false;
                    }
                    if (institution && item.institution.toLowerCase().indexOf(institution.toLowerCase()) === -1) {
                        return false;
                    }
                    if (cgpa && item.cgpa.toLowerCase().indexOf(cgpa.toLowerCase()) === -1) {
                        return false;
                    }
                    //
                    if (status && item.appStatus.toLowerCase().indexOf(status.toLowerCase()) === -1) {
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