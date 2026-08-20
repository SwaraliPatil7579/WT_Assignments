package com.vit.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponseDTO {
    private String regNo;
    private String name;
    private String branch;
    private Integer semester;

    private List<SubjectResultDTO> subjects;

    private Double totalMarksObtained;   // sum of totalMarks across subjects
    private Double totalMaxMarks;        // subjects.size() * 100
    private Double overallPercentage;
    private Double sgpa;                 // credit-weighted grade point average
    private String overallResult;        // PASS / FAIL
}
