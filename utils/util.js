const onlyWordRegExp = new RegExp("^\\w+$");

// 填充零
function formatNumber(n) {
  const s = n.toString();
  return s[1] ? s : `0${s}`;
}

// 通过 Date 对象获取格式化的字符串时间
function formatDate(date, format) {
  const year = date.getFullYear().toString();
  const month = formatNumber(date.getMonth() + 1);
  const day = formatNumber(date.getDate());

  const dateString = format.replace(/(\w+)|(\W+)/g, (s) => {
    if (onlyWordRegExp.test(s)) {
      let rs = "";
      let length = 0;
      switch (s[0]) {
        case "Y":
          length = s.length < 5 ? s.length : 4;
          rs = year.slice(-length);
          break;
        case "M":
          length = s.length < 3 ? s.length : 2;
          rs = month.slice(-length);
          break;
        case "D":
          length = s.length < 3 ? s.length : 2;
          rs = day.slice(-length);
          break;
        default:
          rs = "";
          break;
      }
      return rs;
    }
    return s;
  });
  return dateString;
}

// 通过格式化的字符串时间获取 Date 对象
function parseDate(dateString, format) {
  const pattern = format.replace(/(\w+)|(\W+)/g, (s) => {
    if (onlyWordRegExp.test(s)) {
      return `(?<${s[0]}>\\d{${s.length}})`;
    } else {
      return s;
    }
  });
  const regExp = new RegExp(pattern, "g");
  const result = regExp.exec(dateString);
  const date = new Date();
  Object.keys(result["groups"]).forEach((key) => {
    switch (key) {
      case "Y":
        date.setFullYear(parseInt(result["groups"][key]));
        break;
      case "M":
        date.setMonth(parseInt(result["groups"][key]) - 1);
        break;
      case "D":
        date.setDate(parseInt(result["groups"][key]));
        break;
      default:
        break;
    }
  });
  return date;
}

/**
 * 格式化请求参数
 * @param {*} queryStringObject
 */
function formatQueryString(queryStringObject) {
  if (queryStringObject && typeof queryStringObject === "object") {
    const queryString = Object.keys(queryStringObject)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryStringObject[key])}`)
      .join("&");
    return `?${queryString}`;
  }
  // throw new Error('formatQueryString：', '参数错误，' + queryStringObject)
  return queryStringObject;
}

/**
 * 解析请求参数
 * @param {*} queryString
 */
function parseQueryString(queryString) {
  if (queryString && typeof queryString === "string") {
    const idx = queryString.indexOf("?");
    let _queryString = queryString;
    if (idx > -1) {
      _queryString = queryString.slice(idx + 1);
    }
    const queryStringArray = _queryString.split("&");
    const queryStringObject = {};
    queryStringArray.forEach((item) => {
      const itemArray = item.split("=");
      if (itemArray[0]) {
        queryStringObject[decodeURIComponent(itemArray[0])] = itemArray[1]
          ? decodeURIComponent(itemArray[1])
          : "";
      }
    });
    return queryStringObject;
  }
  // throw new Error("parseQueryString", "参数错误，" + queryString)
  return queryString;
}

/**
 * 获取格式化时间字符串
 * @param {*} dateString
 */
function getFormatDateString(dateString) {
  return dateString.replace("T", " ").replace(/\.[\d+]+$/, "");
}

/**
 * 版本号比较
 * @param {*} v1
 * @param {*} v2
 */
function compareVersion(v1, v2) {
  const _v1 = v1.split(".");
  const _v2 = v2.split(".");
  const len = Math.max(_v1.length, _v2.length);

  while (_v1.length < len) {
    _v1.push("0");
  }
  while (_v2.length < len) {
    _v2.push("0");
  }

  let result = 0;
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(_v1[i]);
    const num2 = parseInt(_v2[i]);

    if (num1 > num2) {
      result = 1;
      break;
    } else if (num1 < num2) {
      result = -1;
      break;
    }
  }

  return result;
}

module.exports = {
  formatNumber,
  formatDate,
  parseDate,
  formatQueryString,
  parseQueryString,
  getFormatDateString,
  compareVersion,
};
