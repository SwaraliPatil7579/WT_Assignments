package com.vit.result.util;

/**
 * Central place for the marks -> grade -> grade point policy so it never
 * has to be duplicated (or drift) across services.
 *
 * Weightage: MSE (out of 50) = 30%, ESE (out of 100) = 70%.
 * Grade bands are on the final weighted total out of 100.
 */
public final class GradeCalculator {

    private GradeCalculator() {}

    public static final double MSE_MAX = 50.0;
    public static final double ESE_MAX = 100.0;
    public static final double MSE_WEIGHT = 0.30;
    public static final double ESE_WEIGHT = 0.70;
    public static final double PASS_THRESHOLD = 50.0;

    public static double weightedMse(double mseMarks) {
        return round2((mseMarks / MSE_MAX) * (MSE_WEIGHT * 100));
    }

    public static double weightedEse(double eseMarks) {
        return round2((eseMarks / ESE_MAX) * (ESE_WEIGHT * 100));
    }

    public static double totalMarks(double mseMarks, double eseMarks) {
        return round2(weightedMse(mseMarks) + weightedEse(eseMarks));
    }

    public static String gradeFor(double total) {
        if (total >= 90) return "S";
        if (total >= 80) return "A";
        if (total >= 70) return "B";
        if (total >= 60) return "C";
        if (total >= 55) return "D";
        if (total >= 50) return "E";
        return "F";
    }

    public static int gradePointFor(String grade) {
        return switch (grade) {
            case "S" -> 10;
            case "A" -> 9;
            case "B" -> 8;
            case "C" -> 7;
            case "D" -> 6;
            case "E" -> 5;
            default -> 0; // F
        };
    }

    public static boolean isPass(double total) {
        return total >= PASS_THRESHOLD;
    }

    public static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
