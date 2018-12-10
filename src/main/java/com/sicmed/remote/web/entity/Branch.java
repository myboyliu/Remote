package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import lombok.Data;

import javax.validation.constraints.*;


/**
 * @author MaxCoder
 * @version 1.0
 */

@Data
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Branch extends BaseEntity {
    @Null(message = "ID由系统自动生成!", groups = {Insert.class})
    @NotBlank(message = "ID不能为空", groups = {Update.class})
    @Size(min = 32, max = 32, message = "id格式错误!", groups = {Update.class})
    private String id;

    @Size(min = 32, max = 32, message = "parentId格式错误!", groups = {Insert.class, Update.class, Select.class})
    private String parentId;

    @NotBlank(message = "科室名称不能为空", groups = {Insert.class,Update.class})
    @Size(min = 2, max = 50, message = "科室名称长度只能是2-32!", groups = {Insert.class, Update.class, Select.class})
    private String branchName;

    @NotBlank(message = "科室编号不能为空", groups = {Insert.class,Update.class})
    @Size(max = 32, message = "branchNumber长度不能超过32!", groups = {Insert.class, Update.class, Select.class})
    private String branchNumber;

    @NotBlank(message = "科室等级不能为空!", groups = {Insert.class,Update.class})
    @Size(max = 32, message = "branchGrade长度不能超过32!", groups = {Insert.class, Update.class, Select.class})
    private String branchGrade;

    @NotBlank(message = "branchInform不能为空!", groups = {Insert.class,Update.class})
    @Size(max = 2556, message = "branchInform长度不能超过2556!", groups = {Insert.class, Update.class, Select.class})
    private String branchInform;

    @NotNull(message = "branchWeight不能为空!", groups = {Insert.class,Update.class})
    @Min(value = 1, message = "branchWeight不能小于于1!", groups = {Insert.class, Update.class})
    @Max(value = Integer.MAX_VALUE, message = "branchWeight不能大于999!", groups = {Insert.class, Update.class})
    private Integer branchWeight;

    @NotBlank(message = "orderWeight不能为空!", groups = {Insert.class,Update.class})
    @Min(value = 1, message = "orderWeight不能小于于1!", groups = {Insert.class, Update.class})
    @Max(value = 8, message = "orderWeight不能大于999!", groups = {Insert.class, Update.class})
    private String orderWeight;


}