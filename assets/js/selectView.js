const latestBtn = document.querySelector('#latestBtn');
const latestPosts = document.querySelector('.latest-posts');
const allPosts = document.querySelector('.all-posts');

window.addEventListener('click', handleView);

/**
 * 토글 방식으로 변경
 */
if(allPosts && latestBtn){
    if (isHidden()) {
        latestPosts.hidden = true;
        allPosts.removeAttribute('hidden');
        latestBtn.innerHTML = '최신 글';
    } else {
        allPosts.hidden = true;
        latestPosts.removeAttribute('hidden');
        latestBtn.innerHTML = '모든 글';
    }
}

/**
 * 토글 방식으로 변경
 */
function handleView(ev) {
    const target = ev.target;
    if (target.id != 'latestBtn') return;

    latestPosts.hidden = !isHidden();
    allPosts.hidden = isHidden();
    setHiddenInfo(!isHidden());

    latestBtn.innerHTML = isHidden() ? '최신 글' : '모든 글';
}

function isHidden() {
    return getHiddenInfo().hidden;
}

function getHiddenInfo() {
    if (!localStorage['isHidden']) localStorage['isHidden'] = '{"hidden": false}';
    const hiddenInfo = JSON.parse(localStorage['isHidden']);
    if (hiddenInfo.hasOwnProperty('maxTime')) localStorage['isHidden'] = '{"hidden": false}';
    // 이전 버전 초기화
    return hiddenInfo;
}

function setHiddenInfo(data) {
    localStorage['isHidden'] = JSON.stringify({
        hidden: data
    });
}