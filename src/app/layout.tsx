import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Tapas - Workout & Habit Tracker',
  description: 'A straightforward system to log workouts and track daily habits. Build discipline through consistent effort.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}