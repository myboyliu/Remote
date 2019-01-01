/**
 * 统一接口管理JS
 * @type {string}
 */
const baseUrl = "http://127.0.0.1"; //服务地址

const getAllHospital = "/hospital/select"; //查询所有医院类别

const getBranchByHospitalIdUrl = "/custom/branch/getByHospitalId"; //查询所有科室列表

const getAllCaseContentType = "/casecontenttype/selectall"; //查询所有病历类型列表

const registrationUrl = "/user/register"; //注册接口

const loginUrl = "/user/login"; //登陆接口

const signOutUrl = "/user/signOut"; //退出登陆接口

const checkPhoneNumber = "/user/checkout"; //校验注册手机号是否可用

const getSpecialistTypeByHospitalId = "/specialistType/findByParam"; //根据医院ID查询专家类型列表

const getSpecialistTypeByCurrentUser = "/specialistType/findByCurrentUser"; //根据当前登陆的用户查询专家类型列表

const addSpecialistType = "/specialistType/add"; //根据当前登陆的用户查询专家类型列表

const updateSpecialistType = "/specialistType/update"; //根据当前登陆的用户查询专家类型列表

const deleteSpecialistType = "/specialistType/remove"; //根据当前登陆的用户查询专家类型列表

const getHospitalByCurrentUserUrl = "/hospital/selectByUser"; //根据当前登陆的医政用户查询医院信息

const updateHospitalByCurrentUserUrl = "/hospital/update"; //根据当前登陆的医政用户修改医院信息

const addBranchListByCurrentUserUrl = "/custom/branch/addList"; //根据当前登陆的医政用户添加科室列表

const getBranchListByCurrentUserUrl = "/custom/branch/getByCurrentUser"; //根据当前登陆的医政用户修改科室列表

const updateCustomBranchListUrl = "/custom/branch/update"; //根据当前登陆的医政用户修改医院信息

const getBranchListByParentIdUrl = "/branch/findByParam"; //根据父级科室ID查询科室列表

const approveRegisterUrl = "/user/agreeRegister"; //医生注册审核通过

const overruleRegisterUrl = "/user/disagreeRegister"; //医生注册审核驳回

const getDoctorListByCurrentUserUrl = "/user/managementDoctor";

const getDoctorDetailByIdUrl = "/user/personalCenter";

const getHospitalBranchListUrl = "/custom/branch/getHospitalBranchList"; //查询通讯录左侧导航 数据

const getDoctorListByBranchIdUrl = "/user/addressBook";

const uploadFileUrl = "/file/upload";

const createCaseUrl = "/case/insertNewCase"; //创建病历接口

const createDraftApplyUrl = "/apply/draft"; //创建申请草稿地址
const createReferralApplyUrl = "/apply/transfer"; //创建转诊申请接口
const createPictureApplyUrl = "/apply/picture"; //创建图文会诊接口
const createVideoApplyUrl = "/apply/video"; //创建视频会诊接口

const getApplyInfoUrl = "/apply/detailById"                  // 查询会诊详情信息
/** 医生查询受邀的申请列表查询 接口 */
const getInviteAcceptUrl = "/apply/consultation/receiveApplyAccede"               // 查询受邀列表 待收诊   列表
const getInviteReviewUrl = "/apply/consultation/receiveSlaveDoctor"             // 查询受邀列表 排期审核 列表
const getInviteDateTimeUrl = "/apply/consultation/receiveDateTimeLocked"             // 查询受邀列表 已排期   列表
const getInviteOngoingUrl = "/apply/consultation/receiveBegin"                // 查询受邀列表 会诊中   列表
const getInviteFeedbackUrl = "/apply/consultation/receiveReportSubmitted"             // 查询受邀列表 待反馈   列表
const getInviteRejectUrl = "/apply/consultation/receiveSlaveMasterReject"               // 查询受邀列表 已拒收   列表
const getInviteDoneUrl = "/apply/consultation/receiveEnd"                  // 查询受邀列表 已结束   列表
/** 医生查询发起的申请列表查询 接口 */
const getApplyReviewUrl = "/apply/consultation/sendApplyCreateSuccess";             // 查询发起的列表 待审核 列表
const getApplyAcceptUrl = "/apply/consultation/sendApplySlaveDoctor";               // 查询发起的列表 待收诊   列表
const getApplyDateTimeUrl = "/apply/consultation/sendDateTimeLocked";             // 查询发起的列表 已排期   列表
const getApplyOngoingUrl = "/apply/consultation/sendBegin";                // 查询发起的列表 会诊中   列表
const getApplyFeedbackUrl = "/apply/consultation/sendReportSubmitted";             // 查询发起的列表 待反馈   列表
const getApplyRejectUrl = "/apply/consultation/sendMasterReject";               // 查询发起的列表 已拒收   列表
const getApplyDoneUrl = "/apply/consultation/sendEnd";                  // 查询发起的列表 已结束   列表
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
const sirReceiveDateTimeLocked = "/apply/consultation/sirReceiveDateTimeLocked";        // 查询受邀的列表 已排期    列表
const sirReceiveBegin = "/apply/consultation/sirReceiveBegin";                          // 查询受邀的列表 会诊中    列表
const sirReceiveReportSubmitted = "/apply/consultation/sirReceiveReportSubmitted";      // 查询受邀的列表 带反馈    列表
const sirReceiveSlaveMasterReject = "/apply/consultation/sirReceiveSlaveMasterReject";  // 查询受邀的列表 已拒收    列表
const sirReceiveEnd = "/apply/consultation/sirReceiveEnd";                              // 查询受邀的列表 已结束    列表
/** 首診醫生 操作接口*/
const doctorSendFeedbackReportMoment = "/apply/dispose/doctorSendFeedbackReportMoment"; //医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 暂存
const doctorSendFeedbackReport = "/apply/dispose/doctorSendFeedbackReport"; //医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 提交
/**首诊医政操作接口*/

const sirSendCheckAccede = "/apply/dispose/sirSendCheckAccede"; //通过会诊申请接口
const sirSendCheckReject = "/apply/dispose/sirSendCheckReject"; //回退会诊申请接口
const sirSendUpdateDate = "/apply/dispose/sirSendUpdateDate"; //修改排期


/** 会诊医政操作接口*/

const sirReceiveMasterAccede = "/apply/dispose/sirReceiveMasterAccede"; //待收诊状态申请 接收
const sirReceiveDateCheckAccede = "/apply/dispose/sirReceiveDateCheckAccede"; //排期审核状态申请 接收
const sirReceiveHarmonizeAccede = "/apply/dispose/sirReceiveHarmonizeAccede"; //专家协调状态申请 接收
const sirReceiveMasterReject = "/apply/dispose/sirReceiveMasterReject"; //会诊中状态以及会诊中状态之前状态申请 拒收
const sirUpdateDate = "/apply/dispose/sirUpdateDate"; //选择排期
const sirUpdateDoctor = "/apply/dispose/sirUpdateDoctor"; //选择医生


/** 转诊类别 医生查询 接口*/
const inquiryCreateSuccess = "/apply/transfer/inquiryCreateSuccess";         //待审核
const inquiryApplyAccede = "/apply/transfer/inquiryApplyAccede";         //待收诊
const inquirySlaveMasterAccede = "/apply/transfer/inquirySlaveMasterAccede";         //排期审核
const inquiryDate = "/apply/transfer/inquiryDate";         //已排期
const inquirySlaveMasterReject = "/apply/transfer/inquirySlaveMasterReject";         //已拒收
const inquiryEnd = "/apply/transfer/inquiryEnd";         //已结束

/** 转诊类别 医政查询 接口*/
const sirInquiryCheck = "/apply/transfer/sirInquiryCheck";         //待审核
const sirInquiryAccept = "/apply/transfer/sirInquiryAccept";         //待接收
const sirInquiryCheckDate = "/apply/transfer/sirInquiryCheckDate";         //排期审核
const sirInquiryDate = "/apply/transfer/sirInquiryDate";         //已排期
const sirInquiryReject = "/apply/transfer/sirInquiryReject";         //已拒收
const sirInquiryEnd = "/apply/transfer/sirInquiryEnd";         //已结束
