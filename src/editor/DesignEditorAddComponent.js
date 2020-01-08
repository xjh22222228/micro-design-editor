import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isFunction, isNumber, noop } from 'lodash';
import { serializeDesignType } from '../utils/design-type';
import { splitGroup, isGrouped } from '../utils/component-group';

export default class DesignEditorAddComponent extends PureComponent {
  static propTypes = {
    components: PropTypes.array,
    componentInstanceCount: PropTypes.object,
    onAddComponent: PropTypes.func.isRequired,
    fromSelected: PropTypes.bool
  };

  static defaultProps = {
    fromSelected: false
  };

  onAdd = component => () => {
    const { componentInstanceCount } = this.props;

    if (canAddMoreInstance(component, componentInstanceCount)) {
      const { shouldCreate } = component;
      shouldAddComponentPromise(component, shouldCreate).then(() => {
        const { fromSelected, onAddComponent } = this.props;
        onAddComponent(component, fromSelected);
      }, noop);
    }
  };

  render() {
    const { components, componentInstanceCount } = this.props;

    if (!components || !components.length) {
      return null;
    }

    if (isGrouped(components)) {
      return this.renderGrouped();
    }

    return (
      <div className="zent-design-editor-add-component zent-design-editor-add-component--mixed">
        <div className="zent-design-editor-add-component__mixed-title">添加内容</div>
        <div className="zent-design-editor-add-component__mixed-list">
          {components.map(c => {
            const { type } = c;
            const key = serializeDesignType(type);

            return (
              <ComponentButton
                type="mixed"
                key={key}
                component={c}
                componentInstanceCount={componentInstanceCount}
                onAdd={this.onAdd}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderGrouped() {
    const { components, componentInstanceCount } = this.props;
    const groups = splitGroup(components);

    return (
      <div className="zent-design-editor-add-component zent-design-editor-add-component--grouped">
        {groups.map(g => (
          <ComponentGroup
            key={g.group.name}
            group={g.group}
            components={g.components}
            componentInstanceCount={componentInstanceCount}
            onAdd={this.onAdd}
          />
        ))}
      </div>
    );
  }
}

function ComponentGroup({
  group,
  components,
  onAdd,
  componentInstanceCount
}) {
  return (
    <div className="zent-design-editor-add-component__grouped">
      <p className="zent-design-editor-add-component__grouped-title">{ group.name }</p>
      <div className="zent-design-editor-add-component__grouped-list">
        {components.map(c => {
          const { type } = c;
          const key = serializeDesignType(type);

          return (
            <ComponentButton
              key={key}
              type="grouped"
              component={c}
              componentInstanceCount={componentInstanceCount}
              onAdd={onAdd}
            />
          );
        })}
      </div>
    </div>
  );
}

function ComponentButton(props) {
  const {
    component,
    componentInstanceCount,
    onAdd,
    type
  } = props;

  const disabled = !canAddMoreInstance(component, componentInstanceCount);
  const message = getLimitMessage(component, componentInstanceCount);

  return (
    <div className={`zent-design-editor-add-component-btn-wrapper zent-design-editor-add-component__${type}-btn-wrapper`}>
      { disabled && <div className="design-editor-add-tooltip">{ message }</div> }
      <a
        onClick={onAdd(component)}
        className={cx(`zent-design-editor-add-component__${type}-btn`, {
          [`zent-design-editor-add-component__${type}-btn--disabled`]: disabled,
        })}
        disabled={disabled}
      >
        {component.editor.designDescription}
      </a>
    </div>
  );
}

function canAddMoreInstance(component, componentInstanceCount) {
  const { type, limit } = component;
  const key = serializeDesignType(type);
  const count = componentInstanceCount.get(key);

  if (isFunction(limit)) {
    return limit(count);
  }

  return limit ? count < limit : true;
}

function getLimitMessage(component, componentInstanceCount) {
  const { type, limitMessage, limit } = component;
  const key = serializeDesignType(type);
  const count = componentInstanceCount.get(key);

  if (isFunction(limitMessage)) {
    return limitMessage(count);
  }

  let defaultMessage = '';
  if (isNumber(limit)) {
    // limit === 0 表示不限制
    if (limit > 0) {
      defaultMessage = `该组件最多可以添加 ${limit} 个`;
    } else if (limit < 0) {
      defaultMessage = '该组件暂不可用';
    }
  }

  return limitMessage || defaultMessage;
}

// Normalize to Promise
function shouldAddComponentPromise(component, fn) {
  if (isFunction(fn)) {
    return fn(component);
  }

  return Promise.resolve();
}
