import Tagify from '@yaireo/tagify';
import { useEffect, useRef, useState } from 'react';

export const TagifyInput = ({
  defaultValue = '',
  whitelist,
  onChange,
}) => {
  /**
   * Tag input ref
   */
  const tagInputRef = useRef(null);

  const [tagify, setTagify] = useState(null)

  /**
   * Mount Tagify
   */
  useEffect(() => {
    if(!tagify)
        setTagify(new Tagify(tagInputRef.current))
  }, []);

  /**
   * Set event handlers
   */
  useEffect(() => {
    if(tagify)
        tagify.on('change', (e) => onChange(e));
  }, [tagify])

  return (
    <input
      type="text"
      defaultValue={defaultValue}
      ref={tagInputRef}
      className="w-full px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      placeholder="تگ ها"
    />
  );
};

