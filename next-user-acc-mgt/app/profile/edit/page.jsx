"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Form from './form'
import useAuth from '../../utils/useauth'
import Loading from '../../utils/loading'

const EditProfilePage = () => {

    // TO CHECK AUTHENTICATION
    const { isAuthenticated } = useAuth()

    // STATE VARIABLES
    const [profile, setProfile] = useState()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // FETCH USER ID AND TOKEN FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // FETCH USER PROFILE
    useEffect(() => {

        // FETCH USER PROFILE
        const fetchProfile = async () => {
            // SET LOADING TO TRUE
            setLoading(true)

            // CLEAR ERROR MESSAGE
            setError('')

            try {
                // ATTEMPT TO FETCH USER PROFILE
                const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user).id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                })

                // IF SUCCESSFUL, SET PROFILE STATE
                if (profileResponse && profileResponse.data.status === 200) {
                    setProfile(profileResponse.data.profile)
                }

                // SET ERROR MESSAGE
                else setError(`Error occured: ${profileResponse.data.msg}`)

            } catch (error) {
                // SET ERROR MESSAGE
                setError('Something went wrong! Please try again.')
            }

            // SET LOADING TO FALSE
            setLoading(false)
        }

        // CALL FETCH PROFILE FUNCTION
        fetchProfile()
    }, [])

    // IF NOT AUTHENTICATED, DISPLAY MESSAGE
    if (!isAuthenticated) {
        return <p>Please log in to edit profile.</p>
    }

    // IF LOADING, DISPLAY LOADING SPINNER
    if (loading) return <div className="flex items-center justify-center h-screen"><Loading /></div>

    // RETURN THE FORM
    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <Form
                setLoading={setLoading}
                loading={loading}
                error={error}
                setError={setError}
                profile={profile}
                user={user}
                token={token}
                setProfile={setProfile}
            />
        </div>
    )
}

export default EditProfilePage