import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomDropdown from '../../../ui/dropdown';
import {
  useGetInstructionQuery,
  useUpdateInstructionMutation,
} from '../../../store/api/instructionApi';
import EditInstructionLoading from './EditInstructionLoading';
import Error from '../InstructionError';

/**
 * Show skeleton only on first fetch
 */
let __EDIT_INSTRUCTION_FIRST_FETCH_DONE__ = false;

const EditInstructionPage = () => {
  /**
   * Navigator & route params
   */
  const navigate = useNavigate();
  const { id } = useParams();

  /**
   * Local form state
   */
  const [formData, setFormData] = useState({
    label: '',
    text: '',
    agent_type: '',
    status: 1,
  });

  /**
   * Legacy local ui states 
   */
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * fetch & update
   */
  const {
    data: instruction,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
    refetch, 
  } = useGetInstructionQuery(
    { id },
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const [
    updateInstruction,
    { isLoading: isUpdating, isError: isUpdateError, error: updateError, reset },
  ] = useUpdateInstructionMutation();

  /**
   * Skeleton one-time gate
   */
  const [showSkeleton, setShowSkeleton] = useState(
    !__EDIT_INSTRUCTION_FIRST_FETCH_DONE__
  );
  const hasEverLoadedRef = useRef(__EDIT_INSTRUCTION_FIRST_FETCH_DONE__);

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching]);

  /**
   * Fill form with fetched data on first load
   */
  useEffect(() => {
    if (instruction) {
      setFormData({
        label: instruction.label || '',
        text: instruction.text || '',
        agent_type: instruction.agent_type || '',
        status: Number(instruction.status ?? 1),
      });
    }
  }, [instruction]);

  /**
   * Handle fetch error 
  */
  useEffect(() => {
    if (isFetchError) {
      setError('خطا در دریافت اطلاعات دستورالعمل');
      setLoading(false);
      setShowSkeleton(false);
      hasEverLoadedRef.current = true;
      __EDIT_INSTRUCTION_FIRST_FETCH_DONE__ = true;
    }
  }, [isFetchError]);

  /**
   * Show Skeleton when data arrives
   */
  useEffect(() => {
    if (!hasEverLoadedRef.current) {
      if (!instruction || !instruction.id) {
        setShowSkeleton(true);
        return;
      }
      setShowSkeleton(false);
      hasEverLoadedRef.current = true;
      __EDIT_INSTRUCTION_FIRST_FETCH_DONE__ = true;
    } else {
      setShowSkeleton(false);
    }
  }, [instruction]);

  /**
   * Form change handler
   */
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value,
    }));
  };

  /**
   * Submit handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateInstruction({ id, data: formData }).unwrap();
      navigate('/instructions');
    } catch (err) {
      setError('خطا در بروزرسانی دستورالعمل');
      setSaving(false);
    }
  };

  /**
   * Display skeleton only on first fetch
   */
  if (showSkeleton && !hasEverLoadedRef.current) {
    return (
      <div className="transition-opacity duration-500 opacity-100">
        <EditInstructionLoading />
      </div>
    );
  }

  /**
   * Preserve original loading fallback
   */
  if (loading) return <div className="p-4">در حال بارگذاری...</div>;

  return (
    <div className="p-4 max-md:pt-10 w-full">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">ویرایش دستورالعمل</h1>
        {(error || fetchError) && (
          <div className="mb-4">
            <Error
              message={error || fetchError?.data?.message}
              defaultMessage="خطایی در دریافت اطلاعات دستورالعمل رخ داده است."
              reset={() => {
                setError(null);
                refetch();
              }}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              برچسب
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              متن
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="w-full flex justify-center gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نوع ربات
              </label>
              <CustomDropdown
                options={[
                  { value: 'both', label: 'همه' },
                  { value: 'text_agent', label: 'ربات متنی' },
                  { value: 'voice_agent', label: 'ربات صوتی' },
                ]}
                value={formData.agent_type}
                onChange={(val) => handleChange('agent_type', val)}
                placeholder="انتخاب کنید"
                className="w-full"
                parentStyle="w-full"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                وضعیت
              </label>
              <CustomDropdown
                options={[
                  { value: 1, label: 'فعال' },
                  { value: 0, label: 'غیرفعال' },
                ]}
                value={formData.status}
                onChange={(val) => handleChange('status', val)}
                placeholder="انتخاب وضعیت"
                className="w-full"
                parentStyle="w-full"
              />
            </div>
          </div>
          {isUpdateError && (
            <div className="p-2">
              <Error
                message={updateError?.data?.message}
                defaultMessage="خطایی در بروزرسانی دستورالعمل رخ داده است."
                reset={() => reset()}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate('/instructions')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving || isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving || isUpdating ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInstructionPage;