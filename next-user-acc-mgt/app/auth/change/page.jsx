'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import useAuth from '../../utils/useauth'
import Loading from '../../utils/loading'

const PasswordChangePage = () => {

    // TO CHECK AUTHENTICATION
    const { isAuthenticated } = useAuth()

    // STATE VARIABLES
    const [oldPswd, setOldPassword] = useState('')
    const [newPswd, setNewPswd] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingChange, setLoadingChange] = useState(false)

    // HANDLE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault()

        // CURRENT USER ID
        const user = typeof window !== 'undefined' && localStorage.getItem('user')
        const userId = JSON.parse(user).id

        // TOKEN FROM LOCAL STORAGE
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        // CHECK FOR VALIDITY OF password - REGEX
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

        if (!passwordRegex.test(oldPswd)) {
            // RETURN TRUE IF password IS VALID, FALSE OTHERWISE
            passwordRegex.test(oldPswd)
            setError('Please enter a valid password')
            return
        }

        if (!passwordRegex.test(newPswd)) {
            // RETURN TRUE IF password IS VALID, FALSE OTHERWISE
            passwordRegex.test(oldPswd)
            setError('Please enter a valid password')
            return
        }

        // VALIDATE PASSWORDS 
        if (oldPswd === newPswd) {
            setError('New password can not the same as the old password')
            return;
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingChange(true)

            // ATTEMPT TO RESET PASSWORD
            const pswdResponse = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/change-password`, { oldPswd, newPswd, userId },
                {
                    headers: { 'x-auth-token': token }
                })

            // SET SUCCESS MESSAGE AND REDIRECT TO DASHBOARD
            if (pswdResponse && pswdResponse.data.status === 200) {
                setSuccess(true)
                setLoadingChange(false)

                // LOGOUT AND REDIRECT TO LOGIN PAGE
                setTimeout(() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                }, 3000)
            }

            else setError(pswdResponse.data.msg)

            // SET LOADING TO FALSE
            setLoadingChange(false)

            // CLEAR FORM
            setOldPassword('')
            setNewPswd('')

        } catch (error) {
            // SET LOADING TO FALSE
            setLoadingChange(false)

            // SET ERROR MESSAGE
            const err = error.response.data.msg
            setError(err)
        }
    }

    // CHECK FOR AUTHENTICATION
    if (!isAuthenticated) {
        return <p>Please log in to edit profile.</p>
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-4/5 py-4 mt-20 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-8">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-8'>Change your password</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Please provide strong password.</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingChange && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>

                )}
                {!loadingChange && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Password changed successfully!</p>
                    </div>
                )}

                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Enter old password"
                    value={oldPswd}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Enter new password"
                    value={newPswd}
                    onChange={(e) => setNewPswd(e.target.value)}
                />

                <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Change
                </button>
            </form>
        </div>
    )
}

export default PasswordChangePage