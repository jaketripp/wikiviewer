// ajax get request from wikipedia
// top 10 results from api
// button for random article (piece of cake)
// update the search on enter?

// have an empty ul on the page
// function 
// clear all li elements from ul
//   take input and run get request
// add 10 lis for top 10 articles
//   each li has title, the first bit from the wiki page, and is linked to the wiki link
//  have something on li:hover

// title, first sentence, url

// get top 10 pages for Earth
// https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Earth&utf8=&

// working but maybe dont need continue
// https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&explaintext&continue&exintro&exlimit=3&utf8=&titles=Earth|Mars|Russia

// get extracts 
// https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&explaintext&exintro&exlimit=3&utf8=&titles=Earth|Mars|Russia
// exsentences = how many of the sentences (we just want the first)
// explaintext = returns plaintext instead of html
// exintro = only return content before first section
// exlimit = how many results we want (we want 10)
// uft8= use utf8
// titles= titles

// create urls from pageid
// this is mars
// https://en.wikipedia.org/?curid=14640471

// =========
// VARIABLES 
// =========

var titleParam; 

// ===================
// AUXILIARY FUNCTIONS
// ===================

// splits a string by spaces, joins it with '_', then splits by apostrophes, joins by '%27'
function formatURLParam(string) {
	var str = string.split(' ');
	str = str.join('_');
	str = str.split("'");
	str = str.join("%27");
	return str;
}

// ==============
// MAIN FUNCTIONS
// ==============

function getData(string) {
	$(document).ready(function() {
		var str = formatURLParam(string);
		var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&utf8=&origin=*&srsearch=" + str;      
		$.ajax({
			url: url,
			success: function(result){
				var arr = result.query.search;
				// start out titleParam as the first title string
				titleParam = arr[0].title;
				for (var i = 1; i < arr.length; i++) {
					// build the title string like 'title|title_of_titles|tito%27s_titles'
					var title = formatURLParam(arr[i].title)
					titleParam+= ("|" + title) 
				}
				getPageExtracts(titleParam);
			}
		});
	});
}
function getPageExtracts(param) {

	var url = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exsentences=1&explaintext&exintro&exlimit=10&utf8=&titles=" + param;      
	$.ajax({
		url: url,
		success: function(result){
			var arr = result.query.pages;
			for (var key in arr) {
				$('ul').append('<a href="https://en.wikipedia.org/?curid=' + arr[key].pageid + '" + target="_blank"><li>' + '<h5>' + arr[key].title + '</h5>' + arr[key].extract + '</li></a>')
			}
		}
	});
}

// init attached to search button
// clear current items
// if search entry is blank, open random article
// else do the search (getData)

function init() {
	$('ul').empty();
	var search = $('#searchbar').val();
	if (search === '') {
		window.open("https://en.wikipedia.org/wiki/Special:Random");
	}
	getData(search);
}

