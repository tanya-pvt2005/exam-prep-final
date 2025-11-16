import React from 'react'

const Input = () => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2 rounded-lg bg-white/40 backdrop-blur-md border
          border-white/40 shadow-inner focus:outline-none focus:ring-2
          focus:ring-blue-400 transition-all"
      />
    </div>
  )
}

export default Input
