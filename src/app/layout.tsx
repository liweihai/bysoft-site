import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "上海丙赟信息科技有限责任公司",
  description: "上海丙赟信息科技有限责任公司承接各种移动应用的软件设计，全栈开发和云部署，包括苹果手机应用、安卓手机应用、H5、微信和支付宝小程序以及对应的高并发服务器软件。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
