import React from 'react'

const Footer = () => {
  return (
      <footer className="backdrop-blur-md border-t border-white/40 mt-10">
      <div className="container mx-auto px-4 py-4 text-center text-white">
        © {new Date().getFullYear()} ExamPrep Platform — All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
