;(function($){
	var defaultConfig = {
		selectWrapClass: 'dropdown',
		curClass: 'current',
		overClass: 'over',
		defaultClass: 'grey'
	}
	
	$.fn.selectImitate = function(opts) {
		opts = $.extend({}, defaultConfig, opts);
		return this.each(function(i, obj){
			//生成id
			var selectId = (this.name || this.id)+'__jQSelect'+i||'__jQSelect'+i;
			//隐藏当前select
			if (obj.style.display != 'none' && $(this).parents()[0].id.indexOf('__jQSelect')<0) {
				//包裹生成
				$(this).before("<div class='"+opts.selectWrapClass+"' id="+selectId+" tabIndex="+tabindex+"></div>").prependTo($("#"+selectId))
				//初始化
				$('#'+selectId).append('<div class="dropselectbox"><h4></h4><ul></ul></div>');

				
				var tabindex = this.tabIndex || 0,
				selectZindex = $(this).css('z-index'),
				selectNodes = $('#'+selectId+' select'),
				options = $('#'+selectId+' option'),
				optionSelected = $('#'+selectId+' option:selected'),
				selectIndex = options.index(optionSelected[0]),
				selectedTxt = optionSelected.text(),
				ulNode = $('#'+selectId+' ul'),
				titWrap = $('#'+selectId+' div'),
				jqId = $("#"+selectId);

				

				var titElem = $('#'+selectId+' h4');


				if (selectedTxt.indexOf('请选择') !== -1) {
					titElem.addClass(opts.defaultClass);
				};

				titElem.html(selectedTxt);

				//style
				var w = selectNodes.width();

				if ($.browser.safari) {
					w = w + 15;
				};

				titElem.css({
					width: w
				});

				var listWidth = w + parseInt(titElem.css('padding-left')) + parseInt(titElem.css('padding-right'));
				ulNode.css({
					width: listWidth
				});

				selectNodes.hide();
				/*
					bind Event
				 */
				titWrap.hover(function(){
					titElem.addClass(opts.overClass);
				},function(){
					titElem.removeClass(opts.overClass);
				});

				//click
				function clickFun(){
					titElem.addClass(opts.curClass);
					ulNode.show();
					var zIndex = jqId.css('z-index'),
						win = $(window);
						

					if ($.browser.msie || $.browser.opera) {
						$('.'+opts.selectWrapClass).css({
							'position':'relative',
							'z-index': 0
						});
					};

					jqId.css({
						'position':'relative',
						'z-index': 999
					});


					setSelectVal(selectId);
					var listNode = $('#'+selectId+' li');
					selectIndex = listNode.index($('selectedli')[0]);
					var windowspace = (win.scrollTop() + document.documentElement.clientHeight) - jqId.offset().top,
						ulspace = ulNode.outerHeight(true),
						windowspace2 = jqId.offset().top - win.scrollTop() - ulspace;

					windowspace < ulspace && windowspace2 > 0 ? ulNode.css({top:-ulspace}) : ulNode.css({top:titElem.outerHeight(true) - 1});
					win.scroll(function(){
						windowspace = (win.scrollTop() + document.documentElement.clientHeight) - jqId.offset().top;
						windowspace < ulspace?ulNode.css({top:-ulspace}):ulNode.css({
							top:titElem.outerHeight(true)
						});
					});
						
					listNode.click(function(e){
							selectIndex = listNode.index(this);
							upSelect(selectId, selectIndex);
							var txt = $('#'+selectId+' option:selected').text();
							if (txt.indexOf('请选择') !== -1) {
								titElem.addClass(opts.defaultClass);
							}else{
								titElem.removeClass(opts.defaultClass);
							}
							titElem.html(txt);
							clearSelectMenu(selectId, selectZindex);
							e.stopPropagation();
							e.cancelbubble = true;
					})
					.hover(
						   function(){
								listNode.removeClass(opts.overClass);
								$(this).addClass(opts.overClass).addClass("selectedli");
								selectIndex = listNode.index(this);
							},
							function(){
								$(this).removeClass(opts.overClass);
							}
					);

				}
				//当前元素事件绑定
				jqId.bind('focus', function(){
					titElem.addClass(opts.overClass);
				}).bind('click', function(e){
					if (ulNode.css('display') == 'block') {
						clearSelectMenu(selectId, selectZindex);
						return false;
					}else{
						clickFun();
					}
					e.stopPropagation();
				}).bind("dblclick", function(){
					clearSelectMenu(selectId, selectZindex);
					return false;
				})
				.bind("blur",function(){
					clearSelectMenu(selectId, selectZindex);
					return false;
				})
				.bind("selectstart",function(){
						return false;
				});

			}else if($(this).parents()[0].id.indexOf('__jQSelect') !== -1){
				selected = $(this).parents()[0].id;
				setSelectVal(selected);
			}
		});
		//私有
		function clearSelectMenu(selectId, selectZindex){
			if(selectId != undefined){
				selectZindex = selectZindex || 'auto';
				$('#'+selectId+' ul').empty().hide();
				$('#'+selectId+' h4').removeClass(opts.overClass).removeClass(opts.curClass);
				$('#'+selectId).css({'z-index':selectZindex});
			}
		}

		function setSelectVal(sid, obj){
			var content = [];
			$.each($('#'+sid+' option'), function(i){
				content.push("<li class='FixSelectBrowser'>"+$(this).text()+"</li>");
			});
			content = content.join('');
			$('#'+sid+' ul').html(content);
			$('#'+sid+' h4').html($('#'+sid+' option:selected').text());
			$('#'+sid+' li').eq($('#'+sid+' select')[0].selectedIndex).addClass(opts.overClass)
			.addClass("selectedli");
		}


		function upSelect(sid, sIndex){
			var obj = $('#'+sid+' select');
			obj[0].selectedIndex = sIndex;
			obj.change();
			$('#'+sid+' li:eq('+sIndex+')').toggleClass(opts.overClass);
			$('#'+sid+' h4').html($('#'+sid+' option:selected').text());
		}
	}
})(jQuery);
