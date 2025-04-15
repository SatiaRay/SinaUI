import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const PersonnelList = () => {
  const [personnel, setPersonnel] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    role_id: '',
    phone: '',
    email: ''
  });
  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [personnelResponse, rolesResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/personnel', { headers }),
        axios.get('http://localhost:8000/api/roles', { headers })
      ]);
      
      setPersonnel(personnelResponse.data || []);
      setRoles(rolesResponse.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleViewPerson = (person) => {
    setSelectedPerson(person);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPerson(null);
  };

  const handleEditClick = (person) => {
    setSelectedPerson(person);
    setEditFormData({
      name: person.name,
      role_id: person.role_id,
      phone: person.phone || '',
      email: person.email || ''
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
      
      const response = await axios.put(
        `http://localhost:8000/api/personnel/${selectedPerson.id}`,
        editFormData,
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating personnel:', error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedPerson(null);
    setEditFormData({
      name: '',
      role_id: '',
      phone: '',
      email: ''
    });
  };

  const handleDeleteClick = (person) => {
    setSelectedPerson(person);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPerson(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/personnel/${selectedPerson.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting personnel:', error);
      const errorMessage = error.response?.data?.message || 'خطا در حذف پرسنل';
      alert(errorMessage);
      setDeleteDialogOpen(false);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'بدون سمت';
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:8000/api/personnel/${selectedPerson.id}/change-password`,
        passwordFormData,
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Password change response:', response.data);
      setShowPasswordForm(false);
      setPasswordFormData({
        password: '',
        password_confirmation: ''
      });
      alert('رمز عبور با موفقیت تغییر کرد');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('خطا در تغییر رمز عبور');
    }
  };

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/personnel/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'personnel_list.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('خطا در دریافت فایل CSV');
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
        {/* Add Personnel Button and Excel Export Button */}
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => navigate('/personnel/create')}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ثبت پرسنل
          </button>
          <button
            onClick={handleExportExcel}
            className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            دریافت اکسل
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">سمت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تلفن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ایمیل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {personnel.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {person.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {getRoleName(person.role_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {person.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {person.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-start gap-4">
                      <button
                        onClick={() => handleViewPerson(person)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(person)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPerson(person);
                          setDeleteDialogOpen(true);
                        }}
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
            {personnel.map((person) => (
              <div key={person.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">نام:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{person.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">سمت:</span>
                    <span className="text-gray-900 dark:text-gray-100">{getRoleName(person.role_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">تلفن:</span>
                    <span className="text-gray-900 dark:text-gray-100">{person.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">ایمیل:</span>
                    <span className="text-gray-900 dark:text-gray-100">{person.email || '-'}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => handleViewPerson(person)}
                    className="flex items-center text-blue-600 dark:text-blue-400"
                  >
                    <EyeIcon className="h-5 w-5 ml-1" />
                    <span>مشاهده</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(person)}
                    className="flex items-center text-yellow-600 dark:text-yellow-400"
                  >
                    <PencilIcon className="h-5 w-5 ml-1" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPerson(person);
                      setDeleteDialogOpen(true);
                    }}
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

      {/* View Dialog */}
      {viewDialogOpen && selectedPerson && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseViewDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جزئیات پرسنل</h2>
              <button
                onClick={handleCloseViewDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">نام</label>
                  <div className="input bg-gray-50">{selectedPerson.name}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">سمت</label>
                  <div className="input bg-gray-50">{getRoleName(selectedPerson.role_id)}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">تلفن</label>
                  <div className="input bg-gray-50">{selectedPerson.phone || '-'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">ایمیل</label>
                  <div className="input bg-gray-50">{selectedPerson.email || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseEditDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ویرایش پرسنل</h2>
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
                <label className="form-label">سمت</label>
                <select
                  name="role_id"
                  value={editFormData.role_id}
                  onChange={handleEditFormChange}
                  className="input"
                >
                  <option value="">انتخاب سمت</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">تلفن</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {showPasswordForm ? 'انصراف تغییر رمز عبور' : 'تغییر رمز عبور'}
                </button>

                {showPasswordForm && (
                  <div className="mt-4 space-y-4">
                    <div className="form-group">
                      <label className="form-label">رمز عبور جدید</label>
                      <input
                        type="password"
                        name="password"
                        value={passwordFormData.password}
                        onChange={handlePasswordChange}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">تکرار رمز عبور</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={passwordFormData.password_confirmation}
                        onChange={handlePasswordChange}
                        className="input"
                      />
                    </div>

                    <button
                      onClick={handlePasswordSubmit}
                      className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                    >
                      ذخیره رمز عبور
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedPerson(selectedPerson);
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
      {deleteDialogOpen && selectedPerson && (
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
                آیا از حذف {selectedPerson.name} اطمینان دارید؟
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

export default PersonnelList; 