package com.vit.result.controller;

import com.vit.result.dto.MarksRequestDTO;
import com.vit.result.dto.StudentRequestDTO;
import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/{regNo}")
    public Student getStudent(@PathVariable String regNo) {
        return studentService.getByRegNo(regNo);
    }

    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody StudentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.createStudent(dto));
    }

    @GetMapping("/subjects")
    public List<Subject> getAllSubjects() {
        return studentService.getAllSubjects();
    }

    @PostMapping("/marks")
    public ResponseEntity<Marks> saveMarks(@Valid @RequestBody MarksRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.saveMarks(dto));
    }
}
