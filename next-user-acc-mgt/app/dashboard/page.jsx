"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'
import Image from 'next/image'

const DashboardPage = () => {

    const { isAuthenticated } = useAuth() // CUSTOM HOOK TO CHECK AUTHENTICATION STATUS
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null) // TOKEN FROM LOCAL STORAGE
    const [user, setUser] = useState(typeof window !== 'undefined' ? localStorage.getItem('user') : null) // USER FROM LOCAL STORAGE
    const [loading, setLoading] = useState(true)
    const [isMfa, setIsMfa] = useState(false)
    const [profile, setProfile] = useState({})
    const [error, setError] = useState('')
    const displayName = profile && profile.firstName ? profile.firstName : JSON.parse(user) && JSON.parse(user).email
    const [veriStatus, setVeriStatus] = useState('unverified')
    const displayImage = veriStatus === 'verified' ? '/images/verified.png' : veriStatus === 'unverified' ? '/images/unverified.png' : '/images/pending.gif'
    const displayText = veriStatus === 'verified' ? 'Verified account' : veriStatus === 'unverified' ? 'Unverified account' : 'Pending verification'

    // FETCH USER PROFILE AND SETTINGS ON PAGE LOAD
    useEffect(() => {

        // SET LOADING TO TRUE
        setLoading(true)

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
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                // IF SUCCESSFUL, SET THE SETTINGS STATE, ELSE SET THE SETTINGS STATE TO NULL
                response.data.mfa && setIsMfa(response.data.mfa)

            } catch (error) {
                // IF ERROR, SET THE SETTINGS STATE TO NULL
                setIsMfa(true)
                setError(error.response.data.msg)
            }
        }

        // GET VERIFICATION STATUS
        const getVerificationStatus = async () => {

            // REQUEST USING ID
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                console.log("Verification status: \n", response)

                // IF SUCCESSFUL, SET THE SETTINGS STATE, ELSE SET THE SETTINGS STATE TO NULL
                response.data && setVeriStatus(response.data.status)

            } catch (error) {
                // IF ERROR, SET THE SETTINGS STATE TO NULL
                setVeriStatus('unverified')
                setError(error.response.data.msg)
            }
        }

        // CALL THE FUNCTIONS
        getUserProfile()
        getUserSettings()
        getVerificationStatus()

        // SET LOADING TO FALSE
        setLoading(false)

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
        return <p>Please log in to access the dashboard. {console.log("Not authenticated")}</p>
    }

    // IF AUTHENTICATED, DISPLAY DASHBOARD
    return (
        <div className='flex flex-col items-center justify-center mt-24'>

            {/* VERIFIED ACCOUNT - Mark the account as verified - using badges (Twitter as an example) - NAME IF ANY, EMAIL OTHERWISE THEN ICON */}
            {profile && profile &&

                <div className="flex items-center justify-center w-full h-min p-3 mb-4 bg-slate-200 rounded-sm sm:hover:scale-90 sm:hover:bg-blue-200 transition duration-300 ease-in-out shadow-lg shadow-white">
                    <div className="flex flex-row ml-auto">

                        {/* <div className="flex flex-col items-center justify-right w-full ml-auto"> */}
                        <div className="flex flex-col items-center justify-center w-full">
                            <p className='mb-0 font-bold'>{displayName && displayName}</p>
                            <small className={`${(veriStatus === 'verified') ? 'text-green-500' : (veriStatus === 'unverified') ? 'text-red-500' : 'text-yellow-500'} text-xs`}>{displayText}</small>
                        </div>

                        {console.log('Profile: ', profile, 'User: ', user)}
                        <div className="w-8 h-8 sm:w-8 sm:h-6 rounded-full overflow-hidden shadow-md border-2 border-gray-200 mx-auto my-2 sm:mx-4">
                            <Link href="profile/profilePhoto" passHref>
                                <Image
                                    src={displayImage && displayImage}
                                    alt="Profile Image"
                                    width={34}
                                    height={34} />
                            </Link>
                        </div>
                    </div>
                </div>}

            <div className="flex items-center justify-center my-24">
                <div className="flex flex-col items-center justify-center w-11/12 sm:w-9/10 h-min p-3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">
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
            <div className="flex flex-col items-center justify-center w-11/12 sm:w-4/5 h-min p-4 sm:p-24 bg-blue-400 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white text-left mt-16">
                <h1 className="text-3xl text-white font-bold mb-8">User Details</h1>
                {
                    Object.keys(profile).length > 0 && Object.keys(profile).map((key, index) => {
                        return (
                            <div className="flex flex-row items-center w-5/6 h-1/3 text-left text-xs sm:text-3xl" key={index}>
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