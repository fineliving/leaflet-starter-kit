/**
 * @description 判断一个对象是否是数组。
 * @param {Object} a - 对象。
 * @returns {boolean} 是否是数组。
 */
export const isArray = a => {
  return Object.prototype.toString.call(a) === '[object Array]'
}
/**
 * @description 获取某对象再数组中的索引值。
 * @param {Array} array - 数组。
 * @param {Object} obj - 对象。
 * @returns {number} 某对象再数组中的索引值。
 */
export const indexOf = (array, obj) => {
  if (array == null) {
    return -1
  } else {
    // use the build-in function if available.
    if (typeof array.indexOf === 'function') {
      return array.indexOf(obj)
    } else {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === obj) {
          return i
        }
      }
      return -1
    }
  }
}

export const compare = (value1, value2) => {
  if (value1.radius < value2.radius) {
    return 1
  } else if (value1.radius > value2.radius) {
    return -1
  } else {
    return 0
  }
}

export const xxx = (value1, value2) => {
  if (value1.attrs.outerRadius < value2.attrs.outerRadius) {
    return 1
  } else if (value1.attrs.outerRadius > value2.attrs.outerRadius) {
    return -1
  } else {
    return 0
  }
}
