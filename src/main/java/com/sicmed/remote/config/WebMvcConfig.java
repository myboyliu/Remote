package com.sicmed.remote.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
  public class WebMvcConfig extends WebMvcConfigurerAdapter {

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
     registry.addViewController("/dist").setViewName("forward:/dist/index.html");
     registry.addViewController("/dist/").setViewName("forward:/dist/index.html");
     registry.addViewController("/app").setViewName("forward:/app/index.html");
     registry.addViewController("/app/").setViewName("forward:/app/index.html");
     registry.addViewController("/page").setViewName("forward:/page/login.html");
     registry.addViewController("/page/").setViewName("forward:/page/login.html");
     registry.addViewController("/").setViewName("forward:/page/login.html");
     registry.addViewController("").setViewName("forward:/page/login.html");
      }


  } 