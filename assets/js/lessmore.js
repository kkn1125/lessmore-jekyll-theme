!function(){
    var lessmore = function(config){
        let objArray = new lessmore.ObjArray;

        config.call(objArray, objArray);
        return objArray;
    };

    lessmore.ObjArray = function(){
        this.objectArray = [];
        this.add = function(data){
          this.objectArray.push(data);
        }
        this.search = function(str){
          let result = [];

          this.objectArray.forEach(obj=>{
            if((obj.id+'').toLowerCase().indexOf(str)>-1
            || obj.url.toLowerCase().indexOf(str)>-1
            || obj.title.toLowerCase().indexOf(str)>-1
            || obj.body.toLowerCase().indexOf(str)>-1
            || obj.tag?.toLowerCase().indexOf(str)>-1
            ){
              obj.ref = obj.id
              result.push(obj);
            }
          });

          return result;
        }
    };

    (function(root, factory){
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(factory)
          } else if (typeof exports === 'object') {
            /**
             * Node. Does not work with strict CommonJS, but
             * only CommonJS-like enviroments that support module.exports,
             * like Node.
             */
            module.exports = factory();
          } else {
            // Browser globals (root is window)
            root.lessmore = factory();
          }
    }(this, function(){
        return lessmore
    }))
}();

(function(){
  const topArrowEL = `<button id="topArrowEL" onclick="document.body.scrollTo(0,0)" class="btn btn-warning px-1 position-fixed" style="right: 30px;bottom: 120px; z-index: 50;"><i class="fa-solid fa-arrow-turn-up" style="width: 16px;"></i></button>`;
  const searchBtnEL = `<div class="position-fixed" style="right: 30px; bottom: 70px; z-index: 50;">
    <button id="searchBtn" class="btn btn-brand px-1">
        <i class="fa-solid fa-magnifying-glass-plus" style="user-select: none;"></i>
    </button>
  </div>`;
  const searcherEL = `<div id="searcher" class="hidden">
    <div class="text-center">
        <h1 class="text-white">📚 Search 🔍</h1>
    </div>
    <form class="bd-search hidden-sm-down" onSubmit="return lessmore_search(document.getElementById('lunrsearch').value);" style="width:80vw">
        <div class="search btn-bundle g-0 my-5">
            <input id="lunrsearch" name="q" value="" type="text" class="form-input form-input-lg col" placeholder="검색어를 입력해주세요.">
            <button class="btn btn-lg btn-info">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </form>
  </div>`;
  const cursor = document.createElement('span');
  cursor.classList.add('bg-dark', 'rounded-circle');
  cursor.style.setProperty('--bg-opacity', 0.2);
  cursor.id = 'cursor';
  
  window.addEventListener('DOMContentLoaded', e=>{
    document.body.append(cursor);
    document.body.insertAdjacentHTML('beforeend', topArrowEL);
    document.body.insertAdjacentHTML('beforeend', searchBtnEL);
    document.body.insertAdjacentHTML('beforeend', searcherEL);
    document.body.addEventListener('scroll', handleShowTopArrowEl);
  });

  function handleShowTopArrowEl(e){
    const topEL = document.querySelector('#topArrowEL');
    if(document.body.scrollTop > parseInt(document.body.clientHeight*0.3)){
      topEL.classList.add('show');
    } else {
      topEL.classList.remove('show');
    }
  }
  
  function handleSearchOpener(e) {
    const searcher = document.querySelector('#searcher');
    const lunrsearch = document.querySelector('#lunrsearch');
    const lunrsearchresults = document.querySelector('#lunrsearchresults');
    const target = e.target;

    if(target.closest('.search')) return;

    if(target.id != 'searchBtn') {
      searcher.classList.add('hidden');
      lunrsearchresults.style.display = 'none';
      return;
    }
    setTimeout(() => {
      lunrsearch.focus();
    }, 10);

    if(searcher.classList.contains('hidden')) searcher.classList.remove('hidden');
    else searcher.classList.add('hidden');
  }

  function handleSearchClose(e){
    const searcher = document.querySelector('#searcher');
    const lunrsearchresults = document.querySelector('#lunrsearchresults');
    if(e.key.toLowerCase() == 'escape'){
      searcher.classList.add('hidden');
      lunrsearchresults.style.display = 'none';
    }
  }

  window.addEventListener('click', handleSearchOpener);
  window.addEventListener('keydown', handleSearchClose);

  let x, y;
  let cursorSize = 30;
  let isLink = false, isBtn = false;

  requestAnimationFrame(drawCursor);

  function drawCursor(){
    if(isLink || isBtn){
      cursorSize = 70;
    } else {
      cursorSize = 30;
    }
    cursor.style.transform = `translate(${x-cursorSize/2}px, ${y-cursorSize/2}px)`;
    requestAnimationFrame(drawCursor);
  }
  
  function handleCursor(e){
    x = e.clientX
    y = e.clientY;
  }
  function handleCursorIn(e){
    const target = e.target;
    if(target.closest('button')) {
      isBtn = true;
      cursor.classList.add('on-btn');
    } else if (target.closest('a')) {
      isLink = true;
      cursor.classList.add('on-link');
    } else {
      isBtn = false;
      isLink = false;
      cursor.classList.remove('on-btn', 'on-link');
    }
  }
  window.addEventListener('mouseover', handleCursorIn);
  window.addEventListener('mousemove', handleCursor);
})();