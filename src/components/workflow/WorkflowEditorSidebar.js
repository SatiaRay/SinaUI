import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import CustomDropdown from '../../ui/dropdown';
import {
  PlayIcon,
  PlusCircleIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const WorkflowEditorSidebar = ({
  addNode,
  setShowChatModal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const buttonStyles =
    'flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-white rounded-md transition-all duration-200 hover:scale-102 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';

  return (
    <div className="absolute left-0 top-0 z-10 bg-white dark:bg-gray-800 shadow-md overflow-hidden transition-all duration-300 h-full border-r border-gray-700">
      <style>
        {`
          :root {
            --primary-bg: #F9FAFB;
            --primary-text: #1F2937;
            --accent-green: #34D399;
            --accent-blue: #4B5EAA;
            --accent-yellow: #F59E0B;
            --accent-purple: #A78BFA;
            --accent-orange: #F97316;
            --accent-red: #EF4444;
            --accent-teal: #14B8A6;
          }
          .dark {
            --primary-bg: #1F2937;
            --primary-text: #F9FAFB;
          }
        `}
      </style>
     
      <div
        className={` flex flex-col gap-1.5 p-2 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-[calc(100vh-110px)] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <button
          onClick={() => addNode('start')}
          className={`${buttonStyles} bg-[var(--accent-blue)] hover:bg-blue-600 focus:ring-blue-400 w-[50px] h-[50px] rounded-[50%] text-center px-0`}
          title='نقطه شروع فرایند'
        >
          <PlusCircleIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>شروع</span> */}
        </button>
        <button
          onClick={() => addNode('process')}
          className={`${buttonStyles} bg-[var(--accent-blue)] hover:bg-blue-600 focus:ring-blue-400 w-[50px] h-[50px] rounded-[50%]`}
          title='فرایند'
        >
          <CogIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>فرآیند</span> */}
        </button>
        <button
          onClick={() => addNode('decision')}
          className={`${buttonStyles} bg-[var(--accent-yellow)] hover:bg-yellow-600 focus:ring-yellow-400 w-[50px] h-[50px] rounded-[50%]`}
          title='تصمیم'
        >
          <QuestionMarkCircleIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>تصمیم</span> */}
        </button>
        <button
          onClick={() => addNode('function')}
          className={`${buttonStyles} bg-[var(--accent-purple)] hover:bg-purple-600 focus:ring-purple-400 w-[50px] h-[50px] rounded-[50%]`}
          title='تابع'
        >
          <CogIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>تابع</span> */}
        </button>
        <button
          onClick={() => addNode('response')}
          className={`${buttonStyles} bg-[var(--accent-orange)] hover:bg-orange-600 focus:ring-orange-400 w-[50px] h-[50px] rounded-[50%]`}
          title='پاسخ'
        >
          <QuestionMarkCircleIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>پاسخ</span> */}
        </button>
        <button
          onClick={() => addNode('end')}
          className={`${buttonStyles} bg-[var(--accent-red)] hover:bg-red-600 focus:ring-red-400 w-[50px] h-[50px] rounded-[50%]`}
          title='پایان'
        >
          <XCircleIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>پایان</span> */}
        </button>
        <hr className="border-gray-200 dark:border-gray-700 my-1" />
        <button
          onClick={() => setShowChatModal(true)}
          className={`${buttonStyles} bg-[var(--accent-teal)] hover:bg-teal-600 focus:ring-teal-400 border border-teal-400 w-[50px] h-[50px] rounded-[50%]`}
          title='اجرا'
        >
          <PlayIcon className="h-10 w-10 px-0 mx-auto" />
          {/* <span>اجرا</span> */}
        </button>
      </div>
    </div>
  );
};

export default WorkflowEditorSidebar;
