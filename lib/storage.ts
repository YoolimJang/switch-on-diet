export type MetricEntry = {
  id: string
  date: string
  weight: number
  fat: number
}

export type MealCheck = {
  checked: boolean
  time: string
}

export type MealChecks = {
  b: MealCheck
  l: MealCheck
  s: MealCheck
  d: MealCheck
}

export type Checklist = {
  water: boolean
  sleep: boolean
  supplement: boolean
  waterTime: string
  sleepTime: string
  supplementTime: string
}

const KEYS = {
  day: "switchon_day",
  metrics: "switchon_metrics",
  checklistDate: "switchon_checklist_date",
  checklist: "switchon_checklist",
  mealChecks: "switchon_meal_checks",
  prevDay28: "switchon_prev_day28",
}

export function getDay(): number {
  if (typeof window === "undefined") return 1
  const v = localStorage.getItem(KEYS.day)
  return v ? parseInt(v) : 1
}

export function setDay(day: number): void {
  localStorage.setItem(KEYS.day, String(day))
}

export function getMetrics(): MetricEntry[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEYS.metrics) ?? "[]")
  } catch {
    return []
  }
}

export function saveMetrics(entries: MetricEntry[]): void {
  localStorage.setItem(KEYS.metrics, JSON.stringify(entries))
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getMealChecks(): MealChecks {
  if (typeof window === "undefined") return defaultMealChecks()
  const savedDate = localStorage.getItem(KEYS.checklistDate)
  const today = getTodayDateString()
  if (savedDate !== today) return defaultMealChecks()
  try {
    return JSON.parse(localStorage.getItem(KEYS.mealChecks) ?? "null") ?? defaultMealChecks()
  } catch {
    return defaultMealChecks()
  }
}

export function saveMealChecks(checks: MealChecks): void {
  localStorage.setItem(KEYS.checklistDate, getTodayDateString())
  localStorage.setItem(KEYS.mealChecks, JSON.stringify(checks))
}

export function getChecklist(): Checklist {
  if (typeof window === "undefined") return defaultChecklist()
  const savedDate = localStorage.getItem(KEYS.checklistDate)
  const today = getTodayDateString()
  if (savedDate !== today) return defaultChecklist()
  try {
    return JSON.parse(localStorage.getItem(KEYS.checklist) ?? "null") ?? defaultChecklist()
  } catch {
    return defaultChecklist()
  }
}

export function saveChecklist(cl: Checklist): void {
  localStorage.setItem(KEYS.checklistDate, getTodayDateString())
  localStorage.setItem(KEYS.checklist, JSON.stringify(cl))
}

export function getPrevDay28(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(KEYS.prevDay28) === "true"
}

export function setPrevDay28(val: boolean): void {
  localStorage.setItem(KEYS.prevDay28, String(val))
}

export function resetDailyChecks(): void {
  localStorage.removeItem(KEYS.checklist)
  localStorage.removeItem(KEYS.mealChecks)
  localStorage.removeItem(KEYS.checklistDate)
}

export function defaultMealChecks(): MealChecks {
  return {
    b: { checked: false, time: "" },
    l: { checked: false, time: "" },
    s: { checked: false, time: "" },
    d: { checked: false, time: "" },
  }
}

export function defaultChecklist(): Checklist {
  return {
    water: false,
    sleep: false,
    supplement: false,
    waterTime: "",
    sleepTime: "",
    supplementTime: "",
  }
}
