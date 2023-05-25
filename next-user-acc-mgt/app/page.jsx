import Link from 'next/link'
import React from 'react'

const page = () => {
  return (

    <div className="bg-gray-800 text-white text-lg font-serif mt-20">

      <div className={`bg-fixed bg-cover bg-center bg-no-repeat bg-[#051726] h-screen bg-image-home`}>
        <div className="flex flex-col items-center justify-center h-full px-2 sm:px-24 text-center my-20">
          <div className="bg-gray-900 py-10 mt-12">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-1xl font-bold text-center mb-8">Welcome to the User Account Management App!</h1>
              <p className="text-sm text-center mb-8">Manage and control user accounts with ease. Our app provides a comprehensive solution for user registration, authentication, and profile management. Streamline your user management processes and enhance the user experience with our powerful features.</p>

              <p className="text-sm text-center mb-8">Our user account management app simplifies the process of managing user accounts, providing a seamless experience for both administrators and users. Whether you're building a customer portal, an e-commerce platform, or an internal application, our app has the tools you need to efficiently manage user accounts and ensure a secure environment.</p>

              <p className="text-sm text-center mb-8">Get started today and take control of your user account management process. Sign up now to experience the convenience and security our app offers.</p>

              <p className="text-sm text-center mb-4">Ready to streamline your user management? Start using our User Account Management App today!</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-8 hover:scale-125 transition duration-500 ease-in-out">
            <Link href="/register" className="p-2 border rounded-md bg-blue-500 text-white hover:bg-blue-900 mb-4">
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center justify-center mt-4">
          <h2 className="text-1xl font-bold mb-4">Key Features:</h2>
          <ul className="list-disc list-inside text-left mb-8">
            <li className='mb-4'><b className='font-bold underline'>User Registration:</b> Allow users to sign up for an account by providing their email and password.</li>
            <li className='mb-4'><b className='font-bold underline'>Secure Authentication:</b> Implement robust authentication mechanisms to verify user identities and protect sensitive data.</li>
            <li className='mb-4'><b className='font-bold underline'>Profile Management:</b> Enable users to update their profiles, including profile photos, personal information, and preferences.</li>
            <li className='mb-4'><b className='font-bold underline'>Role-Based Access Control:</b> Assign roles to users and manage access permissions based on user roles.</li>
            <li className='mb-4'><b className='font-bold underline'>Multi-Factor Authentication:</b> Enhance account security with multi-factor authentication, adding an extra layer of verification.</li>
            <li className='mb-4'><b className='font-bold underline'>Account Verification:</b> Verify user accounts through document verification and official identification.</li>
            <li className='mb-4'><b className='font-bold underline'>Notifications:</b> Keep users informed with important account-related notifications and updates.</li>
            <li className='mb-4'><b className='font-bold underline'>Account Verification Workflow:</b> Implement a verification workflow to review and verify user-submitted documents.</li>
            <li className='mb-4'><b className='font-bold underline'>Password Reset:</b> Allow users to reset their passwords securely in case they forget or need to change them.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default page
