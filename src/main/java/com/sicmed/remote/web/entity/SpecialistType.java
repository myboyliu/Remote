package com.sicmed.remote.web.entity;

import lombok.Data;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class SpecialistType extends BaseEntity {
    private String id;

    private String specialistName;

    private String hospitalId;

    private String consultationPicturePrice;

    private String consultationVideoPrice;

}