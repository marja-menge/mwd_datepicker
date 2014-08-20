/*mwd_datepicker - v1.0 beta
* http://www.mwd-form-elements.com/datetime/#!/getting-started/download/mwd_datepicker
* Copyright (c) 2014 Marja Menge, Menge Webdesign, MIT License */
(function ($) {

	/*Do not redefine mwd_datepicker */
	$.ui.mwd_datepicker = $.ui.mwd_datepicker || {};
	if ($.ui.mwd_datepicker.version) { return; }

	/* Extend jQueryUI, get it started with our version number	*/
	$.extend($.ui, { mwd_datepicker: {	version: '@@version' } });	
	
	/* mwd_datepicker manager / Settings for the individual mwd_datepickers are stored in an instance object */
	var this_datepicker = function () {
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[''] = { // Default regional settings
			currentText: 'Now',
			clearBtnText: 'Clear',
			weekText: 'Week',
			timeText: 'Current time:&nbsp;',
			closeText: 'Close'
		};
		this._defaults = {
			datePicker: true,
			changeMonth: true,
			monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			changeYear: true,
			showButtonPanel: true,
			dateFormat: 'dd-mm-yy',
			clearBtn: true,
			monthPicker: false,
			monthSeperator: ' ',
			weekPicker: false,
			weekSeperator: ', ',
			timePicker: false,
			timeSeperator: ' ',
			minTime: '00:00',
			maxTime: '23:59',
			step: 1,
			orientation: 'horizontal',
			showTimezone: false,
			timezoneList: [
			   			{ value: -12, label: ' Z-12h'},
			   			{ value: -11, label: ' Z-11h'},
			   			{ value: -10, label: ' Z-10h'},
			   			{ value: -9, label: ' Z-9h'},
			   			{ value: -8, label: ' Z-8h'},
			   			{ value: -7, label: ' Z-7h'},
			   			{ value: -6, label: ' Z-6h'},
			   			{ value: -5, label: ' Z-5h'},
			   			{ value: -4, label: ' Z-4h'},
			   			{ value: -3, label: ' Z-3h'},
						{ value: -2, label: ' Z-2h'},
						{ value: -1, label: ' Z-1h'},
						{ value: 0, label: ' Z+0h'},
						{ value: +1, label: ' Z+1h'},
						{ value: +2, label: ' Z+2h'},
						{ value: +3, label: ' Z+3h'},
						{ value: +4, label: ' Z+4h'},
						{ value: +5, label: ' Z+5h'},
						{ value: +6, label: ' Z+6h'},
						{ value: +7, label: ' Z+7h'},
						{ value: +8, label: ' Z+8h'},
						{ value: +9, label: ' Z+9h'},
						{ value: +10, label: ' Z+10'},
						{ value: +11, label: ' Z+11h'},
						{ value: +12, label: ' Z+12h'}
			]
		};
		$.extend(this._defaults, this.regional['']);
	};

	$.extend(this_datepicker.prototype, {

		/*Override default settings for all mwd_datepickers*/
		setDefaults: function (settings) {
			$.extend(this._defaults, settings || {});
			return $this;
		},

		/*Create a new mwd_datepicker instance*/
		_newInst: function ($input, opts) {
			var mwddp_inst = new this_datepicker(),
			fns = {},
			overrides;

			/* Override datepicker event functions. If the user has specified any in the options, they are called at the end*/
			overrides = {
				beforeShow: function (input, dp_inst) {	
					var thisro = $(input).attr('readonly');
					if(thisro) { return false; }					
					if ($.isFunction(mwddp_inst._defaults.evnts.beforeShow)) {
						return mwddp_inst._defaults.evnts.beforeShow.call($input[0], input, dp_inst);
					}
				},
				onChangeMonthYear: function(y, m, dp_inst) {		
					mwddp_inst._setSelectedDate(dp_inst, 'select');
	                if ($.isFunction(mwddp_inst._defaults.evnts.onChangeMonthYear)) {
						return mwddp_inst._defaults.evnts.onChangeMonthYear.call($input[0], y, m, dp_inst);
					}	
				},
				onSelect: function(dateText, dp_inst) { 				
					if ($.isFunction(mwddp_inst._defaults.evnts.onSelect)) {
						return mwddp_inst._defaults.evnts.onSelect.call($input[0], dateText, dp_inst);
					}	
				},
				onClose: function (dateText, dp_inst) {
					if ($.isFunction(mwddp_inst._defaults.evnts.onClose)) {
						return mwddp_inst._defaults.evnts.onClose.call($input[0], dateText, dp_inst);
					}
				}
			};
			
			for (i in overrides) {
				if (overrides.hasOwnProperty(i)) {
					fns[i] = opts[i] || null;
				}
			}
			
			mwddp_inst._defaults = $.extend({}, this._defaults, opts, overrides, {
				evnts: fns,
				mwd_datepicker: mwddp_inst 
			});	

			mwddp_inst.$input = $input;	
			
			return mwddp_inst;
		},
		
		_setTheCss: function(input) {
			var dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			//alert($(input).datepicker('option', 'monthPicker'));
			//week
			if($(input).datepicker('option', 'weekPicker') == true) { 
				$('.ui-datepicker').css({height: dph + 'px', width: dpw + 'px'});
				$('.ui-datepicker').on('mousemove', 'tbody tr', function () { $(this).find('td a').addClass('ui-state-hover'); });
				$('.ui-datepicker').on('mouseleave', 'tbody tr', function() { $(this).find('td a').removeClass('ui-state-hover'); });
				$('.ui-datepicker').find('.ui-datepicker-current-day a').addClass('ui-state-default').removeClass('ui-state-active');
				$('.ui-datepicker').find('.ui-datepicker-current-day').parents('tr').addClass('ui-state-highlight');
			}
			//month
			else if($(input).datepicker('option', 'monthPicker') == true) { 
				$('.ui-datepicker-calendar').hide();
				$('.ui-datepicker').css({height: hh + 5 + bh + 'px', width: dpw + 'px'});
			}
			//time
			else if($(input).datepicker('option', 'timePicker') == true) {	
				var dp = $(input).datepicker('option', 'datePicker'),	
				orientation = 'v';
				if(dp == false) { 
					orientation = 'h'; 
					var tph = parseInt($('.time_sliderwrapper').css('height'));			
					$('.ui-datepicker-header').hide();
					$('.ui-datepicker-calendar').hide();
					$('.mwd-ui-datepicker-header-h').show();	
					$('.ui-datepicker').css({height: dph - calh + tph + 'px', width: dpw + 'px'});
				}
				else {
					$('.datewrapper-v').css({float: 'left', 'width': dpw + 'px'});
					$('.ui-datepicker').css({height: dph + 'px', width: 'auto'});			
					$('.mwd-ui-datepicker-header-v').css({paddingLeft: '5px', paddingBottom: '4px'});		
					$('.mwd-ui-datetimepicker').css({height: dph - 3 + 'px'});
				}							
				$('.ui-datepicker').off('mousemove', 'tbody tr');
				$('.ui-datepicker').off('mouseleave', 'tbody tr');
			}
			//date
			else {
				$('.ui-datepicker').css({height: dph + 'px', width: dpw + 'px'});
				$('.ui-datepicker').off('mousemove', 'tbody tr');
				$('.ui-datepicker').off('mouseleave', 'tbody tr');
			}
		},

		_setInitDate: function(input, dp_inst) {
		
			//set main vars					
			var thisval = $(input).attr('value'),
			disabled = $(input).attr('disabled'),
			placeholder = $(input).attr('placeholder'),
			mindate = $(input).datepicker('option', 'minDate'),
			maxdate = $(input).datepicker('option', 'maxDate'),
			mintime = $(input).datepicker('option', 'minTime'),
			maxtime = $(input).datepicker('option', 'maxTime'),
			step = $(input).datepicker('option', 'step'),		
			dp = $(input).datepicker('option', 'datePicker'),
			tp = $(input).datepicker('option', 'timePicker'),
			wp = $(input).datepicker('option', 'weekPicker'),
			mp = $(input).datepicker('option', 'monthPicker'),
			df = $(input).datepicker('option', 'dateFormat'),
			dfc = $.datepicker._getFormatConfig(dp_inst),
			thisdate = '',
			thistime = '',
			setdate = new Date(),
			settime = get_currenttime();	

			//datepicker init
			if(dp == true && tp == false) {
				if(thisval) {								
					thisdate = thisval;	
					thistime = settime;				
					setdate = thisval; 
				}
				$(input).datepicker('setDate', setdate); 
				$(input).datepicker('option', 'monthPicker', false);	
				$(input).datepicker('option', 'weekPicker', false);	
				$(input).datepicker('option', 'datePicker', true);	
				$(input).datepicker('option', 'timePicker', false);	
			}
			
			//datetimepicker init
			if(dp == true && tp == true) {
				var timesep = $(input).datepicker('option', 'timeSeperator'),
				thismintime = mintime,
				thismaxtime = maxtime,
				thismindate = mindate,
				thismaxdate = maxdate;
				if(thisval) {		
					var splitvalue1 = thisval.split(':'),
					splitvalue2 = splitvalue1[0].split(timesep),
					lastsep = splitvalue2.length-1;
					thistime = splitvalue2[lastsep] + ':' + splitvalue1[1];	
					thisdate = thisval.replace(timesep + thistime, '');			
					setdate = thisdate;
				}						
				if(mindate && mintime == '00:00' && mindate.match(timesep) && mindate.match(':')) {
					var splitvalue1 = mindate.split(':'),
					splitvalue2 = splitvalue1[0].split(timesep),
					lastsep = splitvalue2.length-1;
					thismintime = splitvalue2[lastsep] + ':' + splitvalue1[1];
					thismindate = mindate.replace(timesep + mintime, '');			
					$(input).datepicker('option', 'minDate', thismindate);			
					$(input).datepicker('option', 'minTime', thismintime);
				}						
				if(maxdate && maxtime == '23:59' && maxdate.match(timesep) && maxdate.match(':')) {
					var splitvalue1 = maxdate.split(':'),
					splitvalue2 = splitvalue1[0].split(timesep),
					lastsep = splitvalue2.length-1;
					thismaxtime = splitvalue2[lastsep] + ':' + splitvalue1[1];	
					thismaxdate = maxdate.replace(timesep + maxtime, '');			
					$(input).datepicker('option', 'maxDate', thismaxdate);	
					$(input).datepicker('option', 'maxTime', thismaxtime);
				}
				if(timesep == '' || thisdate.match(timesep)) {
					timesep = ' T';
					$(input).datepicker('option', 'timeSeperator', ' T');
				}
				$(input).datepicker('setDate', setdate); 
				$(input).datepicker('option', 'orientation', 'vertical');	
				$(input).datepicker('option', 'monthPicker', false);	
				$(input).datepicker('option', 'weekPicker', false);	
				$(input).datepicker('option', 'datePicker', true);	
				$(input).datepicker('option', 'timePicker', true);	
			}

			//timepicker init
			if(dp == false && tp == true) {		
				$(input).datepicker('option', 'dateFormat',  'dd-mm-yy');
				if(thisval) {						
					thisdate = $.datepicker.formatDate('dd-mm-yy', setdate, '');
					thistime = thisval;	
				}
				$(input).datepicker('setDate', setdate); 
				$(input).datepicker('option', 'orientation', 'horizontal');
				$(input).datepicker('option', 'timeSeperator', '_____');
				$(input).datepicker('option', 'monthPicker', false);	
				$(input).datepicker('option', 'weekPicker', false);	
				$(input).datepicker('option', 'datePicker', false);	
				$(input).datepicker('option', 'timePicker', true);	
			}					

			if(tp == true) {	
				if(thistime) {
					var gettimevalues = get_value_from_time(thistime),
					timevalue = gettimevalues['value'];
					if(thismintime && thismintime != '00:00') {
						var get_thistime_min = get_value_from_time(thismintime),
						minvalue = get_thistime_min['value'];
						if(timevalue < minvalue) {
							thistime = thismintime;
						}
					}
					if(thismaxtime && thismaxtime != '23:59') {
						var get_thistime_max = get_value_from_time(thismaxtime),
						maxvalue = get_thistime_max['value'];
						if(timevalue > maxvalue) {
							thistime = thismaxtime;
						}
					}
				}
			}
			
			//weekpicker init
			if(wp == true) {									
				var wsep = $(input).datepicker('option', 'weekSeperator');
				if(thisval) {
					var weekvalnrs = thisval.split(wsep),						
					weekvalnrs1 = weekvalnrs[0].match(/\d/g),
					wyval = parseInt(weekvalnrs[1]),
					wwval = parseInt(weekvalnrs1.join('')),
					setdate = get_first_weekday(wwval, wyval);
					thisdate = thisval;	
					thistime = settime;	
				}			
				if(mindate) {
					var weekvalnrsmin = mindate.split(wsep),						
					weekvalnrs1min = weekvalnrsmin[0].match(/\d/g),
					wymin = parseInt(weekvalnrsmin[1]),
					wwmin = parseInt(weekvalnrs1min.join('')),
					wdmin = get_first_weekday(wwmin, wymin);
					$(input).datepicker('option', 'minDate', wdmin);
				}						
				if(maxdate) {
					var weekvalnrsmax = maxdate.split(wsep),						
					weekvalnrs1max = weekvalnrsmax[0].match(/\d/g),
					wymax = parseInt(weekvalnrsmax[1]),
					wwmax = parseInt(weekvalnrs1max.join('')),
					wdmax = get_first_weekday(wwmax, wymax);
					$(input).datepicker('option', 'maxDate', wdmax);
				}						
				$(input).datepicker('setDate', setdate); 
				$(input).datepicker('option', 'showWeek', true);
				$(input).datepicker('option', 'firstDay', 1);
				$(input).datepicker('option', 'datePicker', true);	
				$(input).datepicker('option', 'timePicker', false);	
				$(input).datepicker('option', 'monthPicker', false);	
				$(input).datepicker('option', 'weekPicker', true);	
			}					

			//monthpicker init				
			if(mp == true) {
				var msep = $(input).datepicker('option', 'monthSeperator');
				$(input).datepicker('option', 'dateFormat',  'd MM' + msep + 'yy');
				if(thisval) {
					setdate = '1 ' + thisval;
					thisdate = thisval;	
					thistime = settime;	
				}
				if(mindate) {
					$(input).datepicker('option', 'minDate', '1 ' + mindate);
				}
				if(maxdate) {
					$(input).datepicker('option', 'maxDate', '1 ' + maxdate);
				}
				$(input).datepicker('setDate', setdate); 						
				$(input).datepicker('option', 'datePicker', true);	
				$(input).datepicker('option', 'timePicker', false);	
				$(input).datepicker('option', 'weekPicker', false);	
				$(input).datepicker('option', 'monthPicker', true);	
			}
			//integer step
			if(step) { $(input).datepicker('option', 'step', parseInt(step));	}
			
			return { 'thisdate': thisdate, 'thistime': thistime };
			
		},
		
		
		_setSelectedDate: function(dp_inst, initval) {
			var mwddp_inst = $.datepicker._get(dp_inst, 'mwd_datepicker'),
			thisid = this.$input.attr('id'),
			dateid = '#mwd_date_' + thisid,
			hiddenid_date = '#mwd_date_hidden_' + thisid,
			hiddenid_time = '#mwd_time_hidden_' + thisid,
			thistype = 'date';
						
			var d = dp_inst.selectedDay,
			m = dp_inst.selectedMonth,
			fm = m + 1,
			y = dp_inst.selectedYear;

			if (this.$input.datepicker('option', 'weekPicker') == true) { thistype = 'week'; }
			if (this.$input.datepicker('option', 'monthPicker') == true) { thistype = 'month'; }
			
			//valid date
			try { $.datepicker.parseDate('yy-m-d', y + '-' + fm + '-' + d, ''); }
			catch (e) { 
				var ld = new Date(y, m + 1, 0), 
				ldm = ld.getDate();
				d = ldm;
			}
			var thisnewdateval = new Date(y + '/' + fm + '/' + d);	
			
			var dateopts = '',
			dateobject = '',
			datestring = '',
			timestring = '',
			df = this.$input.datepicker('option', 'dateFormat'),
			dfc = $.datepicker._getFormatConfig(dp_inst);
			
			if(thistype == 'date') {
				dateopts = { 'sep': '', 'df': df, 'dfc': dfc };
			}
			if(thistype == 'month') {
				dateopts = { 'sep': this.$input.datepicker('option', 'monthSeperator'), 'monthnames': this.$input.datepicker('option', 'monthNames'), 'dfc': dfc };				
			}
			if(thistype == 'week') {		
				dateopts = { 'sep': this.$input.datepicker('option', 'weekSeperator'), 'weektext': this.$input.datepicker('option', 'weekText') };			
			}

			var get_thisdate = get_newdate (thistype, thisnewdateval, dateopts);
			if(get_thisdate == undefined) { }
			else {
				dateobject = get_thisdate['dateobject'];
				datestring = String(get_thisdate['datestring']);
			}
			this.$input.datepicker('setDate', dateobject); 
			
			
			var timezonelist = '',
			timeopts = '',
			thistime = $(hiddenid_time).val();
			
			//get time
			if(this.$input.datepicker('option', 'showTimezone') == true) { 
				timezonelist = this.$input.datepicker('option', 'timezoneList');
			}

			timeopts = {'timezonelist': timezonelist};
			var get_thistime = get_newtime(thistime, timeopts),
			timestring = get_thistime['timestring'],
			timezonevalue = get_thistime['timezonevalue'],
			timesep = this.$input.datepicker('option', 'timeSeperator');

			var timezonelabel = '';
			if(timezonelist) { 
				$.map(timezonelist, function (val) {
					if(timezonevalue == val.value) {	timezonelabel = val.label; }
				});			
			}
			
			var required = this.$input.attr('required');
			if(initval == '' && !required) {
				datestring = '';
				timestring = '';
			}
			//date & time
			var dateshow = datestring,
			dp = this.$input.datepicker('option', 'datePicker');
			if(this.$input.datepicker('option', 'timePicker') == true) {
				if(datestring != '' && timestring != '') { dateshow = datestring + timesep + timestring + timezonelabel; }
			}
			if(dp == false) {
				if(timestring != '') { dateshow = timestring + timezonelabel; }
			}
			$(hiddenid_date).val(datestring);	
			$(hiddenid_time).val(timestring + timezonelabel);	
			$(dateid).val(dateshow);

			var placeholder = this.$input.attr('placeholder'),
			placeholderid = '#mwd_placeholder_' + thisid;
			
			if(placeholder) { 
				$(placeholderid).html(''); 
				if($(dateid).val() == '') { $(placeholderid).html(placeholder); }	
			}

		},
				
		_addClearBtn: function(input) {  
			var required = $(input).attr('required'),
			clearbtn = $(input).datepicker('option', 'clearBtn'),
			buttondisplay = '';
			if(required || clearbtn == false) { buttondisplay = 'display: none;'; }
			var buttonPane = $(input).datepicker('widget').find('.ui-datepicker-buttonpane');
			var thisid = $(input).attr('id'),
			btntxt = $(input).datepicker('option', 'clearBtnText'),
			placeholder = $(input).attr('placeholder'),
			btn = $('<button class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="' + buttondisplay + '">' + btntxt + '</button>')			
			.unbind('click')
			.bind('click', function () { 
				$.datepicker._clearDate(input); 
				$('#mwd_date_' + thisid).val(''); 
				$('#mwd_date_hidden_' + thisid).val(''); 			
				$('#mwd_time_hidden_' + thisid).val(''); 					
				if (placeholder) { $('#mwd_placeholder_' + thisid).html(placeholder); }
			})
			.appendTo(buttonPane); 	
		},
		
		_addTimepicker: function(input, dp_inst) {		
			if($(input).datepicker('option', 'timePicker') == true) { 					
				var thisid = $(input).attr('id'),
				dpdiv = dp_inst.dpDiv,
				buttonPane = dpdiv.find('.ui-datepicker-buttonpane'),
				timetext = $(input).datepicker('option', 'timeText'),
				zonelist = '',
				zonelistclass = '';
				if($(input).datepicker('option', 'showTimezone') == true) {
					zonelist = '<select id="zonelist_' + thisid + '" class="zonelist"></select>',
					zonelistclass = ' time_slider_btn-zl';	
				}	

				if($(input).datepicker('option', 'datePicker') == false) { 
					var html_h = '<div class="mwd-ui-timepicker">';					
					html_h += '<div class="ui-datepicker-header mwd-ui-datepicker-header-h ui-widget-header ui-helper-clearfix ui-corner-all">';
					html_h += '<div class="time_current_txt">' + timetext + '</div>';
					html_h += '<input id="mwd_time_current_' + thisid + '" type="text" value="" readonly>';
					html_h += zonelist;	
					html_h += '</div>';	
					html_h += '<div class="time_sliderwrapper">';
					html_h += '<div id="time_slider_min_btn_' + thisid + '" class="time_slider_btn time_slider_min_btn ui-corner-all ui-state-default">';
					html_h += '<span class="ui-icon ui-icon-circle-triangle-w"></span>';
					html_h += '</div>';		
					html_h += '<div id="time_slider_' + thisid + '" class="time_slider"></div>';
					html_h += '<div id="time_slider_max_btn_' + thisid + '" class="time_slider_btn time_slider_max_btn ui-corner-all ui-state-default">';
					html_h += '<span class="ui-icon ui-icon-circle-triangle-e"></span>';
					html_h += '</div>';	
					html_h += '</div>';		
					html_h += '<div id="time_slider_min_' + thisid + '" class="time_slider_time time_slider_mintime"></div>';		
					html_h += '<div id="time_slider_max_' + thisid + '" class="time_slider_time time_slider_maxtime"></div>';	
					html_h += '</div>';	
					$(html_h).prependTo(dpdiv);					
				} else {
					var html_v = '<div class="mwd-ui-datetimepicker' + '">';
					html_v += '<div class="ui-datepicker-header mwd-ui-datepicker-header-v ui-widget-header ui-helper-clearfix ui-corner-all">';
					html_v += '<input id="mwd_time_current_' + thisid + '" type="text" value="" readonly>';
					html_v += zonelist;	
					html_v += '</div>';
					html_v += '<div id="time_slider_max_btn_' + thisid + '" class="time_slider_btn' + zonelistclass + ' time_slider_max_btn ui-corner-all ui-state-default">';
					html_v += '<span class="ui-icon ui-icon-circle-triangle-n"></span>';
					html_v += '</div>';
					html_v += '<div id="time_slider_min_' + thisid + '" class="time_slider_time time_slider_mintime"></div>';
					html_v += '<div id="time_slider_' + thisid + '" class="time_slider"></div>';
					html_v += '<div id="time_slider_max_' + thisid + '" class="time_slider_time time_slider_maxtime"></div>';
					html_v += '<div id="time_slider_min_btn_' + thisid + '" class="time_slider_btn' + zonelistclass + ' time_slider_min_btn ui-corner-all ui-state-default">';
					html_v += '<span class="ui-icon ui-icon-circle-triangle-s"></span>';
					html_v += '</div>';
					html_v += '</div>';
					$( dpdiv ).wrapInner('<div class="datewrapper-v"></div>');
					$(html_v).appendTo(dpdiv);
				}				
				var mwddp_inst = $.datepicker._get(dp_inst, 'mwd_datepicker');		
				mwddp_inst._addSlider(input, dp_inst);	
			}				
		},
		
		_addSlider: function(input, dp_inst) {
			if($(input).datepicker('option', 'timePicker') == true) { 
				var thisid = $(input).attr('id'),
				hiddenid_time = '#mwd_time_hidden_' + thisid,
				hiddenid_date = '#mwd_date_hidden_' + thisid;

				$('button.ui-datepicker-current').on('click', function() {
					var $dp = dp_inst.dpDiv;
					$('button.ui-datepicker-clear').trigger('click');
					$('.ui-datepicker-today', $dp).click();
				});
				
				var thistime = $(hiddenid_time).val(),
				dateid = '#mwd_date_' + thisid,
				orientation =$(input).datepicker('option', 'orientation'),
				stepvalue = parseInt($(input).datepicker('option', 'step')),
				thismintime = String($(input).datepicker('option', 'minTime')),
				thismaxtime = String($(input).datepicker('option', 'maxTime')),
				get_thistime = {},
				dp = $(input).datepicker('option', 'datePicker'),	
				timesep = $(input).datepicker('option', 'timeSeperator'),
				thisdate =  $('#mwd_date_hidden_' + thisid).val(),
				timeopts = '',
				timezonelist = '';
				$('#time_slider_min_' + thisid).html(thismintime);		
				$('#time_slider_max_' + thisid).html(thismaxtime);					
				//get time
				if($(input).datepicker('option', 'showTimezone') == true) { 
					timezonelist = $(input).datepicker('option', 'timezoneList');
				}

				timeopts = {'timezonelist': timezonelist};

				var get_thistime = get_newtime(thistime, timeopts),
				timestring = get_thistime['timestring'],
				timevalue = get_thistime['timevalue'],
				timezonevalue = get_thistime['timezonevalue'];
				
				var get_thistime_min = get_newtime(thismintime, ''),
				minvalue = get_thistime_min['timevalue'];
				
				var get_thistime_max = get_newtime(thismaxtime, ''),
				maxvalue = get_thistime_max['timevalue'];
				
				if(orientation == 'vertical') { 
					timevalue =  maxvalue - get_thistime['timevalue'] + minvalue; 
				}
				$('#mwd_time_current_' + thisid).val(timestring);	
								
				if(timezonelist) { 
					var listitems;
					$.map(timezonelist, function (val) {
						listitems = $('<option></option>');
						$(listitems).val(val.value); 
						$(listitems).text(val.label); 						
						if(timezonevalue == val.value) {
							$(listitems).attr('selected', 'selected'); 
						}
						$('#zonelist_' + thisid).append(listitems);	
					});					
					$('#zonelist_' + thisid).change(function () {
						var timecurrent = $('#mwd_time_current_' + thisid).val();	
						var selected = $(this).find(":selected").text();          			     
						if(dp == false) { 
							$(dateid).val(timecurrent + selected);
							$(hiddenid_date).val(thisdate);
						}   else {   
							$(dateid).val(thisdate + timesep + timecurrent + selected);
						}
						$(hiddenid_time).val(timecurrent + selected);
					});					
				}
				
				$('#time_slider_' + thisid).slider({
					orientation: orientation,
			        min: minvalue,
			        max: maxvalue,
			        step: stepvalue,
			        value: timevalue,
			        slide: function(event, ui) {	
			        	var sliderval = ui.value;
			        	if(orientation == 'vertical') { 
			        		sliderval = maxvalue - ui.value + minvalue; 
			        		if(ui.value == minvalue) { sliderval = maxvalue; }
			        		if(ui.value == maxvalue) { sliderval = minvalue; }
			        	}
			            var hours = Math.floor(sliderval / 60);
			            var minutes = sliderval - (hours * 60);
			            if(hours < 10) { hours= '0' + hours; }
			            if(minutes < 10) { minutes = '0' + minutes; }
			            if(hours == 0) { hours = '00'; }
			            if(minutes == 0) { minutes = '00'; }			       
						var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();	     
						if(dp == false) { 
							$(dateid).val(hours + ':' + minutes + timezonecurrent);
							$(hiddenid_date).val(thisdate);
						}   else {   
							$(dateid).val(thisdate + timesep + hours + ':' + minutes + timezonecurrent);
						}
						$('#mwd_time_current_' + thisid).val(hours + ':' + minutes);	
						$('#mwd_placeholder_' + thisid).html('');	
			        }
			    });		
				
				$('#time_slider_' + thisid).on('slidechange', function( event, ui ) { 
		        	var sliderval = ui.value;
		        	if(orientation == 'vertical') { 
		        		sliderval = maxvalue - ui.value + minvalue; 
		        		if(ui.value == minvalue) { sliderval = maxvalue; }
		        		if(ui.value == maxvalue) { sliderval = minvalue; }
		        	}
		            var hours = Math.floor(sliderval / 60);
		            var minutes = sliderval - (hours * 60);
					var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();
		            if(hours < 10) { hours= '0' + hours; }
		            if(minutes < 10) { minutes = '0' + minutes; }
		            if(hours == 0) { hours = '00'; }
		            if(minutes == 0) { minutes = '00'; }			       
					var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();	     
					if(dp == false) { 
						$(dateid).val(hours + ':' + minutes + timezonecurrent);
						$(hiddenid_date).val(thisdate);
					}   else {   
						$(dateid).val(thisdate + timesep + hours + ':' + minutes + timezonecurrent);
					}
					$('#mwd_time_current_' + thisid).val(hours + ':' + minutes);	
					$('#mwd_placeholder_' + thisid).html('');	
					$(hiddenid_time).val(hours + ':' + minutes + timezonecurrent);
				});
				
				var intervalmin, timermin;
				$('#time_slider_min_btn_' + thisid).mousedown(function() {	
					repeatingbtnmin();
					timermin = setTimeout(function(){  
						intervalmin = setInterval( function() { repeatingbtnmin(); }, 100);			
					}, 500);		
				})
				.mouseover(function() { $(this).addClass('ui-state-hover'); })
				.mouseup(function() { clearTimeout(timermin); clearInterval(intervalmin); })
				.mouseout(function() { clearTimeout(timermin); clearInterval(intervalmin);  $(this).removeClass('ui-state-hover'); });				
				function repeatingbtnmin() {
					var currentvalue = $('#time_slider_' + thisid).slider('value');
					$('#time_slider_' + thisid).slider('value', currentvalue - stepvalue );
				}
				
				var intervalmax, timermax;
				$('#time_slider_max_btn_' + thisid).mousedown(function() {	
					repeatingbtnmax();
					timermax = setTimeout(function(){  
						intervalmax = setInterval( function() { repeatingbtnmax(); }, 100);	
					}, 500);		
				})
				.mouseover(function() { $(this).addClass('ui-state-hover'); })
				.mouseup(function() { clearTimeout(timermax); clearInterval(intervalmax); })
				.mouseout(function() { clearTimeout(timermax); clearInterval(intervalmax); $(this).removeClass('ui-state-hover'); });				
				function repeatingbtnmax() {
					var currentvalue = $('#time_slider_' + thisid).slider('value');
					$('#time_slider_' + thisid).slider('value', currentvalue + stepvalue );
				}				
			}		
		}				
		
	});

	$.fn.extend({
		
		/* shorthand just to use mwd_monthpicker*/
		mwd_monthpicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);
			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					monthPicker: true
				});
			}
			return $(this).each(function () {
				$.fn.mwd_datepicker.apply($(this), tmp_args);
			});
		},
		
		/* shorthand just to use mwd_weekpicker*/
		mwd_weekpicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);
			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					weekPicker: true
				});
			}
			return $(this).each(function () {
				$.fn.mwd_datepicker.apply($(this), tmp_args);
			});
		},
		
		/* shorthand just to use mwd_datetimepicker*/
		mwd_datetimepicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);
			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					datePicker: true,
					timePicker: true
				});
			}
			return $(this).each(function () {
				$.fn.mwd_datepicker.apply($(this), tmp_args);
			});
		},

		/* shorthand just to use mwd_timepicker*/
		mwd_timepicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);
			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					datePicker: false,
					timePicker: true
				});
			}
			return $(this).each(function () {
				$.fn.mwd_datepicker.apply($(this), tmp_args);
			});
		},
		
		/*extend the datepicker with mwd_datepicker*/
		mwd_datepicker: function(o) {
			o = o || {};
			var args = arguments;
			if (typeof(o) === 'string') {
				// Forward function calls to datepicker
				if (o === 'getDate') {
					return $.fn.datepicker.apply($(this[0]), args);
				} else {
					return this.each(function () {
						var $t = $(this);
						$t.datepicker.apply($t, args);
					});
				}
			} else {	// Start mwd_datepicker
				return this.each(function () {
					
					 //apply id
					var input = this,
					thisid = $(input).attr('id'); 
					if(!thisid || thisid == undefined || thisid == '') { 
						$(input).uniqueId();
						$(input).attr('id', input.id);
					}
					
					//remove on destroy
					$('#mwd_datepicker_' + thisid).remove();
					
					//apply name
					var thisname = $(input).attr('name'); 
					if(!thisname || thisname == undefined || thisname == '') {
						thisname = $(input).attr('id');
						$(input).attr('name', thisname);
					}
					thisname = $(input).attr('name').replace('[]', '')
					
					//set type
					$(input).attr('type', 'text');
					
					//initiate the datepicker 
					$('#' + thisid).datepicker($.mwd_datepicker._newInst($('#' + thisid), o)._defaults);
					
					//set/get the mainvars
					var thisval = $(input).attr('value'),
					disabled = $(input).attr('disabled'),
					placeholder = $(input).attr('placeholder'),
					thisinst = $.datepicker._getInst($(input)[0]),
					mwddp_inst = $.datepicker._get(thisinst, 'mwd_datepicker'),					
					thisdatetime = mwddp_inst._setInitDate(input, thisinst),
					thisdate = thisdatetime['thisdate'],
					thistime = thisdatetime['thistime'],
					thisnamex = thisname + '[]';

					//setup the input
					$(input)
					.attr('name', thisnamex)
					.addClass('mwd_datepicker_input')
					.after('<div  id="mwd_datepicker_' + thisid + '" class="mwd_datepicker">'
					+ '<input  id="mwd_date_' + thisid + '" name="' + thisnamex + '" type="text" class="mwd_datepicker_value" value="' + thisval + '" readonly>'
					+ '<input  id="mwd_date_hidden_' + thisid + '" name="' + thisnamex + '" type="hidden" value="' + thisdate + '">'
					+ '<input  id="mwd_time_hidden_' + thisid + '" name="' + thisnamex + '" type="hidden" value="' + thistime + '">'
					+ '<div class="mwd-ui-datepicker" style=\"display: none;\"></div>'
					+ '</div>')
					.css({width: '1px', overflow: 'hidden', outline: 'none', border: 0, padding: 0, margin: 0});					
					if(placeholder) { $('#mwd_date_' + thisid).attr('placeholder', placeholder); }	
					if(disabled) { 
						$('#mwd_date_' + thisid).attr('disabled', 'disabled'); 
						$('#mwd_date_hidden_' + thisid).attr('disabled', 'disabled'); 
						$('#mwd_time_hidden_' + thisid).attr('disabled', 'disabled'); 
					}			

					//initiate the values
					mwddp_inst._setSelectedDate(thisinst, thisval);	

					//trigger the input
					$('#mwd_date_' + thisid).add('#mwd_placeholder_' + thisid).click(function() {
						$(input).trigger('focus'); 
					});
					if($(input).attr('autofocus')) {
						$(input).trigger('focus'); 
					}		
					
				});
			}
		}
	});
	
	/* bad hack : override datepicker so it doesn't close on select */
	$.datepicker._base_selectDate_mwddp = $.datepicker._selectDate;
	$.datepicker._selectDate = function (id, dateStr) {
		var inst = this._getInst($(id)[0]),
		mwddp_inst = this._get(inst, 'mwd_datepicker'),
		input = inst.input[0];
		if (mwddp_inst) { 
			inst.inline = inst.stay_open = true;
			this._base_selectDate_mwddp(id, dateStr);
			inst.inline = inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);	
		} else {
			this._base_selectDate_mwddp(id, dateStr);
		}
	};
	
	/* bad hack : override datepicker so it triggers an event when changing the input field and does not redraw the datepicker on every selectDate event */
	$.datepicker._base_updateDatepicker_mwddp = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function (inst) { 
		// don't popup the datepicker if there is another instance already opened
		var input = inst.input[0],
		mwddp_inst = this._get(inst, 'mwd_datepicker');
		if (mwddp_inst) { 
			if ($.datepicker._curInst && $.datepicker._curInst !== inst && $.datepicker._datepickerShowing && $.datepicker._lastInput !== input) {
				return;
			}
			if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {
				this._base_updateDatepicker_mwddp(inst);		
				vis = $(input).datepicker( "widget" ).is(":visible");
				if(vis == true) {					
					mwddp_inst._addTimepicker(input, inst);	
					mwddp_inst._addClearBtn(input);
					mwddp_inst._setTheCss(input);
				}
			}
		} else {
			this._base_updateDatepicker_mwddp(inst);	
		}
	};

	var get_newdate = function(type, thisval, dateopts) {
		
		var sep = String(dateopts['sep']), 
		dateobject = null, datestring = '', dateval = null;			
		if(thisval == '') { thisval = new Date(); }		
			
		//dateval string
		if(typeof thisval === 'string') { 
			dateval = new Date();
			if(type == 'date') {	
				try { dateval = new Date($.datepicker.parseDate(dateopts['df'], thisval, dateopts['dfc'])); }
				catch (e) { }		
			}
			if(type == 'month' && thisval.match(sep)) { 
				try { 
					dateval = new Date($.datepicker.parseDate('d MM' + sep + 'yy', thisval, dateopts['dfc'])); 
					var mnr = $.datepicker.formatDate('m', dateval, '') - 1,
					m = dateopts['monthnames'][mnr],
					y = $.datepicker.formatDate('yy', thisval, '');
					thisval = m + sep + y;
				}
				catch (e) { }		
			}
			if(type == 'week' && thisval.match(sep)) { 
				var weekvalnrs = thisval.split(sep),
				weekvalnrs1 = weekvalnrs[0].match(/\d/g),
				weekvalnrs2 = weekvalnrs[1].match(/\d/g);
				if(weekvalnrs1 != null && weekvalnrs2 != null) {
					var ww = parseInt(weekvalnrs1.join('')),
					wy = parseInt(weekvalnrs2.join(''));
					if(ww >= 1 && ww <= 52 && wy > 0 && wy.toString().length == 4) { 
						dateval = new Date(get_first_weekday(ww, wy));	
					} 
				} 			
			}
			dateobject = dateval;
			datestring = thisval;
		}				
		
		//dateval object
		if(typeof thisval === 'object') { 		
			dateobject = thisval;
			if(type == 'date') {	
				datestring = $.datepicker.formatDate(dateopts['df'], thisval, dateopts['dfc']);
			}
			if(type == 'month') { 
				var mnr = $.datepicker.formatDate('m', thisval, '') - 1,
				m = dateopts['monthnames'][mnr],
				y = $.datepicker.formatDate('yy', thisval, '');
				datestring = m + sep + y;
			}
			if(type == 'week') { 
				var fw = $.datepicker.iso8601Week(thisval),
				y = $.datepicker.formatDate('yy', thisval, '');		
				datestring = dateopts['weektext'] + ' ' + fw + sep + y;
			}
		}		
		
		return { 'dateobject': dateobject, 'datestring': datestring }; 	
		
	};

	var get_newtime = function(thistime, timeopts) {

		thistime = String(thistime);
		if(thistime == '') {	thistime = get_currenttime(); }
		var timestring = thistime, 
		thistimex = encodeURIComponent(thistime), lbl,
		timezoneval = '';	

		if(timeopts['timezonelist']) { 
			var timezonelist = timeopts['timezonelist'], timezonelbl = '';
			timezoneval = -(new Date().getTimezoneOffset() / 60);
			$.map(timezonelist, function (val) {
				lbl = encodeURIComponent(val.label);
				if(thistimex.match(lbl)) {
					timezoneval = val.value;
					timezonelbl = val.label;
				}				
			});
			thistime = thistime.replace(timezonelbl, '');
		}
		
		//curr	
		var gettimevalues = get_value_from_time(thistime),
		thishour = gettimevalues['hours'],
		thisminute = gettimevalues['minutes'],
		timevalue = gettimevalues['value'];
		
		timestring = thishour + ':' + thisminute; 
		
		return {'timestring': timestring, 'timevalue': timevalue, 'timezonevalue': timezoneval}; 
		
	};
		
	//get value from time
	var get_value_from_time = function(time) {
		var hours = 0, minutes = 0, value = 0;
		if(time.match(':')) { 	
			var splittime = time.split(':'),				
			hours = parseInt(splittime[0]),
			minutes = parseInt(splittime[1]);
			var value = Math.floor(hours * 60) + minutes;
			if (hours < 10) { hours = '0' + hours; }
			if (minutes < 10) { minutes = '0' + minutes; }
		}
		return {'hours': hours, 'minutes': minutes, 'value': value};
	};
	
	//get time from value
	var get_time_from_value = function(value) {
		var hours = parseInt(value / 60),
		minutes = value - (hours*60);
		if (hours < 10) { hours = '0' + hours; }
		if (minutes < 10) { minutes = '0' + minutes; }
		var time = String(hours + ':' + minutes);
		return time;
	};
	
	//get the current time
	var get_currenttime = function() {
		var d = new Date(),
		hours = d.getHours(),
		minutes = d.getMinutes();
        if(hours < 10) { hours= '0' + hours; }
        if(minutes < 10) { minutes = '0' + minutes; }
		var currenttime = hours + ':' + minutes;
		return currenttime;
	};
	
	//get first day of the week
	var get_first_weekday = function(w, y){
		var simple = new Date(y, 0, 1 + (w - 1) * 7),
		dow = simple.getDay(),
		first_weekday = simple;
		if (dow <= 4) {
			first_weekday.setDate(simple.getDate() - simple.getDay() + 1);
		} else {
			first_weekday.setDate(simple.getDate() + 8 - simple.getDay());
		}
		return first_weekday;
	};
	
	//get last day of the week
	var get_last_weekday = function(w, y){
		var simple = new Date(y, 0, 1 + (w - 1) * 7),
		dow = simple.getDay(),
		first_weekday = simple,
		last_weekday = simple;
		if (dow <= 4) {
			first_weekday.setDate(simple.getDate() - simple.getDay() + 1);
		} else {
			first_weekday.setDate(simple.getDate() + 8 - simple.getDay());
		}
		last_weekday.setDate(first_weekday.getDate() + 6);
		return last_weekday;
	};
	
	/* Create a Singleton Instance */
	$.mwd_datepicker = new this_datepicker();

	/* Keep up with the version */
	$.mwd_datepicker.version = "@@version";

})(jQuery);

