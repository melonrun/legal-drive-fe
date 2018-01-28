import axios from 'axios'
import {serverConfig} from './server_config'

function checkStatus (response) {
  if (response && (response.status === 200) && response.data.head.code === 200) {
    return response.data.data
  } else if (response.data.head.code !== 200) {
    return {
      status: false,
      result: '',
      msg: response.data.head.msg
    }
  }
}

function errorCallback (error) {
  console.log(error)
}

export default {
  post (uri, data) {
    var url = serverConfig.serverURI + uri
    return axios({
      method: 'post',
      url,
      data,
      timeout: 5000,
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(errorCallback)
  },
  get (uri, data) {
    var url = serverConfig.serverURI + uri
    return axios({
      method: 'get',
      url,
      data,
      timeout: 5000,
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(errorCallback)
  },
  upload (uri, param) {
    if (!param || !uri) {
      return
    }
    var url = serverConfig.serverURI + uri
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    return axios({
      method: 'post',
      url,
      data: param,
      config: config,
      timeout: 10000,
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(errorCallback)
  },
  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    var url = serverConfig.serverURI + uri
    return axios({
      method,
      url,
      data,
      timeout: 5000,
      withCredentials: true
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(errorCallback)
  },
  setCookie (cName, cValue, exDays = 1) {
    var d = new Date()
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cName + '=' + cValue + '; ' + expires
  },
  getCookie (name) {
    var cname = name + '='
    var temp = document.cookie.split(';')
    for (var i = 0; i < temp.length; i++) {
      temp[i] = temp[i].trim()
      if (temp[i].indexOf(cname) === 0) {
        return temp[i].substring(cname.length, temp[i].length)
      }
    }
    return ''
  },
  checkLoginStatus () {
    let userRole = this.getCookie('_ld_user_name_cookie_')
    if (!userRole) {
      return false
    }
    return true
  },
  formatDate (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str))
      }
    }
    return fmt
  },
  padLeftZero (str) {
    return ('00' + str).substr(str.length)
  }
}
