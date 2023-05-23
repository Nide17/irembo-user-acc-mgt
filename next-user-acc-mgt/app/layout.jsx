import './globals.css'

// TAILWIND CSS
import 'tailwindcss/tailwind.css'

// THE HEADER NAVIGATION
import Header from './Header'

export const metadata = {
  title: 'User Account Management App',
  description: 'Managing user accounts',
}

// PROVIDER COMPONENT
export default function RootLayout({ children }) {

  // DISABLE NEXT JS 13 ERROR OVERLAY
  const noOverlayWorkaroundScript = `
  window.addEventListener('error', event => {
    event.stopImmediatePropagation()
  })

  window.addEventListener('unhandledrejection', event => {
    event.stopImmediatePropagation()
  })
`

  // RETURN THE LAYOUT
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>User Account Management App</title>

        {/* DISABLE NEXT JS 13 ERROR OVERLAY */}
        {process.env.NODE_ENV !== 'production' && <script dangerouslySetInnerHTML={{ __html: noOverlayWorkaroundScript }} />}
      </head>
      <body >
        <Header />
        {children}
      </body>
    </html>
  )
}
