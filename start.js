const app = require("./lib/index");

// 需要下载的信息
/**
 * @url 目标下载站的url（有iframe嵌套者，需要最内层的iframe地址）
 * @name 输出的文件夹名称
 */
const downLoadInfo = {
  url: 'https://www.baidu.com/',
  name: '百家乐'
}

app(downLoadInfo)


