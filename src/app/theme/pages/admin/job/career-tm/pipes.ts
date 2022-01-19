import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], termAdvId: number, termPosId: string, termJobTtl: string, termPosName: string,
        termLOB: string, termCreator: string, termTtlApp: number, termTtlAppMin: number, termTtlAppMax: number, termStatus: string, termDtStart: string, termDtEnd: string
        , termDtStart2: Date, termDtEnd2: Date) {
        try {
            if (items && items.length) {
                // 3
                return items.filter(item => {
                    if (termAdvId && item.idx != termAdvId) {
                        return false;
                    }
                    if (termPosId && item.pos_id.indexOf(termPosId) === -1) {
                        return false;
                    }
                    if (termJobTtl && item.job_ttl.toLowerCase().indexOf(termJobTtl.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termPosName && item.pos_name.toLowerCase().indexOf(termPosName.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termLOB && item.comp.toLowerCase().indexOf(termLOB.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termCreator && item.creator.toLowerCase().indexOf(termCreator.toLowerCase()) === -1) {
                        return false;
                    }
                    //
                    if (termTtlApp && item.total_applicant > termTtlApp) {
                        return false;
                    }
                    if (termTtlApp && isNaN(termTtlApp)) {
                        return false;
                    }
                    if (termTtlAppMin) {
                        if (isNaN(termTtlAppMin)) {
                            return false;
                        } else if (termTtlAppMin > item.total_applicant) {
                            return false;
                        }
                    }
                    if (termTtlAppMax) {
                        if (isNaN(termTtlAppMax)) {
                            return false;
                        } else if (item.total_applicant > termTtlAppMax) {
                            return false;
                        }
                    }
                    //
                    if (termStatus && item.status.toLowerCase().indexOf(termStatus.toLowerCase()) === -1) {
                        return false;
                    }

                    if (termDtStart && item.st_date == termDtStart) {
                        return false;
                    }
                    if (termDtEnd && item.end_date.toLowerCase().indexOf(termDtEnd.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termDtStart2) {
                        return false;
                    }
                    /* if (termDtStart2){
                        //console.log(termDtStart2);
                        //console.log(new Date(item.st_date2));
                        //let newST= item.st_date2.toDateString();
                        //console.log(newST);
                        //console.log(termDtStart2);
                        //if (item.st_date2.valueOf() != termDtStart2.valueOf()){
                        //return false;
                        //}
                        let a=item.st_date2;
                        let b=termDtStart2;
                        console.log(a);
                        console.log(a.getFullYear());
                        console.log(b.getFullYear());
                        if (a.getFullYear()!==b.getFullYear()){
                            return false;
                        } else if (a.getMonth()+1!==b.getMonth()+1){
                            return false;
                        } else if (a.getDate()!==b.getDate()){
                            return false;
                        }
                    } */

                    if (termDtEnd2 && item.end_date2 !== termDtEnd2) {
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