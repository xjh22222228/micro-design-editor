import Design from './DesignWithDnd';
import DesignWithoutDnd from './Design';
import { createGroup } from './utils/component-group';
import * as designEditor from './editor/DesignEditor';

Design.group = createGroup;
Design.DesignWithoutDnd = DesignWithoutDnd;

export const DesignEditor = designEditor.DesignEditor;

export const ControlGroup = designEditor.ControlGroup;

export default Design;
