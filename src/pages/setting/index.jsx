import axios from 'axios';
import { useEffect, useState } from 'react';
import { notify } from "../../ui/toast";
import { Export } from "./export";
import SettingsForm from "./form";
import { Import } from "./import";

const Setting = () => {
  const [settingsSchema, setSettingsSchema] = useState(null);
  const [currentSettings, setCurrentSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [schemaResponse, settingsResponse] = await axios.all([
          axios.get('/system/settings-schema'),
          axios.get('/system/settings')
        ]);
        console.log("Schema from backend:", schemaResponse.data);  // ✅ log schema
        console.log("Current settings from backend:", settingsResponse.data);

        setSettingsSchema(schemaResponse.data.schema);
        setCurrentSettings(settingsResponse.data);
      } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error);
        setError('خطا در بارگذاری تنظیمات. لطفاً مجدداً تلاش کنید.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/system/settings', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        notify.success('تنظیمات با موفقیت ذخیره شد!');
        const settingsResponse = await axios.get('/system/settings');
        setCurrentSettings(settingsResponse.data);
      }
    } catch (error) {
      notify.error(`خطا در ذخیره تنظیمات: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex px-4 py-12 gap-10 h-screen overflow-hidden items-center justify-center text-black dark:text-white">
      <main className="md:w-[40%] w-full flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>در حال بارگذاری فرم تنظیمات...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : settingsSchema ? (
            <SettingsForm
              schema={settingsSchema}
              initialValues={currentSettings}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          ) : null}
        </div>

        <div className="w-full flex items-center justify-center pt-4 border-t gap-4 border-gray-300 dark:border-gray-700">
          <Export />
          <Import />
        </div>
      </main>
    </section>
  );
};

export default Setting;
