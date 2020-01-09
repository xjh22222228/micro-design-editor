import React from 'react';
import { Input } from 'zent';
import { DesignEditor, ControlGroup } from 'micro-design-editor/es/editor/DesignEditor';
import { PLACEHOLDER } from './constants';

export default class Editor extends DesignEditor {

  static designType = 'search';
  static designDescription = '搜索';
  static getInitialValue(settings, globalConfig) {
    return {
      placeholder: ''
    };
  }

  static validate() {
    return new Promise(resolve => {
      // 一旦传入对象即抛出异常
      resolve();
    });
  }

  render() {
    const { value, showError, validation, onChange } = this.props;

    return (
      <div>
        <ControlGroup
          label="占位符:"
          required
          showError={showError || this.getMetaProperty('placeholder', 'touched')}
          error={validation.placeholder}
        >
          <Input
            name="placeholder"
            placeholder={PLACEHOLDER}
            value={value.placeholder}
            onChange={e => onChange({ placeholder: e.target.value })}
            onBlur={this.onInputBlur}
            maxLength={50}
          />
        </ControlGroup>
      </div>
    );
  }
}
