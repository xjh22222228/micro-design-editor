import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class WhitespacePreview extends PureComponent {
  static propTypes = {
    value: PropTypes.object
  };

  render() {
    const { value } = this.props;

    return (
      <div
        className={`zent-design-component-whitespace-preview`}
        style={{ height: `${value.height}px` }}
      />
    );
  }
}
