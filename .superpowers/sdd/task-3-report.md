# Task 3 report

## RED

Command: `npm test -- src/test/spelarvard.test.ts`

Result: Exit code 1. Five new contract tests failed for the intended missing advice: nutrition/hydration ranges, optional individualized caffeine, sleep and strength intensity, three training alternatives with a full rest day, and risk-reduction language. Eleven existing tests passed.

## GREEN

Command: `npm test -- src/test/spelarvard.test.ts src/pages/Spelarvard.test.tsx`

Result: Exit code 0. Two test files passed; 23 of 23 tests passed.

## Changes

- Aligned carbohydrate, protein, hydration, creatine, supplement, caffeine, sleep, strength and recovery advice with the approved ranges.
- Replaced the generic summer frequency with Full plan, Underhåll and Miniminivå alternatives from the training model.
- Reframed injury advice as capacity-building and possible risk reduction, explicitly without guarantees.
- No exact UI copy assertions required changes in `src/pages/Spelarvard.test.tsx`.

## Concerns

- Advice remains general and does not replace individualized medical or nutrition guidance.

## Review follow-up: absolute promises

### RED

Command: `npm test -- src/test/spelarvard.test.ts`

Result: Exit code 1. The new global active-copy contract failed on the absolute creatine performance claim; 16 existing tests passed. The contract scans every section bullet and every area blurb and also rejects the identified strength, injury and speed promises.

### GREEN

Command: `npm test -- src/test/spelarvard.test.ts src/pages/Spelarvard.test.tsx`

Result: Exit code 0. Two test files passed; 24 of 24 tests passed.

Copy now describes creatine and strength as potentially supportive, describes the gym area through capacity and possible risk reduction, and states that individual effect varies.
