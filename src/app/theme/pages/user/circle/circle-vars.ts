export const CircleVars = Object.freeze({


    APIsearchCircle: '/circle/search', // Post search name
    APIcircleRecommend: '/circle/friend/request/recommended', // Get friend recomended
    APIcirclePending: '/circle/friend/request/pending', // Get friend pending
    APIcircleAll: '/circle/friend/getAll', // Get all request friends
    APIgetProfile: '/circle/friend/getProfile', // Get friend's profile
    APIacceptFriend: '/circle/friend/request/accept', //Post accept/follow friend (in Pending part)
    APIsendRequestFr: '/circle/friend/request/sent', // Post send Request Friend (in Recommended part)
    APIrejectFriend: '/circle/friend/request/unfriend',// Post to reject/not follow friend 
    APIallFriend: '/circle/people/friend/getAll', // Post all Pending, Recommended an all friends
    APIremoveFriend: '/circle/friend/request/recommended/remove',
    APIuserProfile: '/user/career/profile', //Post user profile
    APIListfriendEndorse: '/skillset/user/friend/endorse/get', //Post list endorsement friend
    APIgetPersonalDetail: '/api/user/getProfile', //get current user detail
    APIendorseSkillset: '/skillset/user/endorse', //Post endorse other skillset
    APIDeendorseSkillset: '/skillset/user/de-endorse', //Post de-endorse other people skillset
    APIContactFriend: '/circle/contact/recommended',


    // Get user Picture
    APIGetImg: '/get/image',

    errNoData: '--- No Data ---',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">Ooopss... <strong>No data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    errLoadData: '[ERROR] Loading Data Failed.',
    errNoResult: 'No Result. Please try again.',
    errSearch: '[ERROR] Searching Failed.',
    pageSize: 10,

    btnEndorse: 'ENDORSE',
    btnDeEndorse: 'DE-ENDORSE',


})


