import Editor from './editor';
import Preview from './preview';
import './style.scss';

export default {
  type: Editor.designType,
  editor: Editor,
  preview: Preview,
  // 是否可以拖拽
  dragable: false,

  // 是否出现在底部的添加组件区域
  appendable: false,

  // 是否可以编辑，UMP里面有些地方config是不能编辑的
  editable: true,

  configurable: false,

  highlightWhenSelect: false
};
