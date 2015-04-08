'use strict';
/*global io*/
/*global alert*/
/*global console*/
/*global isNaN*/
/*global Math*/

$(document).ready(function() {
    if ('') {
	alert('1');
	console.log('1');
    }
    
    $('#NewToDo').focus();
    var socket = io();
    
    function prependToDo(index, toPrepend) {
	var newToDo = $('<div class="ToDo">').attr('id', index);
	var checkbox = $('<input type="checkbox">').prop('checked', toPrepend.isDone);
	var span = $('<span class="ToDo-text">').text(toPrepend.content);
	var button = $('<button>').addClass('close').attr('type', 'button').text('×');

	newToDo.append(checkbox);
	newToDo.append(span);
	newToDo.append(button);
	newToDo.append('<hr>');
	if (toPrepend.isDone) {
	    span.addClass('doneToDo');
	}
	
	$('#TableOfToDo').prepend(newToDo);
    }
    
    socket.on('initiate', function(ToDos) {
	var keys = Object.keys(ToDos).sort(function(a, b) {
	    return +a - +b;
	});
	
	for (var i = 0; i < keys.length; ++i) {
	    prependToDo(keys[i], ToDos[keys[i]]);
	}
	updateProgressBar();
    });
    
    socket.on('prependToDo', function(index, newToDo) {
	prependToDo(index, newToDo);
	updateProgressBar();
    });
    
    socket.on('deleteToDo', function(index) {
	$('#' + index).remove();
	updateProgressBar();
    });
    
    socket.on('toDoChanged', function(index, newContent) {
	$('#' + index + ' span').text(newContent);
    });
    
    socket.on('toggleToDo', function(index) {
	var checkbox = $('#' + index + ' input');
	checkbox.prop('checked', !checkbox.prop('checked'));
	checkbox.next().toggleClass('doneToDo');
	updateProgressBar();
    });

    $('form').submit(function(event) {
	$('#AllComp').prop('checked', false);
	var content = $('#NewToDo').val();
	$('#NewToDo').val('');
	socket.emit('newToDo', content);
	event.preventDefault();
    });
    
    $(document).on('mousedown', 'button[class="close"]', function(event) {
	socket.emit('deleteToDo', $(this).parent().attr('id'));
    });
    
    $('#AllComp').change(function(event) {
	var newValue = $(this).prop('checked');
	$('div[class="ToDo"] input').prop('checked', newValue);
	$('div[class="ToDo"] input').trigger('change');
    });
    
    function updateProgressBar() {
	var persentage = $('span[class*="doneToDo"]').size() / $('div[class*="ToDo"]').size() * 100;
	if (isNaN(persentage)) {
	    persentage = 0;
	}
	$('div[class="progress-bar"]').css('width', Math.round(persentage) + '%');
	$('div[class="progress-bar"]').text(Math.round(persentage) + '%');
    }

    $(document).on('change', 'div[class="ToDo"] input', function(event) {
	var hasClass = $(this).next().hasClass('doneToDo');
	if ($(this).prop('checked') ? !hasClass: hasClass) {
	    $(this).next().toggleClass('doneToDo');
	    socket.emit('toggleToDo', $(this).parent().attr('id'));
	    updateProgressBar();
	}
    });

    $(document).on('keydown', 'div[class="ToDo"] span', function(event) {
	if ( event.which === 13 ) {
	    event.preventDefault();
	    $('#NewToDo').focus();
	}
    });
    
    $(document).on('dblclick', 'div[class="ToDo"] span', function(event) {
	$(this).prop('contenteditable', 'true');
	$(this).focus();
    });

    $(document).on('mousedown', 'div[class="ToDo"] span', function(event) {
	event.preventDefault();
    });
    
    $(document).on('focusout', 'div[class="ToDo"] span', function(event) {
	$(this).prop('contenteditable', false);
	socket.emit('toDoChanged', $(this).parent().attr('id'), $(this).text());
    });
   
    $('#done').click( function(event) {
	var doneToDos = $.map($('span.doneToDo').parent(), function(element) {
	    return $(element).attr('id');
	});
	$.each(doneToDos, function (index, value) {
	    socket.emit('deleteToDo', value);
	});
    });
});
