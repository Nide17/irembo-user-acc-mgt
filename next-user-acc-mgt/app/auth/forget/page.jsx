'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import Loading from '../../utils/loading'

const ForgetPage = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingForget, setLoadingForget] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // VALIDATE EMAIL
        const re = /\S+@\S+\.\S+/
        if (!re.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingForget(true)

            // ATTEMPT TO LOGIN
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/forgot-password`, { email })

            // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
            if (response && response.data) {
                setSuccess(true)
            }

            else {
                setError('An error occurred during reset. Please try again.')
            }

            // SET LOADING TO FALSE
            setLoadingForget(false)

            // CLEAR FORM
            setEmail('')

        } catch (error) {
            setError('An error occurred during reset. Please try again.')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-8">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-8'>Forgot Password</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingForget && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>

                )}
                {!loadingForget && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success, check your email!</p>
                    </div>
                )}

                <input
                    className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 px-2 rounded-lg"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Request
                </button>
            </form>
        </div>
    )
}

export default ForgetPage