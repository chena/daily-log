function removeItems() {
	$('#list').find('li').remove();
}

function generateDailyBlocks() {
	removeItems();
	for (var currDate = startDate; currDate.isBefore(endDate); currDate = currDate.add('d', 1)) {
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
var startDate = moment(),
	endDate = moment().add('d', 7);

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
	console.log('start date ' + new Date(startDate));
	console.log('end date ' + new Date(endDate));
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