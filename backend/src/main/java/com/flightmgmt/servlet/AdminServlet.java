package com.flightmgmt.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import com.flightmgmt.dao.AdminDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AdminServlet extends HttpServlet {
    private AdminDAO adminDAO;
    private Gson gson;

    @Override
    public void init() {
        adminDAO = new AdminDAO();
        gson = new Gson();
    }

    /**
     * Handles Admin Login: POST /api/admin/login
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        // Ensure the path is for login
        if (pathInfo != null && pathInfo.equals("/login")) {
            handleLogin(req, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 1. Read the JSON request body
        String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        
        // 2. Parse JSON to get username and password
        // Using JsonObject for simple, non-model-backed data
        JsonObject loginData = gson.fromJson(body, JsonObject.class);
        String username = loginData.get("username").getAsString();
        String password = loginData.get("password").getAsString();

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        // 3. Prepare a map for the JSON response
        Map<String, Object> result = new HashMap<>();

        try {
            // 4. Validate credentials using the DAO
            boolean isValid = adminDAO.validateAdmin(username, password);
            
            if (isValid) {
                resp.setStatus(HttpServletResponse.SC_OK);
                result.put("success", true);
                result.put("message", "Login successful");
                // In a real app, generate a JWT. For this, a simple token is fine.
                result.put("token", "admin-logged-in-token-xyz");
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                result.put("success", false);
                result.put("message", "Invalid username or password");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            result.put("success", false);
            result.put("message", "Database error: " + e.getMessage());
        }
        
        // 5. Write the JSON response
        out.print(gson.toJson(result));
        out.flush();
    }
}