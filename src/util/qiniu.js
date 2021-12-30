
function getQiniuToken (contect) {
  return new Promise((resolve, reject) => {
    contect.$axios.post(contect.$domain + '/api/getUploadToken').then(res => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}
function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function uuid () {
  return (S4() + S4() + S4() + S4())
}
function uploadQiniu (context, token, file, isBase64, ext) {
  return new Promise((resolve, reject) => {
    const axiosInstance = context.$axios.create({withCredentials: false})
    let data = new FormData()
    data.append('token', token)
    if (isBase64 === false) {
      data.append('file', file)
    } else {
      data.append('file', this.dataURItoBlob(file))
    }
    if (ext) {
      data.append('key', 'upload/' + this.uuid() + ext)
    } else {
      data.append('key', '/postDesign/' + this.uuid() + '.jpg')
    }
    axiosInstance({
      method: 'POST',
      url: 'http://upload.qiniup.com/',
      data: data,
      timeout: 30000
    }).then(data => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
  })
}
function dataURItoBlob (dataURI) {
  // base64 解码
  let byteString = window.atob(dataURI.split(',')[1])
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], {type: mimeString})
}
export default {
  install (Vue) {
    Vue.qiniu = Vue.prototype.$qiniu = {
      uploadQiniu,
      getQiniuToken,
      dataURItoBlob,
      uuid
    }
  }
}
