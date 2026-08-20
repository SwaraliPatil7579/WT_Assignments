package com.vit.result.repository;

import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);
    List<Marks> findByStudentId(Long studentId);
    Optional<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
