package com.sicmed.remote.common.util;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class ConsultationUserBean {
    private String doctorName;
    private String doctorId;
    private BigDecimal price;
    private String branchId;
    private BigDecimal doctorPicturePrice;
    private BigDecimal doctorVideoPrice;
    private BigDecimal hospitalImgPrice;
    private BigDecimal hospitalVideoPrice;
}