"use client";
import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const VerificationPage = () => {
    // DOCUMENT TYPE, DOCUMENT NUMBER, DOCUMENT IMAGE
    const [documentType, setDocumentType] = useState('') // passport, nid, drivers_license, laissez_passer
    const [documentNumber, setDocumentNumber] = useState('')
    const [documentImage, setDocumentImage] = useState('')

    // ERROR, SUCCESS, LOADING
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    // USER ID FROM LOCAL STORAGE
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
    const userId = user && user.id

    // TOKEN FROM LOCAL STORAGE
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY}/accvers/user/${userId}`, formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            })

            if (response.status === 200) {
                setLoading(false)
                setSuccess(true)

                // GO BACK TO DASHBOARD
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 5000)

                return response
            }
            else {
                setLoading(false)
                setError('Error occurred: ' + response.data.message)
                return error
            }
        }
        catch (err) {
            setError('Something went wrong')

            // IF ERROR IS 401 UNAUTHORIZED, LOGOUT USER
            if (err.response.status === 401) {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
            return error
        }
    }

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