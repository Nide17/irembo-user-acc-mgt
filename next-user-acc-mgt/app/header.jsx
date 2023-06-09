"use client"
import { useState, useEffect } from 'react'
import ProfilePic from './utils/profilePic'
import Link from 'next/link'
import axios from 'axios'

export default function Header() {

    // STATE VARIABLES
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // isAuth STATE TO KEEP TRACK OF AUTHENTICATION STATUS
    const [isAuth, setIsAuth] = useState(false)

    // GET THE TOKEN FROM LOCAL STORAGE
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null) // TOKEN FROM LOCAL STORAGE

    // IF TOKEN IS PRESENT, CHECK IF IT IS VALID VIA /auth/verify-token API
    useEffect(() => {

        // IF TOKEN IS PRESENT, CHECK IF IT IS VALID
        if (token) {

            // FUNCTION TO CHECK IF TOKEN IS VALID
            const checkToken = async () => {
                try {
                    // CALL THE API TO CHECK IF TOKEN IS VALID
                    const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/verify-token`, { token }, {
                        headers: {
                            'x-auth-token': token,
                            'Content-Type': 'application/json',
                        }
                    })

                    // IF TOKEN IS VALID, USER IS AUTHORIZED
                    if (tokenResponse && tokenResponse.data.status === 200) {
                        setIsAuth(true)
                    }

                    else {
                        // REMOVE TOKEN AND USER DATA FROM LOCAL STORAGE
                        setIsAuth(false)
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                    }
                }
                catch (error) {
                    // IF TOKEN IS INVALID, LOGOUT USER
                    setIsAuth(false)
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                }
            }
            // CALL THE FUNCTION TO CHECK IF TOKEN IS VALID
            checkToken()
        }

        // KEEP TRACKING OF AUTHENTICATION STATUS THROUGH OUT THE APP
        setIsAuth(isAuth)
    }, [token])

    // LOGOUT USER
    const logout = () => {

        setIsAuth(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // REDIRECT TO LOGIN PAGE
        window.location.href = '/login'
    }

    // TOGGLE MENU FUNCTION ON MOBILE 
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className='fixed top-0 left-0 w-full z-10 bg-slate-100 text-slate-900 text-16 drop-shadow-md'>

            <nav className="py-1 px-3 flex flex-col sm:flex-row items-center columns-1 sm:columns-3">

                <div className="w-full sm:w-120 h-16 p-2 flex items-center justify-between text-center">
                    <Link href="#" className='p-1 font-bold'>

                        <span className='hidden lg:block text-xl md:text-2xl text-blue-500 leading-6'>User Account Management App</span>

                        <span className='block lg:hidden text-xl md:text-2xl text-blue-500 leading-6'>UAM App</span>

                        <span className='block text-sm md:text-base text-slate-800 underline underline-offset-4 leading-6'>Manage, be fruitful</span>
                    </Link>

                    <div className={`hamburger inline sm:hidden ml-auto ${isMenuOpen ? "w-4 h-[2rem]" : ""}`} onClick={toggleMenu}>
                        <span className={`w-5 h-[2px] bg-slate-900 block ${isMenuOpen ? "hidden" : ""}`}></span>
                        <span className={`sm:w-5 h-[2px] bg-slate-900 block my-1 ${isMenuOpen ? "w-0 h-0 font-mono text-3xl my-auto text-blue-500" : ""}`}>
                            {isMenuOpen ? "X" : ""}
                        </span>
                        <span className={`w-5 h-[2px] bg-slate-900 block ${isMenuOpen ? "hidden" : ""}`}></span>
                    </div>
                </div>

                <div className={`${isMenuOpen ? "" : "hidden"} sm:flex grow justify-center sm:justify-end top-20 sm:top-0 h-72 sm:h-auto fixed sm:static z-10 sm:z-1 mr-3 sm:mr-0  w-full sm:w-auto`}>

                    <ul className={`flex flex-col sm:flex-row justify-center sm:justify-end items-center w-9/12 sm:w-auto mx-auto sm:mr-0 bg-slate-100`}>

                        <li className='sm:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                            <Link href="/#" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                Home
                            </Link>
                        </li>

                        <li className='lg:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                            <Link href="/dashboard" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                Dashboard
                            </Link>
                        </li>

                        {
                            isAuth ? <li className='lg:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={logout}>
                                    Logout
                                </button>
                            </li> :

                                <>
                                    <li className='sm:mx-4 lg:ml-20 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                        <Link href="/login" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                            Login
                                        </Link>
                                    </li>

                                    <li className='lg:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                        <Link href="/register" className='p-2 border rounded-md bg-blue-500 text-white hover:bg-blue-900'>
                                            Register
                                        </Link>
                                    </li>
                                </>
                        }
                    </ul>

                    {isAuth &&
                        <ProfilePic
                            token={token}
                            isAuth={isAuth}
                        />}
                </div>
            </nav>
        </header>
    )
}