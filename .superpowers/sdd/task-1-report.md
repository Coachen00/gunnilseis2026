# Task 1 report

Status: DONE

## RED

Command: `npm test -- src/data/individualTraining.test.ts`

Result: Exit code 1. Vitest reported one failed suite and `Failed to resolve import "./individualTraining"`; the expected failure was caused by the missing production module.

## GREEN

Command: `npm test -- src/data/individualTraining.test.ts`

Result: Exit code 0. One test file passed, 10 tests passed.

## Regression verification

- `npm test`: Exit code 0; 30 test files and 350 tests passed.
- `npm run build`: Exit code 0; production build completed successfully.

## Self-review

- The public exports and every required schedule field are covered by contract tests.
- Full, maintenance and minimum schedules contain only the requested sessions and days.
- All high-intensity sessions carry an explicit stop rule.
- Plan labels are neutral, and loading guidance uses percentages or RPE.
- Position-to-role mapping uses the existing `Player`/`Position` contract.

## Clarification recorded during initial implementation

The brief simultaneously prescribes strength on Monday and Friday and asks for 48–72 hours between strength sessions. Those weekdays are 96 hours apart by elapsed clock time (or three full intervening recovery days). The implementation preserves the explicitly prescribed Monday/Friday schedule; the test verifies that prescribed placement.

## Review fixes

### RED

Command: `npm test -- src/data/individualTraining.test.ts`

Result: Exit code 1; 2 failed and 9 passed. The new exact progression assertion received the old deload ordering, and the sprint-rule assertion rejected `tiden sjunker`.

### GREEN

Command: `npm test -- src/data/individualTraining.test.ts`

Result: Exit code 0; 1 test file and 11 tests passed.

Command: `npm test`

Result: Exit code 0; 30 test files and 351 tests passed.

The strength-placement test now states the contract honestly: two sessions on Monday and Friday with at least 48 hours recovery. It no longer claims a 72-hour maximum.
