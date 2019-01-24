package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TwxrayCheck extends BaseEntity {
    /** 检查医嘱id */
    private String id;

    /** 检查医嘱名称 */
    private String checkName;

    /** 检查医嘱拼音首字母 */
    private String checkNamePy;

    /** 检查类别id */
    private String checkClassId;

    /** 检查详情 */
    private String checkDetail;

    /** 创建时间 */
    private Date createDate;

    /** 创建人 */
    private String createUser;

    /** 创建时间 */
    private Date updateDate;

    /** 修改人 */
    private String updateUser;

    /** 删除标记 */
    private String delFlag;

}