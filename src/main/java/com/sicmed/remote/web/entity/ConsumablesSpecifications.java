package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConsumablesSpecifications extends BaseEntity {
    /** 耗材规格id */
    private String id;

    /** 耗材id */
    private String consumablesId;

    /** 规格名称 */
    private String specificationsName;

    /**  */
    private Date createDate;

    /** 创建人 */
    private String createUser;

    /** 修改时间 */
    private Date updateDate;

    /** 修改人 */
    private String updateUser;

    /** 删除标记 */
    private String delFlag;

}