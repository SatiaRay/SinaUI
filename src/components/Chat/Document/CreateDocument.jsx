import React, { useState, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { documentEndpoints } from "../../../utils/apis";
import CustomDropdown from "../../../ui/dropdown";
import { notify } from "../../../ui/toast";

const AGENT_TYPES = [
  { value: "text_agent", label: "ربات متن" },
  { value: "voice_agent", label: "ربات صوتی" },
  { value: "both", label: "هر دو" },
];

const CreateDocument = ({ onClose }) => {
  const [form, setForm] = useState({
    title: "",
    text: "",
    agentType: "text_agent", // Set default value to match one of the AGENT_TYPES values
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
  });

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.title.trim() || !form.text.trim()) {
        setStatus({ loading: false, error: "لطفاً عنوان و متن را وارد کنید." });
        return;
      }

      setStatus({ loading: true, error: null });

      try {
        const { status: apiStatus } = await documentEndpoints.addDocumentManually({
          text: form.text,
          agent_type: form.agentType,
          metadata: { source: "manual", title: form.title },
        });

        if (apiStatus === "success") {
          notify.success("اطلاعات با موفقیت ذخیره شد");
          setForm({ title: "", text: "", agentType: "text_agent" });
          onClose();
        } else {
          throw new Error("خطا در ذخیره اطلاعات");
        }
      } catch (err) {
        setStatus({ loading: false, error: err.message });
        console.error("خطا در ذخیره سند:", err);
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    },
    [form, onClose]
  );

  /** ثبت با Enter */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow w-full mx-auto max-h-[90vh] flex flex-col">
      <div className="p-4 sm:p-6 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
          ایجاد سند جدید
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="w-full flex gap-2">
            <div className="w-1/2 flex flex-col gap-1">
              <label htmlFor="title" className="block dark:text-white text-sm font-medium mb-1">
                عنوان
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="عنوان سند را وارد کنید"
                className="w-full px-3 h-10 border rounded-lg shadow-sm bg-transparent dark:border-white"
                required
              />
            </div>

            <div className="w-1/2 flex flex-col gap-1">
              <label htmlFor="agentType" className="block dark:text-white text-sm font-medium mb-1">
                نوع ربات
              </label>
              <CustomDropdown
                options={AGENT_TYPES}
                value={form.agentType}
                onChange={(value) => handleChange("agentType", value)}
                placeholder="نوع ربات را انتخاب کنید"
                className="h-10"
                parentStyle="w-full"
              />
            </div>
          </div>


          <div className="flex flex-col gap-1">
            <label htmlFor="text" className="block dark:text-white text-sm font-medium mb-1">
              متن
            </label>
            <div className="min-h-[200px] max-h-[30vh] overflow-auto p-3 border rounded-lg">
              <CKEditor
                editor={ClassicEditor}
                data={form.text}
                onChange={(event, editor) => handleChange("text", editor.getData())}
                config={{
                  language: "fa",
                  direction: "rtl",
                  toolbar: {
                    items: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "outdent",
                      "indent",
                      "|",
                      "insertTable",
                      "undo",
                      "redo",
                    ],
                  },
                  table: {
                    contentToolbar: [
                      "tableColumn",
                      "tableRow",
                      "mergeTableCells",
                      "tableProperties",
                      "tableCellProperties",
                    ],
                    defaultProperties: {
                      borderWidth: "1px",
                      borderColor: "#ccc",
                      borderStyle: "solid",
                      alignment: "right",
                    },
                  },
                  htmlSupport: {
                    allow: [
                      { name: "table", attributes: true, classes: true, styles: true },
                      { name: "tr", attributes: true, classes: true, styles: true },
                      { name: "td", attributes: true, classes: true, styles: true },
                      { name: "th", attributes: true, classes: true, styles: true },
                    ],
                  },
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

          </div>

          {/* پیام خطا */}
          {status.error && (
            <div className="text-red-500 text-sm text-center">{status.error}</div>
          )}
        </form>
      </div>

      {/* دکمه ثبت */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 sm:p-6 flex-shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status.loading}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {status.loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              در حال ذخیره...
            </>
          ) : (
            "ذخیره سند"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateDocument;