package com.vit.result.repository;

import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);

    @Query("SELECT m FROM Marks m JOIN FETCH m.subject WHERE m.student.id = :studentId")
    List<Marks> findByStudentId(@Param("studentId") Long studentId);

    Optional<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
