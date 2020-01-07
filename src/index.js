import Design from './DesignWithDnd';
import DesignWithoutDnd from './Design';
import { createGroup } from './utils/component-group';

Design.group = createGroup;
Design.DesignWithoutDnd = DesignWithoutDnd;

export default Design;
