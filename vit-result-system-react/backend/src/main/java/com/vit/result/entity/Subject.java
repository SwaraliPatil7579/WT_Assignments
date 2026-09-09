package com.vit.result.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subjects", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;           // e.g. CSE101

    @Column(nullable = false, length = 100)
    private String name;           // e.g. Data Structures and Algorithms

    @Column(nullable = false)
    private Integer credits;
}
