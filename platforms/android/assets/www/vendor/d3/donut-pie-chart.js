(function ( $ ) {
 	
	var DonutPie = function($self, options) {
		this.$self = $self;
		this.settings = $.extend( $.fn.donutpie.defaults, options );
	};

	DonutPie.prototype.display = function() {
		
		var radius = this.settings.radius / 2;

		this.svg = d3.select(this.$self[0])
			.append("svg")
			.attr("width", radius * 2)
			.attr("height", radius * 2)
			.append("g");

		this.svg.append("g")
			.attr("class", "slices");
		// TimeFocus A
		var timetextgroup = this.svg.append("g")
			.attr("class", "timetextgroup");

			var elapsed_time = timetextgroup.append("text")
				.attr("class", "elapsed-time")
				.attr("text-anchor", "middle")
				.attr("dy","-2");
				// .attr("alignment-baseline", "central");

				var elapsed_mins = elapsed_time.append("tspan")
					.attr("class", "elapsed-mins")
					.text('00');

				var elapsed_colon = elapsed_time.append("tspan")
					.attr("class", "elapsed-colon")
					.text(':');

				var elapsed_secs = elapsed_time.append("tspan")
					.attr("class", "elapsed-secs")
					.text('00');
				// elapsed_secs.attr("text-anchor", "right")
			
			var total_time = timetextgroup.append("text")
				.attr("class", "total-time")
				.attr("text-anchor", "middle")
				.attr("dy","16");

			var total_mins = total_time.append("tspan")
					.attr("class", "total-mins")
					.text('00');

			total_time.append("tspan")
					.attr("class", "total-mins-mins")
					.text(' mins');					

		// TimeFocus B

		this.pie = d3.layout.pie()
			.sort(null)
			.value(function(d){
				return d.hvalue;
			});

		this.arc = d3.svg.arc()
		  .outerRadius(radius * 0.8)
		  .innerRadius(radius * 0.6); // TimeFocus

		this.outerArc = d3.svg.arc()
		  .innerRadius(radius * 0.9)
		  .outerRadius(radius * 0.9);

		this.svg.attr("transform", "translate(" + radius + "," + radius + ")");

		var tpClass = this.settings.tooltipClass;
		if (!$('body').hasClass( tpClass )) {
			$('.' + tpClass).remove();
			d3.select("body")
			    .append("div")
			    .attr('class', tpClass )
			    .style("position", "absolute")
			    .style("z-index", "100")
			    .style("visibility", "hidden")
			    .text("");
		}

	};

	DonutPie.prototype.update = function(data) {
		
		//TimeFocus START
		var elapsed_mins_val = parseInt(data[0]['hvalue']/60);
		if (elapsed_mins_val < 10){elapsed_mins_val = "0" + elapsed_mins_val}
		var elapsed_secs_val = data[0]['hvalue']-(elapsed_mins_val*60);
		if (elapsed_secs_val < 10){elapsed_secs_val = "0" + elapsed_secs_val}

		this.svg.select("tspan.elapsed-mins").text(elapsed_mins_val);
		this.svg.select("tspan.elapsed-secs").text(elapsed_secs_val);

		var total_mins_val = parseInt((data[0]['hvalue'] + data[1]['hvalue'])/60);
		this.svg.select("tspan.total-mins").text(total_mins_val);
		//TimeFocus END

		// check if all the items has colors.
		var colors = d3.scale.category20().range();
		for (var i = 0; i < data.length; i++) {
			if( data[i]['color'] == undefined ) 
				data[i]['color'] = colors[i];
		};

		var tooltip = this.settings.tooltip;
		var tpClass = "." + this.settings.tooltipClass;
		var arc = this.arc;
		var slice = this.svg.select(".slices").selectAll("path.slice")
		    .data(this.pie(data));

		slice.enter()
		    .insert("path")
		    .style("fill", function(d) { return d.data.color; })
		    .attr("title", function(d) { return d.data.name + " " + Math.round(d.value) + "%"; })
		    .attr("class", "slice")
		    .on("mouseover", function (d) {
	    	if (tooltip) {
		    	if (d.id != "none") {
			        $(tpClass).html( d.data.name + " " + Math.round(d.value) + "%" );
			        $(tpClass).css("visibility", "visible");
			    }
		    }
		})
		.on("mousemove", function(d){
			if (tooltip) {
		    	if (d.id != "none") {
		    		$(tpClass).css("top",(d3.event.pageY-10)+"px").css("left",(d3.event.pageX+10)+"px");
			    }
			}
	    })
		.on("mouseout", function () {
			if (tooltip) {		
		    	$(tpClass).html("");
		        $(tpClass).css("visibility", "hidden");
			}
		});

		slice   
		    .transition().duration(1000)
		 	.style("fill", function(d) { return d.data.color; })
		 	.attr("title", function(d) { return d.data.name + " " + Math.round(d.value) + "%"; })
		 	.attrTween("d", function(d) {
		      this._current = this._current || d;
		      var interpolate = d3.interpolate(this._current, d);
		      this._current = interpolate(0);
		      return function(t) {
		        return arc(interpolate(t));
		      };
		    });

		slice.exit()
		    .remove();

	};


	//TimeFocus START
	// DonutPie.prototype.updateTotal = function(totalSecs) {
	// 	this.svg.select("tspan.total-mins").text(parseInt(totalSecs/60);
	// };
	//TimeFocus END

	$.fn.donutpie = function(option) {
	  
	    var $this = $(this);
	    var $donutpie = $this.data("donutpie");

	    if(!$donutpie) {
			// init the object
			var options = typeof option == "object" && option;
			$donutpie   = new DonutPie($this, options);
			$this.data("donutpie", $donutpie);
	    }

    	if (typeof option === 'string' && $.fn.donutpie.methods[option]) {
    		$donutpie[option].apply($donutpie, Array.prototype.slice.call(arguments, 1));
    	} else if ( typeof option === 'object' || !option ) {
    		$donutpie.display.apply( $donutpie, option);
    	} else {
    		$.error( 'Method ' +  option + ' does not exist in DonutPie' );
    	}
	   
	};

	$.fn.donutpie.methods = {
		'display': 1, 
		'update': 1
	}

	$.fn.donutpie.defaults = {
	  radius: 240,
	  tooltip : true,
	  tooltipClass : "donut-pie-tooltip-bubble"
	};

}( jQuery ));