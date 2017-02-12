function Chunk(data) {
    this.title = ko.observable(data.title);
    this.seconds = ko.observable(data.seconds);
    this.minutes = ko.pureComputed(function () {
        return (this.seconds() / 60) + " mins";
    }, this);
    this.elapsedSeconds = ko.observable(data.elapsedSeconds);
    // this.elapsedMinutes = ko.pureComputed(function () {
    //     return parseInt(this.elapsedSeconds/60);
    // }, this);
    this.elapsedMinutesAndSeconds = ko.pureComputed(function () {
        // return ((this.elapsedSeconds)/60);
        return parseInt(this.elapsedSeconds() / 60) + ":" + parseInt(this.elapsedSeconds() % 60);
    }, this);

    this.isDone = ko.observable(data.isDone);
    this.percentElapsed = ko.pureComputed(function () {
        return (this.elapsedSeconds() / this.seconds()) * 100;
    }, this);
    this.negativePercentElapsed = ko.pureComputed(function () {
        return (-this.percentElapsed());
    }, this);

    this.isActive = ko.observable(false);
}

function ChunkListViewModel() {



    // Data
    var self = this;
    self.chunks = ko.observableArray([]);
    self.newChunkText = ko.observable();
    self.newChunkMins = ko.observable();
    self.incompleteChunks = ko.computed(function () {
        return ko.utils.arrayFilter(self.chunks(), function (chunk) { return !chunk.isDone() && !chunk._destroy });
    });
    self.activeChunkIndex = ko.observable();

    // Operations
    self.addChunk = function () {
        self.chunks.push(new Chunk({ title: this.newChunkText(), seconds: this.newChunkMins() * 60, elapsedSeconds: 0 }));
        $("#popupAddChunk").popup("close")
        self.newChunkText("");
        self.newChunkMins("");
    };
    self.removeChunk = function (item,event) {
        // $("#chunk-" + chunkId).animate({ 'margin-left': '-1000px', 'margin-right': '1000px' }, 1000, function () { $("#chunk-" + chunkId).slideUp('fast'); });

        $(event.target).closest(".chunk")
            .animate({ 'margin-left': '-1000px', 'margin-right': '1000px' }, 1000)
            .slideUp({queue: false})
            .fadeOut(null, function() {
                self.chunks.destroy(item);
        });
        
    };
    self.markChunkComplete = function (chunk) { chunk.isDone(true) };
    self.setActiveChunk = function (chunk) {
        //  alert(self.chunks().indexOf(chunk));
        self.activeChunkIndex(self.chunks().indexOf(chunk));
        //set any currently active chunks to inactive
        self.chunks().forEach(function (chunk) {
            chunk.isActive(false);
        })

        //set this chunk's active property to true
        chunk.isActive(true);

        if (self.activeChunkIndex() > -1) {
            window.plugins.insomnia.keepAwake();
        }
        else {
            window.plugins.insomnia.allowSleepAgain();
        }

    };

    // Load initial state from server, convert it to Chunk instances, then populate self.chunks
    $.getJSON("/json/test.json", function (allData) {
        var mappedChunks = $.map(allData, function (item) { return new Chunk(item) });
        self.chunks(mappedChunks);
        // for (var key in mappedChunks){
        //     alert(mappedChunks[key]);
        // } 
    });

    self.save = function () {
        $.ajax("/json/test.json", {
            data: ko.toJSON({ chunks: self.chunks }),
            type: "post", contentType: "application/json",
            success: function (result) { alert(result) }
        });
    };


    self.someText = ko.observable('do something with')
    tapHandler = function (data, e) {
        //Note, event types will be tap or hold, depending on what your action will be.
        self.someText('you just ' + e.type + 'ed.');
    }
    swipeHandler = function (data, e) {
        if (e.gesture.direction == "left") {
            //delete
            self.someText('delete');
            self.removeChunk(data,e);
        }
        else if (e.gesture.direction == "right") {
            //complete
            self.someText('complete');
            self.markChunkComplete(data);
        }
        // self.someText( e.gesture.direction + 'hey ' + 'you just swiped!!!');
    }
    doubletapHandler = function (data, e) {
        self.someText('doubletap goes here!!!');
    }




}


// custom bindings
// from http://jsfiddle.net/CT7fy/
ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        $(document).on({
            "mouseup touchend keypress": function (elem) {
                var sliderVal = $('#' + element.id).val();
                value(sliderVal);
            }
        }, ".ui-slider");
    }
    //     ,
    //   update: function (element, valueAccessor)
    //   {
    //     var el = $(element);

    //     var value = ko.utils.unwrapObservable(valueAccessor()());
    //     if (value !== el.val())
    //     {
    //       el.val(value);
    //       el.slider("refresh");
    //     }
    //   }
}

// from https://dzone.com/articles/knockoutjs-binding-helper
// ko.bindingHandlers.jQuerySliderValue = {
//   // Initialize slider
//   init: function (element, valueAccessor)
//   {
//     var val = valueAccessor()();
//     var el = $(element);
//     el.slider({ value: val });

//     el.bind("change", function (event, ui)
//     {
//       var value = valueAccessor()();
//       if (value !== el.val)
//       {
//         valueAccessor()(parseInt(el.val()));
//       }
//     });
//   },

//   //handle the model value changing
//   update: function (element, valueAccessor)
//   {
//     var el = $(element);

//     var value = ko.utils.unwrapObservable(valueAccessor()());
//     if (value !== el.val())
//     {
//       el.val(value);
//       el.slider("refresh");
//     }
//   }
// };


var ChunkListViewModelVar = new ChunkListViewModel();
ko.applyBindings(ChunkListViewModelVar);