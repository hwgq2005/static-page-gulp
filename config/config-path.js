/**
 * @description 路径配置项
 * @author Hwg
 * @date 2019/10/23
 */

const path = require('path');
const fs = require("fs");

// const notifier = require('node-notifier');
// // String
// notifier.notify('Message');

// 获取参数
const argv = process.argv;
const dirPath = argv[3];

// 基本路径配置
const basePath = './src/';
const outBasePath = './dist/';
const devPath = basePath + dirPath;
const outPath = outBasePath + 'pages/' + dirPath;

// 错误信息
let errMsg = '';

// 判断命令行是否输入
if (!dirPath || dirPath === undefined) {
    errMsg = '请输入目录，比如：npm run dev "activity"';
    throw new Error('请输入目录，比如：npm run dev "activity"');
}

// 禁止监听该目录
let catalogArr = ['shop', 'recovery', 'tools'];
if (dirPath && catalogArr.indexOf(dirPath.split('/')[0]) >= 0 && !errMsg) {
    errMsg = '禁止监听该目录:' + dirPath;
    throw new Error('禁止监听该目录:' + dirPath);
}

// 判断目录是否存在
if (dirPath && !errMsg){
    try {
        fs.statSync(path.join(__dirname, '.' + devPath));
        console.log('success!');
    } catch (e) {
        errMsg = '请输入正确的目录' ;
        throw new Error('请输入正确的目录！');

    }
}

module.exports = {
    basePath,
    outBasePath,
    devPath,
    outPath,
    errMsg
};
