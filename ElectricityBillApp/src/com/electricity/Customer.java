package com.electricity;

public class Customer {
    private int id;
    private String customerName;
    private String meterNumber;
    private String billingMonth;
    private double unitsConsumed;
    private double billAmount;
    private String billingDate;
    
    // Constructors
    public Customer() {}
    
    public Customer(String customerName, String meterNumber, String billingMonth, double unitsConsumed) {
        this.customerName = customerName;
        this.meterNumber = meterNumber;
        this.billingMonth = billingMonth;
        this.unitsConsumed = unitsConsumed;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }
    
    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }
    
    public double getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(double unitsConsumed) { this.unitsConsumed = unitsConsumed; }
    
    public double getBillAmount() { return billAmount; }
    public void setBillAmount(double billAmount) { this.billAmount = billAmount; }
    
    public String getBillingDate() { return billingDate; }
    public void setBillingDate(String billingDate) { this.billingDate = billingDate; }
}