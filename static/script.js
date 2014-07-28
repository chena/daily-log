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

// TODO: don't use jquery!

// the view
var appView = {
	initEventHandlers: function() {
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

			if (e.which === 13) {
				var log = [];
				target.find('li').each(function(index, item) {
					log.push($(item).text());
				});
				localStorage.setItem(target.data('log'), JSON.stringify(log));
			}
		});
	},

	updateDisplayedDates: function(startDate, endDate) {
		if (startDate) {
			$('#startDate').val(startDate.format('YYYY-MM-DD'));
		}

		if (endDate) {
			$('#endDate').val(endDate.format('YYYY-MM-DD'));
		}
	},

	updateDisplayedItems: function(items) {

	},

	clearItems: function() {
		$('#list').find('li').remove();
	}
}

// the controller
var App = function() {
	// app constructor
	this.setDefaultDates();
	this.generateDailyBlocks();
	this.loadLocalData();
	appView.initEventHandlers();
};

App.prototype = {
	// set default dates, set default start date to first day of hacker school
	setDefaultDates: function() {
		this._startDate = moment('20140721', 'YYYYMMDD');
		this._endDate = moment().add('d', 7);
		appView.updateDisplayedDates(this._startDate, this._endDate);
	},

	generateDailyBlocks: function() {
		appView.clearItems();
		console.log('start date: ' + this.startDate);

		for (var currDate = this._startDate; 
				!currDate.isAfter(this._endDate); 
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
	},

	loadLocalData: function() {
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
	},

	startDateChanged: function(value) {
		// set change events for date range
		this.startDate = moment(value);
		// change end date is start dates becomes greater than endate
		if (this.startDate.isAfter(this.endDate)) {
			this.endDate = moment(this.startDate).add('days', 7);
			this.updateDates(null, this.endDate);
		}
		this.generateDailyBlocks();
		thisloadLocalData();
	},

	endDateChanged: function(value) {
		endDate = moment(value);
		// change start date if end date becomes earlier than start date
		if (endDate.isBefore(startDate)) {
			startDate = moment(endDate).subtract('days', 7);
			updateDates(startDate, null);
		}
		generateDailyBlocks();
		loadLocalData();
	}
}

/********************
  Script starts
********************/
var app = new App();

// FIXME: chaning dates = buggy
// TODO: advance by week or paginate?
