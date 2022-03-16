'use strict';

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

const typer = Typer.init({
    typer: {
        // data-typer-name 지정태그에 텍스트 추가 모습
        words: {
            desc: ['현재 devkimson의 typer를 사용한 프로필을 보고 계십니다.',
                '다크모드가 추가되어 있는 블로그 샘플입니다.',
                '채팅버튼을 추가 할 예정입니다.',
                '다른 테마에서 새롭게 만날 수 있도록 기대해주세요.'
            ],
        },
        speed: 0.1,
        delay: 1,
        loop: false,
        loopDelay: 1,
        start: 0,
        eraseMode: false,
        eraseSpeed: 0.1,
        style: {
            cursorBlink: 'vertical'
        },
    }
});

// load lunr

function loadSearch(){
    // Create a new Index
    idx = lunr(function(){
        this.field('id')
        this.field('title', { boost: 10 })
        this.field('summary')
    })
 
    // Send a request to get the content json file
    $.getJSON('/content.json', function(data){
 
        // Put the data into the window global so it can be used later
        window.searchData = data
 
        // Loop through each entry and add it to the index
        $.each(data, function(index, entry){
            idx.add($.extend({"id": index}, entry))
        })
    })
 
    // When search is pressed on the menu toggle the search box
    $('#search').on('click', function(){
        $('.searchForm').toggleClass('show')
    })
 
    // When the search form is submitted
    $('#searchForm').on('submit', function(e){
        // Stop the default action
        e.preventDefault()
 
        // Find the results from lunr
        results = idx.search($('#searchField').val())
 
        // Empty #content and put a list in for the results
        $('#content').html('<h1>Search Results (' + results.length + ')</h1>')
        $('#content').append('<ul id="searchResults"></ul>')
 
        // Loop through results
        $.each(results, function(index, result){
            // Get the entry from the window global
            entry = window.searchData[result.ref]
 
            // Append the entry to the list.
            $('#searchResults').append('<li><a href="' + entry.url + '">' + entry.title + '</li>')
        })
    })
}

String.prototype.marking = function(keyword) {
    return this.replace(new RegExp(keyword, 'gim'), `<span class="text-mark">$&</span>`);
}