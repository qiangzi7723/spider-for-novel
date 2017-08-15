const socket = io.connect();
const startBtn = document.getElementById('start-btn');
const scrollElm = document.getElementById('scroll');
const percent = document.getElementById('percent');
const time = document.getElementById('time');
const bar = new ProgressBar.Circle(container, {
    strokeWidth: 2,
    duration: 0,
    color: '#369ed0',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null
});
startBtn.onclick = () => {
    socket.emit('start');
};
socket.on('news', (content) => {
    let elm = document.createElement('p');
    elm.innerText = content;
    scrollElm.appendChild(elm);
    scrollElm.scrollTop = scrollElm.scrollHeight;
});
socket.on('progress', (progress, least) => {
    const p = (progress * 100).toFixed(3);
    bar.animate(p / 100); // Number from 0.0 to 1.0
    percent.innerText = p + '%';
    time.innerText=least;
});
