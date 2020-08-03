const fs = require("fs-extra");
const path = require("path");
const cuter = require("./hcSpriteCuter2");
const ora = require('ora');
const chalk = require('chalk');

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

module.exports = async (info) => {
  let result = await fileDisplay(info.dir);
  // // 同步遍历下载
  const spinner = ora({ text: `${chalk.yellow('拼命切图中,请耐心等待')}`, color: 'yellow', }).start();

  // let result = [
  //   'E:\\project\\puppeteer-download\\file\\原始资源\\洞房花柱\\image\\bigwin_01595219325313.png',
  //   'E:\\project\\puppeteer-download\\file\\原始资源\\洞房花柱\\image\\bigwin_11595219325313.png',
  //   'E:\\project\\puppeteer-download\\file\\原始资源\\洞房花柱\\image\\bigwin_21595219325313.png',
  // ]

  // console.log('result', result);
  // const filePath = info.dir.replace('原始资源', '切图资源')
  // fs.writeFileSync(filePath + 'url.json', JSON.stringify(result), 'utf8')

  let r = await cuter('E:\\project\\puppeteer-download\\file\\原始资源\\美人如玉\\image\\fcaf16f4c90e2ba418d358c90f830de01595255776927.png');
  return
  const status = result.map(async (item) => {
    try {
    } catch (error) {
      console.log(error);
    }
  })
  await Promise.all(status)
  spinner.stop()
  console.log(chalk.blue('全部资源已切完'));
}