package com.sicmed.remote.web.controller;

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
            uploadFile(file.getBytes(), location, fileName);
            return succeedRequest(fileName);
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
    public static String uploadFile(byte[] file, String filePath, String fileName){
        File targetFile = new File(filePath);
        if (!targetFile.exists()) {
            boolean b = targetFile.mkdirs();
            if (b){
                return "文件夹创建失败!";
            }
        }
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(filePath + "/" + fileName);
            out.write(file);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if(out!=null){
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return filePath + "/" + fileName;
    }

}
