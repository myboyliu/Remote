package com.sicmed.remote.web.YoonaLtUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class AESUtils {

    private static final String CHARSET = "UTF-8";
    private static final String KEY_ALGORITHM = "AES";
    private static final String SALT = "yilaiyiwang2019";
    private static final String DEFAULT_CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";

    /**
     * AES 加密操作
     *
     * @param data     待加密内容
     * @param password 加密密码
     * @return 返回Base64转码后的加密数据
     */
    public static String encrypt(String data, String password) {

        try {
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);  // 创建密码器
            byte[] byteContent = data.getBytes(CHARSET);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(password));  // 初始化为加密模式的密码器
            byte[] result = cipher.doFinal(byteContent);  // 加密
            return Base64.encodeBase64String(result);  //通过Base64转码返回
        } catch (Exception e) {
            throw new RuntimeException("公钥加密[" + data + "]时遇到异常", e);
//            Logger.getLogger(AESUtil.class.getName()).log(Level.SEVERE, null, e);
        }

    }

    /**
     * AES 解密操作
     *
     * @param data
     * @param password
     * @return
     */
    public static String decrypt(String data, String password) {

        try {
            //实例化
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            //使用密钥初始化，设置为解密模式
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(password));
            //执行操作
            byte[] result = cipher.doFinal(Base64.decodeBase64(data));
            return new String(result, CHARSET);
        } catch (Exception e) {
            throw new RuntimeException("私钥解密[" + data + "]时遇到异常", e);
//            Logger.getLogger(AESUtil.class.getName()).log(Level.SEVERE, null, e);
        }

    }

    /**
     * 生成加密秘钥
     *
     * @return
     */
    private static SecretKeySpec getSecretKey(String password) {

        if (StringUtils.isBlank(password)) {
            password = SALT;
        }

        //返回生成指定算法密钥生成器的 KeyGenerator 对象
        KeyGenerator keyGenerator;
        try {
            keyGenerator = KeyGenerator.getInstance(KEY_ALGORITHM);
            //AES 要求密钥长度为 128
            keyGenerator.init(128, new SecureRandom(password.getBytes()));
            //生成一个密钥
            SecretKey secretKey = keyGenerator.generateKey();
            return new SecretKeySpec(secretKey.getEncoded(), KEY_ALGORITHM);// 转换为AES专用密钥
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalArgumentException("No such algorithm-->[" + DEFAULT_CIPHER_ALGORITHM + "]");
//            Logger.getLogger(AESUtil.class.getName()).log(Level.SEVERE, null, e);
        }

    }

}
