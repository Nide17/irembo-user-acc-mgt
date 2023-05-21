"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'

const DashboardPage = () => {

    const { isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({})
    const [isMfa, setMfa] = useState({})

    // USER ID FROM LOCAL STORAGE
    const userLocal = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const userId = userLocal && userLocal.id

    useEffect(() => {
        setLoading(false)

        // TOKEN FROM LOCAL STORAGE
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        // GET USER PROFILE
        const getUserProfile = async () => {
            // REQUEST USING ID 
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/users/${userId}/profile`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                },
            })

            // SET USER PROFILE
            if (response.status === 200) {
                // SET USER SETTINGS
                setMfa(response.data.mfa)
            }
        }
        // GET USER SETTINGS
        const getUserSettings = async () => {
            // REQUEST USING ID
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${userId}`, {
                headers: {  // HEADERS
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                },
            })

            // SET USER SETTINGS
            if (response.status === 200) {
                setMfa(response.data.settings)
            }
        }
        getUserProfile()
        getUserSettings()
    }, [])


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <p>Please log in to access the dashboard.</p>
    }

    return (
        <div className='flex flex-col items-center justify-center my-32'>
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-5/6 sm:w-9/10 h-min p-3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">
                    <h1 className="text-3xl text-white font-bold mb-8">Dashboard</h1>

                    {!isMfa &&
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
                    Object.keys(user).length > 0 && Object.keys(user).map((key, index) => {
                        return (
                            <div className="flex flex-row items-center w-full h-1/3 text-left text-sm sm:text-3xl" key={index}>
                                <span className="text-xl text-white font-bold mr-2 overflow-ellipsis">{key}:</span>
                                <span className="text-xl text-white font-bold overflow-ellipsis">{user[key]}</span>
                            </div>
                        )
                    }
                    )
                }
            </div>

        </div>)
}

export default DashboardPage
