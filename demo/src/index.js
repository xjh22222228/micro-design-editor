import React, { Component } from 'react';
import 'zent/css/index.css';
import '../../src/styles/index.scss';
import './styles/index.scss';
import { render } from 'react-dom';
import { Button } from 'zent';
import Design from '../../src';
import configConf from './components/config';
import ConfigEditor from './components/config/ConfigEditor';
import whitespaceConf from './components/whitespace';
import lineConf from './components/line';
import imageAdConf from './components/image-ad';

const groupedComponents = [
  Object.assign({}, configConf, {
    // 是否可以拖拽
    dragable: false,

    // 是否出现在底部的添加组件区域
    appendable: false,

    // 是否可以编辑，UMP里面有些地方config是不能编辑的
    // editable: true,

    configurable: false,

    highlightWhenSelect: false,
  }),

  Design.group('基础'),
  imageAdConf,

  Design.group('其他'),
  Object.assign({ limit: 1 }, whitespaceConf),
  lineConf,
];

class Demo extends Component {
  state = {
    value: [
      {
        type: configConf.type,
        ...ConfigEditor.getInitialValue(),
      }
    ],
    settings: {
      previewBackground: '#fff'
    },
    id: Date.now()
  };

  onChange = newValue => {
    this.setState({
      value: newValue,
    });
  };

  onSettingsChange = newSettings => {
    this.setState({
      settings: newSettings,
    });
  };

  handleReplace = () => {
    this.setState({
      value: [
        {
          "type": "config",
          "title": "刷新数据",
          "color": "#f00",
          "description": ""
        }
      ],
      id: Date.now()
    });
  }

  saveDesign = instance => {
    this.design = instance && instance.getDecoratedComponentInstance();
  };

  triggerDesignValidation() {
    return this.design.validate();
  }

  submit = () => {
    this.triggerDesignValidation()
    .then(() => {
      const data = this.state.value;
      console.log(JSON.stringify(data, null, 2));
      // submit this.state.value to server
      this.design.markAsSaved();
      alert('保存成功');
    })
    .catch(validations => {
      console.log(validations);
    });
  }

  render() {
    const PageHeader = (
      <div className="design-page-header">
        <div className="design-page-header__go-back">返回微页面</div>
        <div>
          <Button type="primary" onClick={this.submit}>上架</Button>
          <Button onClick={this.handleReplace}>请求新数据</Button>
        </div>
      </div>
    );

    return (
      <Design
        id={this.state.id}
        ref={this.saveDesign}
        cache
        cacheId="micro-design-editor"
        confirmUnsavedLeave={false}
        components={groupedComponents}
        value={this.state.value}
        onChange={this.onChange}
        settings={this.state.settings}
        onSettingsChange={this.onSettingsChange}
        scrollTopOffset={-270}
        globalConfig={window._global}
        pageHeader={PageHeader}
      >
        <div></div>
      </Design>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
