$( document ).ready(function() {
  
  $('input[type=date]').mwd_datepicker();
  
	$('input[type=time]').mwd_timepicker();
	
	$('input.timezone[type=time]').mwd_timepicker('destroy').mwd_timepicker({
		showTimezone: true
	});	
	
	$('input[type=datetime-local]').mwd_datetimepicker();	
	
	$('input[type=datetime]').mwd_datetimepicker({
		showTimezone: true
	});		
	
	$('input[type=month]').mwd_monthpicker();	
	
	$('input[type=week]').mwd_weekpicker();	
	
});
