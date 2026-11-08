import { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ToastifyContainer } from "@/components/ToastifyContainer";
import { ToggleThemeProvider } from "@/components/ToggleTheme";
import localFont from "next/font/local";
import { getCurrentUser } from "@/lib/login/manage-login";
import "katex/dist/katex.min.css";
import "react-toastify/dist/ReactToastify.css";

const oldeEnglishFont = localFont({
  src: "./fonts/OldeEnglish-Regular.ttf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-olde-english",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Temple of no Importance - A philosophy blog and related subjects',
    template: '%s | Temple of no Importance',
  },
  description: 'A philosophy blog and related subjects',
}

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={oldeEnglishFont.variable}>
        <ToggleThemeProvider>
          <Container>
            <Header isAuthenticated={Boolean(user)} isAdmin={user?.isAdmin ?? false} />

            {children}

            <Footer />

          </Container>
          <ToastifyContainer />
        </ToggleThemeProvider>
      </body>
    </html>
  )
}
