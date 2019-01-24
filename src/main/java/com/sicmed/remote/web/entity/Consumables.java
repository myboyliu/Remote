package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Consumables  extends BaseEntity {
    /** 耗材表id */
    private String id;

    /** 耗材编号 */
    private String consumablesNumber;

    /** 耗材名称 */
    private String consumablesName;

    /** 备品首字母 */
    private String consumablesEnglish;

    /** 耗材最小单位 */
    private String consumablesUnit;

    /** 耗材详情 */
    private String consumablesDetail;

    /** 创建人 */
    private String createUser;

    /** 创建时间 */
    private Date createDate;

    /** 修改人 */
    private String updateUser;

    /** 修改时间 */
    private Date updateDate;

    /** 删除标记(0:未删除,1:已删除) */
    private String delFlag;

}