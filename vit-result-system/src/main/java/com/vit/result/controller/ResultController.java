package com.vit.result.controller;

import com.vit.result.dto.ResultResponseDTO;
import com.vit.result.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/result")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/{regNo}")
    public ResultResponseDTO getResult(@PathVariable String regNo) {
        return resultService.computeResult(regNo);
    }
}
