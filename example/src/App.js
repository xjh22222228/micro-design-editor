import React, { Component } from 'react';
import './app.css';
import 'micro-design-editor/css/index.css';
import Design from 'micro-design-editor/es/index';
import _cloneDeep from 'lodash/cloneDeep';
import navigationBarConf from './components/navigationBar';
import searchConf from './components/search';
import noticeConf from './components/notice';
import { Button, Notify } from 'zent';

const groupedComponents = [
  navigationBarConf,

  Design.group('基础'),
  searchConf,
  noticeConf,

  Design.group('其他'),
  searchConf,
];

class App extends Component {
  state = {
    value: [
      {
        type: navigationBarConf.type,
        ...navigationBarConf.editor.getInitialValue()
      }
    ]
  };

  onChange = newValue => {
    this.setState({ value: newValue });
  }

  onSettingsChange = newSettings => {
    this.setState({ settings: newSettings });
  }

  /**
   * @param {Design} instance - Design 组件的实例, 用于调用组件里的方法
   */
  saveDesign = instance => {
    this.design = instance && instance.getDecoratedComponentInstance();

    // 恢复上一次未保存数据
    const cache = this.design && this.design.readCache();
    if (Array.isArray(cache)) {
      this.setState({ value: cache });
    }
  }

  onFormSubmit = () => {
    this.design.validate()
    .then(() => {
      // 如果需要对数据处理，需要对原数据进行拷贝
      let data = _cloneDeep(this.state.value);
      const stringify = JSON.stringify(data, null, 2);
      console.log(stringify);
      // 标记为以保存状态，如果使用了缓存或者离开提示需要手动调用这个函数通知 Design 更改已经保存
      // localStorage 将被清除
      this.design.markAsSaved();
      Notify.success('保存成功');
    })
    .catch(validations => {
      Notify.warning('保存失败, 请检查配置');
    });
  }

  render() {
    return (
      <div className="design-page">
        <Design
          ref={this.saveDesign}
          cache
          cacheId="micro-design"
          confirmUnsavedLeave={false}
          components={groupedComponents}
          value={this.state.value}
          onChange={this.onChange}
          settings={this.state.settings}
          onSettingsChange={this.onSettingsChange}
          scrollTopOffset={-270}
          globalConfig={window._global}
        />
        <div className="design-bottom-action">
          <Button type="primary" onClick={this.onFormSubmit}>保存并继续</Button>
        </div>
      </div>
    );
  }
}

export default App;
