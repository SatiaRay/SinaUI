import React, { useState } from 'react';

const NodeDetails = ({ node, onUpdate, onClose, onDelete }) => {
  const [details, setDetails] = useState({
    label: node.data.label || '',
    description: node.data.description || '',
    connections: node.data.connections || [],
    conditions: node.data.conditions || []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(node.id, details);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  const addConnection = () => {
    setDetails(prev => ({
      ...prev,
      connections: [...prev.connections, { targetId: '', label: '' }]
    }));
  };

  const removeConnection = (index) => {
    setDetails(prev => ({
      ...prev,
      connections: prev.connections.filter((_, i) => i !== index)
    }));
  };

  const updateConnection = (index, field, value) => {
    setDetails(prev => ({
      ...prev,
      connections: prev.connections.map((conn, i) => 
        i === index ? { ...conn, [field]: value } : conn
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          ویرایش {node.type === 'start' ? 'شروع' : 
                  node.type === 'process' ? 'فرآیند' : 
                  node.type === 'decision' ? 'تصمیم' : 'پایان'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              عنوان
            </label>
            <input
              type="text"
              value={details.label}
              onChange={(e) => setDetails(prev => ({ ...prev, label: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              توضیحات
            </label>
            <textarea
              value={details.description}
              onChange={(e) => setDetails(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
            />
          </div>

          {node.type === 'decision' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                شرایط
              </label>
              <div className="space-y-2">
                {details.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...details.conditions];
                        newConditions[index] = e.target.value;
                        setDetails(prev => ({ ...prev, conditions: newConditions }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="شرط تصمیم"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newConditions = details.conditions.filter((_, i) => i !== index);
                        setDetails(prev => ({ ...prev, conditions: newConditions }));
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setDetails(prev => ({ ...prev, conditions: [...prev.conditions, ''] }))}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + افزودن شرط
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              اتصالات
            </label>
            <div className="space-y-2">
              {details.connections.map((connection, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={connection.targetId}
                    onChange={(e) => updateConnection(index, 'targetId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="شناسه نود مقصد"
                  />
                  <input
                    type="text"
                    value={connection.label}
                    onChange={(e) => updateConnection(index, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="برچسب اتصال"
                  />
                  <button
                    type="button"
                    onClick={() => removeConnection(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addConnection}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + افزودن اتصال
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              حذف
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              تایید حذف
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              آیا از حذف این {node.type === 'start' ? 'شروع' : 
                            node.type === 'process' ? 'فرآیند' : 
                            node.type === 'decision' ? 'تصمیم' : 'پایان'} اطمینان دارید؟
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetails; 