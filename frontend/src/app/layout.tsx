import { Metadata } from "next";

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

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}