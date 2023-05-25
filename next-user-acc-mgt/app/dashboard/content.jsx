import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import moment from 'moment'

const DashboardContent = ({ profile, isMfa }) => {

    const fName = profile && profile.firstName || ''
    const lName = profile && profile.lastName || ''
    const profilePic = profile && profile.profilePhoto

    return (
        <div className='flex flex-col items-center justify-center my-8 w-full'>
            <div className="flex items-center justify-center my-8">
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
            <div className="flex flex-col items-center justify-center w-11/12 sm:w-4/5 h-min p-4 sm:p-8 bg-blue-400 rounded-lg sm:hover:scale-105 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white text-left mt-4">
                <h1 className="text-3xl text-white font-bold mb-8">{fName + ' ' + lName}</h1>

                {
                    <div className='flex flex-row items-center justify-around'>
                        <div className='w-11/12 sm:w-2/5 p-4 sm:p-0 border-2 rounded-lg flex mx-0 sm:mx-16'>
                            <Image
                                src={profilePic ? profilePic : '/images/profile.jpg'}
                                alt="Profile Image"
                                width={240}
                                height={240}
                                className='rounded-lg'
                            />
                        </div>

                        <div className='w-11/12 sm:w-3/5 p-4'>
                            <p className='w-max text-slate-100'> <span className='font-bold'>Nationality:</span> {profile && profile.nationality}</p>
                            <p className='w-max text-slate-100'> <span className='font-bold'>Marital status:</span> {profile && profile.maritalStatus}</p>
                            <p className='w-max text-slate-100'> <span className='font-bold'>Gender:</span> {profile && profile.gender}</p>
                            <p className='w-max text-slate-100'> <span className='font-bold'>Date of Birth:</span> {profile && profile.dateOfBirth && moment(profile.dateOfBirth).format('DD-MM-YYYY')}</p>
                            <p className='w-max text-slate-100'> <span className='font-bold'>Age:</span> {profile && profile.age}</p>
                            <p className='w-max text-slate-100'><span className='font-bold'>Registered on</span> {profile && moment(profile.createdAt).format('DD-MM-YYYY')}</p>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export default DashboardContent
