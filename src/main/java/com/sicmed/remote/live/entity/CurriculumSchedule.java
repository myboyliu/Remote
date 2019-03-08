package com.sicmed.remote.live.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class CurriculumSchedule implements Serializable {

    private String id;

    private String curriculumId;

    private String curriculumType;

    private Date curriculumStartTime;

    private Date curriculumEndTime;

    private Integer curriculumDuration;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;


}