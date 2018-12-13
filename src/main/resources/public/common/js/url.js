/**
 * 统一接口管理JS
 * @type {string}
 */
const baseUrl = "http://127.0.0.1"; //服务地址

const getAllHospital = "/hospital/select"; //查询所有医院类别

const getAllBranch = "/branch/getAll"; //查询所有科室列表

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

const uploadFileUrl = "/file/upload";


