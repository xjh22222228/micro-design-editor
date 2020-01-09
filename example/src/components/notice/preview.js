import React from 'react';
import { Alert } from 'zent';

const Preview = function ({ value }) {

  return (
    <div className="design-notice-preview">
      <Alert>
        <span>{ value.content }</span>
        <a href="https://github.com/xjh22222228/micro-design-editor" rel="noopener noreferrer" target="_blank">
          文字链接
        </a>
      </Alert>
    </div>
  )
};

export default React.memo(Preview);
