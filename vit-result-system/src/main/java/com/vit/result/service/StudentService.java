package com.vit.result.service;

import com.vit.result.dto.MarksRequestDTO;
import com.vit.result.dto.StudentRequestDTO;
import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.repository.MarksRepository;
import com.vit.result.repository.StudentRepository;
import com.vit.result.repository.SubjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarksRepository marksRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Student getByRegNo(String regNo) {
        return studentRepository.findByRegNoIgnoreCase(regNo)
                .orElseThrow(() -> new EntityNotFoundException("No student found with registration number: " + regNo));
    }

    @Transactional
    public Student createStudent(StudentRequestDTO dto) {
        if (studentRepository.existsByRegNoIgnoreCase(dto.getRegNo())) {
            throw new IllegalArgumentException("A student with registration number " + dto.getRegNo() + " already exists");
        }
        Student student = new Student();
        student.setRegNo(dto.getRegNo().toUpperCase());
        student.setName(dto.getName());
        student.setBranch(dto.getBranch());
        student.setSemester(dto.getSemester());
        return studentRepository.save(student);
    }

    /**
     * Create or update the MSE/ESE marks for one student in one subject.
     * Upsert semantics: re-submitting the same regNo+subjectCode overwrites the marks.
     */
    @Transactional
    public Marks saveMarks(MarksRequestDTO dto) {
        Student student = getByRegNo(dto.getRegNo());
        Subject subject = subjectRepository.findByCodeIgnoreCase(dto.getSubjectCode())
                .orElseThrow(() -> new EntityNotFoundException("No subject found with code: " + dto.getSubjectCode()));

        Marks marks = marksRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .orElseGet(Marks::new);
        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setMseMarks(dto.getMseMarks());
        marks.setEseMarks(dto.getEseMarks());
        return marksRepository.save(marks);
    }
}
