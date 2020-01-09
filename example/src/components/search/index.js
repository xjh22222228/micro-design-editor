import Editor from './editor';
import Preview from './preview';
import './style.scss';

export default {
  type: Editor.designType,
  editor: Editor,
  preview: Preview
};
