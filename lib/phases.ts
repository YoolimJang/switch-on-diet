export type Phase = {
  days: [number, number]
  phase: string
  weekLabel: string
  meals: { b: string; l: string; s: string; d: string }
  foods: string[]
}

export const phases: Phase[] = [
  {
    days: [1, 3],
    phase: "지방 대사 켜기",
    weekLabel: "1주차 · 1~3일차 단계",
    meals: { b: "단백질 쉐이크", l: "단백질 쉐이크", s: "단백질 쉐이크", d: "단백질 쉐이크" },
    foods: ["녹황색 채소", "두부", "무가당 요거트", "오이", "코코넛오일", "허브티"],
  },
  {
    days: [4, 7],
    phase: "렙틴 저항성 개선",
    weekLabel: "1주차 · 4~7일차 단계",
    meals: { b: "단백질 쉐이크", l: "잡곡밥½ + 닭가슴살 + 해조류", s: "단백질 쉐이크", d: "단백질 쉐이크" },
    foods: ["잡곡밥 반공기", "닭가슴살", "생선·해산물", "달걀", "버섯", "해조류"],
  },
  {
    days: [8, 14],
    phase: "인슐린 저항성 개선",
    weekLabel: "2주차",
    meals: { b: "단백질 쉐이크", l: "잡곡밥½ + 두부 + 채소", s: "단백질 쉐이크", d: "등푸른 생선 or 수육" },
    foods: ["잡곡밥 반공기", "두부", "콩류", "견과류", "블랙커피", "우유 2잔", "천연 치즈", "김치(소량)"],
  },
  {
    days: [15, 21],
    phase: "단식 주 2회",
    weekLabel: "3주차",
    meals: { b: "단백질 쉐이크", l: "잡곡밥½ + 고단백 반찬", s: "단백질 쉐이크", d: "수육 or 샤브샤브" },
    foods: ["잡곡밥 반공기", "닭가슴살", "등푸른 생선", "수육·샤브샤브", "두부", "견과류"],
  },
  {
    days: [22, 28],
    phase: "허용 확대 · 유지기",
    weekLabel: "4주차",
    meals: { b: "쉐이크 + 과일 1개", l: "잡곡밥½ + 저탄수 반찬", s: "견과류 한 줌", d: "무탄수 고단백 식사" },
    foods: ["과일 1개(아침)", "단호박", "토마토", "바나나", "베리류", "견과류", "잡곡밥 반공기"],
  },
]

export function getPhaseForDay(day: number): Phase {
  return phases.find((p) => day >= p.days[0] && day <= p.days[1]) ?? phases[0]
}

export type WeekPlanRow = {
  d: string
  b: string
  l: string
  s: string
  dn: string
  note: string
}

export const weekPlans: Record<number, WeekPlanRow[]> = {
  1: [
    { d: "1~3일", b: "단백질 쉐이크", l: "단백질 쉐이크", s: "단백질 쉐이크", dn: "단백질 쉐이크", note: "" },
    { d: "4~7일", b: "단백질 쉐이크", l: "잡곡밥½ + 닭가슴살", s: "단백질 쉐이크", dn: "단백질 쉐이크", note: "" },
  ],
  2: [{ d: "8~14일", b: "단백질 쉐이크", l: "잡곡밥½ + 두부 + 채소", s: "단백질 쉐이크", dn: "등푸른생선 or 수육", note: "단식 1회" }],
  3: [{ d: "15~21일", b: "단백질 쉐이크", l: "잡곡밥½ + 고단백", s: "단백질 쉐이크", dn: "수육·샤브샤브", note: "단식 2회" }],
  4: [{ d: "22~28일", b: "쉐이크+과일 1개", l: "잡곡밥½ + 저탄수", s: "견과류 한 줌", dn: "무탄수 고단백", note: "" }],
}

export const weekFoods: Record<number, string[]> = {
  1: ["녹황색 채소", "두부", "무가당 요거트", "오이", "코코넛오일", "허브티", "잡곡밥 반공기", "닭가슴살", "생선·해산물", "달걀", "버섯", "해조류"],
  2: ["잡곡밥 반공기", "두부", "콩류", "견과류", "블랙커피", "우유 2잔", "천연 치즈", "김치(소량)"],
  3: ["잡곡밥 반공기", "닭가슴살", "등푸른 생선", "수육·샤브샤브", "두부", "견과류"],
  4: ["과일 1개(아침)", "단호박", "토마토", "바나나", "베리류", "견과류", "잡곡밥 반공기"],
}
