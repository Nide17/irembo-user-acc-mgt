'use client'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'

const ProfilePic = ({ user, token, isLoggedIn }) => {
    // STATE VARIABLES
    const [profilePic, setProfilePic] = useState()

    // GET PROFILE PIC
    useEffect(() => {
        // GET PROFILE PIC
        const getProfilePic = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/users/${user.id}/profile`, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json',
                    },
                })

                // SET PROFILE PIC
                setProfilePic(response.data.profilePhoto)

                // RETURN RESPONSE
                return response
            }

            catch (error) {
                // RETURN ERROR
                return error
            }
        }

        // CALL THE FUNCTION
        getProfilePic()
    }, [])

    // IF USER IS NOT LOGGED IN, RETURN NULL
    if (!isLoggedIn) {
        return null
    }
    else {
        // RETURN THE PROFILE PIC
        return (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-md border-2 border-gray-200 mx-4">
                <Link href="profile/profilePhoto" passHref>
                    <Image
                        src={profilePic ? profilePic : '/images/profile.jpg'}
                        alt="Profile Image"
                        width={64}
                        height={64} />
                </Link>
            </div>

        )
    }
}

export default ProfilePic