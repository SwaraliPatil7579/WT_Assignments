package com.vit.result.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students", uniqueConstraints = @UniqueConstraint(columnNames = "reg_no"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "reg_no", nullable = false, unique = true, length = 20)
    private String regNo;          // e.g. 21BCE1234

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 60)
    private String branch;         // e.g. Computer Science and Engineering

    @Column(name = "semester")
    private Integer semester;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Marks> marksList = new ArrayList<>();
}
