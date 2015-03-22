$(document).ready(function() {
    var i = 0;
    $('#NewToDo').focus();
    $('#TableOfToDo').append(localStorage.getItem('TableOfToDo'));
    if (JSON.parse(localStorage.getItem('maxI')) != null)
	i = JSON.parse(localStorage.getItem('maxI'));
    
    $('form').submit(function(event) {
	$('#AllComp').removeAttr("checked");
	var text = $('#NewToDo').val();
	$('#NewToDo').val('');
	var NewToDo = $('<div class="ToDo">');
	NewToDo.append('<input type="checkbox" id = check-' + i + '>');
	NewToDo.append('<span  id = ToDo-' + i + '>' + text);
	NewToDo.append('<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
	NewToDo.append('<hr>');
	i++;
	$('#TableOfToDo').append(NewToDo);
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
	localStorage.setItem('maxI', JSON.stringify(i));
	event.preventDefault();
    });
    
    $(document).on('mousedown', 'button[class="close"]', function(event) {
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
	$(this).parent().remove();
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $('#AllComp').change(function(event) {
	if (void 0 === $("#AllComp").attr("checked")) {
	    $('span[id*=ToDo-]').addClass('doneToDo');
	    $("#AllComp").attr("checked", "checked");
	    $("input[id*=check-]").attr("checked", "checked");
	    $("input[id*=check-]").prop("checked", true);
	} else {
	    $('span[id*=ToDo-]').removeClass('doneToDo');
	    $("#AllComp").removeAttr("checked");
	    $("input[id*=check-]").prop("checked", false);
	    $("input[id*=check-]").removeAttr("checked");
	}
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $(document).on('change', 'input[id*=check-]', function(event) {
	var cur_div = '#ToDo' + $(this).attr("id").slice(5);
	if (void 0 === $(this).attr("checked")) {
	    $(cur_div).addClass('doneToDo');
	    $(this).attr("checked", "checked");
	} else {
	    $(cur_div).removeClass('doneToDo');
	    $(this).removeAttr("checked");
	    $('#AllComp').removeAttr("checked");
	}
	localStorage.setItem('TableOfToDo', $('#TableOfToDo').html());
    });
    
    $(document).on('dblclick', 'span[id*=ToDo-]', function(event) {
	$(this).attr('contenteditable', 'true');
	$(this).prop('contenteditable', 'true');
	$(this).focus();
    });
    
    $(document).on('keydown', 'span[id*=ToDo-]', function(event) {
	if ( event.which == 13 ) {
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
