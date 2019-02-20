package com.sicmed.remote.common.util;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConsultationUserBean {
    private String doctorName;
    private String doctorId;
    private String price;
    private String branchId;
    private String doctorPicturePrice;
    private String doctorVideoPrice;
    private String hospitalImgPrice;
    private String hospitalVideoPrice;
}