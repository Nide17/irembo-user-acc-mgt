'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import Loading from '../utils/loading'

const MfaBox = ({ email, password, userId, jwtToken, setIsAuthenticated }) => {
    const [twoFactorToken, setTwoFactorToken] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingMfa, setLoadingMfa] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // VALIDATE OTP CODE
        if (!twoFactorToken) {
            setError('Please provide OTP code!')
            return
        }

        // CHECK FOR VALID OTP - 6 CHARACTERS (NUMBERS AND TEXT), WITH NO SPACES OR SPECIAL CHARACTERS
        const re = /^[a-zA-Z0-9]{6}$/

        if (!re.test(twoFactorToken)) {
            setError('Please enter a valid OTP code')
            return
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingMfa(true)

            // ATTEMPT TO CHECK OTP CODE
            console.log("Verify 2FA: ", email, password, userId, twoFactorToken, jwtToken)
            const Verify2FAresponse = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/verify-two-fa`, { email, password, userId, twoFactorToken }, { headers: { 'x-auth-token': jwtToken } })

            console.log("\nResponse:\n", Verify2FAresponse)

            // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
            if (Verify2FAresponse && Verify2FAresponse.data) {
                console.log(Verify2FAresponse.data)

                // SAVE TOKEN AND USER DATA TO LOCAL STORAGE
                localStorage.setItem('token', Verify2FAresponse.data.token)
                localStorage.setItem('user', JSON.stringify(Verify2FAresponse.data.user))

                // SET AUTHENTICATED TO TRUE
                setIsAuthenticated(true)

                setSuccess(true)

                // REDIRECT TO DASHBOARD AFTER 2 SECONDS
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 2000)
            }

            else {
                console.log(Verify2FAresponse)
                setError('An error occurred. Please try again.')
            }

            console.log("Done!")

            // SET LOADING TO FALSE
            setLoadingMfa(false)

            // CLEAR FORM
            setTwoFactorToken('')

        } catch (error) {
            console.log(error)
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-full h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center p-4 my-4">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-6 my-2'>Provide OTP code</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingMfa && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {!loadingMfa && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Logged in!</p>
                    </div>
                )}

                <input
                    className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 px-2 rounded-lg"
                    type="twoFactorToken"
                    placeholder="OTP code"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                />
                <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Login
                </button>
            </form>
        </div>
    )
}

export default MfaBox