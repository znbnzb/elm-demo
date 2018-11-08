import {
  baseUrl
} from './env'

export default async (url = '', data = {}, type = 'GET', method = 'fatch') => {
  type = type.toUpperCase(); //将请求类型转换大写
  url = baseUrl + url; //拼接地址

  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    //forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
    Object.keys(data).forEach(key => {
      dataStr += key = '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      //substr() 的参数指定的是子串的开始位置和长度
      //lastIndexOf() 方法可返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置从后向前搜索。

      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  //判断请求的方式是否为fetch
  if (window.fetch && method == 'fetch') {
    let requestConfig = {

      //credentials：证书，凭证  等于  include 包含
      credentials: 'include',

      //方法类型
      method: type,

      //请求为json
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      //CORS定义一种跨域访问的机制，可以让AJAX实现跨域访问。
      mode: "cors",


      /** 
       force-cache：浏览器在HTTP缓存中查找匹配的请求。
        如果有新的或旧的匹配， 它将从缓存中返回。
        如果不匹配， 浏览器将发出正常的请求， 并用下载的资源更新缓存。
    */
      cache: "force-cache"
    }
    if (type == 'POST') {




      //Object.defineProperty(obj, prop, descriptor) 方法会直接在一个对象上定义一个新属性，
      //或者修改一个对象的现有属性， 并返回这个对象。
      //obj:要在其上定义属性的对象。 prop:要定义或修改的属性的名称。 descriptor:将被定义或修改的属性描述符。
      //返回值：被传递给函数的对象。


      Object.defineProperty(requestConfig, 'body', {

        //JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。

        value: JSON.stringify(data)
      })
    }
    //抛出错误
    try {
      const responsee = await fetch(url, requestConfig);
      const responseJson = await responsee.json();
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    /**
     * Promise的构造函数接受一个参数， 是函数；
     *  并且传入两个参数： resolve, reject，
     *  分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数；
     */

    return new Promise((resolve, reject) => {
      let requestObj; //ajax请求方法
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }
      let sendData = ''; //发送数据
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }
      //设置ajax请求方法
      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      requestObj.send(sendData);

      /**
       * 当请求被发送到服务器时， 我们需要执行一些基于响应的任务。
       * 每当 readyState 改变时， 就会触发 onreadystatechange 事件。
       * readyState 属性存有 XMLHttpRequest 的状态信息。
       */

      requestObj.onreadystatechange = () => {
        //4: 请求已完成，且响应已就绪
        if (requestObj.readyState == 4) {

          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
