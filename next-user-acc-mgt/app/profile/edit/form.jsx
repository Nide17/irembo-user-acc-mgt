"use client"
import Link from 'next/link'
import { useState } from 'react'
import countryList from './countries.json'
import moment from 'moment'
import Loading from '../../utils/loading'

const Form = ({ error, updateUser, profile, setProfile }) => {

  // STATE VARIABLES
  const [errorP, setErrorP] = useState(error)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // DESTRUCTURE PROFILE
  const { firstName, lastName, gender, dateOfBirth, maritalStatus, nationality } = profile

  const handleSubmit = async (e) => {
    e.preventDefault()

    // SET LOADING TO TRUE
    setLoading(true)

    // CLEAR ERROR MESSAGE
    setErrorP('')

    // ATTEMPT TO UPDATE USER PROFILE
    try {
      // CALL UPDATE USER FUNCTION
      const response = await updateUser(firstName, lastName, gender, dateOfBirth, maritalStatus, nationality)

      // IF SUCCESSFUL, SET SUCCESS STATE
      if (response && response.data) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      // IF ERROR, SET ERROR STATE
      setSuccess(false)
      setErrorP('Error updating user profile')
      return error
    }

    // SET LOADING TO FALSE
    setLoading(false)
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
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}

      {errorP && (
        <div className="flex items-center justify-center h-16 mx-2 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-100">
          <p className="text-center text-red-700 text-sm">{errorP}</p>
        </div>)}

      {!loading && !errorP && success && (
        <div className="flex items-center justify-center h-10 px-2 my-4 text-center sm:my-2 rounded-lg bg-green-200">
          <p className="text-center text-green-900 text-lg">Success, updating profile!</p>
        </div>
      )}

      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        type="text"
        placeholder="First name"
        value={profile && profile.firstName ? profile.firstName : ''}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        required
      />
      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        type="text"
        placeholder="Last name"
        value={profile && profile.lastName ? profile.lastName : ''}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        required
      />
      <select
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="gender"
        value={profile && profile.gender ? profile.gender : ""}
        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
        required
      >
        <option value="">Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>

      <input
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="dateOfBirth"
        type="date"
        placeholder="Date of Birth"
        value={profile && profile.dateOfBirth ? moment(profile.dateOfBirth).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
        onChange={(e) => setProfile({
          ...profile,
          dateOfBirth: moment(e.target.value).format('YYYY-MM-DD')
        }
        )}
        required
      />

      <select
        className="w-5/6 sm:w-2/3 h-9 my-3 text-center sm:my-2 px-2 rounded-lg"
        id="maritalStatus"
        value={profile && profile.maritalStatus ? profile.maritalStatus : ''}
        onChange={(e) => setProfile({ ...profile, maritalStatus: e.target.value })}
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
        value={profile && profile.nationality ? profile.nationality : ''}
        onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
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