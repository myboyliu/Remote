package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Banner extends BaseEntity{
    /** 横幅图片id */
    private String id;

    /** 链接url */
    private String linkPath;

    /** 图片url */
    private String picturePath;

    /** 状态(0:未启用,1:启用) */
    private String bannerPictureStatus;

    /** 请求系统 */
    private String bannerSystem;

    /** 创建人 */
    private String createUser;

    /** 创建时间 */
    private Date createTime;

    /** 修改人 */
    private String updateUser;

    /** 修改时间 */
    private Date updateTime;

    /** 删除人 */
    private String deleteUser;

    /** 删除时间 */
    private Date deleteTime;

    /** 删除标记 */
    private String delFlag;

}