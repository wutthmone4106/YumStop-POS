import React from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';

const BackButton = () => {

    const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} className="bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] text-[#f5f5f5] p-2 font-bold rounded-lg">
        <IoArrowBackOutline />
      </button>
    </div>
  )
}

export default BackButton
