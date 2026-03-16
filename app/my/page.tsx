"use client"

import { useState, useEffect, useCallback } from "react"
import { X, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getMetrics, saveMetrics, type MetricEntry } from "@/lib/storage"

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function DiffBadge({ diff }: { diff: number | null }) {
  if (diff === null) return null
  if (diff === 0) return (
    <span className="flex items-center gap-0.5 text-xs text-[#736F4E]/70">
      <Minus size={12} /> 0
    </span>
  )
  const isDown = diff < 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${isDown ? "text-[#EB5E28]" : "text-red-500"}`}>
      {isDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
      {isDown ? diff.toFixed(1) : `+${diff.toFixed(1)}`}
    </span>
  )
}

export default function MyPage() {
  const [entries, setEntries] = useState<MetricEntry[]>([])
  const [weightInput, setWeightInput] = useState("")
  const [fatInput, setFatInput] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteAll, setDeleteAll] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEntries(getMetrics())
    const dark = localStorage.getItem("theme") === "dark"
    setIsDark(dark)
  }, [])

  const toggleDark = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }, [isDark])

  const latest = entries[entries.length - 1] ?? null
  const prev = entries.length >= 2 ? entries[entries.length - 2] : null
  const weightDiff =
    latest?.weight != null && prev?.weight != null
      ? +(latest.weight - prev.weight).toFixed(1)
      : null
  const fatDiff =
    latest?.fat != null && prev?.fat != null
      ? +(latest.fat - prev.fat).toFixed(1)
      : null

  const today = new Date().toISOString().slice(0, 10)

  const upsertField = useCallback(
    (field: "weight" | "fat", value: number) => {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.date === today)
        let updated: MetricEntry[]
        if (idx >= 0) {
          updated = prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
        } else {
          updated = [
            ...prev,
            { id: genId(), date: today, weight: null, fat: null, [field]: value },
          ]
        }
        saveMetrics(updated)
        return updated
      })
    },
    [today]
  )

  const handleSaveWeight = useCallback(() => {
    const w = parseFloat(weightInput)
    if (isNaN(w)) return
    upsertField("weight", w)
    setWeightInput("")
  }, [weightInput, upsertField])

  const handleSaveFat = useCallback(() => {
    const f = parseFloat(fatInput)
    if (isNaN(f)) return
    upsertField("fat", f)
    setFatInput("")
  }, [fatInput, upsertField])

  const handleDeleteOne = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      saveMetrics(updated)
      return updated
    })
    setDeleteId(null)
  }, [])

  const handleDeleteAll = useCallback(() => {
    setEntries([])
    saveMetrics([])
    setDeleteAll(false)
  }, [])

  if (!mounted) return null

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-6 pb-24 space-y-5">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-[#001514] dark:text-foreground">마이페이지</h1>
        <button
          onClick={toggleDark}
          role="switch"
          aria-checked={isDark}
          aria-label="다크모드 토글"
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            isDark ? "bg-[#EB5E28]" : "bg-[#D8D3C4]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              isDark ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Metric cards with inline input */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#001514] dark:text-foreground mb-1">체중</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-[#001514]">
                  {latest?.weight != null ? latest.weight : "--"}
                </span>
                <span className="text-sm text-[#736F4E]/70 mb-0.5">kg</span>
              </div>
              <DiffBadge diff={weightDiff} />
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveWeight()}
                className="w-full rounded-md border border-[#D8D3C4] px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5E28]"
              />
              <Button
                size="sm"
                className="bg-[#EB5E28] hover:bg-[#c94d1d] px-2.5 shrink-0"
                onClick={handleSaveWeight}
                disabled={!weightInput}
              >
                저장
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#001514] dark:text-foreground mb-1">체지방률</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-[#001514]">
                  {latest?.fat != null ? latest.fat : "--"}
                </span>
                <span className="text-sm text-[#736F4E]/70 mb-0.5">%</span>
              </div>
              <DiffBadge diff={fatDiff} />
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="%"
                value={fatInput}
                onChange={(e) => setFatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveFat()}
                className="w-full rounded-md border border-[#D8D3C4] px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5E28]"
              />
              <Button
                size="sm"
                className="bg-[#EB5E28] hover:bg-[#c94d1d] px-2.5 shrink-0"
                onClick={handleSaveFat}
                disabled={!fatInput}
              >
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log history */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#001514]">기록 내역</CardTitle>
            {entries.length > 0 && (
              <button
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
                onClick={() => setDeleteAll(true)}
              >
                전체 삭제
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-[#736F4E]/50 text-center py-6">아직 기록이 없어요</p>
          ) : (
            <div className="space-y-2">
              {[...entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-[#D8D3C4] last:border-0"
                >
                  <span className="text-sm text-[#736F4E]/70 w-12 shrink-0">{formatDate(entry.date)}</span>
                  <div className="flex-1 flex items-center gap-4 px-2">
                    <span className="text-[16px] text-[#001514] dark:text-foreground">
                      <span className="font-semibold">{entry.weight != null ? entry.weight : "--"}</span>
                      <span className="text-sm text-[#736F4E]/50 dark:text-muted-foreground"> kg</span>
                    </span>
                    <span className="text-[16px] text-[#001514] dark:text-foreground">
                      <span className="font-semibold">{entry.fat != null ? entry.fat : "--"}</span>
                      <span className="text-sm text-[#736F4E]/50 dark:text-muted-foreground"> %</span>
                    </span>
                  </div>
                  <button
                    className="text-[#736F4E]/30 hover:text-red-400 transition-colors p-1"
                    onClick={() => setDeleteId(entry.id)}
                    aria-label="삭제"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete one confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="max-w-xs mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>기록 삭제</AlertDialogTitle>
            <AlertDialogDescription>이 기록을 삭제할까요? 되돌릴 수 없어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDeleteOne(deleteId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete all confirmation */}
      <AlertDialog open={deleteAll} onOpenChange={setDeleteAll}>
        <AlertDialogContent className="max-w-xs mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>전체 삭제</AlertDialogTitle>
            <AlertDialogDescription>모든 기록을 삭제할까요? 되돌릴 수 없어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteAll}>
              전체 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
