export const ckEditorConfig = {
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
};
