// TODO: make app an object, encapsulate functions
var App = function() {
	// set default dates, set default start date to first day of hacker school
	this.getDefaultDates = function() {
		return {
			startDate:  moment('20140721', 'YYYYMMDD'),
			endDate: moment().add('d', 7)
		};
	};

	this.removeItems = function() {
		$('#list').find('li').remove();
	};

	this.generateDailyBlocks = function() {
		this.removeItems();
		var defaultDates = this.getDefaultDates();

		for (var currDate = defaultDates.startDate; 
				!currDate.isAfter(defaultDates.endDate); 
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

	this.updateDates = function(startDate, endDate) {
		if (startDate) {
			$('#startDate').val(startDate.format('YYYY-MM-DD'));
		}

		if (endDate) {
			$('#endDate').val(endDate.format('YYYY-MM-DD'));
		}
	};

	this.loadLocalData = function() {
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

	this.startDateChanged = function(e) {

	};

};


/********************
  Script starts
********************/
var app = new App();
var defaultDates = app.getDefaultDates();
app.updateDates(defaultDates.startDate, defaultDates.endDate);

// set change events for date range
$('#startDate').on('change', function(e) {
	startDate = moment($(e.target).val());
	// change end date is start dates becomes greater than endate
	if (startDate.isAfter(endDate)) {
		endDate = moment(startDate).add('days', 7);
		updateDates(null, endDate);
	}
	generateDailyBlocks();
	loadLocalData();
});

$('#endDate').on('change', function(e) {
	endDate = moment($(e.target).val());
	// change start date if end date becomes earlier than start date
	if (endDate.isBefore(startDate)) {
		startDate = moment(endDate).subtract('days', 7);
		updateDates(startDate, null);
	}
	generateDailyBlocks();
	loadLocalData();
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
