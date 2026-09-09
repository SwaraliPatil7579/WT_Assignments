package com.vit.result.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentRequestDTO {
    @NotBlank
    private String regNo;
    @NotBlank
    private String name;
    private String branch;
    @NotNull
    @Min(1)
    @Max(8)
    private Integer semester;
}
