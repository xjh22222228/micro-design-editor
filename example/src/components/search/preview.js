import React from 'react';
import { Input } from 'zent';
import { PLACEHOLDER } from './constants';

const Preview = function (props) {
  const { value } = props;

  return (
    <div className="design-search-preview">
      <Input
        placeholder={value.placeholder || PLACEHOLDER}
        style={{ width: '100%' }}
        readOnly
        icon="search"
      />
    </div>
  )
};

export default React.memo(Preview);
