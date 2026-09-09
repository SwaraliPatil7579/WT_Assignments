package com.vit.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResultDTO {
    private String subjectCode;
    private String subjectName;
    private Integer credits;

    private Double mseMarks;       // raw, out of 50
    private Double eseMarks;       // raw, out of 100

    private Double mseWeighted;    // scaled to 30
    private Double eseWeighted;    // scaled to 70

    private Double totalMarks;     // out of 100 (mseWeighted + eseWeighted)
    private String grade;          // S / A / B / C / D / E / F
    private Integer gradePoint;    // 10..0
    private boolean pass;
}
