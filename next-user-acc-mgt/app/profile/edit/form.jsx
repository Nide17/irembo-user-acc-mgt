"use client"

import Link from 'next/link'
import { useState } from 'react'
import countryList from './countries.json'
import moment from 'moment';

const Form = ({ updateUser }) => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [nationality, setNationality] = useState('')

  const [errorP, setErrorP] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Function to validate the form and create a new user
  function calculateAge(birthdate) {
    const age = moment().diff(moment(birthdate), 'years');
    return age;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Call function to update user
    const response = await updateUser(firstName, lastName, gender, dob, maritalStatus, nationality)

    // Redirect to login page if successful
    if (response) {
      // clear error message
      setErrorP('')
      // set loading to true when loading user profile data from server and before setting user state
      setLoading(true)
      // set success to true when user profile data is successfully loaded from server and user state is set
      setSuccess(true)
      // set loading to false when user profile data is successfully loaded from server and user state is set
      setLoading(false)
    } else {
      // clear success message
      setSuccess(false)
      // set loading to true when loading user profile data from server and before setting user state
      setLoading(true)
      // set error message when user profile data is not successfully loaded from server and user state is not set
      setErrorP('Error updating user profile')
      // set loading to false when user profile data is not successfully loaded from server and user state is not set
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col items-center justify-center w-5/6 sm:w-2/5 h-4/5 bg-blue-500 rounded-lg sm:hover:scale-110 sm:hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg shadow-white" onSubmit={handleSubmit}>

      <div className="flex-none w-120 h-16 flex items-center justify-center text-center">
        <Link href="/" className='p-1 font-bold'>
          <span className='block text-4xl text-blue-100 leading-8'>Edit Profile</span>
          <span className='block text-[12px] text-slate-800 underline underline-offset-4 leading-6'>Manage your data</span>
        </Link>
      </div>

      {/* NOTIFICATION - LOADING, ERROR, SUCCESS */}
      {loading && !errorP && !success && (
        <small className="text-yellow-500 text-center animate-ping">Loading ...</small>
      )}

      {errorP && (<small className="text-red-700 text-center animate-bounce">{errorP}</small>)}

      {!loading && !errorP && success && (
        <small className="text-green-700 text-center animate-bounce">Success, login!</small>
      )}

      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <select
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="gender"
        value={gender}
        onChange={(event) => setGender(event.target.value)}
        required
      >
        <option value="">Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>

      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="dob"
        type="date"
        placeholder="Date of Birth"
        value={dob}
        onChange={(event) => setDob(event.target.value)}
        required
      />

      <select
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="maritalStatus"
        value={maritalStatus}
        onChange={(event) => setMaritalStatus(event.target.value)}
        required
      >
        <option value="">Select Marital Status</option>
        <option value="SINGLE">Single</option>
        <option value="MARRIED">Married</option>
        <option value="DIVORCED">Divorced</option>
        <option value="WIDOWED">Widowed</option>
      </select>

      <select
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id='nationality'
        value={nationality}
        onChange={(event) => setNationality(event.target.value)}
        required
      >
        <option value="" disabled>Select a country</option>
        {countryList.map((country, index) => (
          <option key={index} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      <button type="submit" className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 rounded-lg bg-slate-900 text-white">
        Update
      </button>
    </form>
  );
}

export default Form;
