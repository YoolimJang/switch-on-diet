"use client"

import { useState, useEffect, useCallback } from "react"
import { Pencil, Minus, Plus, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { getPhaseForDay } from "@/lib/phases"
import {
  getDay,
  setDay as saveDay,
  getMealChecks,
  saveMealChecks,
  getChecklist,
  saveChecklist,
  resetDailyChecks,
  defaultMealChecks,
  defaultChecklist,
  type MealChecks,
  type Checklist,
} from "@/lib/storage"

function getCurrentTime(): string {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
}

function getFastingProgress(): { progress: number; remaining: string } {
  const now = new Date()
  const totalMinutes = now.getHours() * 60 + now.getMinutes()
  const fastStart = 20 * 60
  const fastDuration = 14 * 60
  let elapsed: number
  if (totalMinutes >= fastStart) {
    elapsed = totalMinutes - fastStart
  } else {
    elapsed = totalMinutes + (24 * 60 - fastStart)
  }
  elapsed = Math.min(elapsed, fastDuration)
  const progress = Math.round((elapsed / fastDuration) * 100)
  const remainingMin = fastDuration - elapsed
  const rh = Math.floor(remainingMin / 60)
  const rm = remainingMin % 60
  const remaining = `${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")} 남음`
  return { progress, remaining }
}

const mealLabels: Record<keyof MealChecks, string> = {
  b: "아침",
  l: "점심",
  s: "간식",
  d: "저녁",
}

const checklistItems: {
  key: "water" | "sleep" | "supplement"
  timeKey: "waterTime" | "sleepTime" | "supplementTime"
  label: string
}[] = [
  { key: "water", timeKey: "waterTime", label: "물 2L 이상" },
  { key: "sleep", timeKey: "sleepTime", label: "수면 6시간+" },
  { key: "supplement", timeKey: "supplementTime", label: "영양제 섭취" },
]

function SaladIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floating leaves */}
      <ellipse cx="7" cy="9" rx="3" ry="1.6" transform="rotate(-25 7 9)" fill="#C2D076" />
      <ellipse cx="13" cy="6.5" rx="2.8" ry="1.5" fill="#C2D076" />
      <ellipse cx="19" cy="9" rx="3" ry="1.6" transform="rotate(25 19 9)" fill="#C2D076" />
      {/* Floating tomatoes */}
      <circle cx="10" cy="11" r="1.7" fill="#EB5E28" />
      <circle cx="16.5" cy="10" r="1.4" fill="#EB5E28" />
      {/* Bowl body */}
      <path d="M2.5 13.5 Q2.5 22 13 22 Q23.5 22 23.5 13.5 Z" fill="#FAF9F5" stroke="#736F4E" strokeWidth="1.4" />
      {/* Bowl rim */}
      <line x1="2.5" y1="13.5" x2="23.5" y2="13.5" stroke="#736F4E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function HomePage() {
  const [day, setDayState] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tempDay, setTempDay] = useState(1)
  const [mealChecks, setMealChecks] = useState<MealChecks>(defaultMealChecks())
  const [checklist, setChecklist] = useState<Checklist>(defaultChecklist())
  const [fasting, setFasting] = useState({ progress: 0, remaining: "00:00 남음" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDayState(getDay())
    setMealChecks(getMealChecks())
    setChecklist(getChecklist())
    setFasting(getFastingProgress())
    const timer = setInterval(() => setFasting(getFastingProgress()), 60000)
    return () => clearInterval(timer)
  }, [])

  const phase = getPhaseForDay(day)

  const openDialog = useCallback(() => {
    setTempDay(day)
    setDialogOpen(true)
  }, [day])

  const confirmDay = useCallback(() => {
    saveDay(tempDay)
    setDayState(tempDay)
    resetDailyChecks()
    setMealChecks(defaultMealChecks())
    setChecklist(defaultChecklist())
    setDialogOpen(false)
  }, [tempDay])

  const toggleMeal = useCallback((key: keyof MealChecks) => {
    setMealChecks((prev) => {
      const updated = {
        ...prev,
        [key]: {
          checked: !prev[key].checked,
          time: !prev[key].checked ? getCurrentTime() : "",
        },
      }
      saveMealChecks(updated)
      return updated
    })
  }, [])

  const toggleCheck = useCallback(
    (key: "water" | "sleep" | "supplement", timeKey: "waterTime" | "sleepTime" | "supplementTime") => {
      setChecklist((prev) => {
        const nowChecked = !prev[key]
        const updated = { ...prev, [key]: nowChecked, [timeKey]: nowChecked ? getCurrentTime() : "" }
        saveChecklist(updated)
        return updated
      })
    },
    []
  )

  const allMealsChecked = Object.values(mealChecks).every((m) => m.checked)
  const allChecklistChecked = checklist.water && checklist.sleep && checklist.supplement
  const allDone = allMealsChecked && allChecklistChecked

  if (!mounted) return null

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span
            className="font-bold italic text-[#001514]"
            style={{ fontFamily: 'Baskerville, "Baskerville Old Face", serif', fontSize: "24pt" }}
          >
            Day{day}
          </span>
          <p className="text-[19px] font-medium text-[#001514] mt-1">{phase.phase}</p>
          <p className="text-sm text-[#736F4E] mt-0.5">{phase.weekLabel}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1 mt-1" onClick={openDialog}>
          <Pencil size={14} />
          수정
        </Button>
      </div>

      <div className="space-y-5">
      {/* Success banner */}
      {allDone && (
        <Alert className="border-[#EB5E28] bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-[#EB5E28]" />
          <AlertDescription className="text-green-800 font-medium">
            {day === 28 ? (
              <>
                스위치온 28일 달성을 축하해요! 🎉 모든 과정을 완주하셨습니다!<br />
                프로그램 직후 바로 재시작은 권장하지 않아요. 최소 2~4주 일반식 기간을 가진 후 다시 시작해 주세요.
              </>
            ) : (
              `${day}일차 성공! 오늘의 체크리스트를 모두 완료했어요 🎉`
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Fasting timer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#001514]">단식 타이머</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={fasting.progress} className="h-3 [&>div]:bg-[#EB5E28]" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#736F4E]/70">14시간 단식 기준 (20:00~10:00)</span>
            <span className="text-sm font-semibold tabular-nums text-[#EB5E28]">{fasting.remaining}</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's meals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#001514]">
              <SaladIcon />
              오늘의 식단
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(mealLabels) as (keyof MealChecks)[]).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="w-12 justify-center shrink-0 text-xs font-medium rounded-full border-[#EB5E28] text-[#EB5E28]"
              >
                {mealLabels[key]}
              </Badge>
              <span
                className={`flex-1 text-sm ${
                  mealChecks[key].checked ? "line-through text-[#736F4E]/50" : "text-[#001514]"
                }`}
              >
                {phase.meals[key]}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {mealChecks[key].checked && (
                  <span className="text-xs text-[#736F4E]/60 tabular-nums">{mealChecks[key].time}</span>
                )}
                <Checkbox
                  checked={mealChecks[key].checked}
                  onCheckedChange={() => toggleMeal(key)}
                  className="data-[state=checked]:bg-[#EB5E28] data-[state=checked]:border-[#EB5E28]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#001514]">오늘의 체크리스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklistItems.map(({ key, timeKey, label }) => {
            const checked = checklist[key]
            const time = checklist[timeKey]
            return (
              <div key={key} className="flex items-center gap-3">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleCheck(key, timeKey)}
                  className="data-[state=checked]:bg-[#EB5E28] data-[state=checked]:border-[#EB5E28]"
                />
                <span
                  className={`flex-1 text-sm ${checked ? "line-through text-[#736F4E]/50" : "text-[#001514]"}`}
                >
                  {label}
                </span>
                {checked && (
                  <span className="text-xs text-[#736F4E]/60 tabular-nums">{time}</span>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Allowed foods */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#001514]">오늘 허용 식품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {phase.foods.map((food) => (
              <div
                key={food}
                className="rounded-full bg-[#C2D076]/20 border border-[#C2D076] text-[#736F4E] text-xs font-medium px-3 py-1.5 text-center"
              >
                {food}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle>현재 날짜 설정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTempDay((d) => Math.max(1, d - 1))}
                disabled={tempDay <= 1}
              >
                <Minus size={18} />
              </Button>
              <div className="text-center">
                <span className="text-4xl font-bold text-[#001514]">{tempDay}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTempDay((d) => d >= 28 ? 1 : d + 1)}
              >
                <Plus size={18} />
              </Button>
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-medium text-[#EB5E28]">{getPhaseForDay(tempDay).phase}</p>
              <p className="text-xs text-[#736F4E]/70">{getPhaseForDay(tempDay).weekLabel}</p>
            </div>
            <p className="text-xs text-amber-600 text-center bg-amber-50 rounded-lg px-3 py-2">
              날짜를 변경하면 오늘의 체크 상태가 초기화됩니다.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button className="bg-[#EB5E28] hover:bg-[#c94d1d]" onClick={confirmDay}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
