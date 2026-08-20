package com.vit.result.repository;

import com.vit.result.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRegNoIgnoreCase(String regNo);
    boolean existsByRegNoIgnoreCase(String regNo);
}
