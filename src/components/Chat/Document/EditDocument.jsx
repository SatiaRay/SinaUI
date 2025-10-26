import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getWebSocketUrl } from '../../../utils/websocket';
import { Link, useParams } from 'react-router-dom';
import { documentEndpoints } from '../../../utils/apis';
import { useGetDocumentQuery } from '../../../store/api/knowledgeApi';
import Tagify from '@yaireo/tagify'

const EditDocument = () => {
  /**
   * Distruct document_id from uri
   */
  const { document_id } = useParams();

  /**
   * Document's title state prop
   */
  const [editedTitle, setEditedTitle] = useState('');

  /**
   * Document's text state prop
   */
  const [ckEditorContent, setCkEditorContent] = useState('');

  /**
   * Document's tag state prop
   */
  const [tag, setTag] = useState('');

  /**
   * Tag input ref
   */
  const tagInputRef = useRef(null);

  /**
   * Fetching Document data usign RTK Query hook
   */
  const { data, isSuccess, isLoading, isError, error } = useGetDocumentQuery({
    id: document_id,
  });

  /**
   * Set state props value after successful fetching
   */
  useEffect(() => {
    if (isSuccess && data) {
      setEditedTitle(data.title);
      setCkEditorContent(data.text)
      var tagify = new Tagify(tagInputRef.current)
      setTag(data.tag)
    }
  }, [isSuccess, data]);


  /**
   * CKEditor modules
   */
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  /**
   * CKEditor text formats
   */
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];


  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              محتوای سند
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={() => {}}
              disabled={false}
              className="px-4 py-2 flex items-center justify-center max-md:w-2/3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              در حال ذخیره سازی
            </button>
            <Link
              to={'/document'}
              className="px-6 py-3 max-md:w-1/3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className='my-2 md:my-3'>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              عنوان:
            </h3>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="عنوان سند"
            />
          </div>

          <div className='my-2 md:my-3'>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              تگ ها:
            </h3>
            <input
              type="text"
              value={tag}
              onChange={(e) => {
                try{
                  let tags = JSON.parse(e.target.value).map(tag => tag.value)
                  tags = tags.join(',')
                } catch{
                  setTag(e.target.value)
                }
              }}
              ref={tagInputRef}
              className="w-full px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="تگ ها"
            />
          </div>

          <div className="my-2 md:my-3 h-1/2 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <div className="min-h-0 max-h-[900px] overflow-y-auto">
              <CKEditor
                editor={ClassicEditor}
                data={ckEditorContent}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setCkEditorContent(data);
                }}
                config={{
                  language: 'fa',
                  direction: 'rtl',
                  toolbar: {
                    items: [
                      'heading',
                      '|',
                      'bold',
                      'italic',
                      'link',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'insertTable',
                      'undo',
                      'redo',
                    ],
                  },
                  table: {
                    contentToolbar: [
                      'tableColumn',
                      'tableRow',
                      'mergeTableCells',
                      'tableProperties',
                      'tableCellProperties',
                    ],
                    defaultProperties: {
                      borderWidth: '1px',
                      borderColor: '#ccc',
                      borderStyle: 'solid',
                      alignment: 'right',
                    },
                  },
                  htmlSupport: {
                    allow: [
                      {
                        name: 'table',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'tr',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'td',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'th',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                    ],
                  },
                }}
                style={{ direction: 'rtl', textAlign: 'right', overflow: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDocument;
