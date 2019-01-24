package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Medical extends BaseEntity {
    /** 药品id */
    private String id;

    /** 药品编号 */
    private String medicalNum;

    /** 药品中文名 */
    private String medicalNameChina;

    /** 药品全拼音 */
    private String medicalNamePinyin;

    /** 药品英文名(首字母大写) */
    private String medicalNameEnglish;

    /** 用药频次 */
    private String medicalUseNumber;

    /** 单次计量 */
    private String medicalMeasure;

    /** 给药途径 */
    private String medicalUse;

    /** 药品详情 */
    private String medicalDetail;

    /** 药品规格 */
    private String medicalStand;

    /** 包装 */
    private String unit1;

    /** 最小开药单位 */
    private String unit2;

    /** 注意事项 */
    private String medicalPrecautions;

    /** 用法用量 */
    private String medicalDosageUsage;

    /** 一级类型id */
    private String medicalClassOneId;

    /** 二级类型id */
    private String medicalClassTwoId;

    /** 三级类型id */
    private String medicalClassThreeId;

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