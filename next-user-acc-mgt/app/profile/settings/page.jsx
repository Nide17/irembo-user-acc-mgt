'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Loading from '../../utils/loading'
import useAuth from '../../utils/useauth'

const SettingsPage = () => {

    // TO CHECK AUTHENTICATION
    const { isAuthenticated } = useAuth()

    // STATE VARIABLES
    const [notifications, setNotifications] = useState(true)
    const [mfa, setMfa] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingSettings, setLoadingSettings] = useState(false)


    // FETCH USER ID AND TOKEN FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // FETCH USER SETTINGS
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // CLEAR ERROR MESSAGE
                setError('')
                setLoadingSettings(true)

                // ATTEMPT TO FETCH USER SETTINGS
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${JSON.parse(user).id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-auth-token': token
                    }
                })

                // SET USER SETTINGS
                console.log(response)
                if (response) {
                    setNotifications(response.data.notifications)
                    setMfa(response.data.mfa)
                }

                // SET ERROR MESSAGE
                else {
                    setError('An error occurred! Please try again.')
                    // CLEAR MESSAGE AFTER 3 SECONDS
                    setTimeout(() => {
                        setError('')
                    }, 3000)
                }

                // SET LOADING TO FALSE
                setLoadingSettings(false)

            } catch (error) {
                setError('Something went wrong! Please try again.')

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)
            }
        }

        fetchSettings()
    }, [])
    console.log(notifications, mfa)

    // NOTIFICATIONS TOGGLE
    const handleNotifications = async (e) => {
        e.preventDefault()

        // SET NOTIFICATIONS TO TRUE OR FALSE
        setNotifications(!notifications)

        // SEND NOTIFICATIONS TO SERVER
        try {
            // CLEAR ERROR MESSAGE
            setError('')
            setSuccess(false)

            // ATTEMPT TO UPDATE USER SETTINGS
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${JSON.parse(user).id}`, { notifications: !notifications }, {
                headers: {
                    'x-auth-token': token,
                }
            })

            // SET SUCCESS MESSAGE
            console.log(response)
            if (response) {
                setSuccess(true)

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setSuccess(false)
                }, 3000)
            }

            // SET ERROR MESSAGE
            else {
                setError('An error occurred! Please try again.')

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)
            }

        } catch (error) {
            setError('Something went wrong! Please try again.')

            // CLEAR MESSAGE AFTER 3 SECONDS
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    // MFA TOGGLE
    const handleMfa = async (e) => {
        e.preventDefault()

        // SET MFA TO TRUE OR FALSE
        setMfa(!mfa)

        // SEND MFA TO SERVER
        try {
            // CLEAR ERROR MESSAGE
            setError('')
            setSuccess(false)

            // ATTEMPT TO UPDATE USER SETTINGS
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${JSON.parse(user).id}`, { mfa: !mfa }, {
                headers: { 'x-auth-token': token }
            })

            // SET SUCCESS MESSAGE
            console.log(response)
            if (response && response.data) {
                setSuccess(true)

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setSuccess(false)
                }, 3000)
            }

            // SET ERROR MESSAGE
            else {
                setError("Error occured: ", response.data.msg)

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)
            }

        } catch (error) {
            setError('Something went wrong! Please try again.')

            // CLEAR MESSAGE AFTER 3 SECONDS
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    // IF NOT AUTHENTICATED, DISPLAY MESSAGE
    if (!isAuthenticated) {
        return <p>Please log in to access the dashboard.</p>
    }

    // IF LOADING, DISPLAY LOADING COMPONENT
    if (loadingSettings) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-8">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-2xl text-blue-100 leading-8 my-4'>UPDATE YOUR SETTINGS</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingSettings && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>

                )}
                {!loadingSettings && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success! Settings updated.</p>
                    </div>
                )}

                {/* NOTIFICATIONS TOGGLE */}
                <label className="relative inline-flex items-left cursor-pointer w-5/6 sm:w-2/3 h-10 my-2">
                    <input type="checkbox"
                        value={notifications}
                        className="sr-only peer"
                        onChange={handleNotifications}
                        checked={notifications}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-100 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-100 peer-checked:bg-green-400"></div>
                    <span className="ml-3 text-sm font-medium text-gray-100 dark:text-gray-300">Notifications</span>
                </label>

                {/* MFA TOGGLE */}
                <label className="relative inline-flex items-left cursor-pointer w-5/6 sm:w-2/3 h-10 my-2">
                    <input type="checkbox"
                        value={mfa}
                        className="sr-only peer"
                        onChange={handleMfa}
                        checked={mfa}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-100 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-100 peer-checked:bg-green-400"></div>
                    <span className="ml-3 text-sm font-medium text-gray-100 dark:text-gray-300">Multi-factor Authentication</span>
                </label>
            </form>
        </div>
    )
}

export default SettingsPage