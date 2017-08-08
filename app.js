// 需要考虑断点以及网络突然断开的情况
const agent = require('superagent');
const cheerio = require('cheerio');
const {format, transform} = require('./util.js');
const fs = require('fs');
const catalog = require('./data/catalog.json');
const async = require('async');
const moment = require('moment');
const open=require('open');

const novel = {
    name: '九星霸体诀',
    url: 'http://www.qu.la/book/14883/',
    root: 'http://www.qu.la'
}

// agent.get(novel.url).then(res => {
//     const cache = [];
//     const $ = cheerio.load(res.text);
//     const list = $('#list a');
//     const listArray = Array.from(list);
//     listArray.forEach(node => {
//         const title = node.children[0].data;
//         const index = transform(title);
//         if (index) {
//             cache[index] = {
//                 title,
//                 href: node.attribs.href
//             }
//         }
//     });
//     // fs.writeFile('./data/catalog.json', JSON.stringify(cache), err => {
//     //     console.log('数据写入完毕');
//     // });
// })
const time = {
    start: moment().format(),
    end: ''
}
let txt = '';
console.log('抓取小说内容开始时间 ', time.start);
async.mapSeries(catalog, (item, cb) => {
    if (!item) {
        cb();
        return;
    }
    agent.get(novel.root + item.href).then(res => {
        console.log('正在抓取 ', item.title);
        const $ = cheerio.load(res.text);
        let content = $('#content').text();
        content = content.replace(/\s+/g, '\r\n');
        content = item.title + content + '\r\n';
        txt += content;
        cb();
    })
}, () => {
    time.end = moment().format();
    console.log('抓取小说内容结束时间 ', time.end);
    console.log('写入小说内容开始时间', moment().format());
    fs.writeFile('./data/novel.txt', txt, err => {
        console.log('写入小说内容结束时间', moment().format());
        console.log('小说内容抓取并存储完毕');
    })
})

// 使用async改写
// let cache;
// catalog.forEach(obj => {
//     if (obj) {
//         const res = await agent.get(novel.root + obj.href);
//         const $=cheerio.load(res.text);
//         const content=$('#content');
//         // 获取章节内容 章节内容含Br标签 可能需要转义
//         const title=obj.title;
//         const charpter=title+'<br>'+text+'<br>';
//         cache+=charpter;
//     }
// });

// fs.writeFile('./data/novel.txt',cache,err=>{
//     // 把数据的写入操作放到循环之后
//     console.log('数据写入完成');
// })