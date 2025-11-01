import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JStack App",
  description: "Created using JStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Seline analytics */}
        <script
          async
          src="https://cdn.seline.com/seline.js"
          data-token="1eadc8582cdf3ff"
        ></script>
      </head>
      <body className="">
        {children}
      </body>
    </html>
  )
}
