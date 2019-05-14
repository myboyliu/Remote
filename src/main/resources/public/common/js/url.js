
/**
 * 统一接口管理JS
 * @type {string}
 */
const NETWORK_PROTOCOL = 'https:' == document.location.protocol ? 'https://' : 'http://';
const baseUrl = NETWORK_PROTOCOL + window.location.host; //服务地址
/**
 * 公共接口
 */

/** 个人中心接口 */
const getPersonalInfoUrl = "/user/dorPersonalCenter";                           //查询医生详细信息
const modifyPassword = "/user/modifyPassword";                                  //跟据旧密码修改密码
const modifyPersonalInfo = "/user/modifyPersonal";                              //修改个人信息
/**
 * 基础数据接口
 */
const getLocalHospitalBranchUrl = "/custom/branch/getLocalHospitalBranch"       //查询本院二级科室列表
const getTwoLevelLinkageBranchUrl = "/custom/branch/getTwoLevelLinkageBranch"   //查询本院两级联动科室列表
/** 医政 管理中心接口 */
const managementUpdateUser = "/user/managementUpdateUser";                      //医政修改医生信息

const getDoctorDetailByIdUrl = "/user/personalCenter";                          //查询医生详细信息

const getAllHospital = "/hospital/select";                                      //查询所有医院类别

const getBranchByHospitalIdUrl = "/custom/branch/getByHospitalId";              //查询所有科室列表

const getAllCaseContentType = "/casecontenttype/selectall";                     //查询所有病历类型列表

const registrationUrl = "/user/register";                                       //注册接口

const loginUrl = "/user/login";                                                 //登陆接口

const signOutUrl = "/user/signOut";                                             //退出登陆接口

const checkPhoneNumber = "/user/checkout";                                      //校验注册手机号是否可用

const getSpecialistTypeByHospitalId = "/specialistType/findByParam";            //根据医院ID查询专家类型列表

const getSpecialistTypeByCurrentUser = "/specialistType/findByCurrentUser";     //根据当前登陆的用户查询专家类型列表

const addSpecialistType = "/specialistType/add";                                //根据当前登陆的用户查询专家类型列表

const updateSpecialistType = "/specialistType/update";                          //根据当前登陆的用户查询专家类型列表

const deleteSpecialistType = "/specialistType/remove";                          //根据当前登陆的用户查询专家类型列表

const getHospitalByCurrentUserUrl = "/hospital/selectByUser";                   //根据当前登陆的医政用户查询医院信息

const updateHospitalByCurrentUserUrl = "/hospital/update";                      //根据当前登陆的医政用户修改医院信息

const addBranchListByCurrentUserUrl = "/custom/branch/addList";                 //根据当前登陆的医政用户添加科室列表

const getBranchListByCurrentUserUrl = "/custom/branch/getByCurrentUser";        //根据当前登陆的医政用户修改科室列表

const updateCustomBranchListUrl = "/custom/branch/update";                      //根据当前登陆的医政用户修改医院信息

const getBranchListByParentIdUrl = "/branch/findByParam";                       //根据父级科室ID查询科室列表

const getFirstListList = "/branch/getFirstList";                                //查询所有系统一级科室列表

const getSecondBranchList = "/branch/getSecondList";                            //查询所有系统二级科室列表

const approveRegisterUrl = "/user/agreeRegister";                               //医生注册审核通过

const overruleRegisterUrl = "/user/disagreeRegister";                           //医生注册审核驳回

const getDoctorListByCurrentUserUrl = "/user/managementDoctor";

const getHospitalBranchListUrl = "/custom/branch/getHospitalBranchList";        //查询通讯录左侧导航 数据

const getMasterHospitalBranchList = "/custom/branch/getMasterHospitalBranchList";//查询通讯录左侧导航 数据

const getDoctorListByBranchIdUrl = "/user/addressBook";

const uploadFileUrl = "/file/upload";


/**
 * 转诊流程接口
 */
const createReferralApplyAuditUrl = "/apply/referral/create/audit";     //发起医生 创建转诊申请
const createReferralApplyUrl = "/apply/referral/create";                //发起医生 创建转诊申请

const sirTransferCheckAccede = "/apply/referral/accept";                //发起医政 审核发布申请

const doctorTransDateCheck = "/apply/referral/receive/audit";           //受邀医生 接收转诊申请
const doctorTransDateSure = "/apply/referral/receive";                  //受邀医生 接收转诊申请
const doctorTransferReject = "/apply/referral/doctor/reject";           //发起医生 拒收转诊申请


const sirTransferMasterAccede = "/apply/referral/sir/accept";           //受邀医政 接收转诊申请
const sirTransferMasterReject = "/apply/referral/sir/reject";           //受邀医政 拒绝转诊申请

const sirTransferDateCheckAccede = "/apply/referral/sir/accept";        //受邀医政 接收转诊申请
const sirTransferDateCheckReject = "/apply/referral/sir/reject";        //受邀医政 拒绝转诊申请

const sirTransferCheckReject = "/apply/referral/reject";                //发起医政 审核退回申请
/**
 * 视频会诊流程接口
 */
const createVideoApplyAuditUrl = "/apply/video/create/audit";           //发起医生 创建视频会诊申请
const createVideoApplyUrl = "/apply/video/create";                      //发起医生 创建视频会诊申请

const sirSendCheckAccede = "/apply/video/accept";                       //发起医政 审核发布视频会诊申请
const sirSendCheckReject = "/apply/video/reject";                       //发起医政 审核退回视频会诊申请

/** 主会诊医生 操作接口 */
const mainDoctorAccedeAuditUrl = "/apply/video/doctor/accept/audit";       //受邀医生 接受视频会诊申请 需要审核
const allocationDoctorTimeAuditUrl = "/apply/video/doctor/accept/audit";      //受邀医生 接受视频会诊申请 需要审核

const mainDoctorAccede = "/apply/video/doctor/accept";                  //受邀医生 接受视频会诊申请 不需要审核
const allocationDoctorTime = "/apply/video/doctor/accept";              //受邀医生 接受视频会诊申请 不需要审核

const sirReceiveApplyVideoUrl = "/apply/video/sir/accept";               //受邀医政 接收视频会诊申请

const doctorReceiveReject = "/apply/video/doctor/reject";               //受邀医生 拒绝视频会诊申请 会诊中状态以及会诊中状态之前状态申请 拒收

const sirReceiveMasterReject = "/apply/video/sir/reject";               //受邀医政 拒绝视频会诊申请 会诊中状态以及会诊中状态之前状态申请 拒收


/** 受邀同科室医生操作接口 */
const doctorAcceptOther = "/apply/dispose/doctorAcceptOther";
/**
 * 图文会诊流程接口
 */
const createPictureApplyAuditUrl = "/apply/picture/create/audit";      //发起医生 创建图文会诊申请
const createPictureApplyUrl = "/apply/picture/create";                 //发起医生 创建图文会诊申请


const mainDoctorAccedePicture = "/apply/picture/doctor/accept";         //受邀医生 接受图文会诊申请
const allocationDoctorTimePicture = "/apply/picture/doctor/accept";     //受邀医生 接受图文会诊申请
const sirReceiveApplyPictureUrl = "/apply/picture/sir/accept";          //受邀医政 接收图文会诊申请


/** 创建病历模块 */
const createCaseUrl = "/case/insertNewCase";                                            //创建病历接口
const insertHalfCase = "/case/insertHalfCase";                                          //创建不完整病历接口
const createDraft = "/apply/draft";                                                     //创建草稿
const updateDraftCase = "/draft/saveDraft";                                             //修改草稿病历


const getApplyInfoUrl = "/apply/detailById"                                             // 查询会诊详情信息
/** 医政 管理页面 接口*/
const adminChangePassWord = "/user/adminChangePassWord";

/** 医生查询受邀的申请列表查询 接口 */
const getInviteAcceptUrl = "/apply/consultation/receiveApplyAccede"                     // 查询受邀列表 待收诊   列表
const getInviteReviewUrl = "/apply/consultation/receiveSlaveDoctor"                     // 查询受邀列表 排期审核 列表
const getInviteDateTimeUrl = "/apply/consultation/receiveDateTimeLocked"                // 查询受邀列表 已排期   列表
const getInviteOngoingUrl = "/apply/consultation/receiveBegin"                          // 查询受邀列表 会诊中   列表
const getInviteFeedbackUrl = "/apply/consultation/receiveReportSubmitted"               // 查询受邀列表 待反馈   列表
const getInviteRejectUrl = "/apply/consultation/receiveSlaveMasterReject"               // 查询受邀列表 已拒收   列表
const getInviteDoneUrl = "/apply/consultation/receiveEnd"                               // 查询受邀列表 已结束   列表
/** 医生查询发起的申请列表查询 接口 */
const getApplyReviewUrl = "/apply/consultation/sendApplyCreateSuccess";                 // 查询发起的列表 待审核 列表
const getApplyAcceptUrl = "/apply/consultation/sendApplySlaveDoctor";                   // 查询发起的列表 待收诊   列表
const getApplyDateTimeUrl = "/apply/consultation/sendDateTimeLocked";                   // 查询发起的列表 已排期   列表
const getApplyOngoingUrl = "/apply/consultation/sendBegin";                             // 查询发起的列表 会诊中   列表
const getApplyFeedbackUrl = "/apply/consultation/sendReportSubmitted";                  // 查询发起的列表 待反馈   列表
const getApplyRejectUrl = "/apply/consultation/sendMasterReject";                       // 查询发起的列表 已拒收   列表
const getApplyDoneUrl = "/apply/consultation/sendEnd";                                  // 查询发起的列表 已结束   列表
/** 医政查询发起的申请列表查询 接口 */
const getApplyReviewByAdminUrl = "/apply/consultation/sirSendApplyCreateSuccess";       // 查询发起的列表 待审核    列表
const getApplyAcceptByAdminUrl = "/apply/consultation/sirSendApplySlaveDoctor";         // 查询发起的列表 待收诊    列表
const getApplyDateTimeByAdminUrl = "/apply/consultation/sirSendDateTimeLocked";         // 查询发起的列表 已排期    列表
const getApplyOngoingByAdminUrl = "/apply/consultation/sirSendBegin";                   // 查询发起的列表 会诊中    列表
const getApplyFeedbackByAdminUrl = "/apply/consultation/sirSendReportSubmitted";        // 查询发起的列表 待反馈    列表
const getApplyRejectByAdminUrl = "/apply/consultation/sirSendMasterReject";             // 查询发起的列表 已拒收    列表
const getApplyDoneByAdminUrl = "/apply/consultation/sirSendEnd";                        // 查询发起的列表 已结束    列表
/** 医政查询受邀的申请列表查询 接口 */
const sirReceiveApplyAccede = "/apply/consultation/sirReceiveApplyAccede";              // 查询受邀的列表 待收诊    列表
const sirReceiveSlaveDoctor = "/apply/consultation/sirReceiveSlaveDoctor";              // 查询受邀的列表 排期审核  列表
const sirReceiveSlaveReject = "/apply/consultation/sirReceiveSlaveReject";              // 查询受邀的列表 专家协调  列表
const sirReceiveDateTimeLocked = "/apply/consultation/sirReceiveDateTimeLocked";        // 查询受邀的列表 已排期    列表
const sirReceiveBegin = "/apply/consultation/sirReceiveBegin";                          // 查询受邀的列表 会诊中    列表
const sirReceiveReportSubmitted = "/apply/consultation/sirReceiveReportSubmitted";      // 查询受邀的列表 带反馈    列表
const sirReceiveSlaveMasterReject = "/apply/consultation/sirReceiveSlaveMasterReject";  // 查询受邀的列表 已拒收    列表
const sirReceiveEnd = "/apply/consultation/sirReceiveEnd";                              // 查询受邀的列表 已结束    列表
/** 首诊医生 操作接口*/
const doctorSendFeedbackReportMoment = "/apply/dispose/doctorSendFeedbackReportMoment"; //医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 暂存
const doctorSendFeedbackReport = "/apply/dispose/doctorSendFeedbackReport";             //医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 提交

/**首诊医政操作接口*/
const sirSendUpdateDate = "/apply/dispose/sirSendUpdateDate";                           //修改排期
const softDelPicture = "/case/softDelPicture";                                          //删除图片
const sirUpdateCase = "/case/sirUpdateCase";                                            //修改病例

/** 会诊医政操作接口*/
const sirUpdateDate = "/apply/dispose/sirUpdateDate";                                   //选择排期
const sirUpdateDoctor = "/apply/dispose/sirUpdateDoctor";                               //选择医生

/** 转诊列表 医生查询 接口*/
const inquiryCreateSuccess = "/apply/transfer/inquiryCreateSuccess";                    //待审核
const inquiryApplyAccede = "/apply/transfer/inquiryApplyAccede";                        //待收诊
const inquirySlaveMasterAccede = "/apply/transfer/inquirySlaveMasterAccede";            //排期审核
const inquiryDate = "/apply/transfer/inquiryDate";                                      //已排期
const inquirySlaveMasterReject = "/apply/transfer/inquirySlaveMasterReject";            //已拒收
const inquiryEnd = "/apply/transfer/inquiryEnd";                                        //已结束

/** 转诊列表 医政查询 接口*/
const sirInquiryCheck = "/apply/transfer/sirInquiryCheck";                              //待审核
const sirInquiryAccept = "/apply/transfer/sirInquiryAccept";                            //待接收
const sirInquiryCheckDate = "/apply/transfer/sirInquiryCheckDate";                      //排期审核
const sirInquiryDate = "/apply/transfer/sirInquiryDate";                                //已排期
const sirInquiryReject = "/apply/transfer/sirInquiryReject";                            //已拒收
const sirInquiryEnd = "/apply/transfer/sirInquiryEnd";                                  //已结束

/** 转诊医生操作接口 */


/** 转诊医政操作接口 */

const sirTransferAmendDor = "/apply/dispose/sirTransferAmendDor";                       //首诊 修改医生
const sirTransferAmendTime = "/apply/dispose/sirTransferAmendTime";                     //首诊 修改排期


/** 草稿接口 */
const selectByUser = "/draft/selectByUser";                                             //想草稿列表
const draftDel = "/draft/draftDel";                                                     //删除草稿
const draftFullCase = "/draft/draftFullCase";                                           //草稿病历完善
/** 分页数量查询接口 */
const draftCount = "/draft/draftCount";                                                 //草稿数量
const sendSelectAllCountDoctor = "/apply/consultation/sendSelectAllCountDoctor";        //首诊医生发出列表
const receiveSelectAllCountDoctor = "/apply/consultation/receiveSelectAllCountDoctor";  //会诊医生接受列表
const sendSelectAllCountSir = "/apply/consultation/sendSelectAllCountSir";              //首诊医政发出列表
const receiveSelectAllCountSir = "/apply/consultation/receiveSelectAllCountSir";        //会诊医政接受列表
const inquiryCsAllCountDr = "/apply/transfer/inquiryCsAllCountDr";                      //转诊医生列表
const inquiryCsAllCountSir = "/apply/transfer/inquiryCsAllCountSir";                    //转诊医政列表

/** 医嘱 模块 接口 */
const fuzzySearchMedicalApi = "/medical/fuzzySearchMedical";                               //糊查询药品(通过药品名和药品简称)
const fuzzySearchCheckApi = "/check/fuzzySearchCheck";                                     //模糊搜索诊疗
const fuzzySearchConsumablesApi = "/consumables/fuzzySearchConsumables";                   //手术备品模糊搜索
const findSpecificationsByIdApi = "/consumables/findSpecificationsById";                   //通过手术备品id查询手术备品对应型号

const selectReport = "/apply/consultation/selectReport";                                    //查询会诊报告 + 医嘱

/** 统计模块接口 **/
const getConsultationStatisticsCount = "/statistics/getConsultationCount"                             //会诊数量统计查询
const getReferralStatisticsCount = "/statistics/getReferralCount"                                     //转诊数量统计查询
const getConsultationPriceStatistics = "/statistics/getConsultationPriceStatistics"                   //转诊价格统计查询

/** 搜索模块接口 **/
const doctorSearch = "/statisticsSearch/doctorSearch"                   //转诊价格统计查询
const doctorSearchCount = "/statisticsSearch/doctorSearchCount"                   //转诊价格统计查询
const sirSearch = "/statisticsSearch/sirSearch"                   //转诊价格统计查询
const sirSearchCount = "/statisticsSearch/sirSearchCount"                   //转诊价格统计查询

/** 云点播 接口 */
const getBannerList = "/banner/getBannerList"                   //转诊价格统计查询

const fuzzySearchVideoListCount = "/vod/fuzzySearchVideoListCount"
const fuzzySearchVideoList = "/vod/fuzzySearchVideoList"
const getVideoListCountUrl = "/vod/getVideoListCount"
const getVideoListUrl = "/vod/getVideoList"
const getVideoListCountByUserUrl = "/vod/getVideoListCountByUser"
const getVideoListByUserUrl = "/vod/getVideoListByUser"
const removeVideoByUserUrl = "/vod/removeVideoByUser"
const getVideoInfoUrl = "/vod/getVideoInfo"
const updateVideoInfoUrl = "/vod/updateVideo"

const getSignatureUrl = "/signature/video/getSignature"
const saveVideoUrl = "/vod/addVideo"                //保存上传成功的视频信息
const addClickCountUrl = "/vod/addClickCount"                //保存上传成功的视频信息

/** 直播接口 */
const createLive = "/live/create";                                           //申请创建直播接口
const updateLiveUrl = "/live/update";                                           //申请创建直播接口
const selectCountByParamUrl = "/live/selectCountByParam";                    //件筛选直播数量接口
const selectListByParamUrl = "/live/selectListByParam";                      //条件筛选直播列表接口
const searchCountByParamUrl = "/live/searchCountByParam";                    //模糊搜索直播数量接口
const searchListByParamUrl = "/live/searchListByParam";                      //糊搜索直播列表接口
const getCountByParamUrl = "/live/getCountByParam";                          //条件筛选个人创建的直播数量接口
const getListByParamUrl = "/live/getListByParam";                            //条件筛选个人创建的直播列表接口
const deleteByIdUrl = "/live/deleteById";                                    //删除直播接口
const getLiveUrl = "/live/getLive";                                          //查询直播信息接口
const addSubscriptionUrl = "/curriculum/schedule/add";                       //添加关注接口
const cancelSubscriptionUrl = "/curriculum/schedule/delete";                 //取消关注接口

/** 会议接口 */


/** 系统消息 接口　*/
const getUnReadMsgCountUrl = "/message/getUnReadMsgCount";                 //查询未读消息数量接口
const getMyMessageCountUrl = "/message/getMyMessageCount";                 //查询所有消息数量接口
const findMyMessageUrl = "/message/findMyMessage";                 //取消关注接口
const lookGroupMessageUrl = "/message/lookGroupMessage";                 //取消关注接口

/**
 * 科室日历
 */

const doctorFindSchedulingUrl = "/worksheet/doctorFindScheduling"
const findSchedulingUrl = "/worksheet/findScheduling"
const findScheduledUrl = "/worksheet/findScheduled"
const doctorFindScheduledUrl = "/worksheet/doctorFindScheduled"