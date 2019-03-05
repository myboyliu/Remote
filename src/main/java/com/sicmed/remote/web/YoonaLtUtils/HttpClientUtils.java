package com.sicmed.remote.web.YoonaLtUtils;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.common.Constant;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.Charsets;
import org.apache.http.*;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @program: tele-medicine
 * @description:
 * @author: Xue0601
 * @create: 2018-11-21 11:00
 **/
@Slf4j
public class HttpClientUtils {

    /**
     * 接口授权认证调用
     *
     * @param mobile       手机号
     * @param realName     姓名
     * @return
     * @throws Exception
     */
    public static String getMethod(String mobile, String realName) {
        CloseableHttpClient httpClient = null;
        HttpPost httpPost = null;
        String result = null;
        try {
            // 创建httpClient实例
            httpClient =  new SSLClient();
            // 创建httpget实例
            httpPost = new HttpPost(Constant.BASEPATH+ Constant.AUTHTOKEN_URL);
            //设置参数
            httpPost.addHeader("Content-Type", "application/json");
            Map map = new LinkedHashMap();
            map.put("mobile", mobile);
            map.put("realName", realName);
            map.put("clientSecret", Constant.CLIENTSECRET);
            httpPost.setEntity(new StringEntity(JSON.toJSONString(map), "utf-8"));
            HttpResponse response = httpClient.execute(httpPost);
            //拿到实体
            HttpEntity httpEntity = response.getEntity();
            if (httpEntity != null) {
                Map <String, Object> map1 = (Map) JSON.parse(EntityUtils.toString(httpEntity, "utf-8"));
                if (map1.get("code") != null && "200".equals(map1.get("code").toString())) {
                    Map <String, String> map2 = (Map) JSON.parse(map1.get("data").toString());
                    result =  map2.get("accessToken").toString();
                }
                //释放流
                EntityUtils.consume(httpEntity);
            }
        } catch (Exception e) {
            log.error("远程调用失败,errorMsg={}", e.getMessage());
        }finally {
            try {
                httpClient.close();
                httpPost.releaseConnection();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * json 格式发送 创建会议
     *
     * @param url
     * @param accessToken
     * @return
     * @throws Exception
     */
    public static String createMeeting(String url, String accessToken, Map <String, Object> params) {
        HttpPost post = null;
        CloseableHttpClient httpClient = null;
        String result = null;
        try {
            httpClient = new SSLClient();
            post = new HttpPost(url);
            // 构造消息头
            post.setHeader("Content-type", "application/json; charset=utf-8");
            post.setHeader("Authorization", "Bearer" + accessToken);
            // 构建消息实体
            //设置请求体
            //解决中文乱码问题
            StringEntity entity = new StringEntity(JSON.toJSONString(params), Charsets.UTF_8);
            entity.setContentEncoding("UTF-8");
            entity.setContentType("application/json");
            post.setEntity(entity);
            CloseableHttpResponse response = httpClient.execute(post);
            //拿到实体
            HttpEntity httpEntity = response.getEntity();
            if (httpEntity != null) {
                result = EntityUtils.toString(httpEntity, "utf-8");
                //释放流
                EntityUtils.consume(httpEntity);
            }
        } catch (Exception e) {
            log.error("远程调用失败,errorMsg={}", e.getMessage());
        } finally {
            try {
                httpClient.close();
                post.releaseConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * delete 请求方式调用
     *
     * @param data
     * @param url
     * @return
     * @throws IOException
     */
    public static String deleteMethod(String data, String url, String accessToken) {

        CloseableHttpClient client = null;
        HttpDelete httpDelete = null;
        String result = null;
        try {
            client = new SSLClient();
            httpDelete = new HttpDelete(url + "/" + data);

            httpDelete.addHeader("Content-Type", "application/json");
            httpDelete.addHeader("Authorization", "Bearer" + accessToken);

            CloseableHttpResponse response = client.execute(httpDelete);
            HttpEntity entity = response.getEntity();

            if (entity != null) {
                result = EntityUtils.toString(entity, "utf-8");
                //释放流
                EntityUtils.consume(entity);
            }
        } catch (Exception e) {
            log.error("远程调用失败,errorMsg={}", e.getMessage());
        } finally {
            try {
                client.close();
                //关闭连接
                httpDelete.releaseConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * put 请求 修改
     *
     * @param params
     * @param url
     * @param accessToken
     * @return
     * @throws IOException
     */
    public static String updateMeeting(Map <String, Object> params, String url, String accessToken) {

        CloseableHttpClient client = null;
        HttpPut httpPut = null;
        String result = null;
        try {
            client = new SSLClient();
            httpPut = new HttpPut(url);
            //谷歌的Gson
            httpPut.addHeader("Content-Type", "application/json");
            httpPut.addHeader("Authorization", "Bearer" + accessToken);
            httpPut.setEntity(new StringEntity(JSON.toJSONString(params), "utf-8"));

            CloseableHttpResponse response = client.execute(httpPut);
            HttpEntity entity = response.getEntity();
            if (entity != null){
                result = EntityUtils.toString(entity);
                //释放流
                EntityUtils.consume(entity);
            }
        } catch (Exception e) {
            log.error("远程调用失败,errorMsg={}", e.getMessage());
        } finally {
            try {
                client.close();
                httpPut.releaseConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * get请求
     * @param roomNumber
     * @param url
     * @param accessToken
     * @return
     */
    public static String getMeetingId(String roomNumber, String url, String accessToken) {
        CloseableHttpClient client = null;
        HttpGet httpGet = null;
        String result = null;
        try {
            client = new SSLClient();
            httpGet = new HttpGet(url + "/" + roomNumber);

            httpGet.addHeader("Content-Type", "application/json");
            httpGet.addHeader("Authorization", "Bearer" + accessToken);

            CloseableHttpResponse response = client.execute(httpGet);
            HttpEntity entity = response.getEntity();

            if (entity != null) {
                result = EntityUtils.toString(entity, "utf-8");
                //释放流
                EntityUtils.consume(entity);
            }
        } catch (Exception e) {
            log.error("远程调用失败,errorMsg={}", e.getMessage());
        } finally {
            try {
                client.close();
                //关闭连接
                httpGet.releaseConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}