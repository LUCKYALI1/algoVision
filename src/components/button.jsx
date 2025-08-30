import React from 'react'

function button(props) {
  return (
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
           {props.text}
          </button>
     
  )
}

export default button
