package com.flightmgmt.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // Update these details to match your MySQL setup
    private static final String URL = "jdbc:mysql://localhost:3308/flightdb"; // <-- changed port
    private static final String USER = "root"; // root is fine
    private static final String PASSWORD = "12345678"; // <-- your new password

    static {
        try {
            // Load the MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load MySQL JDBC driver");
        }
    }

    /**
     * Gets a new connection to the database.
     * @return A Connection object
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
