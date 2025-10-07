// src/Footer.js
import React from 'react'
import { Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <p className="mb-2">Follow us on:</p>
        <a
          href="https://github.com/bniladridas"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 flex items-center"
        >
          <Github size={24} className="mr-2" />
          GitHub
        </a>
      </div>
    </footer>
  )
}

export default Footer
