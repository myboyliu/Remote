package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@Data
public class PageEntity {

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


    public PageEntity() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String pageSizeStr = request.getHeader("pageSize");
        String pageNoStr = request.getHeader("pageNo");

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
