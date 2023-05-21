"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import useAuth from '../utils/useauth'
import Loading from '../utils/loading'
import { useRouter } from 'next/navigation'

const VerificationPage = () => {

    // ROUTER
    const router = useRouter()

    // TO CHECK AUTHENTICATION
    const { isAuthenticated } = useAuth()

    // STATE VARIABLES
    const [documentType, setDocumentType] = useState('') // passport, nid, drivers_license, laissez_passer
    const [documentNumber, setDocumentNumber] = useState('')
    const [documentImage, setDocumentImage] = useState('')

    // ERROR, SUCCESS, LOADING
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    // FETCH USER ID AND TOKEN FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // TRY TO GET EXISTING USER VERIFICATION
    useEffect(() => {
        const fetchVerification = async () => {
            try {

                // CLEAR ERROR msg
                setError('')
                setLoading(true)

                // ATTEMPT TO FETCH USER VERIFICATION
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/user/${JSON.parse(user).id}`, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    }
                })

                // SET USER VERIFICATION
                console.log(response)
                if (response && response.data) {
                    setDocumentType(response.data.documentType || '')
                    setDocumentNumber(response.data.documentNumber || '')
                    setDocumentImage(response.data.documentImage || '')
                }

                // SET ERROR msg
                else {
                    setError("Error occured: ", response.data.msg)
                    // CLEAR msg AFTER 3 SECONDS
                    setTimeout(() => {
                        setError('')
                    }, 3000)
                }

                // SET LOADING TO FALSE
                setLoading(false)

            } catch (error) {
                console.log(error)
                setError('An error occurred! Please try again.')
                // CLEAR msg AFTER 3 SECONDS
                setTimeout(() => {
                    setError('')
                }, 3000)
                setLoading(false)
            }
        }

        fetchVerification()
    }, [])

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault()

        // IF DOCUMENT TYPE IS PASSPORT OR LAISSEZ PASSER DOCUMENT NUMBER MUST BE 8 CHARACTERS
        if ((documentType === 'passport' || documentType === 'laissez_passer') && documentNumber.length !== 8) {
            setError('Document number must be 8 characters')
            return error
        }

        // IF DOCUMENT TYPE IS ID, DOCUMENT NUMBER MUST BE 16 CHARACTERS
        if ((documentType === 'nid' || documentType === 'drivers_license') && documentNumber.length !== 16) {
            setError('Document number must be 16 characters')
            return error
        }

        if (!documentType || !documentNumber || !documentImage) {
            setError('Please fill in all fields')
            return error
        }

        try {
            setError('')
            setLoading(true)

            // CREATE FORM DATA OBJECT TO SEND TO SERVER
            const formData = new FormData()
            formData.append('documentImage', documentImage)
            formData.append('documentType', documentType)
            formData.append('documentNumber', documentNumber)

            // UPDATE DOCUMENT TYPE, DOCUMENT NUMBER, DOCUMENT IMAGE
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/user/${JSON.parse(user).id}`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                },
            })

            console.log(response)
            if (response) {
                setLoading(false)
                setSuccess(true)

                // GO BACK TO DASHBOARD
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 5000)
            }
            else {
                setLoading(false)
                setError('Error occurred: ' + response.data.msg)
                return error
            }
        }
        catch (err) {
            setError('Something went wrong')
        }
    }



    // IF USER IS NOT AUTHENTICATED, REDIRECT TO LOGIN PAGE
    if (!isAuthenticated) {
        router.push('/login')
    }

    // IF LOADING, SHOW LOADING PAGE
    if (loading) {
        return 
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <Loading />
        </div>
    }
    
    // IF USER IS AUTHENTICATED, SHOW VERIFICATION PAGE
    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-4/5 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center my-4">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-8'>Verify Account</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
                    </Link>
                </div>
                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {loading && !error && !success && (
                    <small className="text-yellow-500 text-center animate-ping">Loading ...</small>
                )}

                {error && (<small className="text-red-700 text-center animate-bounce">{error}</small>)}

                {!loading && !error && success && (
                    <small className="text-green-700 text-center animate-bounce">Successful request!</small>
                )}

                <select
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    id="documentType"
                    value={documentType}
                    onChange={(event) => setDocumentType(event.target.value)}
                    required
                >
                    <option value="">SELECT TYPE</option>
                    <option value="passport">PASSPORT</option>
                    <option value="nid">NATIONAL ID</option>
                    <option value="drivers_license">DRIVING LICENCE</option>
                    <option value="laissez_passer">LAISSEZ PASSER</option>
                </select>

                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="text"
                    placeholder="Document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    required
                />

                <input
                    className="w-5/6 sm:w-2/3 h-16 flex items-center justify-center text-center sm:my-2 px-2 rounded-lg bg-slate-300 text-slate-900 py-4"
                    type="file"
                    name="documentImage"
                    id="documentImage"
                    onChange={(e) => setDocumentImage(e.target.files[0])}
                />

                <button type="submit" className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    Request
                </button>
            </form>
        </div>
    )
}

export default VerificationPage