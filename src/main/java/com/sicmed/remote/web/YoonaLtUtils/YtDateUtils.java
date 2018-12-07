package com.sicmed.remote.web.YoonaLtUtils;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description Date Operation Util
 * @data 2018/12/7
 */
public class YtDateUtils {

    /**
     * Convert String format to Date format
     */
    public static Date stringToDate(String str) {

        /**
         * The incoming date format is 19000000, converted to 1900-00-00
         */
        if (str.length() == 8) {
            StringBuffer stringBuffer = new StringBuffer(str);
            stringBuffer.insert(4, "-");
            stringBuffer.insert(7, "-");
            str = stringBuffer.toString();
        }


        Date date;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        try {
            date = simpleDateFormat.parse(str); //toString -->Mon Jan 14 00:00:00 CST 2013
            return date;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }

}
