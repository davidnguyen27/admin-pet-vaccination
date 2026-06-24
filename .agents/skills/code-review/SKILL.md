---
name: code-review
description: Use this skill when reviewing Vue, TypeScript, Pinia, Axios, routing, Ant Design Vue, or i18n code in this repository.
---

# Code Review Skill

Review code in this order:

1. Correctness
2. State ownership
3. TypeScript safety
4. Vue reactivity
5. Pinia usage
6. API/Axios usage
7. Router usage
8. UI consistency
9. i18n
10. Simplicity

## Check For

- components calling API services directly
- components calling `axiosClient` directly
- duplicated store state in component
- destructured Pinia state without `storeToRefs`
- computed values with side effects
- watchers used where computed is enough
- missing typed props or emits
- missing API response types
- hardcoded UI text
- unnecessary border radius or shadows
- broad unrelated refactors
- new libraries added without approval

## Output Format

Use this format:

````md
## Overall

Short review.

## Issues

### 1. Issue title

Problem.

Suggested fix.

```ts
// code example
```
````

## Recommended Version

```ts
// improved code
```

## Summary

- What to change
- Why it matters