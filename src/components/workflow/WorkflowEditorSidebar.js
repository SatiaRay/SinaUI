import React, { useEffect, useState } from 'react';
import {
  PlayIcon,
  PlusCircleIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { useDisplay } from 'hooks/display';

const WorkflowEditorSidebar = ({ addNode, setShowChatModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Sidebar extendable state
   */
  const [extended, setExtended] = useState(false);

  /**
   * Display util hooks
   */
  const { isDesktop } = useDisplay();

  const buttonStyles =
    'flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-white rounded-md transition-all duration-200 hover:scale-102 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';

  return (
    <>
      {/* Sandbox */}
      <div
        className={`absolute w-full h-full top-0 left-0 dark:bg-gray-600 bg-gray-400 opacity-80 z-10 ${extended && !isDesktop ? '' : 'hidden'}`}
      ></div>

      <div
        className="absolute left-0 top-0 z-10 bg-white dark:bg-gray-800 shadow-md overflow-x-hidden overflow-y-auto transition-all duration-300 h-full border-r border-gray-300 dark:border-gray-700 w-auto"
        style={{ width: extended ? '250px' : 'auto' }}
      >
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

        {/* Sidebar Menu */}
        <div
          className={`flex flex-col justify-between items-stretch h-full gap-1.5 p-2 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-[calc(100vh-110px)] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Menu options  */}
          <div className="grid gap-2">
            {extended && (
              <>
                <h3 className={`text-lg my-0 pt-2 mr-1`}>منو</h3>
                <hr className="border-gray-200 dark:border-gray-700 my-1" />
              </>
            )}

            <button
              onClick={() => addNode('start')}
              className={`${buttonStyles} bg-[var(--accent-blue)] hover:bg-blue-600 focus:ring-blue-400 h-[45px] rounded-lg text-center`}
              style={{ width: extended ? '100%' : '50px' }}
              title="نقطه شروع فرایند"
            >
              <PlusCircleIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>شروع</span>
            </button>
            <button
              onClick={() => addNode('process')}
              className={`${buttonStyles} bg-[var(--accent-blue)] hover:bg-blue-600 focus:ring-blue-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="فرایند"
            >
              <CogIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>فرآیند</span>
            </button>
            <button
              onClick={() => addNode('decision')}
              className={`${buttonStyles} bg-[var(--accent-yellow)] hover:bg-yellow-600 focus:ring-yellow-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="تصمیم"
            >
              <QuestionMarkCircleIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>تصمیم</span>
            </button>
            <button
              onClick={() => addNode('function')}
              className={`${buttonStyles} bg-[var(--accent-purple)] hover:bg-purple-600 focus:ring-purple-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="تابع"
            >
              <CogIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>تابع</span>
            </button>
            <button
              onClick={() => addNode('response')}
              className={`${buttonStyles} bg-[var(--accent-orange)] hover:bg-orange-600 focus:ring-orange-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="پاسخ"
            >
              <QuestionMarkCircleIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>پاسخ</span>
            </button>
            <button
              onClick={() => addNode('end')}
              className={`${buttonStyles} bg-[var(--accent-red)] hover:bg-red-600 focus:ring-red-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="پایان"
            >
              <XCircleIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>پایان</span>
            </button>
            <hr className="border-gray-200 dark:border-gray-700 my-1" />
            <button
              onClick={() => {
                setShowChatModal(true)
                setExtended(false)
              }}
              className={`${buttonStyles} bg-[var(--accent-teal)] hover:bg-teal-600 focus:ring-teal-400 border border-teal-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="اجرا"
            >
              <PlayIcon
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>اجرا</span>
            </button>
          </div>
          {/* Sidebar menu footer */}
          <div className={extended ? 'text-right' : 'text-center'}>
            <button onClick={() => setExtended(!extended)}>
              {extended ? <PanelLeftClose /> : <PanelLeft />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowEditorSidebar;
