function Chunk(data) {
    this.title = ko.observable(data.title);
    this.seconds = ko.observable(data.seconds);
    this.elapsedSeconds = ko.observable(data.elapsedSeconds);
    this.isDone = ko.observable(data.isDone);
    this.percentElapsed = ko.pureComputed(function() {
    return (this.elapsedSeconds()/this.seconds())*100;
    }, this);
}

function ChunkListViewModel() {
    // Data
    var self = this;
    self.chunks = ko.observableArray([]);
    self.newChunkText = ko.observable();
    self.incompleteChunks = ko.computed(function() {
        return ko.utils.arrayFilter(self.chunks(), function(chunk) { return !chunk.isDone() && !chunk._destroy });
    });

    // Operations
    self.addChunk = function() {
        self.chunks.push(new Chunk({ title: this.newChunkText() }));
        self.newChunkText("");
    };
    self.removeChunk = function(chunk) { self.chunks.destroy(chunk) };
    
     // Load initial state from server, convert it to Chunk instances, then populate self.chunks
    $.getJSON("/json/test.json", function(allData) {
        var mappedChunks = $.map(allData, function(item) { return new Chunk(item) });
        self.chunks(mappedChunks);
        // for (var key in mappedChunks){
        //     alert(mappedChunks[key]);
        // } 
    });    
    
    self.save = function() {
        $.ajax("/json/test.json", {
            data: ko.toJSON({ chunks: self.chunks }),
            type: "post", contentType: "application/json",
            success: function(result) { alert(result) }
        });
    }; 
}

ko.applyBindings(new ChunkListViewModel());