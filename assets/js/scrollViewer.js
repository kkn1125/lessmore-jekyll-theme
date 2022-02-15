const body = document.body;
const main = document.querySelector('main');
const gnb = document.querySelector('nav.gnb');
let scrolled = 'pause';
let scrollMaxPauseTime = 2;
let baseHeight;
let gap;
let plus = 0;

window.addEventListener('resize', (ev)=>{
    gap = window.innerHeight - document.body.clientHeight;
    if(gap!=0){
        plus = gap;
    } else {
        plus = gap;
    }
});
body.addEventListener('scroll', scrollViewer);
window.addEventListener('click', handleSideBar);

function handleSideBar(ev){
    const target = ev.target;
    if(target.id != 'delBtn') return;

    document.querySelector('#rsb').classList.remove('show');
    document.querySelector('#rsb').classList.add('hide');
}

function scrollViewer(ev){
    const nav = document.querySelector('nav').clientHeight;
    const main = document.querySelector('.main').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const totalHeight = parseInt(nav + main + footer);
    const windowHeight = parseInt(document.body.clientHeight);
    const currentScrollPoint = parseInt(document.body.scrollTop);
    
    baseHeight = totalHeight - windowHeight;

    const scrollPercent = (currentScrollPoint/(baseHeight-plus))*100;
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
        gauge.children[0].textContent = `${validDigit>100?100:validDigit}`;
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