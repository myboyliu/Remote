package com.sicmed.remote.web.service;


import java.util.List;

/**
 * @version 1.0
 * @author MaxCoder
 **/
public interface BaseService<E> {
    /**
     * 插入数据
     *
     * @param e
     * @return
     */
    int insertSelective(E e);

    /**
     * 根据主键删除数据
     *
     * @param id
     * @return
     */
    int deleteByPrimaryKey(String id);

    /**
     * 根据主键修改有变化的字段
     *
     * @param e
     * @return
     */
    int updateByPrimaryKeySelective(E e);

    /**
     * 根据主键修改所有字段
     *
     * @param e
     * @return
     */
    int updateByPrimaryKey(E e);

    /**
     * 根据主键查询一条数据
     *
     * @param id
     * @return
     */
    E getByPrimaryKey(String id);

    /**
     * 根据不同的参数组合查询多条数据
     *
     * @param e
     * @return
     */
    List<E> findByDynamicParam(E e);

}
