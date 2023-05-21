import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="w-9/10 h-3/5 mt-12 bg-gray-800 text-white text-lg font-serif">

      <div className={`bg-fixed bg-cover bg-center bg-no-repeat bg-[#051726] h-screen w-full bg-image-home`}>
        <div className="flex flex-col items-center justify-center h-full w-full px-2 sm:px-72 text-center">

          <div className="bg-gray-900 py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-1xl font-bold text-center mb-8">Welcome to the User Account Management App!</h1>
              <p className="text-sm text-center mb-8">Manage and control user accounts with ease. Our app provides a comprehensive solution for user registration, authentication, and profile management. Streamline your user management processes and enhance the user experience with our powerful features.</p>

              {/* <h2 className="text-1xl font-bold mb-4">Key Features:</h2>
              <ul className="list-disc list-inside text-left mb-8">
                <li>User Registration: Allow users to sign up for an account by providing their email and password.</li>
                <li>Secure Authentication: Implement robust authentication mechanisms to verify user identities and protect sensitive data.</li>
                <li>Profile Management: Enable users to update their profiles, including profile photos, personal information, and preferences.</li>
                <li>Role-Based Access Control: Assign roles to users and manage access permissions based on user roles.</li>
                <li>Multi-Factor Authentication: Enhance account security with multi-factor authentication, adding an extra layer of verification.</li>
                <li>Account Verification: Verify user accounts through document verification and official identification.</li>
                <li>Notifications: Keep users informed with important account-related notifications and updates.</li>
                <li>Account Verification Workflow: Implement a verification workflow to review and verify user-submitted documents.</li>
                <li>Password Reset: Allow users to reset their passwords securely in case they forget or need to change them.</li>
              </ul> */}

              <p className="text-sm text-center mb-8">Our user account management app simplifies the process of managing user accounts, providing a seamless experience for both administrators and users. Whether you're building a customer portal, an e-commerce platform, or an internal application, our app has the tools you need to efficiently manage user accounts and ensure a secure environment.</p>

              <p className="text-sm text-center mb-8">Get started today and take control of your user account management process. Sign up now to experience the convenience and security our app offers.</p>

              <p className="text-sm text-center mb-4">Ready to streamline your user management? Start using our User Account Management App today!</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 hover:scale-125 transition duration-500 ease-in-out">
            <Link href="/register" className="p-2 border rounded-md bg-blue-500 text-white hover:bg-blue-900 mt-4">
              Get started
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default page
