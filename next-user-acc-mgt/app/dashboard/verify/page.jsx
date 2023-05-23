'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Loading from '../../utils/loading'
import useAuth from '../../utils/useauth'


const VerificationPage = () => {

    // TO CHECK AUTHENTICATION
    const { isAuthenticated } = useAuth()

    // STATE VARIABLES
    const [vers, setVers] = useState()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loadingVers, setLoadingVers] = useState(false)

    // FETCH USER ID AND TOKEN FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // FETCH ALL VERIFICATION REQUESTS
    useEffect(() => {
        const fetchVers = async () => {
            try {
                // CLEAR ERROR MESSAGE
                setError('')
                setLoadingVers(true)

                // ATTEMPT TO FETCH ALL VERIFICATION REQUESTS
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers`, { headers: { 'x-auth-token': token } })

                // SET VERIFICATION REQUESTS
                if (response) {
                    setVers(response.data)
                }

                // SET ERROR MESSAGE
                else {
                    setLoadingVers(false)
                    setError('An error occurred! Please refresh.')
                    // CLEAR MESSAGE AFTER 3 SECONDS
                    setTimeout(() => {
                        setError('')
                    }, 3000)
                }

                // SET LOADING TO FALSE
                setLoadingVers(false)

            } catch (error) {
                setLoadingVers(false)
                setError('An error occurred! Please refresh.')
                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)
            }
        }

        fetchVers()
    }, [])

    // HANDLE VERIFICATION REQUEST
    const handleVerify = async (id, status) => {
        try {
            // CLEAR ERROR MESSAGE
            setError('')
            setLoadingVers(true)

            // ATTEMPT TO VERIFY USER
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/verify/${id}`, { status }, { headers: { 'x-auth-token': token } })

            // SET VERIFICATION REQUESTS
            if (response) {
                setLoadingVers(false)

                // RELAOD VERIFICATION PAGE
                window.location.reload()
            }

            // SET ERROR MESSAGE
            else {
                setLoadingVers(false)
                setError('An error occurred! Please refresh.')
                // CLEAR MESSAGE AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)

            }

            // SET LOADING TO FALSE
            setLoadingVers(false)

        } catch (error) {
            setLoadingVers(false)
            setError('An error occurred! Please refresh.')
            // CLEAR MESSAGE AFTER 3 SECONDS
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center mt-24'>

            <div className="flex flex-col items-center justify-center w-11/12 sm:w-9/10 h-min p-3 bg-blue-500 rounded-lg sm:hover:scale-99 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">
                <h1 className="text-3xl text-white font-bold my-8">Verify users</h1>

                <div className="flex flex-wrap items-center justify-center w-full">
                    {
                        loadingVers ?

                            <Loading /> :

                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className='text-white bg-slate-200 font-extrabold uppercase text-left'>
                                        <th className='w-12 py-2 px-4 bg-black border-b'>#</th>
                                        <th className='py-2 px-4 bg-black border-b'>Name</th>
                                        <th className='py-2 px-4 bg-black border-b'>Document Type</th>
                                        <th className='py-2 px-4 bg-black border-b'>Document Number</th>
                                        <th className='py-2 px-4 bg-black border-b w-1/12'>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {

                                        vers && vers.map((ver, index) => (
                                            <tr key={index} className='text-gray-700'>
                                                <td className='w-12 py-2 px-4 border-b'>
                                                    {index + 1}
                                                </td>

                                                <td className='py-2 px-4 border-b'>
                                                    {ver.firstName + ' ' + ver.lastName}
                                                </td>

                                                <td className='py-2 px-4 border-b'>
                                                    <Link href={ver.documentImage}>

                                                        <span className='flex flex-row'>
                                                            <span className='mr-2 capitalize'>
                                                                {ver.documentType}
                                                            </span>
                                                            <Image
                                                                src="/images/download.gif"
                                                                alt="Profile Image"
                                                                width={24}
                                                                height={4}
                                                            />
                                                        </span>
                                                    </Link>
                                                </td>

                                                <td className='py-2 px-4 border-b'>
                                                    <b>
                                                        {ver.documentNumber}
                                                    </b>
                                                </td>

                                                <td className='py-2 px-4 border-b w-2/12'>
                                                    {
                                                        <label className="relative inline-flex items-left cursor-pointer w-5/6 sm:w-2/3 h-10 my-2">
                                                            <input type="checkbox"
                                                                value={ver.status === 'verified' ? true : false}
                                                                className="sr-only peer"
                                                                onChange={() => handleVerify(ver.id, ver.status === 'verified' ? 'unverified' : 'verified')}
                                                                checked={ver.status === 'verified' ? true : false}
                                                            />

                                                            <span className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-100 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-100 peer-checked:bg-green-400"></span>

                                                            <span className="ml-3 text-sm font-medium text-gray-100 dark:text-gray-300"></span>
                                                        </label>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default VerificationPage
