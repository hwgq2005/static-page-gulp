// 引入插件需要的包
var through = require('through2');

// 定义gulp插件主函数
// prefix_text：调用插件传入的参数
module.exports = function gulp_prefix(prefix) {

    // 创建stream对象，每个文件都会经过这个stream对象

    var str = 'var Env = ' + JSON.stringify(prefix) + ';';
    var prefix = new Buffer(str);

    var stream = through.obj(function(file, encoding, callback){
        // 如果file类型不是buffer 退出不做处理
        if(!file.isBuffer()){
            return callback();
        }

        // 将字符串加到文件数据开头
        console.log(prefix,'prefix');

        file.contents = Buffer.concat([prefix, file.contents]);
        console.log(file.contents.toString(),'222222222');
        // 确保文件会传给下一个插件
        this.push(file);

        // 告诉stream引擎，已经处理完成
        callback();
    });

    return stream;
};
