package com.flightmgmt.model;

public class Admin {
    private int adminId;
    private String username;
    private String password;

    // Getters
    public int getAdminId() {
        return adminId;
    }
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }

    // Setters
    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}