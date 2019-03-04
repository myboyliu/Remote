package com.sicmed.remote.common.util;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileUtils {

    /**
     * 上传文件
     *
     * @param file     文件对应的byte数组流   使用file.getBytes()方法可以获取
     * @param fileName 上传文件名
     * @throws Exception
     */
    public static String uploadFile(byte[] file,String url, String fileName){
        File targetFile = new File(url);
        if (!targetFile.exists()) {
            boolean b = targetFile.mkdirs();
            if (b){
                return "文件夹创建失败!";
            }
        }
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(url + "/" + fileName);
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
        return url + "/" + fileName;
    }
}
