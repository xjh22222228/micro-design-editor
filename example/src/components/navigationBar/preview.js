import React from 'react';

const Preview = function ({ value }) {

  return (
    <div className="zent-design-component-config-preview">
      <div className="zent-design-component-config-preview__title">
        { value.title }
      </div>
    </div>
  )
};

export default React.memo(Preview);
