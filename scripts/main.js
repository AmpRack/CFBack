'use strict';

$(document).ready(function() {

	// Toggle focus style on searchbar in main page
	$('#nav-searchbar').on('focus', 'input', function() {
		$(this).parent().addClass('search-focus');
	});
	$('#nav-searchbar').on('focusout', 'input', function() {
		$(this).parent().removeClass('search-focus');
	});

	// function to unhide and wrap-up div
	function unhideWrapUp(section) {
		section.toggleClass('hidden');
		section.toggleClass('wrapped-up');
	}

	// Show & hide replies/new reply within post template
	$('#show-reply').on('click', function() {
		var getToReplies = $(this).parentsUntil('.post-template')
			.last().siblings('.replies');
		unhideWrapUp(getToReplies);
	});
	$('#create-reply').on('click', function() {
		var getToCreateReply = $(this).parentsUntil('.post-template')
				.last().siblings('.post-reply');
		unhideWrapUp(getToCreateReply);
	});
	$('button#cancel-reply').on('click', function() {
		var getToCreateReply = $(this).parentsUntil('.post-template').last();
		unhideWrapUp(getToCreateReply);
	});

});

// Format raw time units to ##:## ##/##/##
function scrubTime(unit) {
  if (unit > 2000) {
    unit -= 2000;
  }
  if (unit < 10) {
    unit = ('0' + unit.toString());
  }
  return unit.toString();
}

// Returns date and time as separate, semantic strings
function timeStamp() {
  var currentTime = new Date();
  var hrs  = currentTime.getHours();
  var mins = scrubTime(currentTime.getMinutes());
  var day  = scrubTime(currentTime.getDate());
  var mon  = scrubTime(currentTime.getMonth() + 1);
  var year = scrubTime(currentTime.getFullYear());
  var ampm = '';
  // Use hrs to find the meridian (am/pm) before scrubbing
  if (hrs === 0) {
    hrs = '12';
    ampm = 'AM';
  } else if (hrs > 12) {
    hrs = scrubTime(hrs - 12);
    ampm = 'PM';
  } else {
    hrs = scrubTime(hrs);
    ampm = 'AM';
  }
  var postTime = hrs + ':' + mins + ampm;
  var postDate = mon + '/' + day + '/' + year;
  return [postTime, postDate];
}

function isNumber(input) {
     return (input >=0 || input < 0);
}

