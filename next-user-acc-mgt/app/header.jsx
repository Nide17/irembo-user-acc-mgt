"use client"
import Link from 'next/link'
import ProfilePic from './utils/profilePic'

const Header = ({ logout, isMenuOpen, toggleMenu, isLoggedIn, user, token }) => {

    // console.log('user: ', user, 'token: ', token, 'isLoggedIn: ', isLoggedIn) 

    return (
        <header className='fixed top-0 left-0 w-full z-10 bg-slate-100 text-slate-900 text-16 drop-shadow-md'>

            <nav className="py-1 px-3 flex items-center columns-3">
                <div className="p-2 flex-none w-120 h-16 flex items-center justify-center text-center">
                    <Link href="#" className='p-1 font-bold'>
                        <span className='block text-2xl text-blue-500 leading-6'>User Account Management App</span>
                        <span className='block text-[10px] text-slate-800 underline underline-offset-4 leading-6'>Manage, be fruitful</span>
                    </Link>
                </div>
                {/* {console.log(user)} */}
                <div className={`${isMenuOpen ? "" : "hidden"} sm:flex grow justify-center sm:justify-end top-20 sm:top-0 h-72 sm:h-auto fixed sm:static z-10 sm:z-1 mr-3 sm:mr-0  w-full sm:w-auto`}>

                    <ul className={`flex flex-col sm:flex-row justify-center sm:justify-end items-center w-9/12 sm:w-auto mx-auto sm:mr-0 bg-slate-100`}>

                        <li className='sm:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                            <Link href="/#" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                Home
                            </Link>
                        </li>

                        <li className='sm:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                            <Link href="/dashboard" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                Dashboard
                            </Link>
                        </li>

                        {
                            isLoggedIn ? <li className='sm:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={logout}>
                                    Logout
                                </button>
                            </li> :

                                <>
                                    <li className='sm:mx-4 sm:ml-20 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                        <Link href="/login" className='p-2 border border-slate-100 rounded-md hover:bg-blue-500 hover:text-white'>
                                            Login
                                        </Link>
                                    </li>

                                    <li className='sm:mx-4 py-3 hover:scale-110 transition duration-500 ease-in-out'>
                                        <Link href="/register" className='p-2 border rounded-md bg-blue-500 text-white hover:bg-blue-900'>
                                            Register
                                        </Link>
                                    </li>
                                </>
                        }
                    </ul>

                    {isLoggedIn &&
                        <ProfilePic
                            user={user}
                            token={token}
                            isLoggedIn={isLoggedIn}
                        />}
                    {/* {console.log('user: ', user, 'token: ', token, 'isLoggedIn: ', isLoggedIn)} */}
                </div>

                <div className={`hamburger inline sm:hidden ml-auto ${isMenuOpen ? "w-4 h-[2rem]" : ""}`} onClick={toggleMenu}>
                    <span className={`w-5 h-[2px] bg-slate-900 block ${isMenuOpen ? "hidden" : ""}`}></span>
                    <span className={`sm:w-5 h-[2px] bg-slate-900 block my-1 ${isMenuOpen ? "w-0 h-0 font-mono text-3xl my-auto text-blue-500" : ""}`}>
                        {isMenuOpen ? "X" : ""}
                    </span>
                    <span className={`w-5 h-[2px] bg-slate-900 block ${isMenuOpen ? "hidden" : ""}`}></span>
                </div>
            </nav>
        </header>
    )
}

export default Header