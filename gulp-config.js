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

// 开发路径
const devPath = './src/' + dirPath;
// 输出路径
const outPath = './dist/' + dirPath;

// 判断命令行是否输入
if (!dirPath || dirPath === undefined) {
    throw new Error('请输入目录，比如：gulp --env "activity"');
}

// 判断目录是否存在
try{
    fs.statSync(path.join(__dirname,devPath));
    console.log('success!');
}catch(e){
    throw new Error('请输入正确的目录！');
}

module.exports = {
    dirPath,
    devPath,
    outPath
};
