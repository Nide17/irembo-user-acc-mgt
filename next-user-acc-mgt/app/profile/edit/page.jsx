"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Form from './form'
import Loading from '../../utils/loading'

const EditProfilePage = () => {

    // ERROR, SUCCESS, LOADING
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    // PROFILE STATE
    const [profile, setProfile] = useState()

    // USER ID FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const userId = user && user.id

    // TOKEN FROM LOCAL STORAGE
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // FETCH USER PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // CLEAR ERROR MESSAGE
                setError('')
                setLoading(true)

                // ATTEMPT TO FETCH USER PROFILE
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-auth-token': token
                    }
                })

                // SET USER PROFILE
                if (response.status === 200) {
                    setProfile(response.data)
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
                setLoading(false)

                // RETURN THE RESPONSE
                return response.data

            } catch (error) {
                setError('Something went wrong! Please try again.')

                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)

                // SET LOADING TO FALSE
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    // UPDATE USER PROFILE
    const updateUser = async (firstName, lastName, gender, dob, maritalStatus, nationality) => {

        // Check for empty fields
        if (!firstName || !lastName || !gender || !dob || !maritalStatus || !nationality) {
            setError('Please fill in all fields')
            return
        }

        try {
            // clear error message
            setError('')
            // set loading to true when loading user profile data from server and before setting user state
            setLoading(true)

            // attempt to create user
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${userId}`,
                { firstName, lastName, gender, dob, maritalStatus, nationality },
                {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
            if (response.status === 200) {
                setSuccess(true)
                setLoading(false)
                return response
            }

            else
                setError('Error updating user profile')
            setLoading(false)

            return response
        }
        catch (err) {
            setError('Error!')
        }
    }

    // RETURN THE FORM
    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <Form
                updateUser={updateUser}
                error={error}
                success={success}
                loading={loading}
                profile={profile}
                setProfile={setProfile}
            />
        </div>
    )
}

export default EditProfilePage