import React from 'react';
import { Input } from 'zent';
import { DesignEditor, ControlGroup } from 'micro-design-editor/es/editor/DesignEditor';

export default class Editor extends DesignEditor {
  render() {
    const { value, showError, validation } = this.props;

    return (
      <div className="zent-design-component-config-editor">
        <ControlGroup
          showError={showError || this.getMetaProperty('title', 'touched')}
          error={validation.title}
          required
          label="页面标题:"
        >
          <Input
            value={value.title}
            onChange={this.onInputChange}
            onBlur={this.onInputBlur}
            name="title"
          />
        </ControlGroup>
      </div>
    );
  }

  static designType = 'navigationBar';
  static designDescription = '页面标题';
  static getInitialValue() {
    return {
      title: '标题'
    };
  }

  static validate({ title }) {
    return new Promise(resolve => {
      const errors = {};
      if (!title || !title.trim()) {
        errors.title = '请填写页面标题';
      } else if (title.length > 10) {
        errors.title = '页面标题长度不能多于 10 个字';
      }

      resolve(errors);
    });
  }
}
