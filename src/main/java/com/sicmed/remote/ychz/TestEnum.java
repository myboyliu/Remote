package com.sicmed.remote.ychz;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.DoctorTitle;
import com.sicmed.remote.common.InquiryStatus;


/**
 * @author MaxCoder
 */
public class TestEnum {

    public static void main(String[] args) {
        for (ConsultationStatus arg : ConsultationStatus.values()) {
            System.out.println(arg.toString());
        }
        System.out.println("-----------------------------------------");
        for (InquiryStatus arg : InquiryStatus.values()) {
            System.out.println(arg.toString());
        }
        System.out.println("-----------------------------------------");
        for (DoctorTitle arg : DoctorTitle.values()) {
            System.out.println(arg.toString());
        }
        System.out.println("-----------------------------------------");
        for (ApplyType arg : ApplyType.values()) {
            System.out.println(arg.toString());
        }
    }
}
