package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.util.FileUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Slf4j
@RestController
@RequestMapping(value = "file")
public class FileController extends BaseController {

    @Value("${img.location}")
    private String location;

    @Value("${spring.servlet.multipart.max-file-size}")
    private Long max_file_size;

    @PostMapping("upload")
    public Object saveOrUpdatePageInfo(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        while (file.getSize() > max_file_size) {
            return badRequestOfArguments("文件过大");
        }
        try {
            FileUtils.uploadFile(file.getBytes(),location, fileName);
            return succeedRequest(fileName);
        } catch (Exception e) {
            return badRequestOfArguments("文件上传失败");
        }
    }

}
