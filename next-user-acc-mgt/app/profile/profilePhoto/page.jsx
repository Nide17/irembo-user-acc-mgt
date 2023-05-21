'use client'
import Link from 'next/link'
import axios from 'axios'
import { useState } from 'react'
import Loading from '../../utils/loading'

const ProfilePhotoPage = () => {
    const [profilePhoto, setProfilePhoto] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingProfilePhoto, setLoadingProfilePhoto] = useState(false)

    // TOKEN FROM LOCAL STORAGE
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // USER ID FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const userId = user && user.id

    const handleSubmit = async (e) => {
        e.preventDefault()

        // VALIDATE PROFILE PHOTO
        if (!profilePhoto) {
            setError('Please provide a profile photo.')
            return
        }

        // VALIDATE PROFILE PHOTO
        if (profilePhoto.size > 1024 * 1024) {
            setError('Image size must be less than 1mb.')
            return
        }

        // VALIDATE PROFILE PHOTO
        if (profilePhoto.type !== 'image/jpeg' && profilePhoto.type !== 'image/png' && profilePhoto.type !== 'image/jpg') {
            setError('Image format is incorrect.')
            return
        }

        // CREATE FORM DATA OBJECT TO SEND TO SERVER
        const formData = new FormData()
        formData.append('profilePhoto', profilePhoto)

        // SEND PROFILE PHOTO TO SERVER
        try {
            // CLEAR ERROR MESSAGE
            setError('')

            // SET LOADING TO TRUE WHEN LOADING USER PROFILE DATA FROM SERVER AND BEFORE SETTING USER STATE
            setLoadingProfilePhoto(true)

            // ATTEMPT TO UPLOAD PROFILE PHOTO
            const response = await axios.put(`http://localhost:5002/profiles/${userId}/profilePhoto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'x-auth-token': token
                }
            })

            // SET SUCCESS MESSAGE
            if (response.status === 200) {
                setSuccess(true)

                // SET LOADING TO FALSE WHEN USER STATE IS SET
                setLoadingProfilePhoto(false)

                // // RELAOD PAGE AFTER SET SUCCESS MESSAGE
                // setTimeout(() => {
                //     window.location.reload()
                // }, 5000)
            }

            // SET ERROR MESSAGE
            else {
                console.error(response)
                setError('An error occurred!. Please try again.')
            }

            // SET LOADING TO FALSE
            setLoadingProfilePhoto(false)

            // CLEAR FORM
            setProfilePhoto('')

            // RETURN THE RESPONSE
            return response.data

        } catch (error) {
            setError('Something went wrong! Please try again.')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-2/3 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-8">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-2xl text-blue-100 leading-8 my-4'>UPDATE YOUR PROFILE PICTURE</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingProfilePhoto && !error && !success && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>

                )}
                {!loadingProfilePhoto && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success! Picture uploaded.</p>
                    </div>
                )}

                {/* PROFILE PHOTO */}
                <input
                    className="w-5/6 sm:w-2/3 h-16 flex items-center justify-center text-center sm:my-2 px-2 rounded-lg bg-slate-300 text-slate-900 py-4"
                    type="file"
                    name="profilePhoto"
                    id="profilePhoto"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                />

                <button type="submit" className="w-5/6 sm:w-2/3 h-10 my-4 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Upload
                </button>
            </form>
        </div>
    )
}

export default ProfilePhotoPage