"use client";
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loading from '../utils/loading';

const RegisterPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    // ERROR, SUCCESS, LOADING
    const [regError, setRegError] = useState('')
    const [regSuccess, setRegSuccess] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check for empty fields
        if (!email || !password || !password2) {
            setRegError('Please fill in all fields')
            return;
        }

        // Check for valid email address 
        const re = /\S+@\S+\.\S+/
        if (!re.test(email)) {
            setRegError('Please enter a valid email address')
            return;
        }

        // Check if passwords match
        if (password !== password2) {
            setRegError('Passwords do not match')
            return;
        }

        // Check password length
        if (password.length < 6) {
            setRegError('Password must be at least 6 characters')
            return;
        }

        try {
            setRegError('')
            setRegisterLoading(true)
            const usersResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/users`, { email, password })

            if (usersResponse && usersResponse.data.status === 200) {
                setRegSuccess(true)
                setRegisterLoading(false)

                // REDIRECT TO LOGIN PAGE AFTER 2 SECONDS
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            }
            else {
                setRegisterLoading(false)
                setRegError("Error occured: ", usersResponse.data.msg)
                console.log(usersResponse)
            }
        }
        catch (err) {
            console.log(err)
            setRegError('Error signing up!')
        }

        setRegisterLoading(false)
    }

    return (
        <div className="flex items-center justify-center h-screen bg-image-login bg-cover bg-center bg-no-repeat">
            <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-4/5 py-4 mt-20 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

                <div className="flex-none w-120 h-16 flex items-center justify-center text-center">
                    <Link href="/" className='p-1 font-bold'>
                        <span className='block text-4xl text-blue-100 leading-8'>Register</span>
                        <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Sign up to start manage your data</span>
                    </Link>
                </div>

                {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
                {registerLoading && !regError && !regSuccess && (
                    <div className="flex items-center justify-center">
                        <Loading />
                    </div>
                )}

                {regError && (
                    <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
                        <p className="text-center text-red-700 text-sm">{regError}</p>
                    </div>)}

                {!registerLoading && !regError && regSuccess && (
                    <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
                        <p className="text-center text-green-900 text-lg">Success, login now!</p>
                    </div>
                )}

                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
                    type="password"
                    placeholder="Verify"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
                <button type="submit" className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
                    SignUp
                </button>

                <p className="text-center text-white text-sm underline underline-offset-4">
                    <Link href="/login">Already have an account? Login</Link>
                </p>
            </form>
        </div>
    )
}

export default RegisterPage
