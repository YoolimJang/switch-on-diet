"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { weekPlans, weekFoods } from "@/lib/phases"

const mealColLabels = ["아침", "점심", "간식", "저녁"]

export default function DietPage() {
  return (
    <div className="max-w-[430px] mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-[#001514] mb-6">식단표</h1>

      <Tabs defaultValue="1">
        <TabsList className="grid grid-cols-4 w-full mb-5">
          {[1, 2, 3, 4].map((w) => (
            <TabsTrigger
              key={w}
              value={String(w)}
              className="data-[state=active]:bg-[#EB5E28] data-[state=active]:text-white"
            >
              {w}주차
            </TabsTrigger>
          ))}
        </TabsList>

        {([1, 2, 3, 4] as const).map((week) => {
          const plans = weekPlans[week]
          const foods = weekFoods[week]
          return (
            <TabsContent key={week} value={String(week)} className="space-y-5">
              {plans.map((plan) => (
                <Card key={plan.d}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-[#001514]">
                        {plan.d}
                      </CardTitle>
                      {plan.note && (
                        <span className="text-xs bg-[#001514] text-white rounded-full px-2.5 py-1.5 font-medium">
                          {plan.note}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { label: "아침", value: plan.b },
                        { label: "점심", value: plan.l },
                        { label: "간식", value: plan.s },
                        { label: "저녁", value: plan.dn },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <span className="text-xs font-medium text-[#EB5E28] bg-[#EB5E28]/10 border border-[#EB5E28]/30 rounded-full px-2.5 py-0.5 shrink-0 whitespace-nowrap text-center">
                            {label}
                          </span>
                          <span className="text-sm text-[#001514] leading-relaxed">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-[#001514]">이번 주 허용 식품</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {foods.map((food) => (
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
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
