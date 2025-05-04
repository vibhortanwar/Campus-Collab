import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
<div className="flex items-center justify-center mt-12 text-center">
  <div>
    <div className="text-xl text-[#123458] font-semibold mb-2">Looking for Something?</div>
    <div className="mb-4 text-gray-600">
      We're sorry. The Web address you entered is not a functioning page on our site.
    </div>
    <div className='text-[#123458]'>
      <span>Go to </span>
      <Link to="/" className="text-blue-500 hover:underline">Home</Link>
      <span> page</span>
    </div>
  </div>
</div>

  )
}

export default ErrorPage
