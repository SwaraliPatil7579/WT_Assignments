# Electricity Bill Calculator (JSP Web Application)

A modern, responsive JSP web application built to calculate electricity bills based on unit consumption according to customized tariff slab rules.

## Tariff Slab Conditions

| Consumption Range | Units in Slab | Rate per Unit |
|---|---|---|
| **First 50 Units** | 0 – 50 | **₹ 3.50** / unit |
| **Next 100 Units** | 51 – 150 | **₹ 4.00** / unit |
| **Next 100 Units** | 151 – 250 | **₹ 5.20** / unit |
| **Above 250 Units** | > 250 | **₹ 6.50** / unit |

---

## Calculation Examples

1. **30 Units Billed:**
   - Slab 1 (30 units @ ₹3.50) = ₹ 105.00
   - **Total Bill:** **₹ 105.00**

2. **120 Units Billed:**
   - Slab 1 (50 units @ ₹3.50) = ₹ 175.00
   - Slab 2 (70 units @ ₹4.00) = ₹ 280.00
   - **Total Bill:** **₹ 455.00**

3. **200 Units Billed:**
   - Slab 1 (50 units @ ₹3.50) = ₹ 175.00
   - Slab 2 (100 units @ ₹4.00) = ₹ 400.00
   - Slab 3 (50 units @ ₹5.20) = ₹ 260.00
   - **Total Bill:** **₹ 835.00**

4. **300 Units Billed:**
   - Slab 1 (50 units @ ₹3.50) = ₹ 175.00
   - Slab 2 (100 units @ ₹4.00) = ₹ 400.00
   - Slab 3 (100 units @ ₹5.20) = ₹ 520.00
   - Slab 4 (50 units @ ₹6.50) = ₹ 325.00
   - **Total Bill:** **₹ 1,420.00**

---

## Project Directory Structure

```
electricity_bill_jsp/
├── pom.xml                               # Maven build configuration with Jetty plugin
├── README.md                             # Project documentation
└── src/
    └── main/
        └── webapp/
            ├── WEB-INF/
            │   └── web.xml               # Servlet Deployment Descriptor
            ├── index.jsp                 # Interactive calculation form & live estimate
            ├── calculate.jsp             # Server-side JSP logic & invoice receipt generator
            ├── css/
            │   └── style.css             # Glassmorphic dark theme & printable CSS styling
            └── js/
                └── main.js               # Client-side dynamic estimate & UI controls
```

---

## How to Run

### Option 1: Using Maven Jetty Plugin (Recommended)
Open terminal inside the `electricity_bill_jsp` directory and run:

```bash
mvn jetty:run
```

Then open your browser at: `http://localhost:8080/`

### Option 2: Deploying to Apache Tomcat / Servlet Container
1. Build the WAR artifact:
   ```bash
   mvn clean package
   ```
2. Copy `target/electricity_bill_jsp.war` to Tomcat's `webapps/` folder.
3. Access at `http://localhost:8080/electricity_bill_jsp/`

---

## Features
- **Real-Time Client-Side Estimate:** Live updates as you type or adjust unit inputs.
- **Visual Slab Progress Bar:** Visualizes unit allocation across the 4 tariff tiers.
- **Server-Side Validation & Logic:** Robust Java JSP scriptlets for calculating exact bill amounts.
- **Printable Bill Invoice:** Dedicated printable design view formatted for paper or PDF export.
- **Glassmorphic UI Design:** High-contrast modern typography, dark theme gradients, and responsive layout.
