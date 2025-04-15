import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    display_name: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoles(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setEditFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/roles/${selectedRole.id}`,
        editFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('خطا در بروزرسانی نقش');
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRole(null);
    setEditFormData({
      name: '',
      display_name: '',
      description: ''
    });
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/roles/${selectedRole.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting role:', error);
      const errorMessage = error.response?.data?.message || 'خطا در حذف نقش';
      alert(errorMessage);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {/* Add Role Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate('/roles/create')}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ثبت نقش
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام نمایشی</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">توضیحات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {role.display_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {role.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-start gap-4">
                      <button
                        onClick={() => handleEditClick(role)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(role)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">نام:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{role.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">نام نمایشی:</span>
                    <span className="text-gray-900 dark:text-gray-100">{role.display_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">توضیحات:</span>
                    <span className="text-gray-900 dark:text-gray-100">{role.description || '-'}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => handleEditClick(role)}
                    className="flex items-center text-yellow-600 dark:text-yellow-400"
                  >
                    <PencilIcon className="h-5 w-5 ml-1" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(role)}
                    className="flex items-center text-red-600 dark:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5 ml-1" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseEditDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ویرایش نقش</h2>
              <button
                onClick={handleCloseEditDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">نام</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">نام نمایشی</label>
                <input
                  type="text"
                  name="display_name"
                  value={editFormData.display_name}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">توضیحات</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="input"
                  rows="3"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedRole(selectedRole);
                    setDeleteDialogOpen(true);
                  }}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  حذف
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && selectedRole && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseDeleteDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">تایید حذف</h2>
              <button
                onClick={handleCloseDeleteDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                آیا از حذف نقش {selectedRole.display_name} اطمینان دارید؟
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                این عملیات غیرقابل بازگشت است.
              </p>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleCloseDeleteDialog}
                  className="btn bg-gray-500 hover:bg-gray-600 text-white"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesList; 