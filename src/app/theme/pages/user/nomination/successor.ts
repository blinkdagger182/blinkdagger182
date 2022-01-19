/**
 * Book entity, used for filtering as well.
 */
export class Successor {
    /**
     * @type {number} id Unique numeric identifier.
     */
    id: number;
    
    /**
     * @type {number} successor type id.
     */
    successor_type_id: number;
  
    /**
     * @type {string} name of the successor.
     */
    name: String;
  
    /**
     * @type {number} persno of the successor.
     */
    pers_no: number;

    /**
     * @type {string} staff_no of the successor.
     */
    staff_no: String;

    /**
     * @type {string} post description of the successor.
     */
    post_desc: String;

    cell: any;
    talent_class: any;
    image_url: String;
    state_id: number;


  }