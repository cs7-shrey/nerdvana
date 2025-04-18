import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "@/components/ui/sonner"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased dark">
        <Main />
        <NextScript />
        <Toaster richColors />
      </body>
    </Html>
  );
}
