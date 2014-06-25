function removeItems() {
	$('#list').find('li').remove();
}

function generateDailyBlocks() {
	removeItems();
	for (var currDate = startDate; !currDate.isAfter(endDate); currDate = currDate.add('d', 1)) {
		var item = $('<li/>')
			.append($('<label/>', {
				text: currDate.format('ddd MM/DD')
			}))
			.append(
				'<ul contenteditable="true">' +
					'<li></li>' +
				'</ul>'
			);

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

/********************
  Script starts
********************/

// set default dates
var startDate = moment(),
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

// append a new item if none exists
$('#list').on('keyup', function(e) {
	var target = $(e.target);

	if (target.find('li').length == 0) {
		target.append($('<li/>'));
	}
});

generateDailyBlocks();

// FIXME: chaning dates = buggy
// TODO: advance by week
// TODO: localStorage
// TODO: paginate
