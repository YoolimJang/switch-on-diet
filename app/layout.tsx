import type { Metadata } from "next"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import ThemeProvider from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: "스위치온 다이어트",
  description: "Dr. 박용우의 28일 스위치온 다이어트 트래커",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background min-h-screen">
        <ThemeProvider />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
