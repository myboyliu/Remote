package com.sicmed.remote.web.YoonaLtUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

/**
 * @program: tele-medicine
 * @description:
 * @author: Xue0601
 * @create: 2018-07-23 09:53
 **/
public class HttpConnectionUtils {

    static HttpURLConnection httpConn;

    public static String post(String path, String params) throws Exception {
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            URL url = new URL(path);
            httpConn = (HttpURLConnection) url.openConnection();
            httpConn.setRequestMethod("POST");
            httpConn.setDoInput(true);
            httpConn.setDoOutput(true);

            out = new PrintWriter(httpConn.getOutputStream());
            out.println(params);
            out.flush();
            if (httpConn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                StringBuffer content = new StringBuffer();
                String tempStr = "";
                in = new BufferedReader(new InputStreamReader(httpConn.getInputStream()));
                while ((tempStr = in.readLine()) != null) {
                    content.append(tempStr);
                }
                return content.toString();
            } else {
                throw new Exception("请求出现了问题!");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            in.close();
            out.close();
            httpConn.disconnect();
        }
        return null;

    }

    public static String get(String path, String params) throws Exception {
        StringBuffer result = new StringBuffer();
        BufferedReader in = null;
        try {
            String urlNameString = path + "?" + params;
            URL realUrl = new URL(urlNameString);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 建立实际的连接
            connection.connect();
            in = new BufferedReader(new InputStreamReader(
                    connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result.toString();
    }

}

