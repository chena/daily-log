
// default start end end
var startDate = moment(),
	endDate = moment().add('d', 7);

$('#startDate').on('change', function(e) {
	startDate = moment($(e.target).val());
	if (startDate.isAfter(endDate)) {
		startDate = moment(endDate).subtract('d', 7);
	}
	generateDate();
});

$('#endDate').on('change', function(e) {
	endDate = moment($(e.target).val());
	if (endDate.isBefore(startDate)) {
		endDate = moment(startDate).add('d', 7);
	}
	generateDate();
});

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

		/*
		item.append($('<ul/>', {
			'class': 'item-list',
			'contenteditable': true
		}));*/
		item.append('<ul contenteditable="true"><li></li></ul>');

		$('#list').append(item);
	}
}
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

$('#list').on('keyup keydown', function(e) {
	var target = $(e.target),
		content = function() {
			return target.text();
		};

	if (target.find('li').length == 0) {
		target.append($('<li/>', {
			text: content
		}));
		//target.text('');
	}
});

generateDate();

