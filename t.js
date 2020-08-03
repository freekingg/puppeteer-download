const path = require("path");
const url = require("url");
// 测试文件 
var task = { url: 'https://plaingaming-c2lga.betsoftgaming.com/html5/fafatwins/_current_version/resources/imgs/uis/custom/win/fx_final_burst/5.jpg?version=68' }
const pathname = url.parse(task.url).pathname
let basename = path.basename(pathname)
let extname = path.extname(basename)
let fileName = basename.split('.')[0] + new Date().getTime() + '' + extname

console.log(pathname);
console.log(basename);
console.log(extname);
console.log(fileName);