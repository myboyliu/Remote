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


