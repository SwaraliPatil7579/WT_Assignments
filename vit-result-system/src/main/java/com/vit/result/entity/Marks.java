package com.vit.result.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Raw marks entered by faculty/admin.
 * MSE is out of 50 and contributes 30% of the final subject score.
 * ESE is out of 100 and contributes 70% of the final subject score.
 * Weighted scores are computed on the fly in ResultService, never stored,
 * so the weightage can be changed in one place without a data migration.
 */
@Entity
@Table(name = "marks", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "subject_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"marksList"})
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("50.0")
    @Column(name = "mse_marks", nullable = false)
    private Double mseMarks;       // out of 50

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(name = "ese_marks", nullable = false)
    private Double eseMarks;       // out of 100
}
