requestAnimationFrame(loopFind);

function loopFind() {
    let target;
    let mode = getMode() || 'off';
    let label = document.createElement('label');
    let btn = document.createElement('span');
    label.htmlFor = 'mode';
    label.append(btn);
    target = document.querySelector(`[data-switch="${label.htmlFor}"]`);
    
    if (target) {
        target.insertAdjacentElement('beforebegin', label);
        updateMode.call(label, mode, true);
        window.addEventListener('click', modeHandler.bind(label));
        cancelAnimationFrame(loopFind);
    } else {
        requestAnimationFrame(loopFind);
    }
}

window.addEventListener('load', () => {
    document.body.style.transition = `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
});

function modeHandler(ev) {
    let valid = ev.target;
    if (valid.tagName !== 'LABEL' || !valid.htmlFor) return;
    ev.preventDefault();
    let status = this.classList.value == 'on' ? 'off' : 'on';
    updateMode.call(this, status);
}

function updateMode(status) {
    let shape = {
        off: `<i class="far fa-sun"></i>`,
        on: `<i class="fas fa-moon"></i>`
    }
    let body = document.body.classList;
    clearMode.call(this);
    this.classList.add(status);
    this.children[0].innerHTML = shape[status];
    if (status == 'on') {
        body.add('dark');
    } else {
        body.remove('dark');
    }
    setMode(status);
}

function clearMode() {
    this.classList.value = '';
}

function getMode() {
    let mode = sessionStorage['mode'];
    return mode ? JSON.parse(mode).dark : null;
}

function setMode(status) {
    sessionStorage['mode'] = JSON.stringify({
        dark: status,
        toggleTime: new Date()
    });
}