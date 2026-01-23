"use client"
import React from 'react'



type ButtonsProps = {
  cancelLabel: string;
  otherLabel: string;
};

const Buttons = ({ cancelLabel, otherLabel }: ButtonsProps) => {
  return (
    <div className='flex justify-center gap-4 w-full max-w-md mx-auto'>
        <button className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50">
            {cancelLabel}
        </button>

        <button className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600">
            {otherLabel}
        </button>
    </div>
  )
}

export default Buttons