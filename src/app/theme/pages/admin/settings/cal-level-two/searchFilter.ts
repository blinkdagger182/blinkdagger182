import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter1',
    pure: false
})
export class DepartmentFilterPipe implements PipeTransform {
    transform(items: any[], org_unit_desc: string) {
        try {
            if (items && items.length) {
                return items.filter(item => {                
                    if (org_unit_desc && item.org_unit_desc.toLowerCase().indexOf(org_unit_desc.toLowerCase()) === -1) {
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

@Pipe({
    name: 'filter2',
    pure: false
})
export class UnitFilterPipe implements PipeTransform {
    transform(items: any[], sub_org_desc: string) {
        try {
            if (items && items.length) {
                return items.filter(item => {                
                    if (sub_org_desc && item.sub_org_desc.toLowerCase().indexOf(sub_org_desc.toLowerCase()) === -1) {
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

@Pipe({
    name: 'filter3',
    pure: false
})
export class SupervisorFilterPipe implements PipeTransform {
    transform(items: any[], search: string) {
        try {
            if (items && items.length) {
                return items.filter(item => {                
                    if (search && item.search.toLowerCase().indexOf(search.toLowerCase()) === -1) {
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

@Pipe({
    name: 'filter4',
    pure: false
})
export class StaffIdFilterPipe implements PipeTransform {
    transform(items: any[], search: string) {
        try {
            if (items && items.length) {
                return items.filter(item => {                
                    if (search && item.search.toLowerCase().indexOf(search.toLowerCase()) === -1) {
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