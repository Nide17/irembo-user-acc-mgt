"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'
import MfaBox from './mfabox'

const LoginPage = () => {

    // STATE VARIABLES
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')
    const [jwtToken, setJwtToken] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [showMfaBox, setShowMfaBox] = useState(false)

    // ROUTER INSTANCE AND CUSTOM HOOK TO CHECK AUTHENTICATION STATUS
    const router = useRouter()
    const { isAuthenticated, setIsAuthenticated } = useAuth()

    // CHECK IF USER IS AUTHENTICATED AND REDIRECT TO DASHBOARD
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault()

        // CHECK FOR EMPTY FIELDS
        if (!email || !password) {
            setError('Please provide both email and password.')
            return
        }

        // CHECK FOR VALID EMAIL ADDRESS 
        const re = /\S+@\S+\.\S+/
        if (!re.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingLogin(true)

            // ATTEMPT TO LOGIN
            const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/login`, { email, password })

            // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD AFTER 2 SECONDS IF LOGIN IS SUCCESSFUL
            if (loginResponse && loginResponse.data && loginResponse.data.token && loginResponse.data.user) {
                setSuccess(true)

                console.log(loginResponse.data)

                // CHECK IF USER HAS MFA ENABLED
                const mfa = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${loginResponse.data.user.id}`, { headers: { 'x-auth-token': loginResponse.data.token } })

                // IF MFA IS ENABLED, SHOW MFA BOX
                if (mfa && mfa.data && mfa.data.mfa) {

                    // SEND EMAIL TO USER WITH OTP CODE FOR MFA VERIFICATION
                    const sendOtp = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/two-fa`, { email, password }, { headers: { 'x-auth-token': loginResponse.data.token } })

                    console.log(sendOtp.data)

                    // SET USER ID
                    setUserId(loginResponse.data.user.id)

                    // SET JWT TOKEN
                    setJwtToken(loginResponse.data.token)

                    // SHOW MFA BOX IF OTP TO CONTINUE
                    if (sendOtp && sendOtp.data) {
                        setShowMfaBox(true)
                    }
                }

                // IF MFA IS NOT ENABLED, REDIRECT TO DASHBOARD
                else {
                    console.log('MFA is not enabled. Redirecting to dashboard.')

                    // STORE TOKEN AND USER DATA IN LOCAL STORAGE FOR USE IN OTHER PAGES
                    localStorage.setItem('token', loginResponse.data.token)
                    localStorage.setItem('user', JSON.stringify(loginResponse.data.user))

                    // SET AUTHENTICATED TO TRUE
                    setIsAuthenticated(true)

                    // REDIRECT TO DASHBOARD
                    setTimeout(() => {
                        window.location.href = '/dashboard'
                    }, 2000)

                }
            }

            else setError("Error occured: ", loginResponse.data.msg)

            // SET LOADING TO FALSE
            setLoadingLogin(false)

        } catch (error) {
            setError(error.loginResponse.data.msg)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">

            {/* LOGIN FORM */}
            {
                !showMfaBox && (
                    <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                        <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-4">
                            <Link href="/" className='p-1 font-bold'>
                                <span className='block text-4xl text-blue-100 leading-8'>Login</span>
                                <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                            </Link>
                        </div>

                        {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                        {loadingLogin && !error && !success && (
                            <div className="flex items-center justify-center">
                                <Loading />
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                                <p className="text-center text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {!loadingLogin && !error && success && (
                            <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                                <p className="text-center text-green-900 text-lg">Login successful</p>
                            </div>
                        )}


                        <input
                            className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 px-2 rounded-lg"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 px-2 rounded-lg"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                            Login
                        </button>

                        <p className="my-5 text-center text-white text-sm underline underline-offset-4">
                            <Link href="/auth/link">Use a link</Link>
                        </p>

                        <p className="my-5 text-center text-white text-sm underline underline-offset-4">
                            <Link href="/auth/forget">Forgot password?</Link>
                        </p>

                        <p className="text-center text-slate-300 text-sm underline underline-offset-4 font-bold">
                            <Link href="/register">Don't have an account? Sign up</Link>
                        </p>
                    </form>
                )}

            {/* MFA BOX */}
            {showMfaBox && (
                <MfaBox email={email} password={password} userId={userId} jwtToken={jwtToken} setIsAuthenticated={setIsAuthenticated} />
            )}
        </div>
    )
}

export default LoginPage