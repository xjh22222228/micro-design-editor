import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import DesignPreviewItem from './DesignPreviewItem';
import DesignPreviewController from './DesignPreviewController';
import DesignEditorItem from '../editor/DesignEditorItem';
import DesignEditorAddComponent from '../editor/DesignEditorAddComponent';
import uuid from '../utils/uuid';
import { isExpectedDesignType } from '../utils/design-type';
import { isGrouped } from '../utils/component-group';
import { DND_PREVIEW_CONTROLLER, DEFAULT_BACKGROUND } from './constants';
import { ADD_COMPONENT_OVERLAY_POSITION } from '../constants';
import { find, some, defaultTo, isFunction, get } from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

/**
 * DesignPreview 和 config 组件是相互关联的
 * 这个组件里的一些 props 是需要 config 组件提供的
 */
class DesignPreview extends PureComponent {
  // 此组件中的所有道具都是按设计注入的
  static propTypes = {
    className: PropTypes.string,
    design: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    settings: PropTypes.object,
    onSettingsChange: PropTypes.func,
    appendableComponents: PropTypes.array,
    showAddComponentOverlay: PropTypes.bool.isRequired,
    addComponentOverlayPosition: PropTypes.number.isRequired,
    selectedUUID: PropTypes.string,
    getUUIDFromValue: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    disabled: PropTypes.bool,

    // 处理添加按钮的回调函数
    onAdd: PropTypes.func.isRequired,

    // 添加新组件
    onAddComponent: PropTypes.func.isRequired,

    // 每个组件的实例数量
    componentInstanceCount: PropTypes.object,

    // 以下 props 由 config 组件提供
    background: PropTypes.string,
  };

  static defaultProps = {
    background: '#f9f9f9',
    disabled: false,
    appendableComponents: [],
  };

  previewItems = {};
  editorItems = {};
  editors = {};

  dispatchDragEnd = result => {
    const { type } = result;
    if (type === DND_PREVIEW_CONTROLLER) {
      this.onPreviewDragEnd(result);
      return;
    }

    // Let editors handle their dnd actions
    some(this.editors, editor => {
      if (
        isFunction(editor.shouldHandleDragEnd) &&
        editor.shouldHandleDragEnd(type)
      ) {
        isFunction(editor.onDragEnd) && editor.onDragEnd(result);
        return true;
      }

      return false;
    });
  };

  onPreviewDragEnd(result) {
    const { source, destination } = result;

    // dropped outside
    if (!destination) return;

    const { onMove } = this.props;
    onMove(source.index, destination.index);
  }

  savePreviewItem = id => instance => {
    saveRef(this.previewItems, id, instance);
  }

  saveEditorItem = id => instance => {
    saveRef(this.editorItems, id, instance);
  }

  saveEditor = id => instance => {
    saveRef(this.editors, id, instance);
  }

  scrollToItem = (id, offsets) => {
    const item = this.previewItems[id];
    if (!item) return;

    item.scrollTop(offsets);
  }

  getEditorBoundingBox(id) {
    const item = this.editorItems[id];
    if (!item) return;

    return item.getBoundingBox();
  }

  render() {
    const {
      components,
      value,
      validations,
      showError,
      settings,
      onSettingsChange,
      onComponentValueChange,
      componentInstanceCount,
      design,
      appendableComponents,
      showAddComponentOverlay,
      addComponentOverlayPosition,
      selectedUUID,
      getUUIDFromValue,
      onAddComponent,
      onSelect,
      onDelete,
      onEdit,
      onAdd,
      onMove,
      className,
      globalConfig,
      disabled,
    } = this.props;
    const isComponentsGrouped = isGrouped(appendableComponents);
    const hasAppendableComponent = appendableComponents.length > 0;

    return (
      <DragDropContext onDragEnd={this.dispatchDragEnd}>
        <div className={cx('zent-design-preview', className)}>
          {/* 侧边栏组件存放添加区域 */}
          {hasAppendableComponent && (
            <div
              className={cx('zent-design__add', {
                'zent-design__add--grouped': isComponentsGrouped,
                'zent-design__add--mixed': !isComponentsGrouped,
              })}
            >
              <DesignEditorAddComponent
                componentInstanceCount={componentInstanceCount}
                components={appendableComponents}
                onAddComponent={onAddComponent}
              />
            </div>
          )}
          <div className="design-preview-main">
            <Droppable
              droppableId="zent-design-preview-list"
              type={DND_PREVIEW_CONTROLLER}
              direction="vertical"
            >
            {(provided, snapshot) => {
              let draggableIndex = 0;

              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="zent-design__item-list"
                  style={{
                    backgroundColor: get(
                      settings,
                      'previewBackground',
                      DEFAULT_BACKGROUND
                    )
                  }}
                >
                {value.map(v => {
                  const valueType = v.type;
                  const comp = find(components, c => isExpectedDesignType(c, valueType));
                  const PreviewItem = comp.previewItem || DesignPreviewItem;
                  const EditorItem = comp.editorItem || DesignEditorItem;
                  const id = getUUIDFromValue(v) || uuid();
                  const selected = id === selectedUUID;
                  const PreviewController = comp.previewController || DesignPreviewController;
                  const draggable = defaultTo(comp.dragable, true);

                  return (
                    <PreviewItem
                      key={id}
                      id={id}
                      ref={this.savePreviewItem(id)}
                    >
                      <PreviewController
                        value={v}
                        globalConfig={globalConfig}
                        settings={settings}
                        design={design}
                        id={id}
                        index={draggable ? draggableIndex++ : -1}
                        allowHoverEffects={!snapshot.isDraggingOver}
                        dragable={draggable}
                        editable={defaultTo(comp.editable, true)}
                        configurable={defaultTo(comp.configurable, true)}
                        canDelete={defaultTo(comp.canDelete, true)}
                        canInsert={defaultTo(comp.canInsert, true)}
                        highlightWhenSelect={defaultTo(comp.highlightWhenSelect, true)}
                        isSelected={selected}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onAdd={onAdd}
                        onMove={onMove}
                        component={comp.preview}
                        previewProps={getAdditionalProps(comp.previewProps, v)}
                      />

                      {selected && !showAddComponentOverlay && (
                        <EditorItem
                          disabled={disabled}
                          ref={this.saveEditorItem(id)}
                        >
                          <comp.editor
                            {...getAdditionalProps(comp.editorProps, v)}
                            ref={this.saveEditor(id)}
                            value={v}
                            onChange={onComponentValueChange(v)}
                            settings={settings}
                            onSettingsChange={onSettingsChange}
                            globalConfig={globalConfig}
                            design={design}
                            validation={validations[id] || {}}
                            showError={showError}
                          />
                        </EditorItem>
                      )}

                      {selected && showAddComponentOverlay && (
                        <DesignEditorItem
                          ref={this.saveEditorItem(id)}
                          className={cx(
                            'zent-design-add-component-overlay',
                            {
                              'zent-design-add-component-overlay--top':
                                addComponentOverlayPosition ===
                                ADD_COMPONENT_OVERLAY_POSITION.TOP,
                              'zent-design-add-component-overlay--bottom':
                                addComponentOverlayPosition ===
                                ADD_COMPONENT_OVERLAY_POSITION.BOTTOM,
                              'zent-design-add-component-overlay--grouped': isComponentsGrouped,
                              'zent-design-add-component-overlay--mixed': !isComponentsGrouped,
                            }
                          )}
                        >
                          <DesignEditorAddComponent
                            fromSelected
                            componentInstanceCount={componentInstanceCount}
                            components={appendableComponents}
                            onAddComponent={onAddComponent}
                          />
                        </DesignEditorItem>
                      )}
                    </PreviewItem>
                  );
                })}
                  {provided.placeholder}
                </div>
              );
            }}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    );
  }
}

function getAdditionalProps(propsOrFn, value) {
  const props = isFunction(propsOrFn) ? propsOrFn(value) : propsOrFn;

  return props || {};
}

function saveRef(map, id, instance) {
  if (!instance) {
    delete map[id];
  } else {
    map[id] = instance;
  }
}

export default React.forwardRef((props, ref) => <DesignPreview {...props} forwardedRef={ref} />);
