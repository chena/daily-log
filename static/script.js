'use strict';

// the view
var appView = {
	updateDisplayedDates: function(startDate, endDate) {
		if (startDate) {
			$('#startDate').val(startDate.format('YYYY-MM-DD'));
		}

		if (endDate) {
			$('#endDate').val(endDate.format('YYYY-MM-DD'));
		}
	},

	updateLogItem: function(key, entries) {
		// first check if the log is visisble in the DOM
		var log = this._findLogElement(key);

		if (log.length > 0) {
			// first remove all entries
			log.find('li').remove();

			// then populate data
			entries.forEach(function(text) {
				log.append($('<li>', {
					text: text
				}));
			});	
		}
	},

	addItem: function(date) {
		$('#list').append(this._createItem(date));
	},

	clearItems: function() {
		$('#list').find('li').remove();
	},

	/* Helper Methods */

	_createItem: function(date) {
		// creates a single log block item lablled by the given date
		var item = $('<li>')
			.append($('<label>', {
				text: date.format('MM/DD (ddd)')
			}));

		// each unordered list is identified by its date (as a unix timestampe)
		// assigned to the data-log attribute
		var log = $('<ul>', {
				'contenteditable': true,
				'class': 'day',
				'data-log': +date
			}).append($('<li>'));

		item.append(log);
		return item;
	},

	_findLogElement: function(key) {
		return $('.day').filter(function() {
			return $(this).data('log') === parseInt(key);
		});
	},
}

// the controller
var App = function(view) {
	// app constructor
	this._appView = view;

	this.setDefaultDates();
	this.generateDailyBlocks();
	this.loadLocalData();
	this.setEventHandlers();
};

App.prototype = {
	defaultStartDateKey: '_defaultStartDate',
	
	setDefaultDates: function() {
		if (this.defaultStartDateKey in localStorage) {
			this._startDate = moment(localStorage.getItem(this.defaultStartDateKey));
		} else {
			this._startDate = moment().startOf('d');
			localStorage.setItem(this.defaultStartDateKey, this._startDate.format('YYYY-MM-DD'));
		}
		$('#defaultStartDate').attr('checked', true);

		this._endDate = moment().add('d', 7);
		this._appView.updateDisplayedDates(this._startDate, this._endDate);
	},

	generateDailyBlocks: function() {
		this._appView.clearItems();

		for (var currDate = moment(this._startDate); 
				!currDate.isAfter(this._endDate); 
				currDate = currDate.add('d', 1)) {
			this._appView.addItem(currDate);
		}
	},

	loadLocalData: function() {
		for (var key in localStorage) {
			if (key === this.defaultStartDateKey) {
				continue;
			}
			var entries = JSON.parse(localStorage.getItem(key));
			this._appView.updateLogItem(key, entries);
		}
	},

	startDateChanged: function(value) {
		// set change events for date range
		this._startDate = moment(value);
		// change end date if start dates becomes greater than endate
		if (this._startDate.isAfter(this._endDate)) {
			this._endDate = moment(this._startDate).add('days', 7);
			this._appView.updateDisplayedDates(null, this._endDate);
		}

		this.generateDailyBlocks();
		this.loadLocalData();
	},

	endDateChanged: function(value) {
		this._endDate = moment(value);
		// change start date if end date becomes earlier than start date
		if (this._endDate.isBefore(this._startDate)) {
			this._startDate = moment(this._endDate).subtract('days', 7);
			this._appView.updateDisplayedDates(this._startDate, null);
		}
		this.generateDailyBlocks();
		this.loadLocalData();
	},

	setEventHandlers: function() {
		var that = this;

		$('#startDate').on('change', function(e) { 
			var val = $(e.target).val();
			if (val !== localStorage.getItem(this.defaultStartDateKey)) {
				$('#defaultStartDate').attr('checked', false);
			}
			app.startDateChanged(val); 
		});

		$('#endDate').on('change', function(e) {
			app.endDateChanged($(e.target).val());
		});

		$('#defaultStartDate').on('change', function(e) {
			var val = $('#startDate').val();

			if ($(e.target).is(':checked')) {
				localStorage.setItem(that.defaultStartDateKey, val);
			} else {
				localStorage.removeItem(that.defaultStartDateKey);
			}
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
				// TODO: this logic should be in the controller not view?
				localStorage.setItem(target.data('log'), JSON.stringify(log));
			}
		});
	}
}

/********************
  Script starts
********************/
var app = new App(appView);

// FIXME: chaning dates = buggy
// TODO: advance by week or paginate?
// TODO: save on change not on enter keydown event
