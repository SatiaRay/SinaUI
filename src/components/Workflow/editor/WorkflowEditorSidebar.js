import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const WorkflowEditorSidebar = ({ workflowName, setWorkflowName, workflowId, saveWorkflow, addNode, setShowChatModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <button
                onClick={toggleMenu}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                <span className="text-sm font-medium">منوی گردش کار</span>
                {isMenuOpen ? (
                    <ChevronUpIcon className="h-5 w-5" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                )}
            </button>
            <div
                className={`flex flex-col gap-2 px-4 pb-4 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
                <div className="pt-2">
                    <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نام گردش کار
                    </label>
                    <input
                        type="text"
                        id="workflow-name"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        placeholder="نام گردش کار را وارد کنید"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => saveWorkflow()}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    {workflowId ? 'بروزرسانی گردش کار' : 'ذخیره گردش کار'}
                </button>
                <button
                    onClick={() => addNode('start')}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                    افزودن شروع
                </button>
                <button
                    onClick={() => addNode('process')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    افزودن فرآیند
                </button>
                <button
                    onClick={() => addNode('decision')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                    افزودن تصمیم
                </button>
                <button
                    onClick={() => addNode('function')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                    افزودن تابع
                </button>
                <button
                    onClick={() => addNode('response')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                    افزودن پاسخ
                </button>
                <button
                    onClick={() => addNode('end')}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    افزودن پایان
                </button>
                <button
                    onClick={() => setShowChatModal(true)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                    Run
                </button>
            </div>
        </div>
    );
};

export default WorkflowEditorSidebar;