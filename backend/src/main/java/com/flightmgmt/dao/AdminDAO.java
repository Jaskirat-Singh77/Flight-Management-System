package com.flightmgmt.dao;

import com.flightmgmt.config.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AdminDAO {

    /**
     * Validates admin credentials.
     * In a real-world app, passwords should be hashed and compared.
     * Here we do a simple text match as requested.
     */
    public boolean validateAdmin(String username, String password) throws SQLException {
        String sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
        
        // try-with-resources ensures Connection and PreparedStatement are closed
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, username);
            ps.setString(2, password);
            
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next(); // True if a record is found, false otherwise
            }
        }
    }
}