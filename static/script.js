'use strict';

/*
var App = (function(moment){
function DailyLogApp() {
// constructor
}
DailyLogApp.prototype = {
someFunction: function() {}
}
return DailyLogApp;
})(moment);
var app = new App();
function updateDates() {
$('#')
};
$('#endDate').on('change', function(e) {
app.changeStartDate($(e.target).val());
updateDates();
});
*/

var App = function() {
	this.setDefaultDates();
	// App.prototype.setDefaultDates.call(this);
	this.updateDates(this.startDate, this.endDate);
};

// set default dates, set default start date to first day of hacker school
App.prototype.setDefaultDates = function() {
	this.startDate = moment('20140721', 'YYYYMMDD');
	this.endDate = moment().add('d', 7)
};

App.prototype.removeItems = function() {
	$('#list').find('li').remove();
};

App.prototype.generateDailyBlocks = function() {
	this.removeItems();
	for (var currDate = this.startDate; 
			!currDate.isAfter(this.endDate); 
			currDate = currDate.add('d', 1)) {
		var item = $('<li>')
			.append($('<label>', {
				text: currDate.format('MM/DD (ddd)')
			}));

		var log = $('<ul>', {
				'contenteditable': true,
				'class': 'day',
				'data-log': currDate
			}).append($('<li>'));

		item.append(log);
		$('#list').append(item);
	}
};

App.prototype.updateDates = function(startDate, endDate) {
	if (startDate) {
		$('#startDate').val(startDate.format('YYYY-MM-DD'));
	}

	if (endDate) {
		$('#endDate').val(endDate.format('YYYY-MM-DD'));
	}
};

App.prototype.loadLocalData = function() {
	for (var key in localStorage) {
		var d = new Date(Number.parseInt(key));
		var matched = $('.day').filter(function() { 
		  return $(this).data('log') == key;
		});

		if (matched.length > 0) {
			matched.find('li').remove(); // first remove everything
			var arr = JSON.parse(localStorage.getItem(key));
			arr.forEach(function(text) {
				matched.append($('<li>', {
					text: text
				}));
			});	
		}
	}
};

App.prototype.startDateChanged = function(value) {
	// set change events for date range
	this.startDate = moment(value);
	// change end date is start dates becomes greater than endate
	if (this.startDate.isAfter(this.endDate)) {
		this.endDate = moment(this.startDate).add('days', 7);
		this.updateDates(null, this.endDate);
	}
	this.generateDailyBlocks();
	thisloadLocalData();
};

App.prototype.endDateChanged = function(value) {
	endDate = moment(value);
	// change start date if end date becomes earlier than start date
	if (endDate.isBefore(startDate)) {
		startDate = moment(endDate).subtract('days', 7);
		updateDates(startDate, null);
	}
	generateDailyBlocks();
	loadLocalData();
}


/********************
  Script starts
********************/
var app = new App();

$('#startDate').on('change', function(e) { 
	app.startDateChanged($(e.target).val()); 
});

$('#endDate').on('change', function(e) {
	app.endDateChanged($(e.target).val());
});


$('#list').on('keydown', function(e) {
	var target = $(e.target),
		items = target.find('li');

	// prevent deleting if there is only one empty il element left
	if (items.length == 1 && e.keyCode === 8 && items.text() === '') {	
		e.preventDefault();
		return;
	}

	// FIXME: rewrite every single time?
	if (e.which === 13) {
		var log = [];
		target.find('li').each(function(index, item) {
			log.push($(item).text());
		});
		localStorage.setItem(target.data('log'), JSON.stringify(log));
	}
});

app.generateDailyBlocks();
app.loadLocalData();

// FIXME: chaning dates = buggy
// TODO: advance by week or paginate?
