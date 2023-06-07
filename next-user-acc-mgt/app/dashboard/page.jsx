"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'
import Image from 'next/image'
import DashboardContent from './content'

const DashboardPage = () => {

    const { isAuthenticated } = useAuth() // CUSTOM HOOK TO CHECK AUTHENTICATION STATUS
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null) // TOKEN FROM LOCAL STORAGE
    const [user, setUser] = useState(typeof window !== 'undefined' ? localStorage.getItem('user') : null) // USER FROM LOCAL STORAGE
    const [loading, setLoading] = useState(true)
    const [isMfa, setIsMfa] = useState(false)
    const [profile, setProfile] = useState({})
    const [error, setError] = useState('')

    const { firstName, lastName } = profile
    const displayName = profile && firstName && lastName ? firstName + ' ' + lastName :
        firstName && !lastName ? firstName : !firstName && lastName ? lastName :
            JSON.parse(user) && JSON.parse(user).email

    const [veriStatus, setVeriStatus] = useState('unverified')
    const displayIcon = veriStatus === 'verified' ? '/images/verified.png' : veriStatus === 'pending' ? '/images/pending.gif' : '/images/unverified.png'

    const displayText = veriStatus === 'verified' ? 'Verified account' : veriStatus === 'unverified' ? 'Unverified account' : 'Pending verification'

    const role = user && JSON.parse(user).roleId

    // FETCH USER PROFILE AND SETTINGS ON PAGE LOAD
    useEffect(() => {

        // SET LOADING TO TRUE
        setLoading(true)

        // GET USER PROFILE
        const getUserProfile = async () => {

            // ATTEMPT TO GET USER PROFILE
            try {
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                if (userResponse && userResponse.data.status === 200) {
                    setProfile(userResponse.data.profile)
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
                const settingsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/settings/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                // IF SUCCESSFUL, SET THE SETTINGS STATE, ELSE SET THE SETTINGS STATE TO NULL
                if (settingsResponse.data.status === 200) {
                    setIsMfa(settingsResponse.data.settings.mfa)
                }

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
                const verResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                })

                // IF SUCCESSFUL, SET THE SETTINGS STATE, ELSE SET THE SETTINGS STATE TO NULL
                if (verResponse.data.status === 200) {
                    setVeriStatus(verResponse.data.accver.status)
                }

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
        return <p>Please log in to access the dashboard </p>
    }

    // IF AUTHENTICATED, DISPLAY DASHBOARD
    return (
        <div className='flex flex-col items-center justify-center mt-24 w-full'>

            {/* VERIFIED ACCOUNT - Mark the account as verified - using badges (Twitter as an example) - NAME IF ANY, EMAIL OTHERWISE THEN ICON */}
            {profile && profile &&

                <div className="flex items-center justify-center w-full h-min p-3 mb-4 bg-slate-200 rounded-sm sm:hover:scale-95 sm:hover:bg-blue-200 transition duration-300 ease-in-out shadow-lg shadow-white t1">
                    <div className="flex flex-row ml-auto">

                        <div className="flex flex-col items-center justify-center">
                            <p className='mb-0 font-bold'>{displayName && displayName}</p>
                            <small className={`
                            ${(veriStatus === 'verified') ? 'text-green-500' : (veriStatus === 'unverified') ? 'text-red-500' : 'text-yellow-500'} 
                            text-xs ${role === 2 ? 'hidden' : "inline"}`}>
                                {displayText}
                            </small>
                        </div>

                        {
                            role && role !== 2 ?
                                <div className="w-8 h-8 sm:w-8 rounded-full overflow-hidden shadow-md border-2 border-gray-200 mx-auto my-2 sm:mx-4">
                                    <Image
                                        src={displayIcon && displayIcon}
                                        alt="Profile Image"
                                        width={34}
                                        height={34} 
                                        priority />
                                </div> :

                                <div className="flex items-center justify-center h-full mx-4">
                                    {/* LINK TO VERIFY OTHERS AS ADMIN */}
                                    <Link href="dashboard/verify" passHref>
                                        <span className="flex items-center justify-center h-full text-sm font-bold cursor-pointer bg-green-500 hover:bg-green-300 text-white py-2 px-4 rounded transition duration-300 ease-in-out">
                                            Verify users
                                        </span>
                                    </Link>
                                </div>
                        }
                    </div>
                </div>}

            <DashboardContent user={user} isMfa={isMfa} profile={profile} />
        </div>)
}

export default DashboardPage