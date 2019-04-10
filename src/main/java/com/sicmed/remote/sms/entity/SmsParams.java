package com.sicmed.remote.sms.entity;

import com.sicmed.remote.sms.validation.MessageConstant;
import com.sicmed.remote.sms.validation.RegExConstant;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;


@Setter
@Getter
public class SmsParams {
    @NotNull(groups = {PhoneNumberView.class,ParamTimeView.class,AmountView.class})
    @Pattern(regexp = RegExConstant.PHONE_REGEX, message = MessageConstant.PHONE_MSG, groups = {PhoneNumberView.class, ParamTimeView.class, AmountView.class})
    String phoneNumber; //手机号码

    @Null(groups = {PhoneNumberView.class})
    @NotNull(groups = {ParamTimeView.class,AmountView.class})
    @Pattern(regexp = RegExConstant.TIME_REGEX, message = MessageConstant.TIME_MSG, groups = {ParamTimeView.class, AmountView.class})
    String paramTime; //时间 格式 yyyy-MM-dd hh:mm

    @Null(groups = {PhoneNumberView.class,ParamTimeView.class})
    @NotNull(groups = {AmountView.class})
    @Min(value = 1, message = "必须大于1", groups = {AmountView.class})
    String amount; //数字 整数

}
