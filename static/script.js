function removeItems() {
	$('#list').find('li').remove();
}

function generateDailyBlocks() {
	removeItems();
	for (var currDate = startDate; !currDate.isAfter(endDate); currDate = currDate.add('d', 1)) {
		var item = $('<li/>')
			.append($('<label/>', {
				text: currDate.format('ddd MM/DD')
			}));

		var log = $('<ul/>', {
				'contenteditable': true,
				'class': 'day',
				'data-log': currDate
			}).append($('<li/>'));

		item.append(log);
		$('#list').append(item);
	}
}

function updateDates(startDate, endDate) {
	if (startDate) {
		$('#startDate').val(startDate.format('YYYY-MM-DD'));
	}

	if (endDate) {
		$('#endDate').val(endDate.format('YYYY-MM-DD'));
	}
}

function loadLocalData() {
	for (key in localStorage) {
		console.log(key);
	}
}

/********************
  Script starts
********************/

// set default dates
var startDate = moment().subtract('d', 7),
	endDate = moment().add('d', 7);

updateDates(startDate, endDate);

// set change events for date range
$('#startDate').on('change', function(e) {
	startDate = moment($(e.target).val());
	if (startDate.isAfter(endDate)) {
		endDate = moment(startDate).add('days', 7);
		updateDates(null, endDate);
	}
	generateDailyBlocks();
});

$('#endDate').on('change', function(e) {
	endDate = moment($(e.target).val());
	if (endDate.isBefore(startDate)) {
		startDate = moment(endDate).subtract('days', 7);
		updateDates(startDate, null);
	}
	generateDailyBlocks();
});

$('#list').on('keyup', function(e) {
	var target = $(e.target);

	// append a new item if none exists
	if (target.find('li').length == 0) {
		target.append($('<li/>'));
		return;
	}

	// TODO: should make a button to save instead
	if (e.which == 13) {
		var log = [];
		target.find('li').each(function(index, item) {
			log.push($(item).text());
		});
		localStorage.setItem(target.data('log'), JSON.stringify(log));
	}

});


generateDailyBlocks();
loadLocalData();

// FIXME: chaning dates = buggy
// TODO: advance by week
// TODO: localStorage
// TODO: paginate
