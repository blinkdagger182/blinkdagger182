import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], Position_ID : string, Position_Name : string,  
        Staff_Name : string, Lob_Desc : string, Org_Unit_Department : string, Status : string ) {
        try {
            if (items && items.length) {            
                return items.filter(item => {
                                        
                    if (Position_ID && item.Position_ID.toLowerCase().indexOf(Position_ID.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Position_Name && item.Position_Name.toLowerCase().indexOf(Position_Name.toLowerCase()) === -1) {
                        return false;
                    } 
                    // if (Staff_ID && item.Staff_ID.toLowerCase().indexOf(Staff_ID.toLowerCase()) === -1) {
                    //     return false;
                    // } 
                    if (Staff_Name && item.Staff_Name.toLowerCase().indexOf(Staff_Name.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Lob_Desc && item.Lob_Desc.toLowerCase().indexOf(Lob_Desc.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Org_Unit_Department && item.Org_Unit_Department.toLowerCase().indexOf(Org_Unit_Department.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Status && item.Status.toLowerCase().indexOf(Status.toLowerCase()) === -1) {
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
    name: 'filterC',
    pure: false
})
export class FilterPipeC implements PipeTransform {
    transform(items: any[], cPosition_ID : string, cPosition_Name : string, cStaff_ID : string, 
        cStaff_Name : string, cLob_Desc : string, cOrg_Unit_Department : string, cStatus : string ) {
        try {
            if (items && items.length) {            
                return items.filter(item => {
                                        
                    if (cPosition_ID && item.cPosition_ID.toLowerCase().indexOf(cPosition_ID.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cPosition_Name && item.cPosition_Name.toLowerCase().indexOf(cPosition_Name.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cStaff_ID && item.cStaff_ID.toLowerCase().indexOf(cStaff_ID.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cStaff_Name && item.cStaff_Name.toLowerCase().indexOf(cStaff_Name.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cLob_Desc && item.cLob_Desc.toLowerCase().indexOf(cLob_Desc.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cOrg_Unit_Department && item.cOrg_Unit_Department.toLowerCase().indexOf(cOrg_Unit_Department.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (cStatus && item.cStatus.toLowerCase().indexOf(cStatus.toLowerCase()) === -1) {
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