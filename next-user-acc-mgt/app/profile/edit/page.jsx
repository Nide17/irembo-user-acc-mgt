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
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user).id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                })

                // IF SUCCESSFUL, SET PROFILE STATE
                if (response && response.data) setProfile(response.data)

                // SET ERROR MESSAGE
                else setError("Error occured: ", response.data.msg)

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

    // UPDATE USER PROFILE
    const updateUser = async (firstName, lastName, gender, dateOfBirth, maritalStatus, nationality) => {

        // Check for empty fields
        if (!firstName || !lastName || !gender || !dateOfBirth || !maritalStatus || !nationality) {
            setError('Please fill in all fields')
            return
        }

        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // ATTEMPT TO UPDATE USER PROFILE
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user).id}`,
                { firstName, lastName, gender, dateOfBirth, maritalStatus, nationality },
                {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    },
                })

            // IF SUCCESSFUL, SET SUCCESS STATE
            if (response && response.status === 200) {
                return response
            }
            else setError("Error occured: ", response.data.msg)
        }
        catch (err) {
            setError('Error updating user profile')
        }
    }

    // IF NOT AUTHENTICATED, DISPLAY MESSAGE
    if (!isAuthenticated) {
        return <p>Please log in to edit profile.</p>
    }

    // IF LOADING, DISPLAY LOADING SPINNER
    if (loading) return <div className="flex items-center justify-center h-screen"><Loading /></div>

    // RETURN THE FORM
    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            {console.log(profile)}
            <Form
                error={error}
                updateUser={updateUser}
                profile={profile}
                setProfile={setProfile}
            />
        </div>
    )
}

export default EditProfilePage