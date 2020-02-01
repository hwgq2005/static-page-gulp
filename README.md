# gulp自动化工程规范

>开发目录在src目录下，目录下统一只能用一级目录，
原有旧的项目直接在dist的recovery、shop、tools目录下进行修改，新的全部在src目录下开发。

#### 1.命名规范

假设我要开发一个工具H5，目录命名为：tool-xxx；

假设我要开发一个商城的相关业务页面，目录命名为：shop-xxx、shop-act-xxx；

假设我要开发一个回收的相关业务页面，目录命名为：recovery-xxx、recovery-act-xxx；

假设我要开发一个租赁的相关业务页面，目录命名为：lease-xxx、lease-act-xxx；

其它的以此类推。

#### 2.目录结构规范

在src目录下创建好一个新的目录后，里面的目录结构只能按照以下规则来创建，不按规则的则会出事，目录结构如下：

```
├── shop-act-xxx // 项目名称
|   ├── css // 只能存放样式文件，如：index.css、index.scss文件
|   ├── js // 只能存放js文件，可用es6语法，放了其他文件则忽略
|   ├── images // 只能存放图片文件，大图片不要存放在这里，放七牛云
|   ├── others // 存放其他格式文件，比如字体或其他文件，大文件存放在七牛云上
|   ├── index.html // 主页面
|   └── detail.html // 其他页面，可以创建多个html页面
```

#### 3.创建目录

命令如下:
```
npm run new '文件名'
```

帮助文档:
```
npm run help
```

#### 4.安装包

```
cnpm install
```

#### 5.启动gulp

需要在命令填写监听的目录，比如目录叫 `shop-act-xxx` ，不按规则来则会报错。

开发环境：
```
npm run dev "shop-act-xxx"
```

预览环境：
```
npm run build:pre
```

正式环境：
```
npm run build
```

#### 6.不同环境应用不同的域名

可在配置文件添加自己想要的变量，.dev对应测试环境，.pre对应预发布环境，.build对应整数环境。

```
var env = {
    actHost: 'http://testact.zhaoliangji.com',
    proHost: 'http://testproduct.zhaoliangji.com',
    phost: 'http://testpanda.huodao.hk',
    staticHost: 'http://testfrontstatic.zhaoliangji.com'
};

module.exports = env;
```

调用方式`Env`加定义的变量名称，如下：
```
Env.actHost + '/api'
```
#### 7.反馈

大家如果用了遇到什么问题，及时反馈，一起来优化这个工程。
