package com.sicmed.remote.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@RestController
@RequestMapping(value = "file")
public class FileController extends BaseController{

    @Value("${img.location}")
    private String location;

    @PostMapping("upload")
    public Object saveOrUpdatePageInfo(@RequestParam("file") MultipartFile file) {
        //首先进行文件上传
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();
        try {
            String url =  uploadFile(file.getBytes(), location, fileName);
            return succeedRequest(fileName);
        } catch (Exception e) {
            // TODO: handle exception
            return "1";
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
