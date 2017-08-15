// 目前不考虑网络问题
const agent = require('superagent');
const cheerio = require('cheerio');
const {format, transform} = require('./util.js');
const async = require('async');
const moment = require('moment');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const crawlNovelContent = require('./crawlNovelContent.js');
const config = require('./config.js');
require('./server.js')(app, server,express);

io.on('connection', socket => {
    socket.on('start', () => {
        crawlNovelContent(socket);
    });
});

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