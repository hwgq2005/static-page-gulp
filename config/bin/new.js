'use strict';

process.on('exit', (code) => {
    if (code === 1) {
        console.log("项目创建失败，可以npm run help 查看帮助");
    }
});

if (!process.argv[2]) {
    // console.warn('[项目名称必填]必填 - 请输入你的项目名称');
    console.log('\u001b[31m[项目名称必填]必填 - 请输入你的项目名称\u001b[39m');
    process.exit(1);
}

const path = require('path');
const fileSave = require('file-save');
const uppercamelcase = require('uppercamelcase');
const componentname = process.argv[2];
const chineseName = process.argv[3] || componentname;
const ComponentName = uppercamelcase(componentname);
const PackagePath = path.resolve(__dirname, '../../src/', componentname);

const {html,css,js} = require('./template');
const Files = [
    {
        filename: path.join('../../src/pages/', `./${componentname}/index.html`),
        content: html
    },
    {
        filename: path.join('../../src/pages/', `./${componentname}/css/index.scss`),
        content: css
    },
    {
        filename: path.join('../../src/pages/', `./${componentname}/js/index.js`),
        content: js
    },
    {
        filename: path.join('../../src/pages/', `./${componentname}/images/${componentname}.md`),
        content: `## ${ComponentName} ${chineseName}`
    },
    {
        filename: path.join('../../src/pages/', `./${componentname}/others/${componentname}.md`),
        content: `## ${ComponentName} ${chineseName}`
    }

];

// console.log('*******READY FOR CREATE PROJECT********')
// 添加到 components.json
const componentsFile = require('../../project.json');
if (componentsFile[componentname]) {
    console.error(`${componentname} 已存在.`);
    process.exit(1);
}
componentsFile[componentname] = `${componentname}`;
fileSave(path.join(__dirname, '../../project.json'))
    .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
    .end('\n');

// 创建 package
Files.forEach(file => {
    fileSave(path.join(PackagePath, file.filename))
        .write(file.content, 'utf8')
        .end('\n');
});

console.log('DONE!');
