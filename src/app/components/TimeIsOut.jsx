import React from 'react'
import Link from 'next/link'

const TimeIsOut = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-white-100 text-gray-700 border border-gray-300 rounded-md shadow-md max-w-md mx-auto mt-10 mb-10">
    <p className="mb-4">You have unsuccessfully ordered in time.</p>
    <p className="mb-4">Please try again</p>
    <Link href="../ticket-frontpage">
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
        Retry
      </button>
    </Link>
  </div>
  )
}

export default TimeIsOut;
