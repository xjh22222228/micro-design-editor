import React from 'react';
import Slider from 'zent/es/slider';

import { DesignEditor, ControlGroup } from '../../../../src/editor/DesignEditor';

export default class WhitespaceEditor extends DesignEditor {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className={`zent-design-component-whitespace-editor`}>
        <ControlGroup
          label="空白高度:"
          className={`zent-design-component-whitespace-editor__height`}
        >
          <Slider
            min={10}
            max={100}
            value={value.height}
            onChange={value => onChange({ height: value })}
            withInput={false}
          />
          <span>{value.height} 像素</span>
        </ControlGroup>
      </div>
    );
  }

  // 组件的类型
  static designType = 'white';

  // 组件的描述
  static designDescription = (
    <span>
      辅助
      <br />
      空白
    </span>
  );

  // 添加组件时调用，用来获取新组件的初始值
  static getInitialValue() {
    return {
      height: 30,
    };
  }
}
