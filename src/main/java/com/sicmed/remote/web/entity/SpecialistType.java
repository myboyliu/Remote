package com.sicmed.remote.web.entity;

import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import lombok.Data;

import javax.validation.constraints.*;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class SpecialistType extends BaseEntity {
    @Null(message = "ID由系统自动生成!", groups = {Insert.class})
    @NotBlank(message = "ID不能为空", groups = {Update.class})
    @Size(min = 32, max = 32, message = "id格式错误!", groups = {Update.class})
    private String id;

    @NotBlank(message = "专家类型名称不能为空", groups = {Insert.class, Update.class})
    @Size(min = 2, max = 15, message = "specialistName长度只能是2-15!", groups = {Insert.class, Update.class, Select.class})
    private String specialistName;

    @NotBlank(message = "医院不能为空", groups = {Insert.class, Update.class})
    @Size(min = 32, max = 32, message = "hospitalId格式错误!", groups = {Insert.class, Update.class, Select.class})
    private String hospitalId;

    @NotNull(message = "图文会诊价格不能为空!", groups = {Insert.class, Update.class})
    @Min(value = 0, message = "consultationPicturePrice不能小于于0!", groups = {Insert.class, Update.class,Select.class})
    @Max(value = Integer.MAX_VALUE, message = "consultationPicturePrice不能大于2147483647!", groups = {Insert.class, Update.class,Select.class})
    private Integer consultationPicturePrice;

    @NotNull(message = "视频会诊价格不能为空!", groups = {Insert.class, Update.class})
    @Min(value = 0, message = "consultationVideoPrice不能小于于0!", groups = {Insert.class, Update.class,Select.class})
    @Max(value = Integer.MAX_VALUE, message = "consultationVideoPrice不能大于2147483647!", groups = {Insert.class, Update.class,Select.class})
    private Integer consultationVideoPrice;

}