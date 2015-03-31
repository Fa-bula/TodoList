'use strict';
/*global io*/

$(document).ready(function() {
    $('#NewToDo').focus();
    var socket = io();
    function appendToDo(index, content) {
	var NewToDo = $('<div class="ToDo">');
	NewToDo.attr('id', index);
	NewToDo.append('<input type="checkbox" id=check-' + index + '>');
	NewToDo.append('<span class="ToDo-text" id=ToDo-' + index + '>' + content);
	NewToDo.append('<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
	NewToDo.append('<hr>');
	$('#TableOfToDo').append(NewToDo);    
    }
    
    socket.on('initiate', function(ToDos) {
	for (var key in ToDos) {
	    appendToDo(key, ToDos[key]);
	}
    });

    $('form').submit(function(event) {
	$('#AllComp').removeAttr('checked');
	var content = $('#NewToDo').val();
	$('#NewToDo').val('');
	socket.emit('newToDo', content);
	event.preventDefault();
    });
    
    socket.on('appendToDo', function(index, content) {
	appendToDo(index, content);
    });
    
    socket.on('deleteToDo', function(index) {
	$('#' + index).remove();
    });
    
    $(document).on('mousedown', 'button[class="close"]', function(event) {
	socket.emit('deleteToDo', $(this).parent().attr('id'));
    });
    
    
    $('#AllComp').change(function(event) {
	if (void 0 === $('#AllComp').attr('checked')) {
	    $('span[id*=ToDo-]').addClass('doneToDo');
	    $('#AllComp').attr('checked', 'checked');
	    $('input[id*=check-]').attr('checked', 'checked');
	    $('input[id*=check-]').prop('checked', true);
	} else {
	    $('span[id*=ToDo-]').removeClass('doneToDo');
	    $('#AllComp').removeAttr('checked');
	    $('input[id*=check-]').prop('checked', false);
	    $('input[id*=check-]').removeAttr('checked');
	}
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $(document).on('change', 'input[id*=check-]', function(event) {
	var currentDiv = '#ToDo' + $(this).attr('id').slice(5);
	if (void 0 === $(this).attr('checked')) {
	    $(currentDiv).addClass('doneToDo');
	    $(this).attr('checked', 'checked');
	} else {
	    $(currentDiv).removeClass('doneToDo');
	    $(this).removeAttr('checked');
	    $('#AllComp').removeAttr('checked');
	}
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $(document).on('dblclick', 'span[id*=ToDo-]', function(event) {
	$(this).attr('contenteditable', 'true');
	$(this).prop('contenteditable', 'true');
	$(this).focus();
    });

    $(document).on('focusout', 'span[id*=ToDo-]', function(event) {
	socket.emit('toDoChanged', $(this).parent().attr('id'), $(this).html());
    });
    
    socket.on('toDoChanged', function(index, newContent) {
	$('#' + index + ' span:first').html(newContent);
    });
    
    $(document).on('keydown', 'span[id*=ToDo-]', function(event) {
	if ( event.which === 13 ) {
	    event.preventDefault();
	    $('#NewToDo').focus();
	}
    });
    
    $(document).on('mousedown', 'span[id*=ToDo-]', function(event) {
	event.preventDefault();
    });
    
    $(document).on('focusout', 'span[id*=ToDo-]', function(event) {
	$(this).attr('contenteditable', 'false');
	$(this).prop('contenteditable', 'false');
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $('#done').click( function(event) {
	$('.doneToDo').parent().remove();
	$('#AllComp').prop('checked', 'false');
	$('#AllComp').removeAttr('checked');
	$('#NewToDo').focus();
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
});
