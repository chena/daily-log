function removeItems() {
	$('#list').find('li').remove();
}

function generateDate() {
	removeItems();
	for (var currDate = startDate; currDate.isBefore(endDate); currDate = currDate.add('d', 1)) {
		var item = $('<li/>', {
			'class': 'item',
			text: currDate.format('ddd MM/DD')
		});

		item.append(
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
	generateDate();
});

$('#endDate').on('change', function(e) {
	endDate = moment($(e.target).val());
	if (endDate.isBefore(startDate)) {
		startDate = moment(endDate).subtract('d', 7);
	}
	generateDate();
});

// append a new item if none exists
$('#list').on('keyup', function(e) {
	var target = $(e.target);

	if (target.find('li').length == 0) {
		target.append($('<li/>'));
	}
});

/*
$('#list').on('keyup', function(e) {
	var target = $(e.target),
		content = target.text();

	if (e.which == 13) {
		target.text('');
		target.append($('<li/>', {
			text: content
		}));
	}
});*/
generateDate();