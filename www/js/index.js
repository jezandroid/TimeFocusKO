/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var chunkCount = 0;
var activeChunkId = 0;

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        globalTick();

        $("#popupAddChunk").popup({
            afteropen: function (event, ui) {
                $("#add-chunk-name").focus();
            }
        });
        $("#popupEditChunk").popup({
            afteropen: function (event, ui) {
                $("#edit-chunk-name").focus();
            }
        });

        var listholder = document.getElementById('listholder');//$("#listholder");

        listholder.addEventListener('slip:reorder', function (e) {
            e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
            return false;
        }, false);

        listholder.addEventListener('slip:beforeswipe', function (e) {
            //we don't want slip's swipe event to conflict with jquerymobile's
            e.preventDefault();
        }, false);

        new Slip(listholder);

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');


        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};




$(document).ready(function () {
    // globalTick(); // shouldn't this really be in onDeviceReady?
});

function globalTick() {
    var activeChunk = document.getElementById("chunk-" + activeChunkId);
    if (activeChunk) {
        oldElapsedSecs = parseInt($("#chunk-" + activeChunkId).attr("data-elapsed-secs"));
        newElapsedSecs = oldElapsedSecs + 1;
        $("#chunk-" + activeChunkId).attr("data-elapsed-secs", newElapsedSecs)
        $("#chunk-" + activeChunkId + " .chunk-elapsed-mins").text(parseInt(newElapsedSecs / 60));
        $("#chunk-" + activeChunkId + " .chunk-elapsed-secs").text(newElapsedSecs - (parseInt(newElapsedSecs / 60) * 60));
        remainingSecs = $("#chunk-" + activeChunkId).attr("data-total-secs") - newElapsedSecs
        var newData = [
            { "name": "elapsed", "hvalue": newElapsedSecs, "color": "#FFFFFF" },
            { "name": "remaining", "hvalue": remainingSecs, "color": "#000000" }
        ];

        $(".exp_" + activeChunkId).donutpie('update', newData);

        // if (newElapsedSecs = remainingSecs){
        //     navigator.vibrate(1000);
        // }

    }

    updateTaskSummary();


    // we can also record how time has been spent on every tick
    setTimeout(globalTick, 1000);
}


function updateTaskSummary() {
    //called on every tick


    //if any chunk is active, increase elapsed time
    if (activeChunkId > 0) {
        var taskElapsedSecs;
        taskElapsedSecs = parseInt($("#task-time-summary").attr("data-seconds-elapsed"));
        $("#task-time-summary").attr("data-seconds-elapsed", taskElapsedSecs + 1)
    }

    if (ChunkListViewModelVar.activeChunkIndex() > -1) {
        ChunkListViewModelVar.chunks()[ChunkListViewModelVar.activeChunkIndex()].elapsedSeconds(
            ChunkListViewModelVar.chunks()[ChunkListViewModelVar.activeChunkIndex()].elapsedSeconds() + 1
        );

        // alert('do something')
    }


    // $("#task-elapsed").text(taskElapsedSecs)

    //         var taskTotalSecs = 0;

    //total time is sum of all non-deleted chunk totals

    //ETA is now + totaltime - elapsed time
}


function addChunk(chunkId, chunkName, chunkMins) {
    var htmlBlock = "<li data-chunk-id='" + chunkId + "'  data-total-secs='" + chunkMins * 60 + "' data-elapsed-secs='0' id='chunk-" + chunkId + "' class='ui-li-static ui-body-inherit chunk'>"
    // htmlBlock += "<div class='row middle-xs'>"
    htmlBlock += "<div class='start-stop vcentre'>"
    htmlBlock += "<a class='play-button' href='#' onclick='javascript:setActiveChunkId(" + chunkId + ");'><i class='zmdi zmdi-play zmd-2x'></i></a>"
    htmlBlock += "<a style='display: none;' class='pause-button' href='#' onclick='javascript:setActiveChunkId(0);'><i class='zmdi zmdi-pause zmd-2x'></i></a>"


    htmlBlock += "</div>"

    // htmlBlock += "<div class='time'><span class='chunk-elapsed-mins'>0</span>:<span class='chunk-elapsed-secs'>00</span> / <span class='chunk-mins'>" + chunkMins + "</span> mins</div>"

    // htmlBlock += "<div class='edit'>"
    // htmlBlock += "<a data-rel='popup' data-position-to='window' data-role='button' data-inline='true' data-transition='pop' href='#popupEditChunk' "
    // htmlBlock += "onclick='javascript:setEditChunkForm(" + chunkId + ");' class='edit-button' ><i class='zmdi zmdi-edit zmd-2x'></i></a>"
    // htmlBlock += "<a class='delete-button' href='#' class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button' onclick='javascript:deleteChunk(" + chunkId + ");'><i class='zmdi zmdi-delete zmd-2x'></i></a>"    



    htmlBlock += "<div class='donut-time exp_" + chunkId + "'></div>"
    // class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'

    htmlBlock += "<div class='chunk-name vcentre'>" + chunkName + "</div>"

    htmlBlock += "</li>"
    // htmlBlock += "</div></li>"
    $("#listholder").append(htmlBlock);

    var data = [
        { "name": "elapsed", "hvalue": 0, "color": "#FFFFFF" },
        { "name": "remaining", "hvalue": chunkMins * 60, "color": "#000000" }
    ];

    // $(".exp").donutpie();

    $(".exp_" + chunkId).donutpie({
        radius: 85,
        tooltip: false
    });
    // $(".exp_" + chunkId).donutpie('updateTotal', $("#chunk-" + activeChunkId).attr("data-total-secs"));
    $(".exp_" + chunkId).donutpie('update', data);


    $('#chunk-' + chunkId).on('doubletap', function (event) {
        event.preventDefault();//workaround to prevent double firing
        setEditChunkForm(chunkId);
        var audio = new Audio('sounds/button1.wav');
        audio.play();
        $("#popupEditChunk").popup("open");
    });

    $('#chunk-' + chunkId).on('swipeleft', function (event) {
        var audio = new Audio('sounds/button1.wav');
        audio.play();
        deleteChunk(chunkId);
    });




    // $('#chunk-' + chunkId).on('taphold', function (event) {
    //     $("#listholder").sortable();
    // });

    // $('<div/>', {
    //     "id": 'foo',
    //     "name": 'fooDiv',
    //     "class": 'myClass',
    //     "click": function () {
    //         jquery(this).hide();
    //     }
    // }).appendTo('#main-canvas');



    // new $.nd2Toast({ // The 'new' keyword is important, otherwise you would overwrite the current toast instance
    //     message: "Chunk added", // Required
    //     action: { // Optional (Defines the action button on the right)
    //         title: "Cancel", // Title of the action button
    //         link: "/any/link.html", // optional (either link or fn or both must be set to define an action)
    //         fn: function () { // function that will be triggered when action clicked
    //             console.log("Action Button clicked'");
    //         },
    //         color: "red" // optional color of the button (default: 'lime')
    //     },
    //     ttl: 2000 // optional, time-to-live in ms (default: 3000)
    // });

    chunkCount += 1;
}

function editChunk(chunkId, chunkName, chunkMins) {
    //get the chunk's li
    //set its name to chunkName
    //set its mins to chunkMins
    $("#chunk-" + chunkId).children("div.chunk-name").text(chunkName);
    $("#chunk-" + chunkId + " .chunk-mins").text(chunkMins);
    $("#chunk-" + chunkId).attr("data-total-secs", chunkMins * 60)

    // $("#chunk-" + chunkId).children("p").children("span.chunk-mins").text(chunkMins + " mins"); //NOT WORKING
    // $("#chunk-" + chunkId + " > .chunk-name").val(chunkName);
    // $("#chunk-" + chunkId + " > .chunk-mins").val(chunkMins);
}

function deleteChunk(chunkId) {
    if (activeChunkId == chunkId) {
        activeChunkId = 0;
    }
    $("#chunk-" + chunkId).animate({ 'margin-left': '-1000px', 'margin-right': '1000px' }, 1000, function () { $("#chunk-" + chunkId).slideUp('fast'); });
    // chunkCount -= 1;
}

$("#btn_add_chunk").on("tap", function () {
    addChunk(chunkCount + 1, $("#add-chunk-name").val(), $("#add-chunk-mins").val());
});
$("#btn_edit_chunk").on("tap", function () {
    var chunkId = $("#edit-chunk-id").val();
    if (chunkId > 0) {
        editChunk(chunkId, $("#edit-chunk-name").val(), $("#edit-chunk-mins").val());
    }
});

function resetAddChunkForm() {
    $("#add-chunk-name").val("");
    $("#add-chunk-mins").val(5);
}

function setEditChunkForm(chunkId) {
    $("#edit-chunk-id").val(chunkId);
    $("#edit-chunk-name").val($("#chunk-" + chunkId).children("div.chunk-name").text());
    $("#edit-chunk-mins").val($("#chunk-" + chunkId).attr("data-total-secs") / 60);
}

function setActiveChunkId(chunkId) {
    activeChunkId = chunkId;
    // hide the play button, show the pause button
    $(".play-button").show();
    $(".pause-button").hide();
    $("#chunk-" + chunkId + " .play-button").hide();
    $("#chunk-" + chunkId + " .pause-button").show();


    $(".active-chunk").removeClass("active-chunk");
    $("#chunk-" + chunkId).addClass("active-chunk");


    navigator.vibrate(10);

    if (chunkId > 0) {
        window.plugins.insomnia.keepAwake();
    }
    else {
        window.plugins.insomnia.allowSleepAgain();
    }
}





// We do something every second and the thing is this:
// We increase the elapsed time of the active chunk by 1 second