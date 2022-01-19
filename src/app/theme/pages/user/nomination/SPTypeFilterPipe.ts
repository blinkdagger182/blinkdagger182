import { Pipe, PipeTransform } from '@angular/core';

import { Successor } from './successor';

@Pipe({
    name: 'successorfilter',
})
export class SuccessorFilterPipe implements PipeTransform {
  transform(items: Successor[], filter: Successor): Successor[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Successor) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Successor} successor The successor to compare to the filter.
   * @param {Successor} filter The filter to apply.
   * @return {boolean} True if successor satisfies filters, false if not.
   */
  applyFilter(successor: Successor, filter: Successor): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (successor[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (successor[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}