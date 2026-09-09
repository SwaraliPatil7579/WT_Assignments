package com.vit.result.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarksRequestDTO {
    @NotBlank
    private String regNo;

    @NotBlank
    private String subjectCode;

    @NotNull @DecimalMin("0.0") @DecimalMax("50.0")
    private Double mseMarks;

    @NotNull @DecimalMin("0.0") @DecimalMax("100.0")
    private Double eseMarks;
}
