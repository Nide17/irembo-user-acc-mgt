// CUSTOM HOOK FOR PROTECTING ROUTES FROM UNAUTHORIZED USERS
"use client"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const useAuth = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')

        // IF TOKEN IS NOT PRESENT REDIRECT TO LOGIN PAGE
        if (!token || token === 'undefined') {
            router.push('/login')
        }

        else {
            // IF TOKEN IS PRESENT, CHECK IF IT IS VALID
            const checkToken = async () => {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/verify-token`, { token }, {
                        headers: {
                            'x-auth-token': token,
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    })

                    console.log('response for auth:\n\n', response)

                    // IF TOKEN IS VALID, USER IS AUTHORIZED
                    if (response && response.data) {
                        setIsAuthenticated(true)
                    }

                    else {
                        // REMOVE TOKEN AND USER DATA FROM LOCAL STORAGE
                        setIsAuthenticated(false)
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                    }
                }
                catch (error) {
                    // IF TOKEN IS INVALID, REDIRECT TO LOGIN PAGE
                    setIsAuthenticated(false)
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    router.push('/login')
                    return
                }
            }
            // CALL THE FUNCTION TO CHECK IF TOKEN IS VALID
            checkToken()
        }
    }, [])

    return { isAuthenticated, setIsAuthenticated }
}

export default useAuth