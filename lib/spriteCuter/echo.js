const fs = require("fs-extra");
const path = require("path");

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

//文件遍历方法
function fileDisplay(filePath) {
  const rp = filePath.replace('原始资源', '切图资源')
  console.log('filePath', rp);
  mkdirsSync(rp, null)
  return new Promise((resolve, reject) => {
    let fileds = []
    let readDir = fs.readdirSync(filePath)
    //遍历读取到的文件列表
    readDir.forEach(function (filename, index) {

      //获取当前文件的绝对路径
      var filedir = path.join(filePath, filename);

      //根据文件路径获取文件信息，返回一个fs.Stats对象
      let stats = fs.statSync(filedir)
      let isFile = stats.isFile();//是文件
      let isDir = stats.isDirectory();//是文件夹
      if (isFile) {
        let extname = path.extname(filedir)
        if (extname === '.png') {
          fileds.push(filedir)
        }
      }
      if (isDir) {
        const rp = filedir.replace('原始资源', '切图资源')
        const filepaths = path.normalize(rp);
        // 创建文件夹
        if (!fs.existsSync(filepaths)) {
          fs.mkdirSync(filepaths);
        }

        fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    });
    resolve(fileds)
  })
}


// 输出json文件
module.exports = async (info) => {
  let result = await fileDisplay(info.dir);
  console.log('result', result);
  const filePath = info.dir.replace('原始资源', '切图资源')
  fs.writeFileSync(filePath + 'url.json', JSON.stringify(result), 'utf8')


}