const fse = require("fs-extra");
const axios = require("axios");
const path = require("path");
const url = require("url");

module.exports = (task, name) => {
  const filepath = path.resolve('file/原始资源', name);

  // 创建文件夹
  if (!fse.existsSync(filepath)) {
    fse.mkdirSync(filepath);
    fse.mkdirSync(path.resolve(filepath, 'audio'));
    fse.mkdirSync(path.resolve(filepath, 'image'));
  }

  if (isBase64(task.url)) {
    transferToImg(task.url, path.resolve(filepath, 'image'))
    return
  }

  const pathname = url.parse(task.url).pathname
  let basename = path.basename(pathname)
  let extname = path.extname(basename) || '.png'
  let fileName = basename.split('.')[0] + new Date().getTime() + '' + extname

  let audioPath = path.resolve(filepath, 'audio', fileName)
  let imagePath = path.resolve(filepath, 'image', fileName)

  // 请求资源url并分类写入
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({ url: task.url, responseType: "arraybuffer" });
      if (extname == '.jpg' || extname == '.png' || extname == 'bmp') {
        fse.writeFileSync(imagePath, response.data, 'binary')
      } else if (extname == '.mp3' || extname == '.ogg') {
        fse.writeFileSync(audioPath, response.data, 'binary')
      }
      resolve(true)
    } catch (error) {
      reject(error)
    }

  });
};

function isBase64(str) {
  var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}


/**
 * 
 * base64->图片
 */
function transferToImg(imgData, dir) {

  //过滤data:URL
  let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  let dataBuffer = Buffer.from(base64Data, 'base64');

  const allowExtname = ['png', 'jpg', 'jpeg', 'webp', 'bmp'];//支持的图片格式

  //获取扩展名
  let extname = '';
  let filterResult = allowExtname.filter(item => {
    return imgData.includes(item)
  })
  extname = '.' + filterResult[0]

  // 写入图片
  fse.writeFileSync(`${dir}/${new Date().getTime()}${extname}`, dataBuffer)

}