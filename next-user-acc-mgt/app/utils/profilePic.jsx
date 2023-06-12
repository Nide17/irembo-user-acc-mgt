'use client'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'

const ProfilePic = ({ token, isAuth }) => {
    // STATE VARIABLES
    const [profilePic, setProfilePic] = useState()
    const [user, setUser] = useState(typeof window !== 'undefined' ? localStorage.getItem('user') : null) // USER FROM LOCAL STORAGE

    // GET PROFILE PIC
    useEffect(() => {
        // GET PROFILE PIC
        const getProfilePic = async () => {
            try {
                const photoResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/profiles/user/${JSON.parse(user) && JSON.parse(user).id}`, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json',
                    },
                })

                // IF SUCCESSFUL, SET PROFILE PIC, ELSE SET PROFILE PIC TO NULL
                if (photoResponse && photoResponse.data.status === 200) {
                    setProfilePic(photoResponse.data.profile.profilePhoto)
                }

                else setProfilePic(null)
            }

            catch (error) {
                // RETURN ERROR
                return error
            }
        }

        // CALL THE FUNCTION
        getProfilePic()
    }, [user])

    // IF USER IS NOT LOGGED IN, RETURN NULL
    if (!isAuth) {
        return null
    }

    else {
        // RETURN THE PROFILE PIC
        return (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-md border-2 border-gray-200 mx-auto my-2 sm:mx-4">
                <Link href="profile/profilePhoto" passHref>
                    <Image
                        src={profilePic ? profilePic : '/images/profile.jpg'}
                        alt="Profile Image"
                        width={64}
                        height={64}
                        priority />
                </Link>
            </div>

        )
    }
}

export default ProfilePic