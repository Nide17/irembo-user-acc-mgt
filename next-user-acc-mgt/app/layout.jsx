"use client"
import './globals.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

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

  // STATE VARIABLES
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState('')

  // SET TOKEN ON CLIENT SIDE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // GET TOKEN
      const storedToken = localStorage.getItem('token')

      // GET USER
      const storedUser = localStorage.getItem('user')

      // VERIFY IF TOKEN IS VALID. IF TOKEN IS PRESENT, CHECK IF IT IS VALID
      const checkToken = async () => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/verify-token`, { storedToken }, {
            headers: {
              'x-auth-token': storedToken,
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
          })

          // IF TOKEN IS VALID, REDIRECT TO DASHBOARD
          if (response.status === 200) {
            setIsLoggedIn(true)
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
            console.log('token200', response)
          }

          else {
            console.log('token else',response)
            // REMOVE TOKEN AND USER DATA FROM LOCAL STORAGE
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            // SET isLoggedIn TO FALSE
            setIsLoggedIn(false)

            // SET TOKEN TO EMPTY STRING
            setToken('')

            // SET USER TO EMPTY OBJECT
            setUser({})
            setIsAuthenticated(false)
            return response.data.code
          }
        }
        catch (error) {
          // IF TOKEN IS INVALID, REDIRECT TO LOGIN PAGE
          setIsLoggedIn(false)
          setToken('')
          localStorage.removeItem('token')
          router.push('/')
          return
        }
      }
      // CALL THE FUNCTION TO CHECK IF TOKEN IS VALID
      checkToken()
    }
  }, [])

  useEffect(() => {
    // GET THE TOKEN AND UPDATE THE TOKEN STATE VARIABLE
    const token1 = localStorage.getItem('token')

    // GET THE USER AND UPDATE THE USER STATE VARIABLE
    const user1 = localStorage.getItem('user')

    // If token is present, set the state variables
    if (token1) {
      setIsLoggedIn(true)
      setToken(token1)
      setUser(JSON.parse(user1))
    }
    else {
      setIsLoggedIn(false)
      setToken('')
      setUser({})
      localStorage.removeItem('token')
    }
  }, [token])

  // TOGGLE MENU
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // LOGOUT FUNCTION
  const logout = () => {
    // REMOVE TOKEN AND USER DATA FROM LOCAL STORAGE
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // SET isLoggedIn TO FALSE
    setIsLoggedIn(false)

    // SET TOKEN TO EMPTY STRING
    setToken('')

    // SET USER TO EMPTY OBJECT
    setUser({})

    // REDIRECT TO HOME PAGE
    router.push('/')
  }

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
        <Header logout={logout} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} isLoggedIn={isLoggedIn} user={user} token={token} />
        {children}
      </body>
    </html>
  )
}
