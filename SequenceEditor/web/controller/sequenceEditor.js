///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function WindowManager() {
    // WindowManager object is an array of sequenceWindow objects. So instantiate by: var myWindowMan = new WindowManager();
};

function sequenceWindow(uuid) { // Sequence Window object
    this.uuid = uuid;
};

WindowManager.prototype = {
    getWindow: function(uuid) {
        // Return sequ enceWindow object associated with this uuid so all sequence window methods can be called.
        return this[uuid];
        // return document.getElementById('resizable_' + id);  // Get window by variable "id" (integer)
    },
    newWindow: function(appendToId) {
        // windowInfo is an array that holds two variables (filename and author). 
        var uuid = createNewWindow(appendToId);    // Create new sequence editor window. Append to element whose id is passed as a parameter. If no id is passed, default append to body
        this[uuid] = new sequenceWindow(uuid);
    },
    setConnection: function() {
        // Sets window manager's connection
    },
    closeConnection: function() {
        // Closes open window manager connection
    }
};

sequenceWindow.prototype = {
    setFileName: function(fileName) {  // Sets specified window's file name.
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        windows[id].fileName = fileName;
    },
    setAuthor: function(author) {    // Sets specified window's author.
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        windows[id].author = author;
    },
    // File menu options
    newSequence: function() {
        // Open new, blank sequence editor window
    },
    openSequence: function(fileName) {
        // No return value? Open specified file
    },
    saveSequence: function(fileName) {
        // No return value? Save current file as the name provided.
    },
    close: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        
        $('#resizable_' + id).remove();
    },
    changeTheme: function(color) {  // Change the sequence editor window's background color theme.
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#resizable_' + id + '.ui-widget-content').css("background", color);
        $("#centralElement_" + id).css("background-color", color);
        $("#seqTextArea_" + id).css("background-color", "white");
    },
    // Sequence manipulation functions
    translateSequence: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#translate_' + id).click();
    },
    reverseComplement: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#revComp_' + id).click();
    },
    lowercase: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#lowercase_' + id).click();
    },
    uppercase: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#uppercase_' + id).click();
    },
    // Highlight functions
    features: function() {  // Highlight the current list of features in this sequence
        // var id = ($(this).attr('id')).match(/\d+/);  // match the id number associated with the current window
        var id = this.uuid.match(/\d+/);
        $('#features_' + id).click();
    },
    selection: function() {   // Highlight the current selection
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        // setSelectionRange(document.getElementById("seqTextArea_" + id), start, end);
        $('#selection_' + id).click();
    },
    // ORF search functions
    nextForwardORF: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#nextForwardORF_' + id).click();
    },
    previousForwardORF: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#previousForwardORF_' + id).click();
    },
    nextReverseORF: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#nextReverseORF_' + id).click();
    },
    previousReverseORF: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        $('#previousReverseORF_' + id).click();
    },
    // Sequence information functions
    meltingTemp: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        return parseInt($('#tempCell_' + id).html().toString().match(/\d+/));
    },
    gcContent: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        return parseInt($('#gcCell_' + id).html());
    },
    currentFeature: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        return $('#featureCell_' + id).html().toString();
    },
    sequenceLength: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        return parseInt($('#lengthCell_' + id).html());
    },
    cursorPosition: function() {
        var id = this.uuid.match(/\d+/);  // match the id number associated with the current window
        var cursorPos = [];
        if ($('#positionCell_' + id).html().toString().match(/[-]/)) {
            // Range selected, parse accordingly
            var rangeIndices = $('#positionCell_' + id).html().toString().split("(");
            var rangeStart = rangeIndices[0];
            rangeIndices = rangeIndices[1].split("-");
            var rangeEnd = rangeIndices[1];
            cursorPos[0] = rangeStart;
            cursorPos[1] = rangeEnd; 
        } else {
            // Nothing selected, just parse out cursor position
            var rangeIndices = $('#positionCell_' + id).html().toString().split("(");
            cursorPos[0] = rangeIndices[0];
        }
        return cursorPos;   // Returns string with cursor and selection information
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
var windows = [];   // stores sequence editor windows' information
var count = 0;
var aCount = "a" + 0; // tracks count of alignment windows opened. In case multiple alignments are opened at once.
var resize = 0; // tracks large or small interface display. resize = 0 : large interface; resize = 1 : small interface.
var changeLength = 0; //stores change length for updating indices
var _sequence = ""; //store sequence to compare if insert or delete happened
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function createNewWindow(appendToId) {
    if (typeof appendToId === "undefined" || appendToId === null) {
        $('<div class="resizable sequenceWidget ui-widget-content" id="resizable_' + count + '" style="opacity:1;width:150px; height:150px; padding:0.5em; display:none;min-width:650px;min-height:370px;border:solid black 1px;" class="bigInterface"><div class="row-fluid" id="menuRow"><div class="span5"><div class="pull-left"><ul class="menu" style="margin-left:0px;"><li class="btn-group" style="margin-left:0px;"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">File<span class="caret"></span></a><ul class="dropdown-menu" style="width:225px;"><li><a id="colorChanger_' + count + '" href="#">Change Theme</a></li><li><a id="newSequence_' + count + '" href="#">New Sequence<span class="shortcut pull-right">Alt+N</span></a></li><li><a id="openSequence_' + count + '" class="openSequence" href="#">Open Sequence<span class="shortcut pull-right">Alt+O</span></a></li><li><a id="saveSequence_' + count + '" class="saveSequence" href="#">Save Sequence<span class="shortcut pull-right">Alt+S</span></a></li><li><a id="close_' + count + '" class="closeOption" href="#">Close<span class="shortcut pull-right">Esc</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Find<span class="caret"></span></button><ul class="dropdown-menu" style="width:250px;"><li><a id="nextForwardORF_' + count + '" href="#">Next Forward ORF<span class="shortcut pull-right">Alt+Q</span></a></li><li><a id="previousForwardORF_' + count + '" href="#">Previous Forward ORF<span class="shortcut pull-right">Alt+W</span></a></li><li><a id="nextReverseORF_' + count + '" href="#">Next Reverve ORF<span class="shortcut pull-right">Alt+E</span></a></li><li><a id="previousReverseORF_' + count + '" href="#">Previous Reverse ORF<span class="shortcut pull-right">Alt+R</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Highlight<span class="caret"></span></button><ul class="dropdown-menu"><li><a id="features_' + count + '" href="#">Features<span class="shortcut pull-right">Alt+2</span></a></li><li><a id="selection_' + count + '" href="#">Selection<span class="shortcut pull-right">Alt+3</span></a></li></ul></li></ul></div></div><div class="span4"><div class="btn-group" style="text-align:center;"><button id="revComp_' + count + '" class="btn"><i class="icon-backward"></i></button><button id="translate_' + count + '" class="btn"><i class="icon-text-width"></i></button><button id="uppercase_' + count + '" class="btn"><i class="icon-arrow-up"></i></button><button id="lowercase_' + count + '" class="btn"><i class="icon-arrow-down"></i></button></div></div><div class="span2"><div class="btn-group pull-left"><button id="windowTag_' + count + '" class="btn" data-toggle="popover" data-placement="bottom" data-content="Window Tag Info"><i class="icon-tag"></i></button></div></div><div class="span1"><div class="btn-group pull-right"><button id="closeWindow_' + count + '" class="btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="span2" style="padding:0px;margin:0px"></div><div class="span9" style="margin-left:0px"><table class="colsTextArea pull-left" style="width:100%;"><tr><td id="columnFirst_' + count + '" class="columnFirst pull-left">1</td><td id="columnLast_' + count + '" class="columnLast pull-right"></td></tr></table></div></div><div id="centralElement_' + count + '" class="row-fluid"><div class="span2" style="padding:0px;margin:0px"><textArea id="rowsTextArea_' + count + '" disabled class="rowsTextArea pull-right" style="background-color:transparent;border: transparent 2px;box-shadow: none;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;text-align:center;height:240px;overflow:hidden;padding-top:5px;padding-bottom:5px;resize:none;width:75%;margin:0px;cursor:default"></textarea></div><div contenteditable class="seqTextArea span9" id="seqTextArea_' + count + '" style="-moz-appearance:textfield-multiline; -webkit-appearance:textarea; background-color:white; border:solid black 2px; font-size:12pt; font-family:monospace; height:250px; overflow:auto; padding:2px; resize:none; margin-left:0px; margin-bottom:10px;">atgttaacccatccgtgactaagacattgaatgccctag</div></div><div class="row-fluid"><div class="offset1 span10"><table style="width:100%"><tr><th>Position:</th><td id="positionCell_' + count + '" class="positionCell">0(0)</td><th>Temp:</th><td id="tempCell_' + count + '" class="tempCell">0(C)</td><th>Feature:</th><td id="featureCell_' + count + '" class="featureCell">XbaI</td><th>Length:</th><td id="lengthCell_' + count + '" class="lengthCell">100</td><th>% GC</th><td id="gcCell_' + count + '" class="gcCell">50</td></tr></table></div></div></div><span class="hidden" id="measureSpan" style="padding: 0px;font-family: monospace;font-size: 12pt;background-color: transparent">1234567890</span>').appendTo('body').fadeIn('fast');
    } else {
        $('<div class="resizable sequenceWidget ui-widget-content" id="resizable_' + count + '" style="opacity:1;width:150px; height:150px; padding:0.5em; display:none;min-width:650px;min-height:370px;border:solid black 1px;" class="bigInterface"><div class="row-fluid" id="menuRow"><div class="span5"><div class="pull-left"><ul class="menu" style="margin-left:0px;"><li class="btn-group" style="margin-left:0px;"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">File<span class="caret"></span></a><ul class="dropdown-menu" style="width:225px;"><li><a id="colorChanger_' + count + '" href="#">Change Theme</a></li><li><a id="newSequence_' + count + '" href="#">New Sequence<span class="shortcut pull-right">Alt+N</span></a></li><li><a id="openSequence_' + count + '" class="openSequence" href="#">Open Sequence<span class="shortcut pull-right">Alt+O</span></a></li><li><a id="saveSequence_' + count + '" class="saveSequence" href="#">Save Sequence<span class="shortcut pull-right">Alt+S</span></a></li><li><a id="close_' + count + '" class="closeOption" href="#">Close<span class="shortcut pull-right">Esc</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Find<span class="caret"></span></button><ul class="dropdown-menu" style="width:250px;"><li><a id="nextForwardORF_' + count + '" href="#">Next Forward ORF<span class="shortcut pull-right">Alt+Q</span></a></li><li><a id="previousForwardORF_' + count + '" href="#">Previous Forward ORF<span class="shortcut pull-right">Alt+W</span></a></li><li><a id="nextReverseORF_' + count + '" href="#">Next Reverve ORF<span class="shortcut pull-right">Alt+E</span></a></li><li><a id="previousReverseORF_' + count + '" href="#">Previous Reverse ORF<span class="shortcut pull-right">Alt+R</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Highlight<span class="caret"></span></button><ul class="dropdown-menu"><li><a id="features_' + count + '" href="#">Features<span class="shortcut pull-right">Alt+2</span></a></li><li><a id="selection_' + count + '" href="#">Selection<span class="shortcut pull-right">Alt+3</span></a></li></ul></li></ul></div></div><div class="span4"><div class="btn-group" style="text-align:center;"><button id="revComp_' + count + '" class="btn"><i class="icon-backward"></i></button><button id="translate_' + count + '" class="btn"><i class="icon-text-width"></i></button><button id="uppercase_' + count + '" class="btn"><i class="icon-arrow-up"></i></button><button id="lowercase_' + count + '" class="btn"><i class="icon-arrow-down"></i></button></div></div><div class="span2"><div class="btn-group pull-left"><button id="windowTag_' + count + '" class="btn" data-toggle="popover" data-placement="bottom" data-content="Window Tag Info"><i class="icon-tag"></i></button></div></div><div class="span1"><div class="btn-group pull-right"><button id="closeWindow_' + count + '" class="btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="span2" style="padding:0px;margin:0px"></div><div class="span9" style="margin-left:0px"><table class="colsTextArea pull-left" style="width:100%;"><tr><td id="columnFirst_' + count + '" class="columnFirst pull-left">1</td><td id="columnLast_' + count + '" class="columnLast pull-right"></td></tr></table></div></div><div id="centralElement_' + count + '" class="row-fluid"><div class="span2" style="padding:0px;margin:0px"><textArea id="rowsTextArea_' + count + '" disabled class="rowsTextArea pull-right" style="background-color:transparent;border: transparent 2px;box-shadow: none;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;text-align:center;height:240px;overflow:hidden;padding-top:5px;padding-bottom:5px;resize:none;width:75%;margin:0px;cursor:default"></textarea></div><div contenteditable class="seqTextArea span9" id="seqTextArea_' + count + '" style="-moz-appearance:textfield-multiline; -webkit-appearance:textarea; background-color:white; border:solid black 2px; font-size:12pt; font-family:monospace; height:250px; overflow:auto; padding:2px; resize:none; margin-left:0px; margin-bottom:10px;">atgttaacccatccgtgactaagacattgaatgccctag</div></div><div class="row-fluid"><div class="offset1 span10"><table style="width:100%"><tr><th>Position:</th><td id="positionCell_' + count + '" class="positionCell">0(0)</td><th>Temp:</th><td id="tempCell_' + count + '" class="tempCell">0(C)</td><th>Feature:</th><td id="featureCell_' + count + '" class="featureCell">XbaI</td><th>Length:</th><td id="lengthCell_' + count + '" class="lengthCell">100</td><th>% GC</th><td id="gcCell_' + count + '" class="gcCell">50</td></tr></table></div></div></div><span class="hidden" id="measureSpan" style="padding: 0px;font-family: monospace;font-size: 12pt;background-color: transparent">1234567890</span>').appendTo('#' + appendToId).fadeIn('fast');
    }

    rangy.init();
    $('#seqTextArea_' + count).focus();
    $('#resizable_' + count + '.ui-widget-content').css("background", "#faecbc");
    $("#centralElement_" + count).css("background-color", "#faecbc");

    $('#highlight_' + count).css("top", -1 * (parseInt($('#seqTextArea_' + count).css("height")) + parseInt($('#seqTextArea_' + count).css("margin-bottom")) + parseInt($('#seqTextArea_' + count).css("border-width"))));
    var parent = $('#highlight_' + count).parent();
    parent.css("height", parseInt(parent.css("height")) - parseInt($('#highlight_' + count).css("height")));

    $('#resizable_' + count).resizable({
        minHeight: 400,
        minWidth: 400
    });

    $('#resizable_' + count).draggable({
        stack: ".resizable"
    });   

    $('#resizable_' + count).droppable({
        drop: function(event, ui) {
            if (!(($(ui.draggable).attr('id')).match(/\a\d/))) {    // check to make sure user didn't drag alignment window on top of sequence editor window
                var idDragged = ($(ui.draggable).attr('id')).match(/\d+/); // match the id number associated with the current window
                var idDropped = ($(this).attr("id")).match(/\d+/);
                var textAreaDragged = "#seqTextArea_" + idDragged;
                var textAreaDropped = "#seqTextArea_" + idDropped;
                var sequenceDragged = $(textAreaDragged)[0].value;
                var sequenceDropped = $(textAreaDropped)[0].value;
                $.get("SequenceEditorServlet", {"command": "align", "sequence1": sequenceDragged, "sequence2": sequenceDropped}, function(response) {
                    // Open draggable alignment window in testArea and bind a closeWindow button function to it 
                    $('#testArea').append('<div class="resizable ui-widget-content" id="resizable_' + aCount + '" style="min-width:650px;min-height:400px;border:solid black 1px" class="bigInterface"><div class="row-fluid"><div class="span1 offset11"><div class="btn-group pull-right"><button id="closeWindow_' + aCount + '" class="closeWindow btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="offset1 span10"><table class="colsTextArea pull-right" style="width:90%;"><tr><td id="columnFirst_' + aCount + '" class="columnFirst pull-left">1</td><td id="columnLast_' + aCount + '" class="columnLast pull-right"></td></tr></table></div></div><div class="row-fluid"><div class="offset1 span10"><textarea id="rowsTextArea_' + aCount + '" disabled class="rowsTextArea" style="margin-right:0px;border:none;cursor:default;background-color:transparent;resize:none;overflow: hidden;min-height: 250px;width:9%;text-align: center;"></textarea><textarea spellcheck="false" id="seqTextArea_' + aCount + '" class="seqTextArea pull-right" style="margin-left:0px;resize:none;font-size:12pt;font-family: monospace;min-height: 250px;width:90%;">atgttaacccatccgtgactaagacattgaatgccctag</textarea></div></div></div>');
                    $('#resizable_' + aCount).draggable({stack: ".resizable"});
                    $('#closeWindow_' + aCount).click(function() {
                        var idPattern = /\d+/;
                        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
                        $('#resizable_a' + id).remove();
                    });
                    var alignSeqs = []; // stores sequences that were aligned in separate strings
                    alignSeqs = response.split(/[_|]+/);    // Split string at alignment characters to extract aligned sequence information
                    alignSeqs[0] = alignSeqs[0].match(/[A-z-~]+/).toString().replace(/-/g, "~");
                    alignSeqs[1] = alignSeqs[1].match(/[A-z-~]+/).toString().replace(/-/g, "~");
                    var alignmentChars = response.match(/[_|]+/);   // stores alignment character string

                    // This is done initially to gather columns, rows, sequence length information to initialize labels. The aligned sequence is created further below.
                    $('#seqTextArea_' + aCount).text(response); // Set alignment to text area

                    // Initialize rows and columns labels
                    var charWidth = $('#measureSpan').width() / 10;
                    var numberOfCols = Math.floor($('#seqTextArea_' + aCount).width() / charWidth);
                    $('#columnLast_' + aCount).text(numberOfCols);
                    var seqLength = alignSeqs[0].toString().length;

                    var hasScrollBar = 0;
                    if ($('#seqTextArea_' + aCount).hasScrollBar()) {
                        $('#columnLast_' + aCount).text(Math.floor($('#seqTextArea_' + aCount).width() / charWidth - 1));
                        hasScrollBar = 1;
                    } else {
                        $('#columnLast_' + aCount).text(Math.floor($('#seqTextArea_' + aCount).width() / charWidth));
                    }
                    numberOfCols = Math.floor($('#seqTextArea_' + aCount).width() / charWidth - (hasScrollBar*2));
                    var kk = 0;
                    var lineNumber = "";
                    var numberOfRows = Math.ceil(seqLength / numberOfCols);
                    while (kk < numberOfRows) {
                        if (kk === 0) {
                            lineNumber += "\n1\n\n"
                            $("#rowsTextArea_" + aCount).text(lineNumber);
                            kk++;
                        }
                        else {
                            lineNumber += "\r\n\n" + (numberOfCols * kk) + "\n\n";
                            $("#rowsTextArea_" + aCount).text(lineNumber);
                            kk++;
                        }
                    }
                    $('#seqTextArea_' + aCount).filter_input({regex: '[]'});    // filter all keyboard characters. User cannot alter this alignment sequence.
                    //link scrollbars together
                    $('#seqTextArea_' + aCount).scroll(function() {
                        var id = ($(this).attr('id')).match(/\d+/);
                        $('#rowsTextArea_a' + id).scrollTop($(this).scrollTop());
                    });

                    var qq = 0;
                    var alignmentString = "";
                    while (qq <= Math.floor(seqLength / numberOfCols)) {
                        var start = qq * numberOfCols;
                        var end = start + numberOfCols - 1;
                        if (end < seqLength) {
                            alignmentString += alignSeqs[0].toString().substring(start, end);
                            alignmentString += alignmentChars.toString().substring(start, end);
                            alignmentString += alignSeqs[1].toString().substring(start, end) + "\n\n";
                        } else {
                            alignmentString += alignSeqs[0].toString().substring(start, seqLength) + "\n";
                            alignmentString += alignmentChars.toString().substring(start, seqLength) + "\n";
                            alignmentString += alignSeqs[1].toString().substring(start, seqLength);
                        }
                        qq++;
                    }
                    $('#seqTextArea_' + aCount).text(alignmentString); // Set alignment to text area
                });
                var countNum = aCount.match(/\d+/);
                countNum++;
                aCount = "a" + countNum;
            }
        },
        accept: ".sequenceWidget"
    });

    //this span contains 10 characters.
    var charWidth = $('#measureSpan').width() / 10;
    var numberOfCols = Math.floor($('#seqTextArea_' + count).width() / charWidth);

    var tempSeq = $('#seqTextArea_' + count).text().length;
    var numberOfRows = findNumOfRows(tempSeq, numberOfCols);

    tempSeq = $('#seqTextArea_' + count).text();
    var forwardArrayAndIndex = getForwardORFS(tempSeq);
    var reverseArrayAndIndex = getReverseORFS(tempSeq);

    // Generate a generic annotations and features container to add to each window's info object
    var _annotations = [];
    var _features = [];
    var annotations = [];
    var features = [];

    //JSON Object holding all necessary info for each window
    //TODO: calculate this info for each window as they are added        
    var windowInfo = {sequence: $('#seqTextArea_' + count).text(),
    seqLength: $('#seqTextArea_' + count).text().length,
    fileName: "newSequence_" + count,
    author: "anonymous",
    numOfCols: numberOfCols,
    numOfRows: numberOfRows,
    needToResetORFList: 0,
    forwardNextOrPrevious: 1,
    forwardLoopCountORF: 0,
    forwardArrayAndIndex: [{
        forwardCurrentORF: forwardArrayAndIndex[0],
        forwardNumORF: forwardArrayAndIndex[1],
        forwardIndex: forwardArrayAndIndex[2]
    }],
    reverseNextOrPrevious: 2,
    reverseLoopCountORF: 0,
    reverseArrayAndIndex: [{
        reverseCurrentORF: reverseArrayAndIndex[0],
        reverseNumORF: reverseArrayAndIndex[1],
        reverseIndex: reverseArrayAndIndex[2]
    }],
        _annotations: annotations, // holds annotations of features for each sequence editor window
        _features: features // holds features for given sequence in each sequence editor window
    };
    windows.push(windowInfo);           // Add current window JSON object full of information to windows array

    windows[count]._features = _features;
    windows[count]._annotations = _annotations;

    windows[count].sequence = "aaaaggggagatcccccttttaaaaga";
    windows[count]._features.push({name: "feature1", sequence: "aaaa", color: "red"});
    windows[count]._features.push({name: "feature2", sequence: "gggg", color: "cyan"});
    windows[count]._features.push({name: "feature3", sequence: "cccc", color: "green"});
    windows[count]._features.push({name: "feature4", sequence: "tttt", color: "yellow"});

    //i've added a hidden span on kevinSandbox.html with 0px padding; 
    $('#lengthCell_' + count).html(windows[count].seqLength);

    //initialize column width text
    $('#columnLast_' + count).text(numberOfCols);

    //filter all characters besides known nucleotide codes for all seqTextAreas (codes from: http://www.bioinformatics.org/sms2/iupac.html) 
    $('.seqTextArea').filter_input({regex: '[actguryswkmbdhvnACTGURYSWKMBDHVN]'});

    //link scrollbars together
    $('#seqTextArea_' + count).scroll(function() {
        var id = ($(this).attr('id')).match(/\d+/);
        $('#rowsTextArea_' + id).scrollTop($(this).scrollTop());
        $('#highlight_' + id).scrollTop($(this).scrollTop());
    });

    $('#highlight_' + count).scroll(function() {
        var id = ($(this).attr('id')).match(/\d+/);
        $('#seqTextArea_' + id).scrollTop($(this).scrollTop());
    });

    /***************************************************************************************/
    /* Functions */

    /*
     * Reverse Complement function takes sequence text and a boolean isDna. The output returned 
     * is the reversed complemented sequence.   
     * @param {type} sequence
     * @param {type} isDna --- true if DNA sequence, false if RNA sequence
     * @returns {String}
     */
    // <editor-fold defaultstate="collapsed" desc="revComp">
    function revComp(sequence) {
        var isDna = true; //Temporarily set isDna to true. TODO: remove when logic is in place to provide this info to function
        var revText = (sequence).split('').reverse().join('');
        var reverseComp = "";
        var jj = 0;
        while (jj < revText.length) {
            if (revText[jj] === "a") {
                if (isDna) {
                    reverseComp += "t";
                }
                else {
                    reverseComp += "u";
                }
            }
            else if (revText[jj] === "t") {
                reverseComp += "a";
            }
            else if (revText[jj] === "c") {
                reverseComp += "g";
            }
            else if (revText[jj] === "g") {
                reverseComp += "c";
            }
            else if (revText[jj] === "u") {
                reverseComp += "a";
            }
            else if (revText[jj] === "A") {
                if (isDna) {
                    reverseComp += "T";
                }
                else {
                    reverseComp += "U";
                }
            }
            else if (revText[jj] === "T") {
                reverseComp += "A";
            }
            else if (revText[jj] === "C") {
                reverseComp += "G";
            }
            else if (revText[jj] === "G") {
                reverseComp += "C";
            }
            else if (revText[jj] === "U") {
                reverseComp += "A";
            }
            else {
                reverseComp += "X";
            }
            jj++;
        }
        return reverseComp;
    }
    //</editor-fold>

    /*
     * Translate function returns codon representation of sequence
     * @param {type} sequence
     * @returns {String}
     */
    // <editor-fold defaultstate="collapsed" desc="translate">
    function translate(sequence) {
        var translatedSeq = "";
        var ii = 0;
        var triplet = "";
        var stop = "STOP";
        while (ii < (sequence.length) - 2) {
            sequence = sequence.toUpperCase();
            triplet = sequence.substring(ii, ii + 3);
            switch (triplet) {
                case "TTT":
                translatedSeq += "F";
                break;
                case "TTC":
                translatedSeq += "F";
                break;
                case "TTA":
                translatedSeq += "L";
                break;
                case "TTG":
                translatedSeq += "L";
                break;
                case "CTT":
                translatedSeq += "L";
                break;
                case "CTC":
                translatedSeq += "L";
                break;
                case "CTA":
                translatedSeq += "L";
                break;
                case "CTG":
                translatedSeq += "L";
                break;
                case "ATT":
                translatedSeq += "I";
                break;
                case "ATC":
                translatedSeq += "I";
                break;
                case "ATA":
                translatedSeq += "I";
                break;
                case "ATG":
                translatedSeq += "M";
                break;
                case "GTT":
                translatedSeq += "V";
                break;
                case "GTC":
                translatedSeq += "V";
                break;
                case "GTA":
                translatedSeq += "V";
                break;
                case "GTG":
                translatedSeq += "V";
                break;
                case "TCT":
                translatedSeq += "S";
                break;
                case "TCC":
                translatedSeq += "S";
                break;
                case "TCA":
                translatedSeq += "S";
                break;
                case "TCG":
                translatedSeq += "S";
                break;
                case "CCT":
                translatedSeq += "P";
                break;
                case "CCC":
                translatedSeq += "P";
                break;
                case "CCA":
                translatedSeq += "P";
                break;
                case "CCG":
                translatedSeq += "P";
                break;
                case "ACT":
                translatedSeq += "T";
                break;
                case "ACC":
                translatedSeq += "T";
                break;
                case "ACA":
                translatedSeq += "T";
                break;
                case "ACG":
                translatedSeq += "T";
                break;
                case "GCT":
                translatedSeq += "A";
                break;
                case "GCC":
                translatedSeq += "A";
                break;
                case "GCA":
                translatedSeq += "A";
                break;
                case "GCG":
                translatedSeq += "A";
                break;
                case "TAT":
                translatedSeq += "Y";
                break;
                case "TAC":
                translatedSeq += "Y";
                break;
                case "CAT":
                translatedSeq += "H";
                break;
                case "CAC":
                translatedSeq += "H";
                break;
                case "CAA":
                translatedSeq += "Q";
                break;
                case "CAG":
                translatedSeq += "Q";
                break;
                case "AAT":
                translatedSeq += "N";
                break;
                case "AAC":
                translatedSeq += "N";
                break;
                case "AAA":
                translatedSeq += "K";
                break;
                case "AAG":
                translatedSeq += "K";
                break;
                case "GAT":
                translatedSeq += "D";
                break;
                case "GAC":
                translatedSeq += "D";
                break;
                case "GAA":
                translatedSeq += "E";
                break;
                case "GAG":
                translatedSeq += "E";
                break;
                case "TGT":
                translatedSeq += "C";
                break;
                case "TGC":
                translatedSeq += "C";
                break;
                case "TGG":
                translatedSeq += "W";
                break;
                case "CGT":
                translatedSeq += "R";
                break;
                case "CGC":
                translatedSeq += "R";
                break;
                case "CGA":
                translatedSeq += "R";
                break;
                case "CGG":
                translatedSeq += "R";
                break;
                case "AGT":
                translatedSeq += "S";
                break;
                case "AGC":
                translatedSeq += "S";
                break;
                case "AGA":
                translatedSeq += "R";
                break;
                case "AGG":
                translatedSeq += "R";
                break;
                case "GGT":
                translatedSeq += "G";
                break;
                case "GGC":
                translatedSeq += "G";
                break;
                case "GGA":
                translatedSeq += "G";
                break;
                case "GGG":
                translatedSeq += "G";
                break;
                    // Stop Sequences
                    case "TAA":
                    translatedSeq += "*";
                    break;
                    case "TAG":
                    translatedSeq += "*";
                    break;
                    case "TGA":
                    translatedSeq += "*";
                    break;
                    default:
                    translatedSeq += "X";
                    break;
                }
                ii += 3;
            }
            return translatedSeq;
        }
// </editor-fold>

    // Checks to see if an element has a scrollbar
    (function($) {
        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.innerHeight();
        };
    })(jQuery);


    var resizableHeight = $('#resizable_' + count).height();
    var seqAreaHeight = $('#seqTextArea_' + count).height();
    var seqHeightDiff = resizableHeight-seqAreaHeight;
    var rowsAreaHeight = $('#rowsTextArea_' + count).height();
    var rowsHeightDiff = resizableHeight-rowsAreaHeight;



    /* 
     * Updates column width whenever window is resized
     */
     $('#resizable_' + count).resize(function() {
        var id = ($(this).attr('id')).match(/\d+/);
        var scrollBar = 0;
        var seqLength = $('#seqTextArea_' + id).text().length;

        resizableHeight = $('#resizable_' + id).height();
        seqAreaHeight = resizableHeight-seqHeightDiff;
        seqHeightDiff = resizableHeight-seqAreaHeight;
        rowsAreaHeight = resizableHeight-rowsHeightDiff;
        rowsHeightRatio = resizableHeight-rowsAreaHeight;            
        $('#seqTextArea_' + id).height(seqAreaHeight);
        $('#rowsTextArea_' + id).height(rowsAreaHeight);

        var hasScrollBar = 0;
        if ($('#seqTextArea_' + id).hasScrollBar()) {
            $('#columnLast_' + id).text(Math.floor($('#seqTextArea_' + id).width() / charWidth - 2));
            hasScrollBar = 1;
        } else {
            $('#columnLast_' + id).text(Math.floor($('#seqTextArea_' + id).width() / charWidth));
        }
        windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - (hasScrollBar*2));
        var kk = 0;
        var lineNumber = "";
        windows[id].numOfRows = Math.ceil(seqLength / (windows[id].numOfCols));
        while (kk < windows[id].numOfRows) {
            if (kk === 0) {
                lineNumber += "1";
                $("#rowsTextArea_" + id).text(lineNumber);
                kk++;
            }
            else {
                lineNumber += "\r\n" + ((windows[id].numOfCols) * (kk));
                $("#rowsTextArea_" + id).html(lineNumber);
                kk++;
            }
        }
    });

    /*
     * Binds the Reverse Complement function (revComp()) to the revComp button click. 
     */
     $('#revComp_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        $('#seqTextArea_' + id).focus();
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        var textArea = $(textAreaID)[0];
        var wholeSequence = textArea.innerText;
        var selectionText = getSelectionHtml();
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(document.getElementById('seqTextArea_' + id));   // selectionIndices has properties "start" and "end" corresponding to visible text in div.
        if (selectionText.length === 0) {   // Nothing is selected, so reverse complement everything.
            selectionText = wholeSequence;
            var revCompOut = revComp(selectionText);
            $(textAreaID).html(revCompOut);
            for (var ii = 0; ii < windows[id]._annotations.length; ii++) {  // Restore selection ranges upon reverse complement of entire sequence
                var range = rangy.createRange();
                var node = textArea;
                node = node.lastChild;
                if (ii === 0) {
                    range.setStart(node, windows[id]._annotations[ii].start);
                    range.setEnd(node, windows[id]._annotations[ii].end);
                }
                else {
                    range.setStart(node, windows[id]._annotations[ii].start - windows[id]._annotations[ii - 1].end);
                    range.setEnd(node, windows[id]._annotations[ii].end - windows[id]._annotations[ii - 1].end);
                }
                range.select();
                rangy.init();
                var randomCssClass = "rangyTemp_" + (+new Date());
                var classApplier = rangy.createCssClassApplier(randomCssClass, true);
                classApplier.applyToSelection();
                $("." + randomCssClass).css({"background-color": windows[id]._annotations[ii].color}).removeClass(randomCssClass);  // Applies a highlight to the current selection of text adding to any existing highlights.
            }
            setSelectionRange(document.getElementById("seqTextArea_" + id), selectionIndices.start, selectionIndices.start);
            textArea.focus();
        }
        else {
            var revCompOut = revComp(selectionText);
            var completeHTML = $(textAreaID).html();
            var firstHalf = wholeSequence.substring(0, selectionIndices.start);
            var secondHalf = wholeSequence.substring(selectionIndices.end, wholeSequence.length);
            var wholeSequence = firstHalf + revCompOut + secondHalf;
            $(textAreaID).text(wholeSequence);
            var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
            $('#seqTextArea_' + id).html(parsed);
            setSelectionRange(document.getElementById("seqTextArea_" + id), selectionIndices.start, selectionIndices.end);
        }
    });

    /*
     * Translate function displays the sequence's codon representation.
     */
     $('#translate_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        var textArea = $(textAreaID)[0];
        var sequence = "";
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(textArea);
        if (selectionIndices.start === selectionIndices.end) {
            //Nothing highlighted, so change the entire sequence.
            sequence = textArea.innerText;
        } else {
            sequence = getSelectionHtml();
        }
        var transOut = translate(sequence);
        alert(transOut);
    });

    /*
     * Uppercase function makes all selected text uppercase.
     */
     $('#uppercase_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/);  // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id;      // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        var textArea = $(textAreaID)[0];
        var wholeSequence = textArea.innerText;
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(textArea);
        if (selectionIndices.start === selectionIndices.end) {
            textArea.innerText = textArea.innerText.toUpperCase();  //Nothing highlighted, so change everything.
            var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
            $('#seqTextArea_' + id).html(parsed);
        } else {
            var upperOut = getSelectionHtml().toUpperCase();
            var firstHalf = wholeSequence.substring(0, selectionIndices.start);
            var secondHalf = wholeSequence.substring(selectionIndices.end, wholeSequence.length);
            var wholeSequence = firstHalf + upperOut + secondHalf;
            $(textAreaID).text(wholeSequence);
            var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
            $('#seqTextArea_' + id).html(parsed);
        }
        setSelectionRange(document.getElementById("seqTextArea_" + id), selectionIndices.start, selectionIndices.end);    
    });

    /*
     * Lowercase function makes all selected text lowercase.
     */
     $('#lowercase_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        var textArea = $(textAreaID)[0];
        var wholeSequence = textArea.innerText;
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(textArea);
        if (selectionIndices.start === selectionIndices.end) {
            textArea.innerText = textArea.innerText.toLowerCase();  //Nothing highlighted, so change everything.
            var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
            $('#seqTextArea_' + id).html(parsed);
        }
        else {
            var lowerOut = getSelectionHtml().toLowerCase();
            var firstHalf = wholeSequence.substring(0, selectionIndices.start);
            var secondHalf = wholeSequence.substring(selectionIndices.end, wholeSequence.length);
            var wholeSequence = firstHalf + lowerOut + secondHalf;
            $(textAreaID).text(wholeSequence);
            var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
            $('#seqTextArea_' + id).html(parsed);
        }
        setSelectionRange(document.getElementById("seqTextArea_" + id), selectionIndices.start, selectionIndices.end);
    });

    /*
     * Customize theme (background color) function
     */
     $('#colorChanger_' + count).colorpicker().on('changeColor', function(ev) {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var color = ev.color.toHex().toString();
        $('#resizable_' + id + '.ui-widget-content').css("background", color);
        $("#centralElement_" + id).css("background-color", color);
        $("#seqTextArea_" + id).css("background-color", "white");
    });



     $('#resizable_' + count).mouseup(function() {
        var id = $(this).attr('id').match(/\d+/);
        var textAreaID = "#seqTextArea_" + id;
        var textArea = $(textAreaID)[0];
        var gcPattern = /[gc]/ig;
        var gcContent = 0;
        var wholeSequence = textArea.innerText;
        var selection = getSelectionHtml();
        var seqLength = wholeSequence.length;
        var rowsTextArea = "#rowsTextArea_" + id;
        var columnsLast = "#columnLast_" + id;
        var posCell = "#positionCell_" + id;
        var gcCell = "#gcCell_" + id;
        var lenCell = "#lengthCell_" + id;
        // Get cursor position and selection indices (if any)
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(document.getElementById('seqTextArea_' + id));
        var inCodonPosStart = (selectionIndices.start % 3);
        var inCodonPosEnd = (selectionIndices.end % 3);
        windows[id].needToResetORFList = 1;

        // Update rows display
        if (seqLength === 0) {
            $(rowsTextArea).text("");
        }
        else {
            var hasScrollBar = 0;
            if ($(textAreaID).hasScrollBar()) {
                $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth - 2));
                hasScrollBar = 1;
            } else {
                $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth));
            }
            windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - (hasScrollBar*2));
            var kk = 0;
            var lineNumber = "";
            windows[id].numOfRows = Math.ceil(seqLength / (windows[id].numOfCols));
            while (kk < windows[id].numOfRows) {
                if (kk === 0) {
                    lineNumber += "1";
                    $(rowsTextArea).text(lineNumber);
                    kk++;
                }
                else {
                    lineNumber += "\r\n" + ((windows[id].numOfCols) * (kk));
                    $(rowsTextArea).html(lineNumber);
                    kk++;
                }
            }
        }

        if (selectionIndices.start === selectionIndices.end) {
            var posDisplay = selectionIndices.start + "(" + inCodonPosStart + ")";
            $(posCell).html(posDisplay);

            while (gcPattern.test(wholeSequence)) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (wholeSequence.length)) * 100);
            $(gcCell).html(gcContent);
            $(lenCell).html(seqLength);
        }
        else {
            var posDisplay = selectionIndices.start + "(" + inCodonPosStart + ")-" + selectionIndices.end + "(" + inCodonPosEnd + ")";
            $(posCell).html(posDisplay);

            while (gcPattern.test(selection)) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (selection.length)) * 100);
            $(gcCell).html(gcContent);

            var lengthDisplay = seqLength + "(" + selection.length + ")";
            $(lenCell).html(lengthDisplay);
        }
    });


$('#resizable_' + count).keyup(function() {
    var id = $(this).attr('id').match(/\d+/);
    var textAreaID = "#seqTextArea_" + id;
    var textArea = $(textAreaID)[0];
    var wholeSequence = textArea.innerText;
    var selection = getSelectionHtml();
    // Grab current sequence length
    var seqLength = wholeSequence.length;
    var rowsTextArea = "#rowsTextArea_" + id;
    var columnsLast = "#columnLast_" + id;
    var posCell = "#positionCell_" + id;
    var gcCell = "#gcCell_" + id;
    var lengthCell = "#lengthCell_" + id;
    // Get cursor position and selection indices (if any)
    var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(document.getElementById('seqTextArea_' + id));
    var inCodonPosStart = (selectionIndices.start % 3);
    var inCodonPosEnd = (selectionIndices.end % 3);

    // Update rows display
    if (seqLength === 0) {
        $(rowsTextArea).text("");
    }
    else {
        var hasScrollBar = 0;
        if ($(textAreaID).hasScrollBar()) {
            $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth - 2));
            hasScrollBar = 1;
        } else {
            $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth));
        }
        windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - (hasScrollBar*2));
        var kk = 0;
        var lineNumber = "";
        windows[id].numOfRows = Math.ceil(seqLength / (windows[id].numOfCols));
        while (kk < windows[id].numOfRows) {
            if (kk === 0) {
                lineNumber += "1";
                $(rowsTextArea).text(lineNumber);
                kk++;
            }
            else {
                lineNumber += "\r\n" + ((windows[id].numOfCols) * (kk));
                $(rowsTextArea).html(lineNumber);
                kk++;
            }
        }
    }

    var gcPattern = /[gc]/ig;
    var gcContent = 0;
    if (selectionIndices.start === selectionIndices.end) {
        var posDisplay = selectionIndices.start + "(" + inCodonPosStart + ")";
        $(posCell).html(posDisplay);

        while (gcPattern.test(wholeSequence)) {
            gcContent++;
        }
        gcContent = Math.round((gcContent / (wholeSequence.length)) * 100);
        $(gcCell).html(gcContent);

        $(lengthCell).html(seqLength);
    }
    else {
        var posDisplay = selectionIndices.start + "(" + inCodonPosStart + ")-" + selectionIndices.end + "(" + inCodonPosEnd + ")";
        $(posCell).html(posDisplay);

        while (gcPattern.test(selection)) {
            gcContent++;
        }
        gcContent = Math.round((gcContent / (selection.length)) * 100);
        $(gcCell).html(gcContent);

        var lengthDisplay = seqLength + "(" + selection.length + ")";
        $(lengthCell).html(lengthDisplay);
    }

    windows[id].needToResetORFList = 1;
});

/***************************************************************************************/
/* Hotkey Event Handlers */


jwerty.key('alt+n', false);
jwerty.key('alt+n', function() {
var id = (document.activeElement.id).match(/\d+/);
alert('ID: newSequence shortcode called from seqTextArea_' + id);
});

jwerty.key('alt+s', false);
jwerty.key('alt+s', function() {
var id = (document.activeElement.id).match(/\d+/);
alert('ID: saveSequence shortcode selected from seqTextArea_' + id);
});

jwerty.key('esc', false);
jwerty.key('esc', function() {
var id = (document.activeElement.id).match(/\d+/);
alert('ID: close shortcode selected from seqTextArea_' + id);
});

jwerty.key('alt+q', false);
    // When shortcut Alt+q is pressed, call nextForwardORF function
    jwerty.key('alt+q', function() {
        var id = (document.activeElement.id).match(/\d+/);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        var textArea = $(textAreaID)[0];
        // var node1 = textArea.firstChild;
        // var node2 = node1.nextSibling;
        // var range = rangy.createRange();
        // range.setStart(node2, 1);
        // range.setEnd(node2, 3);
        // range.select();
        // nextForwardORF(id, textAreaID);
    });

    jwerty.key('alt+w', false);
    // When shortcut Alt+w is pressed, call previousForwardORF function
    jwerty.key('alt+w', function() {
        var id = (document.activeElement.id).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        previousForwardORF(id, textAreaID);
    });

    jwerty.key('alt+e', false);
    // When shortcut Alt+e is pressed, call nextReverseORF function
    jwerty.key('alt+a', function() {
        var id = (document.activeElement.id).match(/\d+/);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        nextReverseORF(id, textAreaID);
    });

    jwerty.key('alt+r', false);
    // When shortcut Alt+r is pressed, call previousReverseORF function
    jwerty.key('alt+r', function() {
        var id = (document.activeElement.id).match(/\d+/);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        previousReverseORF(id, textAreaID);
    });

    jwerty.key('ctrl+/', false);
    jwerty.key('ctrl+/', function() {
        var id = (document.activeElement.id).match(/\d+/);
        alert('ID: search shortcode selected in seqTextArea_' + id);
    });

    jwerty.key('alt+2', false);
    jwerty.key('alt+2', function() {
        var id = (document.activeElement.id).match(/\d+/);
        alert('ID: features shortcode selected in seqTextArea_' + id);
    });

    jwerty.key('alt+3', false);
    jwerty.key('alt+3', function() {
        var id = (document.activeElement.id).match(/\d+/);
        alert('ID: selection shortcode selected in seqTextArea_' + id);
    });

    jwerty.key('a', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+a', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('c', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+c', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('t', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+t', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('g', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+g', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('u', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+u', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('r', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+r', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('y', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+y', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('s', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+s', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('w', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+w', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('k', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+k', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('m', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+m', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('b', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+b', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('d', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+d', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('h', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+h', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('v', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+v', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('n', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('shift+n', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength++;
    });
    jwerty.key('backspace', function() {
        var id = (document.activeElement.id).match(/\d+/);
        windows[id].needToResetORFList = 1;
        changeLength--;
    });

//    /***************************************************************************************/
//    /* Menu Item Event Handlers */
//

$('#windowTag_' + count).popover({
html: true,
content: function() {
            var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
            var htmlInfo = "<p><strong>TITLE:&nbsp;&nbsp;</strong>" + windows[id].fileName + "</p><p><strong>AUTHOR:&nbsp;&nbsp;</strong>" + windows[id].author + "</p><p><strong>WINDOW&nbsp;ID:&nbsp;&nbsp;</strong>" + id + "</p>";
            return htmlInfo;
        }
    });

$('#newSequence_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("New Sequence menu item chosen for " + bigInterfaceID);
    });

$('#saveSequence_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Save Sequence menu item chosen for " + bigInterfaceID);
    });

$('#close_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        $('#resizable_' + id).remove();
        // alert("Close menu item chosen for " + bigInterfaceID);
    });

$('#nextForwardORF_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        nextForwardORF(id, textAreaID);
    });

$('#previousForwardORF_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        previousForwardORF(id, textAreaID);
    });

$('#nextReverseORF_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        nextReverseORF(id, textAreaID);
    });

$('#previousReverseORF_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        previousReverseORF(id, textAreaID);
    });

$('#search_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Search menu item chosen for " + bigInterfaceID);
    });

$('#features_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        // This hardcodes a sequence into the current seqTextArea
        //TODO: Alter this to take current text area value and determine if features are present
        $('#seqTextArea_' + id).html("aaaaggggagatcccccttttaaaaga");
        windows[id]._annotations = generateAnnotations($('#seqTextArea_' + id)[0].innerText, windows[id]._features);
        var parsed = generateHighlights($('#seqTextArea_' + id)[0].innerText, windows[id]._annotations);
        $('#seqTextArea_' + id).html(parsed);
        windows[id].needToResetORFList = 1;
    });

$('#selection_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var wholeSequence = document.getElementById('seqTextArea_' + id).innerText;
        var seqSelect = getSelectionHtml();
        var sel = rangy.getSelection();
        var savedSel = rangy.saveSelection();
        // selectionIndices has properties "start" and "end" corresponding to visible text in div.
        var selectionIndices = sel.getRangeAt(0).toCharacterRange(document.getElementById('seqTextArea_' + id));

        windows[id]._features.push({name: "userSelect", sequence: seqSelect, color: "orange"});
        windows[id]._annotations = generateAnnotations(wholeSequence, windows[id]._features);
        var parsed = generateHighlights(wholeSequence, windows[id]._annotations);
        $('#seqTextArea_' + id).html(parsed);
        windows[id].needToResetORFList = 1;

        // // Applies a highlight to the current selection of text adding to any existing highlights.
        // rangy.init();
        // var randomCssClass = "rangyTemp_" + (+new Date());
        // var classApplier = rangy.createCssClassApplier(randomCssClass, true);
        // classApplier.applyToSelection();
        // // Now use jQuery to add the CSS colour and remove the class
        // $("." + randomCssClass).css({"background-color": "orange"}).removeClass(randomCssClass);

        //Stores selection annotation/range to some container for later use (removal, manipulation, etc)
        // windows[id]._annotations.push({features: "userSelect", sequence: seqSelect, range: savedSel, start: selectionIndices.start, end: selectionIndices.end, color: "orange"});

        // Removes selection once highlight it chosen
        sel.removeAllRanges();
    });


    // Close window when button is clicked
    $('#closeWindow_' + count).click(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        $('#resizable_' + id).remove();
    });


    // Enable/Disable window draggable class so user can edit text in contenteditable div at the right time
    $('#seqTextArea_' + count).mouseenter(function() {
        var id = $(this).attr('id').match(/\d+/);
        $('#resizable_' + id).draggable('disable');
    });
    $('#seqTextArea_' + count).mouseleave(function() {
        var id = $(this).attr('id').match(/\d+/);
        $('#resizable_' + id).draggable('enable');
    });


    //key events
    $('#seqTextArea_' + count).keydown(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        _sequence = $('#seqTextArea_' + id).val();
    });

    $('#seqTextArea_' + count).keyup(function() {
        var id = ($(this).attr('id')).match(/\d+/); // match the id number associated with the current window
        var textArea = $('#seqTextArea_' + id)[0];
        var unparsed = textArea.innerText;
        var selectionIndices = rangy.getSelection().getRangeAt(0).toCharacterRange(document.getElementById('seqTextArea_' + id));
        if (changeLength !== 0) {
            windows[id]._annotations = updateAnnotationIndices(selectionIndices.end, windows[id]._annotations, changeLength);
        }
        changeLength = 0;
        var parsed = generateHighlights(unparsed, windows[id]._annotations);
        $('#seqTextArea_' + id).html(parsed);
        windows[id].needToResetORFList = 1;
    });

    var seqWinName = "sequenceWindow_" + count;
    return seqWinName;

    // LAST STEP: Increment count variable
    count++;
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////     FUNCTIONS     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var findNumOfRows = function(seqLength, numberOfCols) {
if (seqLength > 0) {
    var kk = 0;
    var lineNumber = "";
    var numberOfRows = Math.ceil(seqLength / numberOfCols);
    while (kk < numberOfRows) {
        if (kk === 0) {
            lineNumber += "1";
            $('#rowsTextArea_' + count).text(lineNumber);
            kk++;
        }
        else {
            lineNumber += "\r\n" + (numberOfCols * (kk));
            $('#rowsTextArea_' + count).html(lineNumber);
            kk++;
        }
    }
}
return numberOfRows;
};


function getForwardORFS(sequence) {
var forwardIndeces = [];
var seqPattern = /atg(?:[atgc]{3}(?!taa|tag|tga))*(?:[atcg]{3})(?:taa|tag|tga)/ig;
while (seqPattern.test(sequence) === true) {
    forwardIndeces.push(seqPattern.lastIndex);
}
var arrayForwardORF = sequence.match(seqPattern);
if (arrayForwardORF === null) {
    return ["", 0];
}
else {
    var numORF = arrayForwardORF.length;
}
return [arrayForwardORF, numORF, forwardIndeces];
}

function getReverseORFS(sequence) {
var seqPattern = /(?:tta|cta|tca)(?:[atgc]{3}(?!cat))*(?:[atcg]{3})(?:cat)/ig;
var reverseIndeces = [];
while (seqPattern.test(sequence) === true) {
    reverseIndeces.push(seqPattern.lastIndex);
}
var arrayReverseORF = sequence.match(seqPattern);
if (arrayReverseORF === null) {
    return ["", 0];
}
else {
    var numORF = arrayReverseORF.length;
}
return [arrayReverseORF, numORF, reverseIndeces];
}


///////////////////////////////////

function getTextNodesIn(node) {
var textNodes = [];
if (node.nodeType == 3) {
    textNodes.push(node);
} else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
        textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
}
return textNodes;
}

function setSelectionRange(el, start, end) {
if (document.createRange && window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var textNodes = getTextNodesIn(el);
    var foundStart = false;
    var charCount = 0, endCharCount;

    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
        endCharCount = charCount + textNode.length;
        if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
            range.setStart(textNode, start - charCount);
            foundStart = true;
        }
        if (foundStart && end <= endCharCount) {
            range.setEnd(textNode, end - charCount);
            break;
        }
        charCount = endCharCount;
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
} else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(true);
    textRange.moveEnd("character", end);
    textRange.moveStart("character", start);
    textRange.select();
}
}

///////////////////////////////////



/*
 * Next Forward ORF function
 * @return: Highlights Next Forward ORF
 */
 function nextForwardORF(id, textAreaID) {

    // setSelectionRange(document.getElementById("seqTextArea_0"), 2, 7);

    if (windows[id].needToResetORFList) {
        var forwardArrayAndIndex = getForwardORFS($(textAreaID)[0].innerText);
        windows[id].forwardArrayAndIndex[0].forwardCurrentORF = forwardArrayAndIndex[0];
        windows[id].forwardArrayAndIndex[0].forwardNumORF = forwardArrayAndIndex[1];
        windows[id].forwardArrayAndIndex[0].forwardIndex = forwardArrayAndIndex[2];
        if (windows[id].forwardLoopCountORF >= windows[id].forwardArrayAndIndex[0].forwardNumORF) {
            windows[id].forwardLoopCountORF = 0;
        }
        windows[id].needToResetORFList = 0;
    }

    if (windows[id].forwardArrayAndIndex[0].forwardNumORF !== 0) {
        if (windows[id].forwardNextOrPrevious === 2 || windows[id].forwardNextOrPrevious === 1) {
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            windows[id].forwardLoopCountORF += 1;
            if (windows[id].forwardLoopCountORF >= windows[id].forwardArrayAndIndex[0].forwardNumORF) {
                windows[id].forwardLoopCountORF = 0;
            }
        }
        else if (windows[id].forwardNextOrPrevious === 0) {
            windows[id].forwardLoopCountORF += 2;
            if (windows[id].forwardLoopCountORF >= windows[id].forwardArrayAndIndex[0].forwardNumORF) {
                windows[id].forwardLoopCountORF = (windows[id].forwardLoopCountORF - (windows[id].forwardArrayAndIndex[0].forwardNumORF - 1)) - 1;
            }
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            windows[id].forwardLoopCountORF += 1;
            if (windows[id].forwardLoopCountORF >= windows[id].forwardArrayAndIndex[0].forwardNumORF) {
                windows[id].forwardLoopCountORF = 0;
            }
        }
    }
    windows[id].forwardNextOrPrevious = 1;
}


/*
 * Next Reverse ORF function
 * @return: Highlights Next Reverse ORF
 */
 function nextReverseORF(id, textAreaID) {
    if (windows[id].needToResetORFList) {
        var reverseArrayAndIndex = getReverseORFS($(textAreaID)[0].innerText);
        windows[id].reverseArrayAndIndex[0].reverseCurrentORF = reverseArrayAndIndex[0];
        windows[id].reverseArrayAndIndex[0].reverseNumORF = reverseArrayAndIndex[1];
        windows[id].reverseArrayAndIndex[0].reverseIndex = reverseArrayAndIndex[2];
        if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
            windows[id].reverseLoopCountORF = 0;
        }
        windows[id].needToResetORFList = 0;
    }

    if (windows[id].reverseArrayAndIndex[0].reverseNumORF !== 0) {
        if (windows[id].reverseNextOrPrevious === 2 || windows[id].reverseNextOrPrevious === 1) {
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            windows[id].reverseLoopCountORF += 1;
            if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
                windows[id].reverseLoopCountORF = 0;
            }
        }
        else if (windows[id].reverseNextOrPrevious === 0) {
            windows[id].reverseLoopCountORF += 2;
            if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
                windows[id].reverseLoopCountORF = (windows[id].reverseLoopCountORF - (windows[id].reverseArrayAndIndex[0].reverseNumORF - 1)) - 1;
            }
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            windows[id].reverseLoopCountORF += 1;
            if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
                windows[id].reverseLoopCountORF = 0;
            }
        }
    }
    windows[id].reverseNextOrPrevious = 1;
}

function previousForwardORF(id, textAreaID) {
    if (windows[id].needToResetORFList) {
        var forwardArrayAndIndex = getForwardORFS($(textAreaID)[0].innerText);
        windows[id].forwardArrayAndIndex[0].forwardCurrentORF = forwardArrayAndIndex[0];
        windows[id].forwardArrayAndIndex[0].forwardNumORF = forwardArrayAndIndex[1];
        windows[id].forwardArrayAndIndex[0].forwardIndex = forwardArrayAndIndex[2];
        if (windows[id].forwardLoopCountORF >= windows[id].forwardArrayAndIndex[0].forwardNumORF) {
            windows[id].forwardLoopCountORF = 0;
        }
        windows[id].needToResetORFList = 0;
    }

    if (windows[id].forwardArrayAndIndex[0].forwardNumORF !== 0) {
        if (windows[id].forwardNextOrPrevious === 0 || windows[id].forwardNextOrPrevious === 2) {
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            windows[id].forwardLoopCountORF -= 1;
            if (windows[id].forwardLoopCountORF < 0) {
                windows[id].forwardLoopCountORF = windows[id].forwardArrayAndIndex[0].forwardNumORF - 1;
            }
        }
        else if (windows[id].forwardNextOrPrevious === 1) {
            windows[id].forwardLoopCountORF -= 2;
            if (windows[id].forwardLoopCountORF < 0) {
                windows[id].forwardLoopCountORF = windows[id].forwardArrayAndIndex[0].forwardNumORF + windows[id].forwardLoopCountORF;
            }
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
            windows[id].forwardLoopCountORF -= 1;
            if (windows[id].forwardLoopCountORF < 0) {
                windows[id].forwardLoopCountORF = windows[id].forwardArrayAndIndex[0].forwardNumORF - 1;
            }
        }
    }
    windows[id].forwardNextOrPrevious = 0;
}

function previousReverseORF(id, textAreaID) {
    if (windows[id].needToResetORFList) {
        var reverseArrayAndIndex = getReverseORFS($(textAreaID)[0].innerText);
        windows[id].reverseArrayAndIndex[0].reverseCurrentORF = reverseArrayAndIndex[0];
        windows[id].reverseArrayAndIndex[0].reverseNumORF = reverseArrayAndIndex[1];
        windows[id].reverseArrayAndIndex[0].reverseIndex = reverseArrayAndIndex[2];
        if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
            windows[id].reverseLoopCountORF = 0;
        }
        windows[id].needToResetORFList = 0;
    }

    if (windows[id].reverseArrayAndIndex[0].reverseNumORF !== 0) {
        if (windows[id].reverseNextOrPrevious === 0 || windows[id].reverseNextOrPrevious === 2) {
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            windows[id].reverseLoopCountORF -= 1;
            if (windows[id].reverseLoopCountORF < 0) {
                windows[id].reverseLoopCountORF = windows[id].reverseArrayAndIndex[0].reverseNumORF - 1;
            }
        }
        else if (windows[id].reverseNextOrPrevious === 1) {
            windows[id].reverseLoopCountORF -= 2;
            if (windows[id].reverseLoopCountORF < 0) {
                windows[id].reverseLoopCountORF = windows[id].reverseArrayAndIndex[0].reverseNumORF + windows[id].reverseLoopCountORF;
            }
            setSelectionRange(document.getElementById("seqTextArea_" + id), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            // $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
            windows[id].reverseLoopCountORF -= 1;
            if (windows[id].reverseLoopCountORF < 0) {
                windows[id].reverseLoopCountORF = windows[id].reverseArrayAndIndex[0].reverseNumORF - 1;
            }
        }
    }
    windows[id].reverseNextOrPrevious = 0;
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

//generates annotations: {featureName, start, end, color}
var generateAnnotations = function(sequence, features) {
    var unresolvedAnnotations = [];                 //annotations with potential overlaps
    for (var i = 0; i < features.length; i++) {
        var matches = getIndicesOf(features[i].sequence, sequence, false);
        if (matches.length > 0) {
            for (var j = 0; j < matches.length; j++) {
                var startIndex = matches[j];
                var endIndex = startIndex + features[i].sequence.length;
                unresolvedAnnotations.push({features: features[i].name, sequence: features[i].sequence, start: startIndex, end: endIndex, color: features[i].color});
            }
        }
    }
    unresolvedAnnotations = unresolvedAnnotations.sort(function(a, b) {
        if (a.start < b.start) {
            return -1;
        }
        else if (a.start > b.start) {
            return 1;
        }
        else {
            if (a.end < b.end) {
                return -1;
            }
            else if (a.end > b.end) {
                return 1;
            }
        }
        return 0;
    });
    var resolvedAnnotations = resolveFeatureOverlap(unresolvedAnnotations, sequence);
    return resolvedAnnotations;
};

//resolve overlaps between annotations
var resolveFeatureOverlap = function(unresolvedAnnotations, sequence) {
    var toReturn = [];  // Annotations denoting overlaps
    for (var i = 0; i < unresolvedAnnotations.length; i++) {
        var overlapping = [];
        var current = unresolvedAnnotations[i];
        overlapping.push(current);
        var j = i + 1;
        while (j < unresolvedAnnotations.length) {
            var compared = unresolvedAnnotations[j];
            if (current.end > compared.start) {
                overlapping.push(compared);
                var k = j+1;
                while(k < unresolvedAnnotations.length) {
                    var nextCompare = unresolvedAnnotations[k];
                    if (compared.end > nextCompare.start) {
                        overlapping.push(nextCompare);
                        i++;
                        j+=1;
                    }
                    k++;
                }
                i++;
            } 
            // Increment variable j and get next feature to compare with current
            j += 1;
            compared = unresolvedAnnotations[j];
        }
        // Find indices for overlapping features. Store in variable ind
        var ind = [];
        for (var kk = 0; kk < overlapping.length; kk++) {
            ind.push(overlapping[kk].start);
            ind.push(overlapping[kk].end);
        }
        // Sort indices for overlapping section
        ind.sort(function(a, b) {
            return a - b;
        });
        // Remove duplicates from ind array
        var uniqueInds = [];
        $.each(ind, function(i, el){
            if($.inArray(el, uniqueInds) === -1) uniqueInds.push(el);
        });        
        // for each span push represented features to spanOverlapping array of feature objects
        for (var mm = 0; mm < ind.length - 1; mm++) {
            var spanOverlapping = [];   // features represented in overlapping spans 
            for (var nn = 0; nn < overlapping.length; nn++) {
                if (overlapping[nn].start >= ind[mm] && overlapping[nn].start < ind[mm + 1]) {
                    spanOverlapping.push(overlapping[nn]);
                }
                else if (overlapping[nn].end > ind[mm] && overlapping[nn].end <= ind[mm + 1]) {
                    spanOverlapping.push(overlapping[nn]);
                }
                else if (overlapping[nn].start <= ind[mm] && overlapping[nn].end >= ind[mm + 1]) {
                    spanOverlapping.push(overlapping[nn]);
                }
            }
            // Concatenate feature names represented in current span
            if (spanOverlapping.length > 1) {
                var pp = 0;
                var featuresRepresented = "";
                while (pp < spanOverlapping.length) {
                    if (pp === 0) {
                        featuresRepresented += spanOverlapping[pp].features;
                    } else {
                        featuresRepresented += "," + spanOverlapping[pp].features;
                    }
                    pp++;
                }
                var spanSequence = sequence.substring(ind[mm], ind[mm + 1]);
                toReturn.push({features: featuresRepresented, sequence: spanSequence, start: ind[mm], end: ind[mm + 1], color: spanOverlapping[spanOverlapping.length - 1].color});
            }
            else {
                var spanSequence = sequence.substring(ind[mm], ind[mm + 1]);
                toReturn.push({features: spanOverlapping[0].features, sequence: spanSequence, start: ind[mm], end: ind[mm + 1], color: spanOverlapping[0].color});
            }
        }
    }
    return toReturn;
};

//TODO: Refactor this function so it operates with contenteditable div
var updateAnnotationIndices = function(index, annotations, changeLength) {
    var updatedAnnotations = [];
    if (changeLength !== 0) {
        for (var i = 0; i < annotations.length; i++) {
            var start = annotations[i].start;
            var end = annotations[i].end;
            if (start + changeLength >= index) {    //change is before annotation
                annotations[i].start = start + changeLength;
                annotations[i].end = end + changeLength;
            }
            if (index > start + changeLength && index < end + changeLength) {
                // Ignore features that should be removed
            } else {
                updatedAnnotations.push(annotations[i]);
            }
        }
        return updatedAnnotations;
    }
    return annotations;
};

var generateHighlights = function(sequence, annotationsToDraw) {
    var toReturn = "";
    if (annotationsToDraw.length > 0) { //iterate through each feature and append regular text or a span
        toReturn = sequence.substring(0, annotationsToDraw[0].start) + '<span title="' + annotationsToDraw[0].features + '" style="background-color:' + annotationsToDraw[0].color + '">' + sequence.substring(annotationsToDraw[0].start, annotationsToDraw[0].end) + '</span>';   //append start of string
        var prevEnd = annotationsToDraw[0].end; //ending of the previous annotation
        for (var i = 1; i < annotationsToDraw.length; i++) {
            var start = annotationsToDraw[i].start;
            var end = annotationsToDraw[i].end;
            var features = annotationsToDraw[i].features;
            var color = annotationsToDraw[i].color;
            toReturn = toReturn + sequence.substring(prevEnd, start);
            toReturn = toReturn + '<span title="' + features + '" style="background-color:' + color + '">' + sequence.substring(start, end) + '</span>';
            prevEnd = end;
        }
        toReturn = toReturn + sequence.substring(annotationsToDraw[annotationsToDraw.length - 1].end, sequence.length); //append end of string
    } else {
        toReturn = sequence;
    }
    return toReturn;
};

// TODO: Rewrite function so that it returns proper sequence string when highlight spans are present. Currently returns html for highlights.
// Function returns current text selection
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection !== "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerText;
        }
    } else if (typeof document.selection !== "undefined") {
        if (document.selection.type === "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
