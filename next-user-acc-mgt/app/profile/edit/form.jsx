"use client"
import Link from 'next/link'
import { useState } from 'react'
import countryList from './countries.json'
import moment from 'moment'

const Form = ({ error, updateUser, profile, setProfile }) => {

  const [errorP, setErrorP] = useState(error)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Call function to update user
    const response = await updateUser(firstName, lastName, gender, dob, maritalStatus, nationality)

    if (response) {
      setErrorP('')
      setSuccess(true)
      setLoading(false)
    } else {
      setSuccess(false)
      setErrorP('Error updating user profile')
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
        <small className="text-green-700 text-center animate-bounce">Success, updating profile!</small>
      )}

      {console.log("Profile to display is:", profile)}

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
        onChange={(e) => setProfile({...profile, gender: e.target.value})}
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
        value={profile && profile.dob ? moment(new Date(profile.dob)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
        onChange={(e) => setProfile({
          ...profile,
          dob: moment(new Date(e.target.value)).format('YYYY-MM-DD')
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
