package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author MaxCoder
 * @version 1.0
 */
@Data
public abstract class BaseEntity implements Serializable {

    @JsonIgnore
    private int pageSize;

    @JsonIgnore
    private int pageNo;

    @JsonIgnore
    private int beginNo;

    @JsonIgnore
    private final static int PAGE_SIZE = 10;

    @JsonIgnore
    private final static int PAGE_NO = 0;

    @JsonIgnore
    private Date createTime;

    @JsonIgnore
    private String createUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date updateTime;

    @JsonIgnore
    private Date deleteTime;

    @JsonIgnore
    private String updateUser;

    @JsonIgnore
    private String deleteUser;

    @JsonIgnore
    private String delFlag;

    public BaseEntity() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String pageSizeStr = request.getParameter("pageSize");
        String pageNoStr = request.getParameter("pageNo");

        if (StringUtils.isNotBlank(pageSizeStr)) {
            int size = Integer.parseInt(pageSizeStr);
            this.pageSize = size > 0 ? size : PAGE_SIZE;

        } else {
            this.pageSize = PAGE_SIZE;
        }

        if (StringUtils.isNotBlank(pageNoStr)) {
            int number = Integer.parseInt(pageNoStr);
            this.pageNo = number > 0 ? number - 1 : PAGE_NO;
        } else {
            this.pageNo = PAGE_NO;
        }

        this.beginNo = pageNo * pageSize;
    }
}
