package com.sicmed.remote.web.YoonaLtUtils;


import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description Date Operation Util
 * @data 2018/12/7
 */
public class YtDateUtils {

    /**
     * yyyy-MM-dd hh:mm:ss
     */
    public static String DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    /**
     * 则个
     */
    private static boolean LENIENT_DATE = false;

    /**
     * 十五分钟换算成毫秒
     */
    public static long FIFTEEN_MINUTES = 15 * 60 * 1000;

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

    /**
     * Input Parameter Date To String("yyyy-MM-dd HH:mm:ss")
     *
     * @param date
     * @return string
     */
    public static String dateToString(Date date) {

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String string = format.format(date);

        return string;
    }


    /**
     * The Morning Of Input Parameter Day 00:00:00
     */
    public static Date parmDateBegin(Date date) {

        Calendar day = Calendar.getInstance();
        day.setTime(date);
        day.set(Calendar.HOUR_OF_DAY, 0);
        day.set(Calendar.MINUTE, 0);
        day.set(Calendar.SECOND, 0);
        day.set(Calendar.MILLISECOND, 0);
        Date resDate = day.getTime();

        return resDate;

    }

    /**
     * The Middle Of The Night Of Input Parameter Day 23:59:59
     */
    public static Date intradayEnd(Date date) {

        Calendar day = Calendar.getInstance();
        day.setTime(date);
        day.set(Calendar.HOUR_OF_DAY, 23);
        day.set(Calendar.MINUTE, 59);
        day.set(Calendar.SECOND, 59);
        day.set(Calendar.MILLISECOND, 999);
        Date resDate = day.getTime();

        return resDate;
    }

    /**
     * 计算两个时间差,返回小时
     *
     * @param startDate 开始时间
     * @param endDate   结束时间
     * @return
     */
    public static float timeDifference(Date startDate, Date endDate) {
        if (endDate.getTime() > startDate.getTime()) {
            long date = endDate.getTime() - startDate.getTime();
            return (float) date / 3600000;
        } else {
            return 0;
        }
    }
    /**
     * 计算两个时间差,返回秒
     *
     * @param endDateStr   结束时间
     * @return
     */

    public static long timeDifferenceMt(String endDateStr) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date endDate = null;
        try {
            endDate = simpleDateFormat.parse(endDateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Date currentDate = new Date();
        if (endDate.getTime() > currentDate.getTime()) {
            long date = endDate.getTime() -  currentDate.getTime();
            return date;
        } else {
            return 0;
        }
    }
    /**
     * 带年月日时分秒
     *
     * @param dateString
     * @return
     */
    public static Date stringToDates(String dateString) {
        return stringToDate(dateString, DATETIME_PATTERN, LENIENT_DATE);
    }

    /**
     * 判断开始时间和当前时间差大于十五分
     */
    public static boolean compareDate(String startDate) {
        if (stringToDates(startDate).getTime() > System.currentTimeMillis() + FIFTEEN_MINUTES) {
            System.out.println(stringToDates(startDate).getTime());
            System.out.println(System.currentTimeMillis() + FIFTEEN_MINUTES);
            return true;
        } else {
            return false;
        }
    }


    /**
     * java.util.Date
     *
     * @param dateText
     * @param format
     * @param lenient
     * @return
     */
    public static Date stringToDate(String dateText, String format, boolean lenient) {

        if (dateText == null) {

            return null;
        }

        DateFormat df = null;

        try {

            if (format == null) {
                df = new SimpleDateFormat();
            } else {
                df = new SimpleDateFormat(format);
            }

            // setLenient avoids allowing dates like 9/32/2001
            // which would otherwise parse to 10/2/2001
            df.setLenient(false);

            return df.parse(dateText);
        } catch (ParseException e) {

            return null;
        }
    }

    /**
     * Data,Calendar格式转转
     */
    public static Calendar dataToCalendar(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar;
    }

    /**
     * 获取传入日期前60分钟时间距现在毫秒数
     */
    public static long before60Time(Date date) {
        Calendar calendar = dataToCalendar(date);
        calendar.add(Calendar.MINUTE, -60);
        Date resultDate = calendar.getTime();
        long resultLong = resultDate.getTime();
        long nowLong = new Date().getTime();
        return resultLong - nowLong;
//        return 20000;
    }

    /**
     * 获取传入日期前15分钟时间距现在毫秒数
     */
    public static long before15Time(Date date) {
        Calendar calendar = dataToCalendar(date);
        calendar.add(Calendar.MINUTE, -15);
        Date resultDate = calendar.getTime();
        long resultLong = resultDate.getTime();
        long nowLong = new Date().getTime();
        return resultLong - nowLong;
//        return 15000;
    }

    /**
     * 获取传入日期前5分钟时间距现在毫秒数
     */
    public static long before5Time(Date date) {
        Calendar calendar = dataToCalendar(date);
        calendar.add(Calendar.MINUTE, -5);
        Date resultDate = calendar.getTime();
        long resultLong = resultDate.getTime();
        long nowLong = new Date().getTime();
        return resultLong - nowLong;
//        return 10000;
    }

    /**
     * 获取明日17:00:00
     */
    public static Date getBefor17Points(Date date) {
        List<String> l = Arrays.asList(dateToString(date).split("[-: ]"));
        int year = Integer.parseInt(l.get(0));
        int month = Integer.parseInt(l.get(1));
        int day = Integer.parseInt(l.get(2));
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(year, month - 1, day - 1, 17, 0, 0);
        return calendar.getTime();
    }

    /**
     * 获取此时与明日17:00:00差的毫秒数
     */
    public static long distance17Points(Date date) {
        long l1 = getBefor17Points(date).getTime();
        long l2 = new Date().getTime();
        return l2 - l1;
    }


}
