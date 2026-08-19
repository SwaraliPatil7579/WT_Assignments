package com.electricity;

import java.sql.Timestamp;

public class BillRecord {
    private int id;
    private String customerName;
    private String meterNumber;
    private String billingMonth;
    private double unitsConsumed;
    private double billAmount;
    private Timestamp createdAt;

    public BillRecord() {}

    public BillRecord(int id, String customerName, String meterNumber, String billingMonth, double unitsConsumed, double billAmount, Timestamp createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.meterNumber = meterNumber;
        this.billingMonth = billingMonth;
        this.unitsConsumed = unitsConsumed;
        this.billAmount = billAmount;
        this.createdAt = createdAt;
    }

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

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
