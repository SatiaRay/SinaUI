import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XMarkIcon, PencilIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * کامپوننت نمایش و ویرایش دسترسی‌های نقش‌ها
 * این کامپوننت یک ماتریس از نقش‌ها و مجوزها را نمایش می‌دهد
 * و امکان ویرایش مجوزهای هر نقش را فراهم می‌کند
 */
const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [savingRoleId, setSavingRoleId] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // فیلتر کردن مجوزها براساس عبارت جستجو
    if (permissionSearchTerm.trim() === '') {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(permission => 
        (permission.display_name || permission.name).toLowerCase().includes(permissionSearchTerm.toLowerCase())
      );
      setFilteredPermissions(filtered);
    }
  }, [permissionSearchTerm, permissions]);

  useEffect(() => {
    // فیلتر کردن نقش‌ها براساس نقش انتخاب شده
    if (selectedRole === null) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(role => role.id === selectedRole);
      setFilteredRoles(filtered);
    }
  }, [selectedRole, roles]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch roles first
      const rolesResponse = await axios.get('http://localhost:8000/api/roles', { headers });
      setRoles(rolesResponse.data || []);
      setFilteredRoles(rolesResponse.data || []);
      
      // Try to fetch permissions
      try {
        const permissionsResponse = await axios.get('http://localhost:8000/api/permissions', { headers });
        setPermissions(permissionsResponse.data || []);
        setFilteredPermissions(permissionsResponse.data || []);
      } catch (permError) {
        console.error('Error fetching permissions:', permError);
        setError('خطا در دریافت لیست مجوزها. لطفاً با مدیر سیستم تماس بگیرید.');
        setPermissions([]);
        setFilteredPermissions([]);
      }

      // Fetch role permissions
      const rolePermissionsData = {};
      for (const role of rolesResponse.data) {
        try {
          const response = await axios.get(`http://localhost:8000/api/roles/${role.id}/permissions`, { headers });
          rolePermissionsData[role.id] = response.data || [];
        } catch (error) {
          console.error(`Error fetching permissions for role ${role.id}:`, error);
          rolePermissionsData[role.id] = [];
        }
      }
      setRolePermissions(rolePermissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('خطا در دریافت اطلاعات. لطفاً صفحه را رفرش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (roleId, permissionId) => {
    if (editingRoleId === roleId) {
      return tempPermissions[roleId]?.includes(permissionId) || false;
    }
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

  const startEditing = (roleId) => {
    setEditingRoleId(roleId);
    setTempPermissions({
      ...tempPermissions,
      [roleId]: [...(rolePermissions[roleId] || [])]
    });
  };

  const togglePermission = (roleId, permissionId) => {
    if (editingRoleId !== roleId) return;

    const currentPermissions = tempPermissions[roleId] || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];

    setTempPermissions({
      ...tempPermissions,
      [roleId]: newPermissions
    });
  };

  const savePermissions = async (roleId) => {
    try {
      setSavingRoleId(roleId);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      await axios.put(
        `http://localhost:8000/api/roles/${roleId}/permissions`,
        { permissions: tempPermissions[roleId] },
        { headers }
      );

      setRolePermissions({
        ...rolePermissions,
        [roleId]: tempPermissions[roleId]
      });
      setEditingRoleId(null);
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('خطا در ذخیره مجوزها');
    } finally {
      setSavingRoleId(null);
    }
  };

  const cancelEditing = (roleId) => {
    setEditingRoleId(null);
    const newTempPermissions = { ...tempPermissions };
    delete newTempPermissions[roleId];
    setTempPermissions(newTempPermissions);
  };

  const handlePermissionSearchChange = (e) => {
    setPermissionSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectRole = (roleId) => {
    setSelectedRole(roleId);
    setIsDropdownOpen(false);
  };

  const clearRoleSelection = () => {
    setSelectedRole(null);
  };

  const getSelectedRoleName = () => {
    if (selectedRole === null) return 'همه نقش‌ها';
    const role = roles.find(r => r.id === selectedRole);
    return role ? (role.display_name || role.name) : 'همه نقش‌ها';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center text-red-500 mb-4">{error}</div>
          <div className="flex justify-center">
            <button 
              onClick={fetchData}
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">دسترسی‌های نقش‌ها</h2>
          <div className="text-center text-gray-500 dark:text-gray-400">
            هیچ مجوزی در سیستم تعریف نشده است.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">دسترسی‌های نقش‌ها</h2>
        
        {/* فیلترهای جستجو */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* جستجوی مجوزها */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="جستجوی مجوز..."
              value={permissionSearchTerm}
              onChange={handlePermissionSearchChange}
            />
          </div>
          
          {/* انتخاب نقش */}
          <div className="relative">
            <button
              type="button"
              className="relative w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm pl-3 pr-10 py-2 text-right cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              onClick={toggleDropdown}
            >
              <span className="block truncate">{getSelectedRoleName()}</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <div 
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
                  onClick={() => selectRole(null)}
                >
                  <span className="block truncate">همه نقش‌ها</span>
                </div>
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
                    onClick={() => selectRole(role.id)}
                  >
                    <span className="block truncate">{role.display_name || role.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  مجوز
                </th>
                {filteredRoles.map(role => (
                  <th key={role.id} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <span>{role.display_name || role.name}</span>
                      {editingRoleId === role.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => savePermissions(role.id)}
                            disabled={savingRoleId === role.id}
                            className="text-green-500 hover:text-green-600"
                          >
                            {savingRoleId === role.id ? '...' : 'ذخیره'}
                          </button>
                          <button
                            onClick={() => cancelEditing(role.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            لغو
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(role.id)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPermissions.map(permission => (
                <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {permission.display_name || permission.name}
                  </td>
                  {filteredRoles.map(role => (
                    <td 
                      key={`${role.id}-${permission.id}`} 
                      className="px-3 py-2 whitespace-nowrap text-center"
                      onClick={() => togglePermission(role.id, permission.id)}
                      style={{ cursor: editingRoleId === role.id ? 'pointer' : 'default' }}
                    >
                      {hasPermission(role.id, permission.id) ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions; 