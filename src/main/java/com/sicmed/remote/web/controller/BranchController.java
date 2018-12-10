package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.entity.Branch;
import com.sicmed.remote.web.service.BranchService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Slf4j
@RestController
@RequestMapping(value = "branch")
public class BranchController extends BaseController {

    @Autowired
    private BranchService branchService;

    /**
     * 添加科室信息接口
     *
     * @param branch
     * @return
     */
    @PostMapping(value = "add")
    public Object addBranch(@Validated(Insert.class) Branch branch, BindingResult bindingResult) {
        List<FieldError> fieldErrorList = bindingResult.getFieldErrors();
        if (!fieldErrorList.isEmpty()){
            Map errorMsg = fieldErrorsBuilder(bindingResult.getFieldErrors());
            return badRequestOfArguments(errorMsg);
        }
        int i = branchService.insertSelective(branch);

        while (i > 0) {
            return succeedRequestOfInsert(branch);
        }
        return badRequestOfInsert(branch);
    }

    /**
     * 科室删除
     *
     * @param branchId
     * @return
     */
    @PostMapping(value = "remove")
    public Object removeBranch(@Length(min = 32, max = 32, message = "branchId格式错误") String branchId) {

        int i = branchService.deleteByPrimaryKey(branchId);

        while (i > 0) {
            return succeedRequestOfDelete("");
        }
        return badRequestOfDelete(branchId);
    }

    /**
     * 科室修改
     *
     * @param branch
     * @return
     */
    @PostMapping(value = "update")
    public Object updateBranch(@Validated(Update.class)Branch branch) {

        int i = branchService.updateByPrimaryKeySelective(branch);

        while (i > 0) {
            return "update_success";
        }
        return "update_failed";
    }


    /**
     * 根据ID查询科室
     *
     * @return
     */
    @GetMapping(value = "getById")
        public Object getById(String branchId) {

        Branch branch = branchService.getByPrimaryKey(branchId);

        while (branch == null) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(branch);
    }

    /**
     * 根据条件查询科室
     *
     * @return
     */
    @GetMapping(value = "findByParam")
    public Object findByParam(@Validated(Select.class)Branch branch) {

        List<Branch> branchList = branchService.findByDynamicParam(branch);

        while (branchList.isEmpty()) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(branchList);
    }


    /**
     * 查询所有科室列表
     *
     * @return
     */
    @GetMapping(value = "getAll")
    public Object getAll() {

        List<BranchBean> branchList = branchService.findMultilevelListByDynamicParam(null);

        while (branchList.isEmpty()) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(branchList);
    }
}
