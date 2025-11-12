package com.flightmgmt.model;

import java.sql.Timestamp;

public class Booking {
    private int bookingId;
    private int flightId;
    private String userName;
    private int seatsBooked;
    private Timestamp bookingDate;

    // Used to hold joined flight data
    private Flight flight;

    // Getters
    public int getBookingId() {
        return bookingId;
    }
    public int getFlightId() {
        return flightId;
    }
    public String getUserName() {
        return userName;
    }
    public int getSeatsBooked() {
        return seatsBooked;
    }
    public Timestamp getBookingDate() {
        return bookingDate;
    }
    public Flight getFlight() {
        return flight;
    }

    // Setters
    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }
    public void setFlightId(int flightId) {
        this.flightId = flightId;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }
    public void setBookingDate(Timestamp bookingDate) {
        this.bookingDate = bookingDate;
    }
    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}