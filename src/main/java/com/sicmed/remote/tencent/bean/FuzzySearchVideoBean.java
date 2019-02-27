package com.sicmed.remote.tencent.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.PageEntity;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FuzzySearchVideoBean extends PageEntity {

    @NotBlank(message = "param is null")
    @Size(min = 1, message = "param 长度不合规")
    private String param;
}
