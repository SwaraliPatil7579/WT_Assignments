/**
 * Client-side grade calculation for the live preview in marks entry form.
 * Mirrors the backend GradeCalculator.java exactly.
 */

const MSE_MAX = 50.0;
const ESE_MAX = 100.0;
const MSE_WEIGHT = 0.30;
const ESE_WEIGHT = 0.70;
const PASS_THRESHOLD = 50.0;

export function round2(value) {
  return Math.round(value * 100) / 100;
}

export function weightedMse(mseMarks) {
  return round2((mseMarks / MSE_MAX) * (MSE_WEIGHT * 100));
}

export function weightedEse(eseMarks) {
  return round2((eseMarks / ESE_MAX) * (ESE_WEIGHT * 100));
}

export function totalMarks(mseMarks, eseMarks) {
  return round2(weightedMse(mseMarks) + weightedEse(eseMarks));
}

export function gradeFor(total) {
  if (total >= 90) return 'S';
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 55) return 'D';
  if (total >= 50) return 'E';
  return 'F';
}

export function gradePointFor(grade) {
  const map = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };
  return map[grade] ?? 0;
}

export function isPass(total) {
  return total >= PASS_THRESHOLD;
}
