import React, { useState, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { documentEndpoints } from "../../../utils/apis";

const AGENT_TYPES = [
  { value: "voice_text", label: "ربات متن" },
  { value: "voice_agent", label: "ربات صوتی" },
  { value: "both", label: "هر دو" },
];

const CreateDocument = ({ onClose }) => {
  const [form, setForm] = useState({
    title: "",
    text: "",
    agentType: "text_agent",
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
          alert("اطلاعات با موفقیت ذخیره شد");
          setForm({ title: "", text: "", agentType: "" });
          onClose?.();
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow w-full max-w-3xl mx-auto h-[90vh] flex flex-col">
      <div className="p-4 sm:p-6 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
          ایجاد سند جدید
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              عنوان
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="عنوان سند را وارد کنید"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="agentType" className="block text-sm font-medium mb-1">
              نوع ربات
            </label>
            <select
              id="agentType"
              value={form.agentType}
              onChange={(e) => handleChange("agentType", e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600"
            >
              {AGENT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="text" className="block text-sm font-medium mb-1">
              متن
            </label>
            <div className="min-h-[200px] max-h-[calc(90vh-200px)] overflow-y-auto">
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
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-t flex-shrink-0">
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
