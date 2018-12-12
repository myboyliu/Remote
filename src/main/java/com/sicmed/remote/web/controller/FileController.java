package com.sicmed.remote.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

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
        String contentType = fileName.substring(fileName.lastIndexOf("."));

        String randomFileName = RandomStringUtils.randomAlphanumeric(16) + contentType;
        try {
            uploadFile(file.getBytes(), location, randomFileName);
            return succeedRequest(randomFileName);
        } catch (Exception e) {
            return badRequestOfArguments("文件上传失败");
        }
    }

    /**
     * 上传文件
     *
     * @param file     文件对应的byte数组流   使用file.getBytes()方法可以获取
     * @param filePath 上传文件路径，不包含文件名
     * @param fileName 上传文件名
     * @throws Exception
     */
    public static String uploadFile(byte[] file, String filePath, String fileName) throws Exception {
        File targetFile = new File(filePath);
        if (!targetFile.exists()) {
            targetFile.mkdirs();
        }
        FileOutputStream out = new FileOutputStream(filePath + "/" + fileName);
        out.write(file);
        out.flush();
        out.close();
        return filePath + "/" + fileName;
    }

}
