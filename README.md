监听目标网站的http响应url,然后获取所有的url地址地址下载

## 使用方法
**1、**
在start.js内进行配置
``` js
/**
 * @url 目标下载站的url（有iframe嵌套者，需要最内层的iframe地址）
 * @name 输出的文件夹名称
 */
const downLoadInfo = {
  url: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=zh&cur=CNY&gameSymbol=vs75empress&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&lobbyURL=https%3A%2F%2Fwww.pragmaticplay.com',
  name: '美人如玉'
}
```

**2、**
```
npm run start
```

**3、**
资源会输出至file文件夹内