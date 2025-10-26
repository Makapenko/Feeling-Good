# Implementation Priorities - Quick Reference

## TIER 1: Quick Wins (2-4 hours each, high impact)

### 1.1 Exercise Rating System
**Impact:** Enables exercise recommendations, engagement
**Files to create:**
- `/src/components/ExerciseRating.tsx` - 1-5 star UI widget
- Add to Redux progressSlice: `exerciseRatings[]` field
- Add selector: `selectExerciseRatings()`
- Add action: `saveExerciseRating()`

**Effort:** 3-4 hours
**User benefit:** Know which exercises help them most

---

### 1.2 Daily Streak Counter
**Impact:** Motivation, habit formation
**Files to create:**
- `/src/utils/streakUtils.ts` - Calculate current streak
- `/src/components/StreakDisplay.tsx` - Visual display
- Add selector: `selectCurrentStreak()`
- Add to TodayTasks component

**Effort:** 2-3 hours
**User benefit:** Visible progress on consistency

---

### 1.3 Mood Score Trending Chart
**Impact:** Shows improvement over time
**Files to create:**
- `/src/components/MoodTrendChart.tsx` - Line chart using Recharts
- Add selector: `selectBurnsScoreTrend()` - Extract historical Burns scores
- Add to a new "Analytics" or "Progress" tab

**Effort:** 3-4 hours
**User benefit:** Clear visual evidence of depression improvement

---

### 1.4 Chapter Mastery Progress Bar
**Impact:** Progress visibility, motivation
**Files to create:**
- `/src/utils/chapterMasteryUtils.ts` - Calculate chapter completion %
- `/src/components/ChapterMasteryProgress.tsx` - Progress bar component
- Add selector: `selectChapterMastery()` - Per-chapter progress

**Effort:** 2-3 hours
**User benefit:** See which chapters completed/in progress

---

## TIER 2: Core Missing Exercises (4-6 hours each)

### 2.1 Anger Situation Tracker (Chapter 7)
**Why:** Major gap in anger management chapter
**Components needed:**
1. AngerSituationTracker.tsx
2. types.ts with AngerSituation interface
3. Situation ranking/severity scale
4. Mental rehearsal progress tracking

**Estimated effort:** 4-6 hours
**Redux changes:**
```typescript
AngerSituationTracker: {
  situations: [{
    id, description, severity: 1-10,
    triggers: string[], coping: string[]
  }]
}
```

---

### 2.2 Guilt vs Responsibility Work (Chapter 8)
**Why:** Entire chapter missing
**Components needed:**
1. GuiltResponsibilityWorksheet.tsx
2. GuiltReframingDiary.tsx
3. Actual vs perceived wrongdoing tracker

**Estimated effort:** 4-6 hours
**Key exercise:**
- List guilt incidents
- Determine if real responsibility or distorted guilt
- Plan restitution if needed

---

### 2.3 Perfectionism Cost-Benefit (Chapter 14)
**Why:** Entire chapter missing
**Components needed:**
1. PerfectionismAnalysis.tsx
2. Intentional mistakes practice tracker
3. Cost-benefit comparison visual

**Estimated effort:** 4-5 hours
**Key exercise:**
- List costs/benefits of perfectionist standards
- Deliberately practice doing things "good enough"
- Track discomfort levels

---

### 2.4 Work-Value Separation (Chapter 13)
**Why:** Entire chapter missing
**Components needed:**
1. WorkValueSeparation.tsx
2. Non-work achievement tracker
3. Self-worth independence scale

**Estimated effort:** 4-5 hours
**Key exercises:**
- Rate self-worth independent of work
- List non-work accomplishments
- Practice separating identity from job

---

## TIER 3: Analytics Dashboard (5-8 hours)

### 3.1 Create Analytics Dashboard Page
**Files to create:**
- `/src/components/AnalyticsDashboard/AnalyticsDashboard.tsx` - Main container
- `/src/components/AnalyticsDashboard/MoodTrendChart.tsx`
- `/src/components/AnalyticsDashboard/ActivityDistribution.tsx` - Pie chart
- `/src/components/AnalyticsDashboard/ExerciseEffectiveness.tsx`
- `/src/components/AnalyticsDashboard/TimeInvestment.tsx`

**Layout:**
```
┌─ Analytics Dashboard ────────┐
├─ Mood Trend (line chart)     │
├─ Activity Distribution       │
├─ Time Spent Breakdown        │
├─ Exercise Ratings            │
├─ Test Score History          │
└──────────────────────────────┘
```

**Effort:** 5-8 hours
**Redux additions:** 4-5 new selectors

---

## TIER 4: Advanced Analytics (8-12 hours)

### 4.1 Activity-Mood Correlation Heatmap
**Complexity:** Requires data aggregation
**File:** `/src/components/ActivityMoodHeatmap.tsx`
**Data needed:** Burns score × Exercise type correlation
**Effort:** 6-8 hours

### 4.2 Procrastination Pattern Analysis
**Complexity:** Multi-dimensional analysis
**Files:** 
- `/src/components/ProcrastinationAnalysis.tsx`
- `/src/utils/procrastinationUtils.ts`
**Effort:** 5-7 hours

### 4.3 Cognitive Distortion Frequency Tracker
**Complexity:** Aggregate across multiple exercises
**File:** `/src/components/DistortionFrequencyChart.tsx`
**Data source:** Cognitive biases test + thought diary entries
**Effort:** 5-6 hours

---

## TIER 5: Missing Exercises (Medium Priority)

### 5.1 Approval Dependency Tracker (Chapter 11)
- Rejection exposure practice
- Approval independence assessment
- Authentic expression journal
**Effort:** 5-7 hours

### 5.2 Grief Processing Journal (Chapter 9)
- Loss expression prompts
- Grief progression tracking
- Integration exercises
**Effort:** 4-5 hours

### 5.3 Love Dependency Assessment (Chapter 12)
- Relationship pattern analysis
- Solo pleasure activities
- Emotional independence metrics
**Effort:** 5-6 hours

---

## Implementation Sequence (Recommended)

### Week 1-2: Foundation
1. Exercise rating system (3h)
2. Daily streak counter (2h)
3. Refactor to Recharts (2h)
4. Total: 7 hours

### Week 3-4: Visualizations
1. Mood trend chart (4h)
2. Chapter mastery progress (3h)
3. Analytics dashboard scaffold (3h)
4. Total: 10 hours

### Week 5-6: Missing Exercises
1. Anger situation tracker (5h)
2. Guilt vs responsibility (5h)
3. Total: 10 hours

### Week 7-8: More Exercises
1. Perfectionism analysis (5h)
2. Work-value separation (5h)
3. Total: 10 hours

### Week 9-10: Advanced Analytics
1. Activity-mood correlation (6h)
2. Procrastination analysis (5h)
3. Total: 11 hours

**Total roadmap: ~48 hours = 6 weeks part-time (8h/week)**

---

## File Structure for New Components

```
src/
├── components/
│   ├── AnalyticsDashboard/
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── MoodTrendChart.tsx
│   │   ├── ActivityDistribution.tsx
│   │   ├── ExerciseEffectiveness.tsx
│   │   ├── TimeInvestment.tsx
│   │   └── AnalyticsDashboard.module.css
│   ├── Activities/
│   │   ├── AngerSituationTracker/
│   │   │   ├── AngerSituationTracker.tsx
│   │   │   ├── types.ts
│   │   │   └── AngerSituationTracker.module.css
│   │   ├── GuiltResponsibility/
│   │   │   ├── GuiltResponsibility.tsx
│   │   │   ├── types.ts
│   │   │   └── GuiltResponsibility.module.css
│   │   ├── PerfectionismAnalysis/
│   │   ├── WorkValueSeparation/
│   │   └── [others...]
│   └── shared/
│       ├── ExerciseRating.tsx
│       ├── StreakDisplay.tsx
│       └── RatingDialog.tsx
├── utils/
│   ├── streakUtils.ts
│   ├── chapterMasteryUtils.ts
│   ├── analyticsUtils.ts
│   └── correlationAnalysis.ts
└── redux/
    └── selectors.ts (add new selectors here)
```

---

## Testing Checklist for Each Component

- [ ] Redux state persists to localStorage
- [ ] Data calculations are memoized (no expensive recalcs)
- [ ] Mobile responsive (test at 375px width)
- [ ] Chart renders with empty data
- [ ] Date range selections work correctly
- [ ] Unit tests for utils
- [ ] Integration tests for Redux actions

---

## Migration Considerations

### Refactor DysfunctionalAttitudeScale Chart
**Current:** Manual canvas drawing
**Target:** Recharts bar chart
**Why:** Consistency, responsiveness, maintainability
**Effort:** 1-2 hours
**File:** `/src/components/Activities/DysfunctionalAttitudeScale/ResultsChart.tsx`

### Move getDailyProgress to Selector
**Current:** Calculation in component
**Target:** Memoized selector using Reselect
**Why:** Performance, reusability
**Effort:** 1 hour
**File:** `/src/redux/selectors.ts`

### Consolidate Timer Logic
**Current:** Scattered across components
**Target:** Single hook + service
**Why:** Single source of truth
**Effort:** 1-2 hours
**Files:** New `/src/hooks/useActivityTimer.ts` + `/src/services/timerService.ts`

---

## Key Performance Metrics to Track

After implementing analytics:

1. **Mood Improvement:** Average Burns score reduction week-over-week
2. **Exercise Engagement:** % of available exercises completed
3. **Consistency:** Daily activity streak distribution
4. **Efficacy:** Correlation coefficient between exercise types and mood
5. **User Retention:** Days since last activity
6. **Chapter Progress:** % chapters completed
7. **Test Patterns:** Frequency of scale retakes

---

## Notes for Development

- Use Recharts for all new charts (consistency with DAS chart upgrade)
- Keep data transformations in selectors, not components
- Export analytics data as JSON for user backup
- Consider privacy - all analytics are local-only (no server tracking)
- Mobile-first design for chart components
- Add loading states for data-heavy components
- Implement error boundaries for chart rendering

