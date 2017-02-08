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
    self.incompleteChunks = ko.computed(function () {
        return ko.utils.arrayFilter(self.chunks(), function (chunk) { return !chunk.isDone() && !chunk._destroy });
    });
    self.activeChunkIndex = ko.observable();

    // Operations
    self.addChunk = function () {
        self.chunks.push(new Chunk({ title: this.newChunkText() }));
        self.newChunkText("");
    };
    self.removeChunk = function (chunk) { self.chunks.destroy(chunk) };

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
}

var ChunkListViewModelVar = new ChunkListViewModel();
ko.applyBindings(ChunkListViewModelVar);