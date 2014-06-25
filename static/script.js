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

/********************
  Script starts
********************/

// set default dates
var startDate = moment(),
	endDate = moment().add('d', 7);

$('#startDate').val(startDate.format('YYYY-MM-DD'));
$('#endDate').val(endDate.format('YYYY-MM-DD'));

// set change events for date range
$('#startDate').on('change', function(e) {
	startDate = moment($(e.target).val());
	if (startDate.isAfter(endDate)) {
		endDate = moment(startDate).add('d', 7);
	}
	generateDailyBlocks();
});

$('#endDate').on('change', function(e) {
	endDate = moment($(e.target).val());
	if (endDate.isBefore(startDate)) {
		startDate = moment(endDate).subtract('d', 7);
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
