package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.Branch;
import com.sicmed.remote.web.service.BranchService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Validated
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
    public Object addBranch(Branch branch) {

        int i = branchService.insertSelective(branch);

        while (i > 0) {
            return branch;
        }
        return null;
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
            return "success";
        }
        return "failed";
    }

    /**
     * 科室修改
     *
     * @param branch
     * @return
     */
    @PostMapping(value = "update")
    public Object updateBranch(Branch branch) {

        int i = branchService.updateByPrimaryKeySelective(branch);

        while (i > 0) {
            return "update_success";
        }
        return "update_failed";
    }

    /**
     * 查询修改
     *
     * @return
     */
    @PostMapping(value = "find")
    public Object findBranch(Branch branch) {

        List<Branch> branchList = branchService.findByDynamicParam(branch);

        while (branchList.isEmpty()) {
            return "查询失败";
        }
        return branchList;
    }
}
