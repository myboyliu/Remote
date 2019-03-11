package com.sicmed.remote.task;

import lombok.Data;

@Data
public class MessageTemplate {

    private String id;

    private String type;

    private String prefix;

    private String suffix;

    private String fill;

    private String linked;

}
