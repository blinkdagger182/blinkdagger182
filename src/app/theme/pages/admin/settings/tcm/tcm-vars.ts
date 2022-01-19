export const tcmVars = Object.freeze({
    title1: 'TCM',
    title2: 'TCM Team',

    postCalibrateListFilters: '/tc/calibrate/get_calibrate_list_by_filters',
    postGetNineGridBoxFilter: '/tc/calibrate/get_box_matrix_by_filter',
    getInfoEmployeeForCalibration: '/tc/calibrate/get_cal_det_by_box_chg_id',
    postGetDetailBasicInfo: '/tc/basicInfo',
    getUserProfile: '/user/getProfile',
    getImg: '/get/image',
    postCalibrateGm: '/tc/calibrate/save_calibrate',
    getNineBoxList: '/tc/get_box_matrix',
    postSubmitCalibrateGmEvp: '/tc/calibrate/submit',
    getHistoryAfterCalibrate: '/tc/calibrate/get_calibrate_sole',
    getFilterByState: '/tc/calibrate/get_cal_list_fl_state',
    getFilterByLob: '/tc/calibrate/get_cal_list_fl_lob',
    getFilterByDepartment: '/tc/calibrate/get_cal_list_fl_dept',
    getFilterByUnit: '/tc/calibrate/get_cal_list_fl_unit',
    getFilterBySupervisor: '/tc/calibrate/get_cal_list_fl_supv',
    getFilterByStaffId: '/tc/calibrate/get_cal_list_fl_stf_id',
    getFilterByBand: '/tc/calibrate/get_cal_list_fl_band',
    getFilterByNGridBox: '/tc/calibrate/get_cal_list_fl_n_grid_box',
    postGetParticularCellNGridBox: '/tc/calibrate/get_employee_list_by_fcell',
    postRevertFromMgr: '/tc/calibrate/revert_calibration_single',
    postRevertFromGm:'/tc/classify/revert_calibration_single',


    //TCM view
    postTCMCalibrateList: '/tc/classify/get_calibrate_list_by_filters',
    postCalibrateSp: '/tc/classify/get_employee_list_by_fcell',
    postRevertSingle: '/tc/classify/revert_calibration_single', 
    postRevertFromEvp:'/tc/admin/revert_calibration_single',

    pageSize: 10,

    //TC - Manager View
    postSaveCalibrate: '/tc/calibrate/save_calibrate',

    APIPostAdd: '/localuser/add',
    APIGetList: '/localuser/list',

   
}); 