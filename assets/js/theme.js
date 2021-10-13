'use strict';

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// scrollHandler
const scrHandler = document.querySelector('.scroll-handler');
const scrArrow = document.querySelector('.arrow');
let isClick = false;
let srcX = 0;
let srcY = 0;
let delay = 0;
let direction = 0;

let visibleLimit = 50; // percent
let scrollDirection = 0;

window.addEventListener('load', readyToScroll);
scrHandler.addEventListener('mousedown', mdownHandler);
window.addEventListener('mouseup', mupHandler);
window.addEventListener('mousemove', dragHandler);
window.addEventListener('scroll', visibleHandler);

function visibleHandler(ev) {
    let y = window.scrollY;
    let maxY = window.innerHeight;
    let calcLimit = maxY * visibleLimit / 100;
    if (scrollDirection < y) {
        if (y > calcLimit) {
            scrHandler.classList.add('show');
        }
    } else if (scrollDirection > y) {
        // console.log('up');
        if(y < calcLimit){
            scrHandler.classList.remove('show');
        }
    }
    scrollDirection = y;
}

function mdownHandler(ev) {
    isClick = true;
    srcX = ev.layerX;
    srcY = ev.layerY;
    if (isClick) {
        scrHandler.classList.toggle('selected');
    }
}

function mupHandler(ev) {
    if (isClick) {
        scrHandler.classList.toggle('selected');
        scrArrow.innerHTML = `<i class="fas fa-arrows-alt-v"></i>`;
        isClick = false;
        delay = 0;
        if (direction < 330) {
            document.body.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
        } else if (direction > 400) {
            document.querySelector('#pageEnd').scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
        direction = 0;
        scrHandler.style.cssText = `
            bottom: 50%;
            transition: 0.7s cubic-bezier(0.175, 1.2, 0.32, 1.575);
            -webkit-transition: 0.7s cubic-bezier(0.175, 1.2, 0.32, 1.575);
            -moz-transition: 0.7s cubic-bezier(0.175, 1.2, 0.32, 1.575);
            -ms-transition: 0.7s cubic-bezier(0.175, 1.2, 0.32, 1.575);
            -o-transition: 0.7s cubic-bezier(0.175, 1.2, 0.32, 1.575);
        `;
    }

}

function dragHandler(ev) {
    if (isClick) {
        const originY = scrHandler.offsetTop;
        let y = ev.y - srcY;
        let dir = null;
        let smooth = function () {
            if (dir > 0)
                dir -= 0.1;
            else
                dir += 0.1;
            requestAnimationFrame(smooth);
            if (dir == 0) {
                cancelAnimationFrame(smooth);
            }
        };
        if (direction < 330) {
            scrArrow.innerHTML = `<i class="fas fa-arrow-up"></i>`;
        } else if (direction > 400) {
            scrArrow.innerHTML = `<i class="fas fa-arrow-down"></i>`;
        }

        if (direction < ev.y) {
            if (dir == null) dir = false;
            if (!dir) {
                requestAnimationFrame(smooth);
                delay += 0.8;
            }
        } else if (direction > ev.y) {
            if (dir == null) dir = true;
            if (dir) {
                requestAnimationFrame(smooth);
                delay -= 0.8;
            }
        }
        scrHandler.style.cssText = `
        transform: translateY(${y-(delay+originY)}px);
        bottom: 50%;
        `;

        direction = ev.y;
    }
}

function readyToScroll(ev) {
    scrHandler.setAttribute('ready', '');
}

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