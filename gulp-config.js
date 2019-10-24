/**
 * @description 路径配置项
 * @author Hwg
 * @date 2019/10/23
 */

const path = require('path');
const fs = require("fs");

// 获取参数
const argv = process.argv;
const dirPath = argv[3];

// 基本路径配置
const basePath = './src/';
const outBasePath = './dist/';
const devPath = basePath + dirPath;
const outPath = outBasePath + dirPath;

// 判断命令行是否输入
if (!dirPath || dirPath === undefined) {
    throw new Error('请输入目录，比如：gulp --env "activity"');
}

// 禁止监听该目录
let catalogArr = ['shop','recovery','tools'];
if (catalogArr.indexOf(dirPath) >= 0) {
    throw new Error('禁止监听该目录:'+ dirPath);
}

// 判断目录是否存在
try{
    fs.statSync(path.join(__dirname,devPath));
    console.log('success!');
}catch(e){
    throw new Error('请输入正确的目录！');
}

module.exports = {
    basePath,
    outBasePath,
    devPath,
    outPath
};
