import React, { useState } from 'react';
import ProjectList from './components/ProjectList';
import { Menu, X } from 'lucide-react'; // Import icons for menu toggling

// Main component for the app
const App: React.FC = () => {
  // State to track the menu's open/close status
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle function to open/close the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#090b1e] text-white font-sans">
      {/* Header with menu and contact button */}
      <header className="bg-[#2b2c41] p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* name*/}
          <h1 className="text-2xl font-bold font-roboto">Your Projects</h1>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-green-400 font-roboto">AI Solutions</a></li>
              <li><a href="#" className="hover:text-green-400 font-roboto">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 font-roboto">Services</a></li>
              <li><a href="#" className="hover:text-green-400 font-roboto">Projects</a></li>
              <li><a href="#" className="hover:text-green-400 font-roboto">Reviews</a></li>
            </ul>
          </nav>

          {/* Contact button for desktop */}
          <button className="hidden md:block bg-[#2a2a38] border border-white text-white px-4 py-2 rounded-lg hover:bg-[#3a3a4d] transition duration-300 font-roboto">
            Contact
          </button>

          {/* Mobile menu toggle button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {/* Show close or menu icon based on menu state */}
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile navigation (visible only when menu is open) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav>
              <ul className="flex flex-col space-y-2">
                <li><a href="#" className="block py-2 px-4 hover:bg-[#2a2a3d] rounded font-roboto">AI Solutions</a></li>
                <li><a href="#" className="block py-2 px-4 hover:bg-[#2a2a3d] rounded font-roboto">About Us</a></li>
                <li><a href="#" className="block py-2 px-4 hover:bg-[#2a2a3d] rounded font-roboto">Services</a></li>
                <li><a href="#" className="block py-2 px-4 hover:bg-[#2a2a3d] rounded font-roboto">Projects</a></li>
                <li><a href="#" className="block py-2 px-4 hover:bg-[#2a2a3d] rounded font-roboto">Reviews</a></li>
              </ul>
            </nav>
            {/* Contact button for mobile */}
            <button className="mt-4 w-full bg-[#2a2a38] border border-white text-white px-4 py-2 rounded-lg hover:bg-[#3a3a4d] transition duration-300 font-roboto">
              Contact
            </button>
          </div>
        )}
      </header>

      {/* Main content area */}
      <main className="container mx-auto py-12">
        {/* Project list component */}
        <ProjectList />
      </main>
    </div>
  );
}

export default App;
