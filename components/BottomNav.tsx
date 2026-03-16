"use client"

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Salad, User } from "lucide-react"

const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/diet", label: "식단표", icon: Salad },
  { href: "/my", label: "마이", icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background dark:bg-[#121212] border-t border-border dark:border-white/[0.08] transition-colors">
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            >
              <Icon
                size={22}
                className={active ? "text-[#EB5E28]" : "text-[#736F4E]/50 dark:text-white/30"}
              />
              <span
                className={`text-xs font-medium ${active ? "text-[#EB5E28]" : "text-[#736F4E]/50 dark:text-white/30"}`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
