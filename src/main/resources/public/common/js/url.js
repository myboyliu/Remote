/**
 * 统一接口管理JS
 * @type {string}
 */
const baseUrl = "http://" + window.location.host; //服务地址
/**
 * 公共接口
 */

/** 个人中心接口 */
const getPersonalInfoUrl = "/user/dorPersonalCenter";                           //查询医生详细信息
const modifyPassword = "/user/modifyPassword";                                  //跟据旧密码修改密码
const modifyPersonalInfo = "/user/modifyPersonal";                              //修改个人信息

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

const approveRegisterUrl = "/user/agreeRegister";                               //医生注册审核通过

const overruleRegisterUrl = "/user/disagreeRegister";                           //医生注册审核驳回

const getDoctorListByCurrentUserUrl = "/user/managementDoctor";

const getHospitalBranchListUrl = "/custom/branch/getHospitalBranchList";        //查询通讯录左侧导航 数据

const getMasterHospitalBranchList = "/custom/branch/getMasterHospitalBranchList";//查询通讯录左侧导航 数据

const getDoctorListByBranchIdUrl = "/user/addressBook";

const uploadFileUrl = "/file/upload";

/** 创建病历模块 */
const createCaseUrl = "/case/insertNewCase";                                            //创建病历接口
const insertHalfCase = "/case/insertHalfCase";                                          //创建不完整病历接口
const createDraft = "/apply/draft";                                                     //创建草稿
const updateDraftCase = "/draft/saveDraft";                                             //修改草稿病历
const createReferralApplyUrl = "/apply/transfer";                                       //创建转诊
const createPictureApplyUrl = "/apply/picture";                                         //创建图文会诊
const createVideoApplyUrl = "/apply/video";                                             //创建视频会诊

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
const doctorReceiveReject = "/apply/dispose/doctor";                                    //会诊中状态以及会诊中状态之前状态申请 拒收
/** 主会诊医生 操作接口 */
const mainDoctorAccede = "/apply/dispose/mainDoctorAccede";
const mainDoctorAccedePicture = "/apply/dispose/mainDoctorAccedePicture";
const allocationDoctorTime = "/apply/dispose/allocationDoctorTime";
const allocationDoctorTimePicture = "/apply/dispose/allocationDoctorTimePicture";
/** 受邀同科室医生操作接口 */
const doctorAcceptOther = "/apply/dispose/doctorAcceptOther";
/**首诊医政操作接口*/

const sirSendCheckAccede = "/apply/dispose/sirSendCheckAccede";                         //通过会诊申请接口
const sirSendCheckReject = "/apply/dispose/sirSendCheckReject";                         //回退会诊申请接口
const sirSendUpdateDate = "/apply/dispose/sirSendUpdateDate";                           //修改排期
const softDelPicture = "/case/softDelPicture";                                          //删除图片
const sirUpdateCase = "/case/sirUpdateCase";                                            //修改病例

/** 会诊医政操作接口*/

const sirReceiveMasterAccede = "/apply/dispose/sirReceiveMasterAccede";                 //待收诊状态申请 接收
const sirReceiveDateCheckAccede = "/apply/dispose/sirReceiveDateCheckAccede";           //排期审核状态申请 接收
const sirReceiveHarmonizeAccede = "/apply/dispose/sirReceiveHarmonizeAccede";           //专家协调状态申请 接收
const sirReceiveMasterReject = "/apply/dispose/sirReceiveMasterReject";                 //会诊中状态以及会诊中状态之前状态申请 拒收
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
const doctorTransferReject = "/apply/dispose/doctorTransferReject";                     //代收诊   拒绝
const doctorTransDateCheck = "/apply/dispose/doctorTransDateCheck";                     //代收诊   接收到排期审核
const doctorTransDateSure = "/apply/dispose/doctorTransDateSure";                       //代收诊   接收到已排期

/** 转诊医政操作接口 */
const sirTransferCheckAccede = "/apply/dispose/sirTransferCheckAccede";                 //首诊审核 通过
const sirTransferCheckReject = "/apply/dispose/sirTransferCheckReject";                 //首诊审核 退回
const sirTransferAmendDor = "/apply/dispose/sirTransferAmendDor";                       //首诊 修改医生
const sirTransferAmendTime = "/apply/dispose/sirTransferAmendTime";                     //首诊 修改排期

const sirTransferMasterAccede = "/apply/dispose/sirTransferMasterAccede";               //代收诊   同意
const sirTransferMasterReject = "/apply/dispose/sirTransferMasterReject";               //代收诊   拒绝
const sirTransferDateCheckAccede = "/apply/dispose/sirTransferDateCheckAccede";         //排期审核 同意
const sirTransferDateCheckReject = "/apply/dispose/sirTransferDateCheckReject";         //排期审核 拒绝

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

const getConsultationCount = "/statistics/getConsultationCount"                             //会诊数量统计查询
const getReferralCount = "/statistics/getReferralCount"                                     //转诊数量统计查询

