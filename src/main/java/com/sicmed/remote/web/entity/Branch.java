package com.sicmed.remote.web.entity;

import lombok.Data;

import javax.validation.constraints.*;


/**
 * @author MaxCoder
 *
 * @version 1.0
 *
 */

@Data
public class Branch extends BaseEntity {
    @Null(message = "")
    private String id;

    @Size(min = 32,max = 32,message = "parentId格式错误!")
    private String parentId;

    @NotBlank(message = "科室名称不能为空")
    @Size(min = 2,max = 50,message = "科室名称长度只能是2-32!")
    private String branchName;

    @Size(max = 32,message = "branchNumber长度不能超过32!")
    private String branchNumber;

    @NotBlank(message = "科室等级不能为空!")
    @Size(max = 32,message = "branchGrade长度不能超过32!")
    private String branchGrade;

    @Size(max = 2556,message = "branchInform长度不能超过2556!")
    private String branchInform;

    @Min(value = 1,message = "branchWeight不能小于于1!")
    @Max(value = 999,message = "branchWeight不能大于999!")
    private Integer branchWeight;

    @Min(value = 1,message = "orderWeight不能小于于1!")
    @Max(value = 999,message = "orderWeight不能大于999!")
    private String orderWeight;


}