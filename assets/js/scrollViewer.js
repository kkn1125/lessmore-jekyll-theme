const body = document.body;
const main = document.querySelector('main');
const gnb = document.querySelector('nav.gnb');
let scrolled = 'pause';
let scrollMaxPauseTime = 2;

body.addEventListener('scroll', scrollViewer);
window.addEventListener('click', handleSideBar);

function handleSideBar(ev){
    const target = ev.target;
    if(target.id != 'delBtn') return;

    document.querySelector('#rsb').classList.remove('show');
    document.querySelector('#rsb').classList.add('hide');
}

function scrollViewer(ev){
    const baseHeight = document.body.scrollHeight - window.innerHeight;
    const currentScrollPoint = document.body.scrollTop;
    const scrollPercent = (currentScrollPoint/baseHeight)*100;

    scrolled = 'scroll';

    renderScrollGauge(parseFloat(scrollPercent.toFixed(2)));
}

function renderScrollGauge(gaugeValue){
    const gauge = body.querySelector('#scrollGauge');
    const validDigit = gaugeValue;

    if(!gauge){
        body.insertAdjacentHTML('beforeend', `
            <div id="scrollGauge" class="tag tag-info">
                <span></span>
                <span> / </span>
                <span>100</span>
            </div>
        `);
    } else {
        gauge.children[0].textContent = `${validDigit}`;
    }
}

let detectPauseScrolling = setInterval(() => {
    const gauge = body.querySelector('#scrollGauge');

    if(scrolled!=='scroll'){
        setTimeout(()=>{
            scrolled = 'ready';
            if(gauge) {
                gauge.classList.add('gauge-hide');
                setTimeout(()=>{
                    gauge.remove();
                }, 300);
            }
        }, scrollMaxPauseTime);
    } else {
        scrolled = 'pause';
    }
}, 1000);