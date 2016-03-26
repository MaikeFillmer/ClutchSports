$(document).ready(function(){
	var $window = $(window); //You forgot this line in the above example
	$('section[data-type="background"]').each(function(){
		var $bgobj = $(this); // assigning the object
		$(window).scroll(function() {
			var yPos = -($window.scrollTop() / $bgobj.data('speed'));
			// Put together our final background position
			var coords = '50% '+ yPos + 'px';
			// Move the background
			$bgobj.css({ backgroundPosition: coords });
		});
	});
	//The keys that we will use for the news search API.
	var keys =
	 ['AIzaSyAuoDyUd1UVUigKWG0XbgNpCot-iQeLHKk',
		'AIzaSyDwR5Jk9x--eTgE1o7dgt_ZTc-zI2ZalVA',
		'AIzaSyCosQeZ1wcWPFJGUlzPMfsAVGHzttA4YDQ'];
	function toNiceDate(string) {
  	var splitString = string.split('T').join(' ')
  	var date = moment(splitString).format("ddd, M/D h:mmA")
  	return date;
  }
  //When the button is clicked, we will get the search term that the user entered and use it in our API queries
	$('button').on('click', function() {
		var search = $('#teamName').val().trim();
		search = search.toLowerCase();
		search = search.split(' ').join('-');
		var queryURL = "https://api.seatgeek.com/2/events?performers.slug=" + search + "&client_id=NDM2Nzc5M3wxNDU4MjU1NzU4";
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(response) {
    	$('#eventsLeft').empty();
      $('#eventsRight').empty();
      ticketResults = [];
      if(response.events.length == 0)
      { //will not show any results if none were found
      	$("#eventsLeft").text("No Tickets Available in the Near Future")
    	}
      else
      {
       	for(i=0;i<10;i++)
       	{
       		ticketResults[i] = {
        		name: response.events[i].title,
        		location: response.events[i].venue.display_location,
        		time: toNiceDate(response.events[i].datetime_local),
        		url: response.events[i].url
          }
          var ticketDiv = $('<div id="item" data-number=' + i+'>')
          ticketDiv.addClass('well');
	        var h = $('<h3>').text(ticketResults[i].name);
	        h.attr('class', 'heading');
	        var l = $('<p>').text(ticketResults[i].location);
	        var t = $('<p>').text(ticketResults[i].time);
	        t.attr('class', 'time');
	        ticketDiv.append(h, l, t);
         	if(i<=4)
         	{
	        	$("#eventsLeft").append(ticketDiv);
	        }
	        else
	        {
	        	$("#eventsRight").append(ticketDiv);
	        }
	      }
	    }
	    return false;
    });
		search = search.split('-').join('+');
		$("#newsLeft").empty();
		$("#newsCenter").empty();
		$("#newsRight").empty();
		var key = keys[Math.floor(Math.random())];
		//AJAX call to search for news articles
		$.ajax({
		  url: 'https://www.googleapis.com/customsearch/v1?q=' + search + '&cx=011101858926978562708%3Abyfxhjvymhs&key=' + key,
		  method: 'GET'
		}).done(function(response) {
		  //Gets 9 articles from response
		  for(var i = 1; i < 10; i++)
		  {
		   	//Stores object data of the articles
		    var currentStory = response.items[i];
		    //Stores data pulled from the page of the article
		    var currentStoryPagemap = response.items[i].pagemap;
		    //The all encompassing div that contains all data for a particular story
		    var newsDiv = $('<div>');
		    newsDiv.addClass('well');
		    //The title of the news story
		    var newsTitle = $('<h3>');
		    newsTitle.addClass('newsTitle');
		    newsTitle.html(currentStoryPagemap.article[0].name);
		    //Adds news title to the individual news story div
		    newsDiv.append(newsTitle);
		    //The article body. A snippet of the actual article. Will contain the thumbnail image in the p tag for formatting
				var newsBody = $('<p>');
				//Thumbnail image tag
		    var newsImg = $('<img>');
		    newsImg.attr('src', currentStoryPagemap.cse_thumbnail[0].src);
		    newsImg.addClass('newsPics');
		    newsBody.append(newsImg);
		    newsBody.addClass('articlebody');
		    newsBody.append(currentStoryPagemap.article[0].articlebody);
		    //Adds the body, containing snippet and image, to individual news story div
		    newsDiv.append(newsBody);
		    newsDiv.append('<br>');
		    //The link to the article on bleacherreport
		    var newsLink = $('<a>');
		    newsLink.addClass('newsLink');
		    newsLink.attr('href', currentStoryPagemap.article[0].url)
		    newsLink.html('read more');
		    //Appends the link to the individual news story div
		    newsDiv.append(newsLink);
		    //Date the article was published
		    var datePub = $('<p>');
        datePub.addClass('datePub');
        datePub.html("Date: " +currentStoryPagemap.article[0].datepublished);
        //Appends date to news story div
        newsDiv.append(datePub);
        //Displays news stories horizontally, 3 per row
		    if(i == 1 || i == 4 || i == 7)
		    {
		      $('#newsLeft').append(newsDiv);
		    }
		    if(i == 2 || i == 5 || i == 8)
		    {
		      $('#newsCenter').append(newsDiv);
		    }
		    if(i == 3 || i == 6 || i == 9)
		    {
		      $('#newsRight').append(newsDiv);
		    }
		  }
		});	
		return false;		//will keep results and not auto refresh
	});
  window.onload = function(){
	  var today = moment().format("YYYY-MM-DD");
    var queryURL2 = "https://api.seatgeek.com/2/events?taxonomies.name=sports&datetime_utc.gt=" + today;
		$.ajax({
	    url: queryURL2,
	    method: 'GET'
	  }).done(function(response) {
	   	$('#eventsLeft').empty();
	   	$('#eventsRight').empty();
	   	ticketResults2=[];
	   	for(i=0;i<10;i++)
	   	{
	  		ticketResults2[i] = {
	  			name: response.events[i].title,
	  			location: response.events[i].venue.display_location,
	  			time: toNiceDate(response.events[i].datetime_local),
	  			url: response.events[i].url
	  		}
	  		var ticketDiv = $('<div id="item2" data-number=' + i+'>')
	  		ticketDiv.addClass('well');
		 		var h = $('<h3>').text(ticketResults2[i].name);
		 		h.attr('class', 'heading');
		 		var l = $('<p>').text('Location:  ' + ticketResults2[i].location);
		  	var t = $('<p>').text('Time:  ' + ticketResults2[i].time);
		  	t.attr('class', 'time');
		  	var u = ticketDiv.append(h, l, t);
		  	if(i<=4)
		  	{
		    	$("#eventsLeft").append(ticketDiv);
		    }
		    else
		    {
		    	$("#eventsRight").append(ticketDiv);
		    }
	    }
	  });
	}
	$('button').on('click', function() {
		$("#merchandise").empty();
		var search = $('#teamName2').val().trim()
		var queryURL = "https://crossorigin.me/http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Mr-ClutchSp-PRD-b3a0284bf-14486c0c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=20&keywords="+search;
		$.ajax({
			url: queryURL,
			method: 'GET'
		}).done(function(response){
			var results = JSON.parse(response);	
			var searchResults = results.findItemsAdvancedResponse[0].searchResult[0];
			$.each(searchResults.item, function(){
				var merchandiseDiv = $("<div>");
				merchandiseDiv.addClass("well")
				merchandiseDiv.attr("id","merchandiseDiv")
				var imageLink = (this.galleryURL[0])
				console.log(imageLink);
				var image = $("<img>");
				image = image.attr("src",imageLink);
				var ebayLink = (this.viewItemURL[0]);
				var listing = $("<a>" + "View EBAY Listing" + "</a>");
				listing.attr("href",ebayLink);
				listing.html("<img src = "+imageLink+">")
				var title = $("<h3>");
				title.text(this.title[0]);
				var currency = $("<p>");
				currency.text(this.sellingStatus[0].currentPrice[0]["@currencyId"] + " $" + this.sellingStatus[0].currentPrice[0]["__value__"])
				// var listing = 
				$(merchandiseDiv).append(title);
				$(merchandiseDiv).append(currency);
				//$(".merchandiseDiv").append(this.sellingStatus[0].currentPrice[0]["__value__"]+"<br>"); 
				$(merchandiseDiv).append(listing);
				$("#merchandise").append(merchandiseDiv);	
			});
		});
	});
  $('body').on('click', '#item', function() {
	 	var index = $(this).data('number');
	 	window.location = ticketResults[index].url;
	});
	$('body').on('click', '#item2', function() {
	 	var index = $(this).data('number');
	 	window.location = ticketResults2[index].url;
	});
});