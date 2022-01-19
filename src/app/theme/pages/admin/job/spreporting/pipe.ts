import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[],Successor_Name : string, 
        Successor_LOB : string, Successor_Division : string, Position_Name : string, Readiness : string ) {
        try {
            if (items && items.length) {            
                return items.filter(item => {
                                        
                   
                    if (Successor_Name && item.Successor_Name.toLowerCase().indexOf(Successor_Name.toLowerCase()) === -1) {
                        return false;
                    }  
                    if (Successor_LOB && item.Successor_LOB.toLowerCase().indexOf(Successor_LOB.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Successor_Division && item.Successor_Division.toLowerCase().indexOf(Successor_Division.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Position_Name && item.Position_Name.toLowerCase().indexOf(Position_Name.toLowerCase()) === -1) {
                        return false;
                    } 
                    if (Readiness && item.Readiness.toLowerCase().indexOf(Readiness.toLowerCase()) === -1) {
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