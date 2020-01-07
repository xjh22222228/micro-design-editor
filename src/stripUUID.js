import { has, isPlainObject, isArray, cloneDeep } from 'lodash';

const UUID_KEY_PATTERN = /__.+uuid__/i;
const OLD_KEY = 'zent-design-uuid';

export default function stripUUID(value) {
  // https://github.com/xjh22222228/micro-design-editor/issues/3
  value = cloneDeep(value);

  if (isPlainObject(value)) {
    // eslint-disable-next-line
    for (const key in value) {
      if (has(value, key)) {
        if (OLD_KEY === key || UUID_KEY_PATTERN.test(key)) {
          delete value[key];
        } else {
          const oldValue = value[key];
          const newValue = stripUUID(oldValue);
          if (newValue !== oldValue) {
            value[key] = newValue;
          }
        }
      }
    }
  } else if (isArray(value)) {
    value.forEach(v => stripUUID(v));
  }

  return value;
}
