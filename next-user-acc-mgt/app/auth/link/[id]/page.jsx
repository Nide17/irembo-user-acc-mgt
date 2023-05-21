'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Loading from '../..//../utils/loading'
import { useParams } from 'next/navigation'

const VerifyLink = () => {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingVerify, setLoadingVerify] = useState(false)
    const router = useParams()

    useEffect(() => {
        const verifyLink = async () => {
            try {
                // CLEAR ERROR MESSAGE
                setError('')

                // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
                setLoadingVerify(true)

                // ATTEMPT TO VERIFY LINK
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/verify-link/${router.id}`, { token: router.id })

                // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
                if (response.status === 200) {

                    // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
                    setSuccess(true)

                    // SET LOADING TO FALSE AFTER SUCCESSFUL REQUEST
                    setLoadingVerify(false)

                    // STORE TOKEN AND USER DATA IN LOCAL STORAGE
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))

                    // REDIRECT TO DASHBOARD
                    window.location.href = '/dashboard'
                }

                else if (response.status === 400 || response.status === 401) {

                    // SET ERROR MESSAGE
                    setError(response.data.msg)
                    setSuccess(false)

                    // REDIRECT TO LOGIN PAGE IF TOKEN IS INVALID
                    if (response.data.msg === 'Invalid token') {
                        router.push('/auth/link')
                    }
                }

                // SET ERROR MESSAGE
                else {
                    setError('Something went wrong. Please try again.')
                }

                // SET LOADING TO FALSE AFTER SUCCESSFUL REQUEST
                setLoadingVerify(false)

            } catch (error) {
                // SET ERROR MESSAGE
                setError('Something went wrong. Please try again.')

                // SET LOADING TO FALSE AFTER FAILED REQUEST
                setLoadingVerify(false)

                // LOG ERROR TO CONSOLE
                console.error(error)
            }
        }

        // CALL VERIFY LINK FUNCTION
        verifyLink()
    }, [])

    return (
        <>
            {
                loadingVerify ?
                    <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
                        <Loading />
                    </div> :

                    error ?

                        // DISPLAY ERROR MESSAGE IF UNSUCCESSFUL
                        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
                            <div className="flex flex-col w-96 p-10 bg-slate-700 rounded-lg shadow-lg">
                                <h1 className="mb-5 text-2xl font-bold text-center text-red-500">Verification failed!</h1>
                                <p className="my-5 text-center text-white text-sm underline underline-offset-4">
                                    <Link href="/auth/link">Try again</Link>
                                </p>
                                <p className="text-center text-white text-sm underline underline-offset-4">
                                    <Link href="/login">Login</Link>
                                </p>
                            </div>
                        </div> :
                        null
            }
        </>
    )
}

export default VerifyLink