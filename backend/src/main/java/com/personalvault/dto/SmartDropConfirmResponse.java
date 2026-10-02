package com.personalvault.dto;

import com.personalvault.model.SmartDropDestination;

public class SmartDropConfirmResponse {
    private boolean success;
    private String message;
    private SmartDropDestination destination;
    private Object createdItem;
    private String navigationUrl;

    public SmartDropConfirmResponse() {}

    public SmartDropConfirmResponse(boolean success, String message, SmartDropDestination destination, Object createdItem, String navigationUrl) {
        this.success = success;
        this.message = message;
        this.destination = destination;
        this.createdItem = createdItem;
        this.navigationUrl = navigationUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SmartDropDestination getDestination() {
        return destination;
    }

    public void setDestination(SmartDropDestination destination) {
        this.destination = destination;
    }

    public Object getCreatedItem() {
        return createdItem;
    }

    public void setCreatedItem(Object createdItem) {
        this.createdItem = createdItem;
    }

    public String getNavigationUrl() {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl) {
        this.navigationUrl = navigationUrl;
    }
}
