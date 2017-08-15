const async = require('async');
const agent = require('superagent');
const moment = require('moment');
const cheerio = require('cheerio');
const catalog = require('./data/catalog.json');
const fs = require('fs');

module.exports = (socket) => {
    // crawl novel
    const novel = {
        name: '九星霸体诀',
        url: 'http://www.qu.la/book/14883/',
        root: 'http://www.qu.la'
    }
    let txt = '';
    socket.emit('news', '抓取小说内容开始时间 ' + moment().format());
    const sum = catalog.length;
    let i = 0;
    const t =+ new Date();
    const leastTime = () => {
        const second = (+ new Date() - t) / 1000;
        const min = second / 60;
        const least = min / (i / sum) - min;
        socket.emit('progress', i / sum, least);
    }
    async.mapSeries(catalog, (item, cb) => {
        i++;
        if (!item) {
            leastTime();
            cb();
            return;
        }
        agent.get(novel.root + item.href).timeout({response: 5000,deadline:30000}).then(res => {
            socket.emit('news', item.title+' 抓取完成');
            const $ = cheerio.load(res.text);
            let content = $('#content').text();
            content = content.replace(/\s+/g, '\r\n');
            content = item.title + content + '\r\n';
            txt += content;
            leastTime();
            cb();
            return;
        }, err => {
            console.log(err, item.title);
            socket.emit('news', '服务器无响应 跳过抓取 ' + item.title);
            cb();
            return;
        })
    }, () => {
        socket.emit('news', '抓取小说内容结束时间 ' + moment().format());
        socket.emit('news', '写入小说内容开始时间' + moment().format());
        fs.writeFile('./data/novel.txt', txt, err => {
            socket.emit('news', '写入小说内容结束时间' + moment().format());
            socket.emit('news', '小说内容抓取并存储完毕');
        })
    })
};
