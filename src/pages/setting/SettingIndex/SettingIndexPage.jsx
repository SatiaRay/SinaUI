import { useCallback, useState } from 'react';
import { notify } from '../../../ui/toast';
import { Export } from '@components/Setting/export';
import SettingsForm from '@components/Setting/form';
import { Import } from '@components/Setting/import';
import {
  useGetSettingsSchemaQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../../store/api/SystemApi';
import SettingIndexLoading from './SettingIndexLoading';

const Setting = () => {
  const [loading, setLoading] = useState(false);

  const {
    data: schemaData,
    isLoading: schemaLoading,
    error: schemaError,
  } = useGetSettingsSchemaQuery();

  const {
    data: settingsData,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useGetSettingsQuery();

  const [updateSettings, { isLoading: updateLoading }] =
    useUpdateSettingsMutation();

  const settingsSchema = schemaData?.schema;
  const currentSettings = settingsData || {};

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const response = await updateSettings(data).unwrap();

        if (response) {
          notify.success('تنظیمات با موفقیت ذخیره شد!');
          await refetchSettings();
        }
      } catch (error) {
        notify.error(
          `خطا در ذخیره تنظیمات: ${error.data?.message || error.message}`
        );
      } finally {
        setLoading(false);
      }
    },
    [updateSettings, refetchSettings]
  );

  const isLoading =
    schemaLoading || settingsLoading || updateLoading || loading;
  const error = schemaError || settingsError;

  if (isLoading) {
    return <SettingIndexLoading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>خطا در بارگذاری تنظیمات. لطفاً مجدداً تلاش کنید.</p>
      </div>
    );
  }

  return (
    <section className="flex px-4 py-12 gap-10 h-screen overflow-hidden items-center justify-center text-black dark:text-white w-full">
      <main className="md:w-[40%] w-full flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full h-full">
          {settingsSchema ? (
            <SettingsForm
              schema={settingsSchema}
              initialValues={currentSettings}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          ) : null}
        </div>

        <div className="w-full flex items-center justify-center pt-4 border-t gap-4 border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row w-full items-center justify-center gap-3">
            <Export />
            <Import />
          </div>
        </div>
      </main>
    </section>
  );
};

export default Setting;
