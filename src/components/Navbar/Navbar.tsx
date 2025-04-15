import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOilMenuOpen, setIsOilMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            لوگو
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setIsOilMenuOpen(!isOilMenuOpen)}
              className="flex items-center gap-2 hover:text-gray-200"
            >
              انواع روغن
              <svg
                className={`w-4 h-4 transition-transform ${
                  isOilMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOilMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1">
                <Link
                  to="/chat"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  چت
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/chat"
            className="flex items-center gap-2 text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            چت
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 