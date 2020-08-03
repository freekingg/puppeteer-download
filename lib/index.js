const pptr = require('puppeteer');
const url = require("url");
const path = require('path');
const download = require("./download");
const ora = require('ora');
const chalk = require('chalk');


module.exports = async (info) => {
  console.log('开始下载', info);
  function bootstrap(info) {
    return new Promise(async (resolve, reject) => {
      let downLoadUrlList = []
      const browser = await pptr.launch({
        headless: false,
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Mobile Safari/537.36')

      // 加载进度指示
      const spinner = ora({ text: `${chalk.yellow('拼命收集资源中,请耐心等待...')}`, color: 'yellow', }).start();

      page.on('response', async request => {

        //获取文件名
        // if (isBase64(request.url())) {
        //   console.log('data:image', request.url());
        // }
        // 

        let basename = url.parse(request.url()).pathname;
        //获取文件的后缀名
        let extname = path.extname(basename);

        // 只下载图片与音频
        let extnameList = ['.png', '.jpg', '.mp3', '.ogg']
        if (extnameList.includes(extname) || isBase64(request.url())) {
          downLoadUrlList.push(request.url())
        }

      });

      // 打开目标网站，判定没有任何网络请求后，返回需要下载的url
      await page.goto(info.url, { waitUntil: 'networkidle0', timeout: 400000 })
      await page.waitFor(3000)
      spinner.stop()
      resolve(downLoadUrlList)

    })
  }

  const result = await bootstrap(info);
  console.log(chalk.green('收集完成,需要下载的文件数量为'), chalk.red(`${result.length}个`));

  // 同步遍历下载
  const spinner = ora({ text: `${chalk.yellow('拼命下载中,请耐心等待')}`, color: 'yellow', }).start();
  const status = result.map(async (item) => {
    try {
      await download({ url: item }, info.name);
    } catch (error) {
      console.log(error);
    }
  })

  await Promise.all(status)
  spinner.stop()
  console.log(chalk.blue('全部资源下载完成'));
  // browser.close()

}

function isBase64(str) {
  var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}
