'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import Loading from '../../../utils/loading'
import { useParams } from 'next/navigation'

const ResetPage = () => {
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingReset, setLoadingReset] = useState(false)

    // GET RESET TOKEN FROM URL
    const router = useParams()
    const resetToken = router.id

    const handleSubmit = async (e) => {
        e.preventDefault()

        // CHECK FOR VALIDITY OF password - REGEX
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

        if (!passwordRegex.test(password)) {
            // RETURN TRUE IF password IS VALID, FALSE OTHERWISE
            passwordRegex.test(password)
            setError('Please enter a valid password')
            console.error('Please enter a valid password')
            return
        }

        // VALIDATE PASSWORDS 
        if (password !== password2) {
            setError('Passwords do not match')
            console.error('Passwords do not match')
            return;
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingReset(true)

            // ATTEMPT TO RESET PASSWORD
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/reset-password`, { resetToken, password })

            // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
            if (response && response.data) {
                setSuccess(true)
            }

            else setError("Error occured: ", response.data.msg)

            // SET LOADING TO FALSE
            setLoadingReset(false)

            // CLEAR FORM
            setPassword('')
            setPassword2('')

        } catch (error) {
            // SET LOADING TO FALSE
            setLoadingReset(false)

            // SET ERROR MESSAGE
            const err = error.response.data.msg
            setError(err)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-8">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-8'>Reset Password</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingReset && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>

                )}
                {!loadingReset && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success, check your email! <Link href="/login" className='underline underline-offset-4 font-semibold'>Login</Link></p>
                    </div>
                )}

                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Verify"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />

                <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Reset
                </button>

                <p className="my-5 text-center text-white text-sm underline underline-offset-4">
                    <Link href="/auth/forget">Request again</Link>
                </p>
            </form>
        </div>
    )
}

export default ResetPage