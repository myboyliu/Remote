package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.*;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Hospital extends BaseEntity {
    private String id;

    @Size(max = 500, message = "hospitalName长度应小于500")
    @NotBlank(message = "hospitalName is null!")
    private String hospitalName;

    @Size(max = 500, message = "hospitalAlias长度应小于500")
    private String hospitalAlias;

    @Size(max = 500, message = "hospitalInform长度应小于1000")
    private String hospitalInform;

    @Size(min = 2, max = 32, message = "hospitalGrade长度错误")
    @NotBlank(message = "hospitalGrade is null!")
    private String hospitalGrade;

    @Min(value = 1, message = "hospitalWeight权重必须大于等于1")
    @Max(value = Integer.MAX_VALUE, message = "hospitalWeight权重必须小于等于0x7fffffff")
    private Integer hospitalWeight;

    @Size(max = 32, min = 32, message = "typeId长度错误")
    private String typeId;

    @Size(max = 32, min = 32, message = "cityId长度错误")
    private String cityId;

    @Size(min = 1, max = 1, message = "activationFlag填写错误")
    private String activationFlag;

    @Size(min = 1, max = 4, message = "orderWeight长度有误")
    private String orderWeight;

    @NotBlank(message = "hospitalPhone is null")
    @Size(max = 32, message = "hospital_phone 长度过长")
    private String hospitalPhone;

    @NotNull(message = "consultationPicturePrice is null")
    @Max(value = 100000,message = "超出最大数值")
    @Min(value = 1,message = "数值过小")
    private Integer consultationPicturePrice;

    @NotNull(message = "consultationVideoPrice is null")
    @Max(value = 100000,message = "超出最大数值")
    @Min(value = 1,message = "数值过小")
    private Integer consultationVideoPrice;
}