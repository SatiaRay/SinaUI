import React, { useState } from 'react';
import {
  Braces,
  CirclePlay,
  Construction,
  Cpu,
  Fullscreen,
  GitPullRequest,
  Menu,
  MessageSquareShare,
  Minimize,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react';
import { useDisplay } from 'hooks/display';

const WorkflowEditorSidebar = ({
  addNode,
  setShowChatModal,
  fullscreen,
  setFullscreen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

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
        className={`absolute w-full h-full top-0 left-0 backdrop-blur-sm opacity-80 z-10 ${extended && !isDesktop ? '' : 'hidden'}`}
      ></div>

      <div
        className={`absolute left-0 top-0 z-10 bg-white dark:bg-gray-800 shadow-md overflow-x-hidden transition-all duration-300 h-full border-l border-gray-300 dark:border-gray-700 ${
          extended ? 'w-64' : 'w-16'
        }`}
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
          className={`flex flex-col md:justify-between items-stretch h-full gap-1.5 p-2 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'
          }`}
        >
          {/* Menu options  */}
          <div
            className={`grid gap-2 order-2 md:order-first ${extended ? '' : 'border-t md:border-none border-gray-300 dark:border-gray-500 pt-3 md:pt-0 mt-1'}`}
          >
            {extended && (
              <>
                <div className="items-center hidden md:flex">
                  <Menu className="pt-2 box-content" />
                  <h3 className={`text-lg my-0 pt-2 mr-2`}>منو</h3>
                </div>
                <hr className="border-gray-200 dark:border-gray-700 my-1" />
              </>
            )}

            <button
              onClick={() => addNode('start')}
              className={`${buttonStyles} bg-green-500 hover:bg-green-600 focus:ring-green-400 h-[45px] rounded-lg text-center`}
              style={{ width: extended ? '100%' : '50px' }}
              title="نقطه شروع فرایند"
            >
              <CirclePlay
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
              <Cpu
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
              <GitPullRequest
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>تصمیم</span>
            </button>
            <button
              onClick={() => addNode('function')}
              className={`${buttonStyles} bg-purple-600 hover:bg-purple-700 focus:ring-purple-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="تابع"
            >
              <Braces
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>تابع</span>
            </button>
            <button
              onClick={() => addNode('response')}
              className={`${buttonStyles} bg-gray-400 hover:bg-gray-600 focus:ring-gray-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="پاسخ"
            >
              <MessageSquareShare
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>پاسخ</span>
            </button>
            <button
              onClick={() => addNode('end')}
              className={`${buttonStyles} bg-red-500 hover:bg-red-600 focus:ring-red-400 h-[45px] rounded-lg`}
              style={{ width: extended ? '100%' : '50px' }}
              title="پایان"
            >
              <Construction
                className="w-[30px] px-0"
                style={{ margin: extended ? '0' : 'auto' }}
              />
              <span className={extended ? '' : 'hidden'}>پایان</span>
            </button>
            {/* <hr className="border-gray-200 dark:border-gray-700 my-1" />
            <button
              onClick={() => {
                setShowChatModal(true);
                setExtended(false);
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
            </button> */}
          </div>
          {/* Sidebar menu footer */}
          <div
            className={`${extended ? 'text-right flex justify-between flex-row-reverse mt-2' : 'text-center grid gap-1 md:mt-0 rounded-lg bg-gray-300 text-gray-600 dark:text-gray-300 dark:bg-gray-600 pt-2'}`}
          >
            <div>
              <button onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? <Minimize /> : <Fullscreen />}
              </button>
            </div>
            <div>
              <button onClick={() => setExtended(!extended)}>
                {extended ? <PanelLeftClose /> : <PanelLeft />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowEditorSidebar;
