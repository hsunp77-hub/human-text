import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";
import "./profile.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "900"],
});

const nanumPenScript = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Human Text",
  description: "A daily writing habit for the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} ${nanumPenScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
