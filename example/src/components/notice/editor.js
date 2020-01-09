import React from 'react';
import { Input } from 'zent';
import { DesignEditor, ControlGroup } from 'micro-design-editor/es/editor/DesignEditor';

export default class Editor extends DesignEditor {

  static designType = 'notice';
  static designDescription = '公告';
  static getInitialValue() {
    return {
      content: '通知提示文案'
    };
  }

  static validate() {
    return new Promise(resolve => {
      resolve();
    });
  }

  render() {
    const { value } = this.props;

    return (
      <div>
        <ControlGroup
          label="提示文案:"
        >
          <Input
            type="text"
            name="content"
            value={value.content}
            onChange={this.onInputChange}
          />
        </ControlGroup>
      </div>
    );
  }
}
