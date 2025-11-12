package com.flightmgmt.model;

import java.sql.Timestamp;

public class Flight {
    private int flightId;
    private String flightNumber;
    private String source;
    private String destination;
    private Timestamp departureTime;
    private Timestamp arrivalTime;
    private double price;
    private int totalSeats;
    private int availableSeats;

    // Getters
    public int getFlightId() {
        return flightId;
    }
    public String getFlightNumber() {
        return flightNumber;
    }
    public String getSource() {
        return source;
    }
    public String getDestination() {
        return destination;
    }
    public Timestamp getDepartureTime() {
        return departureTime;
    }
    public Timestamp getArrivalTime() {
        return arrivalTime;
    }
    public double getPrice() {
        return price;
    }
    public int getTotalSeats() {
        return totalSeats;
    }
    public int getAvailableSeats() {
        return availableSeats;
    }

    // Setters
    public void setFlightId(int flightId) {
        this.flightId = flightId;
    }
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
    public void setSource(String source) {
        this.source = source;
    }
    public void setDestination(String destination) {
        this.destination = destination;
    }
    public void setDepartureTime(Timestamp departureTime) {
        this.departureTime = departureTime;
    }
    public void setArrivalTime(Timestamp arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }
    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}