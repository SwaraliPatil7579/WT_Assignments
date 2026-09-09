-- ============================================================
-- Sample data for Vishwakarma Institute of Technology Result System
-- Runs automatically on startup (spring.sql.init.mode=always)
-- Safe to re-run: guarded with NOT EXISTS checks.
-- ============================================================

INSERT INTO subjects (code, name, credits)
SELECT * FROM (SELECT 'BCSE101' AS code, 'Data Structures and Algorithms' AS name, 4 AS credits) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'BCSE101');

INSERT INTO subjects (code, name, credits)
SELECT * FROM (SELECT 'BCSE102', 'Object Oriented Programming with Java', 4) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'BCSE102');

INSERT INTO subjects (code, name, credits)
SELECT * FROM (SELECT 'BMAT101', 'Discrete Mathematics and Graph Theory', 3) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'BMAT101');

INSERT INTO subjects (code, name, credits)
SELECT * FROM (SELECT 'BCSE103', 'Database Management Systems', 4) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'BCSE103');

-- Demo students
INSERT INTO students (reg_no, name, branch, semester)
SELECT * FROM (SELECT '21BCE1234' AS reg_no, 'Aarav Sharma' AS name, 'Computer Science and Engineering' AS branch, 3 AS semester) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM students WHERE reg_no = '21BCE1234');

INSERT INTO students (reg_no, name, branch, semester)
SELECT * FROM (SELECT '21BCE5678', 'Diya Patel', 'Computer Science and Engineering', 3) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM students WHERE reg_no = '21BCE5678');

INSERT INTO students (reg_no, name, branch, semester)
SELECT * FROM (SELECT '21BEC9012', 'Rohan Mehta', 'Electronics and Communication Engineering', 3) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM students WHERE reg_no = '21BEC9012');

-- Marks for Aarav Sharma (21BCE1234) — strong performer
INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 45, 88 FROM students s, subjects sub
WHERE s.reg_no = '21BCE1234' AND sub.code = 'BCSE101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 42, 91 FROM students s, subjects sub
WHERE s.reg_no = '21BCE1234' AND sub.code = 'BCSE102'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 38, 79 FROM students s, subjects sub
WHERE s.reg_no = '21BCE1234' AND sub.code = 'BMAT101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 40, 85 FROM students s, subjects sub
WHERE s.reg_no = '21BCE1234' AND sub.code = 'BCSE103'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

-- Marks for Diya Patel (21BCE5678) — average, one weak subject
INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 28, 55 FROM students s, subjects sub
WHERE s.reg_no = '21BCE5678' AND sub.code = 'BCSE101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 33, 62 FROM students s, subjects sub
WHERE s.reg_no = '21BCE5678' AND sub.code = 'BCSE102'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 18, 30 FROM students s, subjects sub
WHERE s.reg_no = '21BCE5678' AND sub.code = 'BMAT101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 30, 58 FROM students s, subjects sub
WHERE s.reg_no = '21BCE5678' AND sub.code = 'BCSE103'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

-- Marks for Rohan Mehta (21BEC9012) — solid all-rounder
INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 35, 70 FROM students s, subjects sub
WHERE s.reg_no = '21BEC9012' AND sub.code = 'BCSE101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 37, 74 FROM students s, subjects sub
WHERE s.reg_no = '21BEC9012' AND sub.code = 'BCSE102'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 32, 68 FROM students s, subjects sub
WHERE s.reg_no = '21BEC9012' AND sub.code = 'BMAT101'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);

INSERT INTO marks (student_id, subject_id, mse_marks, ese_marks)
SELECT s.id, sub.id, 36, 72 FROM students s, subjects sub
WHERE s.reg_no = '21BEC9012' AND sub.code = 'BCSE103'
AND NOT EXISTS (SELECT 1 FROM marks m WHERE m.student_id = s.id AND m.subject_id = sub.id);
