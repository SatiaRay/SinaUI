import React, { useState, useEffect } from 'react';
import { TagifyInput } from '../../../components/ui/tagifyInput';
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../../ui/toast';
import { useStoreDocumentMutation } from '../../../store/api/knowledgeApi';
import { ckEditorConfig } from '../../../configs';
import { Sppiner } from '../../../components/ui/sppiner';

const CreateDocumentPage
 = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Document object state prop
   */
  const [document, setDocument] = useState({
    title: "",
    text: "",
    tag: "",
  });

  /**
   * Store document request hook
   */
  const [storeDocument, { isLoading, isSuccess, isError, error }] =
    useStoreDocumentMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isSuccess) {
      notify.success('سند با موفقیت اضافه شد !');
      navigate('/document');
    }
  }, [isSuccess]);

  /**
   * Store document handler
   */
  const handleStoreDocument = () => {
    storeDocument(document);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              افزودن سند جدید
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleStoreDocument}
              disabled={false}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Sppiner size={8} /> : 'ذخیره'}
            </button>
            <Link
              to={'/document'}
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              عنوان:
            </h3>
            <input
              type="text"
              value={document.title}
              onChange={(e) =>
                setDocument({ ...document, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="عنوان سند"
            />
          </div>

          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              تگ ها:
            </h3>
            <TagifyInput
              defaultValue={document.tag}
              onChange={(e) => {
                {
                  try {
                    const tags = JSON.parse(e.target.value).map(
                      (tag) => tag.value
                    );
                    setDocument((prev) => ({ ...prev, tag: tags.join(',') }));
                  } catch {
                    setDocument((prev) => ({ ...prev, tag: e.target.value }));
                  }
                }
              }}
            />
          </div>

          <div className="my-2 md:my-3 h-1/2 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <div className="min-h-0 max-h-[900px] overflow-y-auto">
              <CKEditor
                editor={ClassicEditor}
                data={document.text ?? ''}
                onChange={(event, editor) => {
                  const value = editor.getData();
                  setDocument({ ...document, text: value });
                }}
                config={ckEditorConfig}
                style={{
                  direction: 'rtl',
                  textAlign: 'right',
                  overflow: 'auto',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentPage;
