import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class DesignEditorItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    disabled: false
  };

  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  render() {
    const { disabled, className } = this.props;

    return (
      <div className={cx('zent-design-editor-item', className)} ref={this.node}>
        {disabled && <div className="zent-design__disabled-mask" />}
        {this.props.children}
      </div>
    );
  }

  getBoundingBox() {
    const node = this.node.current;
    return node && node.getBoundingClientRect();
  }
}
