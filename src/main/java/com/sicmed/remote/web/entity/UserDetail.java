package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDetail extends BaseEntity implements Serializable {
    private String id;

    @NotBlank(message = "userName is null")
    @Size(min = 2, max = 16, message = "userName长度不合规")
    private String userName;

    private String userAge;

    private String userSex;

    private String userAddress;

    private String userCardNumber;

    @NotBlank(message = "telephone is null")
    @Size(min = 11, max = 11, message = "telephone")
    private String telephone;

    @NotBlank(message = "hospitalId is null")
    @Size(min = 32, max = 32, message = "hospitalId 长度不合规")
    private String hospitalId;

    @NotBlank(message = "branchId is null")
    @Size(min = 32, max = 32, message = "branchId 长度不合规")
    private String branchId;

    @NotBlank(message = "titleName is null")
    private String titleName;

    @NotBlank(message = "specialistTypeId is null")
    @Size(min = 32, max = 32, message = "specialistTypeId 长度不合规")
    private String specialistTypeId;

    private String headImg;

    private String userResume;

    @Size(max = 1024, message = "userStrong 长度不合规")
    private String userStrong;

    private String needCaseType;

    @NotBlank(message = "consultationPicturePrice is null")
    private String consultationPicturePrice;

    @NotBlank(message = "consultationVideoPrice is null")
    private String consultationVideoPrice;

}