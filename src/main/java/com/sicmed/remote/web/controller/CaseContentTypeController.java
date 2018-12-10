package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.bean.CaseContentTypeBean;
import com.sicmed.remote.web.entity.CaseContentType;
import com.sicmed.remote.web.service.CaseContentTypeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description casecontenttype/insert(添加),casecontenttype/update(更新),casecontenttype/softdel(逻辑删除)
 * casecontenttype/select(动态层级查询),casecontenttype/selectbyid(id查询对应数据),casecontenttype/selectbyparam(动态查询),
 * casecontenttype/selectall(查询所有)
 * @data 2018/12/10
 */
@RestController
@RequestMapping(value = "casecontenttype")
public class CaseContentTypeController extends BaseController {

    @Autowired
    private CaseContentTypeService caseContentTypeService;

    /**
     * 添加CaseContentType
     *
     * @param caseContentType
     * @param br
     */
    @PostMapping(value = "insert")
    public Map insertCaseContentType(@Validated CaseContentType caseContentType, BindingResult br) {

        if (br.hasErrors()) {
            return badRequestOfArguments(br.getFieldErrors());
        }

        int i = caseContentTypeService.insertSelective(caseContentType);
        if (i > 0) {
            return succeedRequestOfInsert("添加CaseContentType成功");
        }

        return badRequestOfInsert("添加CaseContentType失败");
    }

    /**
     * 删除caseContentType
     *
     * @param caseContentType
     */
    @GetMapping(value = "softdel")
    public Map softDelCaseContentType(CaseContentType caseContentType) {

        if (StringUtils.isBlank(caseContentType.getId())) {
            return badRequestOfArguments("caseContentTypeId为空");
        }

        int i = caseContentTypeService.deleteByPrimaryKey(caseContentType.getId());
        if (i > 0) {
            return succeedRequestOfUpdate("删除caseContentType成功");
        }
        return badRequestOfUpdate("删除caseContentType失败");
    }

    /**
     * 更新caseContentType
     *
     * @param caseContentType
     */
    @PostMapping(value = "update")
    public Map updateCaseContentType(CaseContentType caseContentType) {

        if (StringUtils.isBlank(caseContentType.getId())) {
            return badRequestOfArguments("caseContentTypeId为空");
        }

        int i = caseContentTypeService.updateByPrimaryKeySelective(caseContentType);
        if (i > 0) {
            return succeedRequestOfUpdate("更新caseContentType成功");
        }
        return badRequestOfUpdate("更新caseContentType失败");
    }

    /**
     * 动态分层查询caseContentType
     *
     * @param caseContentType
     */
    @GetMapping(value = "select")
    public Map selectCaseContentTypeMultilevel(CaseContentType caseContentType) {

        List<CaseContentTypeBean> caseContentTypeBeans = caseContentTypeService.selectMultilevel(caseContentType);
        if (caseContentTypeBeans != null && !caseContentTypeBeans.isEmpty()) {
            return succeedRequestOfSelect(caseContentTypeBeans);
        }

        return badRequestOfSelect("动态查询失败");
    }

    /**
     * 动态查询caseContentType
     *
     * @param caseContentType
     */
    @GetMapping(value = "selectbyparam")
    public Map selectCaseContentType(CaseContentType caseContentType) {

        List<CaseContentType> caseContentTypes = caseContentTypeService.findByDynamicParam(caseContentType);
        if (caseContentTypes != null && !caseContentTypes.isEmpty()) {
            return succeedRequestOfSelect(caseContentTypes);
        }

        return badRequestOfSelect("动态查询失败");
    }

    /**
     * 由id查询对应的caseContentType
     *
     * @param caseContentType
     */
    @GetMapping(value = "selectbyid")
    public Map selectCaseContentTypeById(CaseContentType caseContentType) {

        if (StringUtils.isBlank(caseContentType.getId())) {
            return badRequestOfArguments("caseContentTypeId为空");
        }

        CaseContentType resultCaseContentType = caseContentTypeService.getByPrimaryKey(caseContentType.getId());
        if (resultCaseContentType != null) {
            return succeedRequestOfSelect(resultCaseContentType);
        }

        return badRequestOfSelect("由id查询caseContentType失败");
    }

    /**
     * 查询所有caseContentType
     */
    @GetMapping(value = "selectall")
    public Map selectAllCaseContentTypeById() {

        List<CaseContentType> caseContentTypes = caseContentTypeService.selectAll();
        if (caseContentTypes != null && !caseContentTypes.isEmpty()) {
            return succeedRequestOfSelect(caseContentTypes);
        }

        return badRequestOfSelect("查询所有caseContentType失败");
    }
}
