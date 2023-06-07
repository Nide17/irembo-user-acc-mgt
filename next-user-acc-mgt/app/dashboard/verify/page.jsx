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
    const [loadingVers, setLoadingVers] = useState(false)
    const [success, setSuccess] = useState(false)

    // FETCH USER ID AND TOKEN FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const userRole = user && JSON.parse(user).roleId

    // FETCH ALL VERIFICATION REQUESTS
    useEffect(() => {
        const fetchVers = async () => {
            try {
                // CLEAR ERROR MESSAGE
                setError('')
                setLoadingVers(true)

                // ATTEMPT TO FETCH ALL VERIFICATION REQUESTS
                const versResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers`, { headers: { 'x-auth-token': token } })

                // SET VERIFICATION REQUESTS
                if (versResponse && versResponse.data.status === 200) {
                    setVers(versResponse.data.accvers)
                }

                // SET ERROR MESSAGE
                else {
                    // SET SUCCESS STATE
                    setSuccess(false)
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

                // SET SUCCESS STATE
                setSuccess(false)
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
    const handleVerify = async (id, userId, status) => {

        try {
            // CLEAR ERROR MESSAGE
            setError('')
            setLoadingVers(true)

            // ATTEMPT TO VERIFY USER
            const verifyResponse = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/verify/${id}`, { userId, status }, { headers: { 'x-auth-token': token } })

            // SET VERIFICATION REQUESTS
            if (verifyResponse && verifyResponse.data.status === 200) {
                setLoadingVers(false)

                // RELAOD VERIFICATION PAGE TO REFLECT CHANGES AFTER 3 SECONDS
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
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

    // IF NOT AUTHENTICATED, DISPLAY MESSAGE
    if (!isAuthenticated || userRole !== 2) {
        return <p>You are not allowed to access this page!</p>
    }

    else return (
        <div className='flex flex-col items-center justify-center mt-24'>

            <div className="flex flex-col items-center justify-center w-11/12 sm:w-9/10 h-min p-3 bg-blue-500 rounded-lg sm:hover:scale-99 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white">
                <h1 className="text-3xl text-white font-bold my-8">Verify users</h1>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loadingVers && !error && !success && (
                    <div className="flex items-center justify-center pb-2">
                        <Loading />
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{error}</p>
                    </div>)}

                {!loadingVers && !error && success && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success, status updated ...</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-center w-full">
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
                                                    <span className='mr-2 capitalize w-3/4'>
                                                        {ver.documentType === 'nid' ? 'National ID' : ver.documentType}
                                                    </span>
                                                    <Image
                                                        src="/images/download.gif"
                                                        alt="Profile Image"
                                                        width={24}
                                                        height={4}
                                                        style={{ width: '8%', height: 'auto' }}
                                                        priority
                                                    />
                                                </span>
                                            </Link>
                                        </td>

                                        <td className='py-2 px-4 border-b'>
                                            <b>
                                                {ver.documentNumber}
                                            </b>
                                        </td>

                                        <td className='py-2 px-4 border-b w-6/12 flex'>
                                            <select
                                                className={`h-9 my-3 sm:m-2 px-2 text-center rounded-lg ${ver.status === 'verified' ? 'text-green-700' : ver.status === 'unverified' ? 'text-red-700' : 'text-gray-700'} font-bold bg-white border border-gray-300 focus:border-yellow-500`}
                                                id="status"
                                                value={ver && ver.status ? ver.status : "SELECT DECISION"}
                                                onChange={(event) => handleVerify(ver.id, ver.userId, event.target.value)}
                                                required
                                            >
                                                <option value="verified" className='bg-green-600 text-white'>VERIFIED</option>
                                                <option value="unverified" className='bg-red-500 text-white'>UNVERIFIED</option>
                                                <option value="pending" className='bg-gray-500 text-white'>PENDING</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default VerificationPage