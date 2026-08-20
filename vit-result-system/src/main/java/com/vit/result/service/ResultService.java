package com.vit.result.service;

import com.vit.result.dto.ResultResponseDTO;
import com.vit.result.dto.SubjectResultDTO;
import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.repository.MarksRepository;
import com.vit.result.util.GradeCalculator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final StudentService studentService;
    private final MarksRepository marksRepository;

    public ResultResponseDTO computeResult(String regNo) {
        Student student = studentService.getByRegNo(regNo);
        List<Marks> marksList = marksRepository.findByStudentId(student.getId());

        if (marksList.isEmpty()) {
            throw new EntityNotFoundException("No marks have been entered yet for " + student.getRegNo());
        }

        marksList.sort(Comparator.comparing(m -> m.getSubject().getCode()));

        double totalObtained = 0;
        double totalMax = 0;
        int creditWeightedPointSum = 0;
        int totalCredits = 0;
        boolean overallPass = true;

        List<SubjectResultDTO> subjectResults = new java.util.ArrayList<>();

        for (Marks m : marksList) {
            double mseW = GradeCalculator.weightedMse(m.getMseMarks());
            double eseW = GradeCalculator.weightedEse(m.getEseMarks());
            double total = GradeCalculator.round2(mseW + eseW);
            String grade = GradeCalculator.gradeFor(total);
            int gradePoint = GradeCalculator.gradePointFor(grade);
            boolean pass = GradeCalculator.isPass(total);
            int credits = m.getSubject().getCredits();

            if (!pass) {
                overallPass = false;
            }

            SubjectResultDTO dto = new SubjectResultDTO(
                    m.getSubject().getCode(),
                    m.getSubject().getName(),
                    credits,
                    m.getMseMarks(),
                    m.getEseMarks(),
                    mseW,
                    eseW,
                    total,
                    grade,
                    gradePoint,
                    pass
            );
            subjectResults.add(dto);

            totalObtained += total;
            totalMax += 100;
            creditWeightedPointSum += gradePoint * credits;
            totalCredits += credits;
        }

        double percentage = GradeCalculator.round2((totalObtained / totalMax) * 100);
        double sgpa = totalCredits == 0 ? 0.0
                : GradeCalculator.round2((double) creditWeightedPointSum / totalCredits);

        ResultResponseDTO response = new ResultResponseDTO();
        response.setRegNo(student.getRegNo());
        response.setName(student.getName());
        response.setBranch(student.getBranch());
        response.setSemester(student.getSemester());
        response.setSubjects(subjectResults);
        response.setTotalMarksObtained(GradeCalculator.round2(totalObtained));
        response.setTotalMaxMarks(totalMax);
        response.setOverallPercentage(percentage);
        response.setSgpa(sgpa);
        response.setOverallResult(overallPass ? "PASS" : "FAIL");
        return response;
    }
}
