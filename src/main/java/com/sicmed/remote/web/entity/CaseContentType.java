package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CaseContentType extends BaseEntity {
    private String id;

    @Size(min = 1, max = 32, message = "caseTypeName 长度错误")
    private String parentId;

    @NotBlank(message = "caseTypeName is null")
    @Size(min = 1, max = 32, message = "caseTypeName 长度错误")
    private String caseTypeName;

    @NotBlank(message = "caseNumber is null")
    @Size(min = 1, max = 32, message = "caseNumber 长度错误")
    private String caseNumber;

    @Min(value = 1, message = "权重级别需大于1")
    @Max(value = Integer.MAX_VALUE, message = "权重级别需小于0x7fffffff")
    private Integer caseTypeWeight;


}