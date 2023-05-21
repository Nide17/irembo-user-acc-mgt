"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'

const DashboardPage = () => {

    const { isAuthenticated } = useAuth() // CUSTOM HOOK TO CHECK AUTHENTICATION STATUS
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null) // TOKEN FROM LOCAL STORAGE
    const [user, setUser] = useState(typeof window !== 'undefined' ? localStorage.getItem('user') : null) // USER FROM LOCAL STORAGE
    const [loading, setLoading] = useState(true)
    const [isMfa, setMfa] = useState({})
    const [profile, setProfile] = useState({})
    const [error, setError] = useState('')

    // FETCH USER PROFILE AND SETTINGS ON PAGE LOAD
    useEffect(() => {

        // SET LOADING TO TRUE
        setLoading(false)
        console.log("USER:", user)

        // GET USER PROFILE
        const getUserProfile = async () => {

            // ATTEMPT TO GET USER PROFILE
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                if (response && response.data) {
                    setProfile(response.data)
                }
                else setProfile({})
            } catch (error) {

                console.log("ERROR:", error.response.data.msg)

                // IF ERROR, SET THE PROFILE STATE TO NULL
                setProfile({})
                setError(error.response.data.msg)
            }
        }

        // GET USER SETTINGS
        const getUserSettings = async () => {

            // REQUEST USING ID
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: {  'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                // IF SUCCESSFUL, SET THE SETTINGS STATE, ELSE SET THE SETTINGS STATE TO NULL
                if (response && response.data) {
                    setMfa(response.data.mfa)
                }
                else setMfa({})
            } catch (error) {

                console.log("ERROR:", error.response.data.msg)

                // IF ERROR, SET THE SETTINGS STATE TO NULL
                setMfa({})
                setError(error.response.data.msg)
            }
        }
        getUserProfile()
        getUserSettings()
    }, [token, user])

    // IF LOADING, DISPLAY LOADING COMPONENT
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    // IF NOT AUTHENTICATED, DISPLAY MESSAGE
    if (!isAuthenticated) {
        return <p>Please log in to access the dashboard.</p>
    }

    // IF AUTHENTICATED, DISPLAY DASHBOARD
    return (
        <div className='flex flex-col items-center justify-center my-32'>
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-5/6 sm:w-9/10 h-min p-3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">
                    <h1 className="text-3xl text-white font-bold mb-8">Dashboard</h1>

                    {!isMfa && // IF MFA IS NOT ENABLED, DISPLAY TOAST
                        <div id="toast-danger" className="flex items-center text-center w-full max-w-xs py-2 mb-4 text-gray-200 bg-white rounded-lg shadow dark:text-gray-200 dark:bg-red-700" role="alert">
                            <div className="w-full ml-3 text-sm font-normal text-center">Please edit settings to allow MFA to secure your account!</div>
                        </div>
                    }

                    <div className="flex flex-wrap items-center justify-center w-5/6 sm:w-4/5 h-2/3">
                        <Link href="/profile/edit" className="w-1/2 flex items-center justify-center p-2">
                            <span className='flex flex-wrap items-center justify-center text-xl text-white font-bold bg-amber-600 h-32 w-40 p-4 rounded-lg'>Edit Profile</span>
                        </Link>
                        <Link href="/verification" className="w-1/2 flex items-center justify-center p-2">
                            <span className='flex flex-wrap items-center justify-center text-xl text-white font-bold bg-amber-600 h-32 w-40 p-4 rounded-lg'>Verify Account</span>
                        </Link>
                        <Link href="/auth/change" className="w-1/2 flex items-center justify-center p-2">
                            <span className='flex flex-wrap items-center justify-center text-xl text-white font-bold bg-amber-600 h-32 w-40 p-4 rounded-lg'>Change Password</span>
                        </Link>
                        <Link href="/profile/settings" className="w-1/2 flex items-center justify-center p-2">
                            <span className='flex flex-wrap items-center justify-center text-xl text-white font-bold bg-amber-600 h-32 w-40 p-4 rounded-lg'>Edit Settings
                            </span>
                        </Link>
                        <Link href="profile/profilePhoto" className="w-1/2 flex items-center justify-center p-2">
                            <span className='flex flex-wrap items-center justify-center text-xl text-white font-bold bg-amber-600 h-32 w-40 p-4 rounded-lg'>Change Profile Photo</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* USER DETAILS */}
            <div className="flex flex-col items-center justify-center w-5/6 sm:w-4/5 h-min p-4 sm:p-24 bg-blue-400 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white text-left mt-16">
                <h1 className="text-3xl text-white font-bold mb-8">User Details</h1>
                {
                    Object.keys(profile).length > 0 && Object.keys(profile).map((key, index) => {
                        return (
                            <div className="flex flex-row items-center w-full h-1/3 text-left text-sm sm:text-3xl" key={index}>
                                <span className="text-xl text-white font-bold mr-2 overflow-ellipsis">{key}:</span>
                                <span className="text-xl text-white font-bold overflow-ellipsis">{profile[key]}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>)
}

export default DashboardPage
