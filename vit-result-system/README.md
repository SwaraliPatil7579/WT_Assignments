# Vishwakarma Institute of Technology Semester Result Register

A responsive web application to compute and display one semester's result for
Vishwakarma Institute of Technology students across four subjects, with **MSE weighted at 30%** and
**ESE weighted at 70%** per subject. Built with **Spring Boot 3 / Java 17**,
**MySQL**, and a vanilla HTML/CSS/JS frontend served as static resources.

## What's inside

- **Backend** — Spring Boot REST API (`/api/...`) with JPA/Hibernate, MySQL,
  bean validation, and a global JSON error handler.
- **Frontend** — a single responsive page (`static/index.html`) styled as an
  "academic ledger": a ruled marksheet table, a stamped grade seal for the
  pass/fail verdict, and a faculty panel to register students and enter marks.
- **Sample data** — 4 subjects and 3 demo students with marks are seeded
  automatically on first run (`data.sql`).

## Marking scheme

| Component | Raw scale | Weight | Formula |
|---|---|---|---|
| MSE | out of 50 | 30% | `(mse/50) * 30` |
| ESE | out of 100 | 70% | `(ese/100) * 70` |
| **Total** | out of 100 | 100% | `MSE_weighted + ESE_weighted` |

Grade bands (on the total /100): **S** ≥90, **A** ≥80, **B** ≥70, **C** ≥60,
**D** ≥55, **E** ≥50, **F** <50 (fail). A subject with total < 50 fails that
subject; the overall result is **FAIL** if any subject fails. SGPA is the
credit-weighted average of grade points (S=10 … F=0) across the four subjects.

All of this logic lives in one place — `util/GradeCalculator.java` — so the
weightage or grade bands can be changed without touching anything else.

## Prerequisites

- JDK 17+
- Maven 3.6+ (or use an IDE with a bundled Maven)
- MySQL 8.x running locally (or reachable) — you only need the *server*
  running; the schema and database are created automatically.

## Setup & run

1. **Start MySQL** and make sure a user with the credentials below (or your
   own) can connect. The app will auto-create the `vit_result_db` database.

2. **Configure credentials** in
   `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/vit_result_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   Change `username`/`password` to match your MySQL setup.

3. **Run the app:**
   ```bash
   mvn spring-boot:run
   ```
   or build a jar and run it:
   ```bash
   mvn clean package
   java -jar target/vit-result-system.jar
   ```

4. **Open the app:** [http://localhost:8080](http://localhost:8080)

On first startup Hibernate creates the `students`, `subjects`, and `marks`
tables, then `data.sql` seeds 4 subjects and 3 demo students. Try looking up
`21BCE1234`, `21BCE5678`, or `21BEC9012` on the "Look Up Result" tab.

## Using the app

- **Look Up Result** — enter a registration number to see the subject-wise
  ledger (MSE, ESE, weighted total, grade), overall percentage, SGPA, and a
  PASS/FAIL seal.
- **Faculty Entry** — register a new student, then enter MSE/ESE marks per
  subject for that student. Re-submitting marks for the same student+subject
  overwrites the previous entry (upsert).

## REST API reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List all students |
| GET | `/api/students/{regNo}` | Get one student |
| POST | `/api/students` | Register a student `{regNo, name, branch, semester}` |
| GET | `/api/subjects` | List the 4 subjects |
| POST | `/api/marks` | Upsert marks `{regNo, subjectCode, mseMarks, eseMarks}` |
| GET | `/api/result/{regNo}` | Computed result: per-subject breakdown, percentage, SGPA, PASS/FAIL |

Example:
```bash
curl http://localhost:8080/api/result/21BCE1234
```

## Project structure

```
vit-result-system/
├── pom.xml
├── src/main/java/com/vit/result/
│   ├── ResultSystemApplication.java
│   ├── config/CorsConfig.java
│   ├── controller/ (StudentController, ResultController, GlobalExceptionHandler)
│   ├── entity/     (Student, Subject, Marks)
│   ├── repository/ (StudentRepository, SubjectRepository, MarksRepository)
│   ├── service/     (StudentService, ResultService)
│   ├── dto/        (StudentRequestDTO, MarksRequestDTO, SubjectResultDTO, ResultResponseDTO)
│   └── util/GradeCalculator.java
└── src/main/resources/
    ├── application.properties
    ├── data.sql
    └── static/ (index.html, css/style.css, js/script.js)
```

## Customizing for real subjects

Edit `data.sql` (or use the Faculty Entry tab) to change the 4 subjects,
their credits, and marks. To change the weightage or pass mark, edit the
constants at the top of `GradeCalculator.java`.

## Notes

- This project wasn't build-verified in the authoring sandbox (no outbound
  access to Maven Central there), but every file was hand-checked for
  syntax and consistency. Run `mvn clean package` locally as your first
  step — if your environment has a different MySQL driver/JDK version
  already cached, that's the one place a mismatch could show up.
