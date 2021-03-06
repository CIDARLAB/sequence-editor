$(document).ready(function() {
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
    var windows = [];   // stores sequence editor windows' information
    var count = 0;
    var aCount = "a" + 0; // tracks count of alignment windows opened. In case multiple alignments are opened at once.
    var resize = 0; // tracks large or small interface display. resize = 0 : large interface; resize = 1 : small interface.
    var changeLength = 0; //stores change length for updating indices
    var _sequence = ""; //store sequence to compare if insert or delete happened

    $('#newButton').click(function() {
        $('#testArea').append('<div class="resizable sequenceWidget ui-widget-content" id="resizable_' + count + '" style="min-width:650px;min-height:400px;border:solid black 1px" class="bigInterface"><div class="row-fluid" id="menuRow"><div class="span7"><div class="pull-left"><ul class="menu"><li class="btn-group" style="margin-left:0px;"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">File<span class="caret"></span></a><ul class="dropdown-menu" style="width:225px;"><li><a id="colorChanger_' + count + '" href="#">Change Theme</a></li><li><a id="newSequence_' + count + '" href="#">New Sequence<span class="shortcut pull-right">Alt+N</span></a></li><li><a id="openSequence_' + count + '" class="openSequence" href="#">Open Sequence<span class="shortcut pull-right">Alt+O</span></a></li><li><a id="saveSequence_' + count + '" class="saveSequence" href="#">Save Sequence<span class="shortcut pull-right">Alt+S</span></a></li><li><a id="close_' + count + '" class="closeOption" href="#">Close<span class="shortcut pull-right">Esc</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Find<span class="caret"></span></button><ul class="dropdown-menu" style="width:250px;"><li><a id="nextForwardORF_' + count + '" href="#">Next Forward ORF<span class="shortcut pull-right">Alt+Q</span></a></li><li><a id="previousForwardORF_' + count + '" href="#">Previous Forward ORF<span class="shortcut pull-right">Alt+W</span></a></li><li><a id="nextReverseORF_' + count + '" href="#">Next Reverve ORF<span class="shortcut pull-right">Alt+E</span></a></li><li><a id="previousReverseORF_' + count + '" href="#">Previous Reverse ORF<span class="shortcut pull-right">Alt+R</span></a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown">Highlight<span class="caret"></span></button><ul class="dropdown-menu"><li><a id="features_' + count + '" href="#">Features<span class="shortcut pull-right">Alt+2</span></a></li><li><a id="selection_' + count + '" href="#">Selection<span class="shortcut pull-right">Alt+3</span></a></li></ul></li></ul></div></div><div class="span2"><div class="btn-group pull-right"><button id="revComp_' + count + '" class="btn"><i class="icon-backward"></i></button><button id="translate_' + count + '" class="btn"><i class="icon-text-width"></i></button><button id="uppercase_' + count + '" class="btn"><i class="icon-arrow-up"></i></button><button id="lowercase_' + count + '" class="btn"><i class="icon-arrow-down"></i></button></div></div><div class="span2 offset1"><div class="btn-group pull-right"><button id="resize_' + count + '" class="resize btn"><i class="icon-fullscreen"></i></button><button id="closeWindow_' + count + '" class="btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="offset1 span10"><table class="colsTextArea pull-right" style="width:90%;"><tr><td id="columnFirst_' + count + '" class="columnFirst pull-left">1</td><td id="columnLast_' + count + '" class="columnLast pull-right"></td></tr></table></div></div><div id="centralElement_' + count + '" class="row-fluid"><div class="offset1 span10"><textarea id="rowsTextArea_' + count + '" disabled class="rowsTextArea" style="margin-right:0px;border:none;cursor:default;background-color:transparent;resize:none;overflow: hidden;min-height: 250px;width:7%;text-align: center;"></textarea><textarea class="seqTextArea pull-right" id="seqTextArea_' + count + '" style="overflow:auto;margin-left:0px;resize:none;font-size:12pt;font-family: monospace;min-height: 250px;width:90%;background-color: transparent;">atgttaacccatccgtgactaagacattgaatgccctag</textarea><!--this is the highlight layer--><div class="pull-right highlight" id="highlight_' + count + '" style="overflow:auto;margin-left: 0px;resize: none;word-wrap: break-word;min-height:250px;height: 250px;z-index: -1;position: relative;width: 90%;"></div></div></div><div class="row-fluid"><div class="offset4 span4"><table style="width:100%"><tr><th>Position:</th><td id="positionCell_' + count + '" class="positionCell">0(0)</td><th>Temp:</th><td id="tempCell_' + count + '" class="tempCell">0(C)</td><th>Feature:</th><td id="featureCell_' + count + '" class="featureCell">XbaI</td></tr><tr><th>Length:</th><td id="lengthCell_' + count + '" class="lengthCell">100</td><th>% GC</th><td id="gcCell_' + count + '" class="gcCell">50</td></tr></table></div></div></div>');

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
                    var idDragged = ($(ui.draggable).attr('id')).match(/\d/); // match the id number associated with the current window
                    var idDropped = ($(this).attr("id")).match(/\d/);
                    var textAreaDragged = "#seqTextArea_" + idDragged;
                    var textAreaDropped = "#seqTextArea_" + idDropped;
                    var sequenceDragged = $(textAreaDragged)[0].value;
                    var sequenceDropped = $(textAreaDropped)[0].value;
                    $.get("SequenceEditorServlet", {"command": "align", "sequence1": sequenceDragged, "sequence2": sequenceDropped}, function(response) {
                        // Open draggable alignment window in testArea and bind a closeWindow button function to it 
                        $('#testArea').append('<div class="resizable ui-widget-content" id="resizable_' + aCount + '" style="min-width:650px;min-height:400px;border:solid black 1px" class="bigInterface"><div class="row-fluid"><div class="span1 offset11"><div class="btn-group pull-right"><button id="closeWindow_' + aCount + '" class="closeWindow btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="offset1 span10"><table class="colsTextArea pull-right" style="width:90%;"><tr><td id="columnFirst_' + aCount + '" class="columnFirst pull-left">1</td><td id="columnLast_' + aCount + '" class="columnLast pull-right"></td></tr></table></div></div><div class="row-fluid"><div class="offset1 span10"><textarea id="rowsTextArea_' + aCount + '" disabled class="rowsTextArea" style="margin-right:0px;border:none;cursor:default;background-color:transparent;resize:none;overflow: hidden;min-height: 250px;width:9%;text-align: center;"></textarea><textarea id="seqTextArea_' + aCount + '" class="seqTextArea pull-right" style="margin-left:0px;resize:none;font-size:12pt;font-family: monospace;min-height: 250px;width:90%;">atgttaacccatccgtgactaagacattgaatgccctag</textarea></div></div></div>');
                        $('#resizable_' + aCount).draggable({stack: ".resizable"});
                        $('#closeWindow_' + aCount).click(function() {
                            var idPattern = /\d/;
                            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
                            $('#resizable_a' + id).remove();
                        });
                        var alignSeqs = []; // stores sequences that were aligned in separate strings
                        alignSeqs = response.split(/[_|]+/);    // Split string at alignment characters to extract aligned sequence information
                        alignSeqs[0] = alignSeqs[0].match(/[A-z-~]+/);
                        alignSeqs[1] = alignSeqs[1].match(/[A-z-~]+/);
                        var alignmentChars = response.match(/[_|]+/);   // stores alignment character string
//                        alert(alignSeqs[0].toString() + " ... AND ... " + alignSeqs[alignSeqs.length - 1].toString() + " ... AND ... " + alignmentChars.toString());

                        // This is done initially to gather columns, rows, sequence length information to initialize labels. The aligned sequence is created further below.
                        $('#seqTextArea_' + aCount).text(response); // Set alignment to text area{


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
                        numberOfCols = Math.floor($('#seqTextArea_' + aCount).width() / charWidth - hasScrollBar);
                        var kk = 0;
                        var lineNumber = "";
                        var numberOfRows = Math.ceil(seqLength / numberOfCols);
                        while (kk < numberOfRows) {
                            if (kk === 0) {
                                lineNumber += "1\n\n1";
                                $("#rowsTextArea_" + aCount).text(lineNumber);
                                kk++;
                            }
                            else {
                                lineNumber += "\r\n" + (numberOfCols * kk) + "\n\n" + (numberOfCols * kk);
                                $("#rowsTextArea_" + aCount).text(lineNumber);
                                kk++;
                            }
                        }
                        $('#seqTextArea_' + aCount).filter_input({regex: '[]'});    // filter all keyboard characters. User cannot alter this alignment sequence.
                        //link scrollbars together
                        $('#seqTextArea_' + aCount).scroll(function() {
                            var id = ($(this).attr('id')).match(/\d/);
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
                                alignmentString += alignSeqs[1].toString().substring(start, end);
                            } else {
                                alignmentString += alignSeqs[0].toString().substring(start, seqLength) + "\n";
                                alignmentString += alignmentChars.toString().substring(start, seqLength) + "\n";
                                alignmentString += alignSeqs[1].toString().substring(start, seqLength);
                            }
                            qq++;
                        }
                        $('#seqTextArea_' + aCount).text(alignmentString); // Set alignment to text area
                    });
                    var countNum = aCount.match(/\d/);
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
        var annotations = [];
        var features = [];

        //JSON Object holding all necessary info for each window
        //TODO: calculate this info for each window as they are added        
        var windowInfo = {sequence: $('#seqTextArea_' + count).text(),
            seqLength: $('#seqTextArea_' + count).text().length,
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

        //i've added a hidden span on kevinSandbox.html with 0px padding; 
        $('#lengthCell_' + count).html(windows[count].seqLength);

        //initialize column width text
        $('#columnLast_' + count).text(numberOfCols);

        //filter all characters besides known nucleotide codes for all seqTextAreas (codes from: http://www.bioinformatics.org/sms2/iupac.html) 
        $('.seqTextArea').filter_input({regex: '[actguryswkmbdhvnACTGURYSWKMBDHVN]'});

        //link scrollbars together
        $('#seqTextArea_' + count).scroll(function() {
            var id = ($(this).attr('id')).match(/\d/);
            $('#rowsTextArea_' + id).scrollTop($(this).scrollTop());
        });

        $('#seqTextArea_' + count).scroll(function() {
            var id = ($(this).attr("id")).match(/\d/);
            $('#highlight_' + id).scrollTop($(this).scrollTop());
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
        function revComp(sequence, isDna) {
            isDna = true; //Temporarily set isDna to true. TODO: remove when logic is in place to provide this info to function
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



        /* 
         * Updates column width whenever window is resized
         */
        $('#resizable_' + count).resize(function() {
            var id = ($(this).attr('id')).match(/\d/);
            var scrollBar = 0;
            var seqLength = $('#seqTextArea_' + id).val().length;

            var hasScrollBar = 0;
            if ($('#seqTextArea_' + id).hasScrollBar()) {
                $('#columnLast_' + id).text(Math.floor($('#seqTextArea_' + id).width() / charWidth - 1));
                hasScrollBar = 1;
            } else {
                $('#columnLast_' + id).text(Math.floor($('#seqTextArea_' + id).width() / charWidth));
            }
            windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - hasScrollBar);
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
                    $("#rowsTextArea_" + id).text(lineNumber);
                    kk++;
                }
            }
        });

        /*
         * Binds the Reverse Complement function (revComp()) to the revComp button click. 
         */
        $('#revComp_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

            var textArea = $(textAreaID)[0];
            var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            if (sequence.length === 0) {
                //Nothing highlighted, so change everything.
                sequence = textArea.value;
                var revCompOut = revComp(sequence);
                $(textAreaID).text(revCompOut);
            }
            else {
                var revCompOut = revComp(sequence);
                $(textAreaID).replaceSelectedText(revCompOut, "select");
            }
        });

        /*
         * Translate function displays the sequence's codon representation.
         */
        $('#translate_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id;
            var textArea = $(textAreaID)[0];
            var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            if (sequence.length === 0) {
                //Nothing highlighted, so change everything.
                sequence = textArea.value;
            }
            var transOut = translate(sequence);
            $(textAreaID).setSelection(textArea.selectionStart, textArea.selectionEnd);
            alert(transOut);
        });
        /*
         * Uppercase function makes all selected text uppercase.
         */
        $('#uppercase_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

            var textArea = $(textAreaID)[0];
            var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            if (sequence.length === 0) {
                //Nothing highlighted, so change everything.
                sequence = textArea.value.toUpperCase();
                $(textAreaID).text(sequence);
            }
            else {
                var upperOut = sequence.toUpperCase();
                $(textAreaID).replaceSelectedText(upperOut, "select");
            }
        });
        /*
         * Lowercase function makes all selected text lowercase.
         */
        $('#lowercase_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

            var textArea = $(textAreaID)[0];
            var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            if (sequence.length === 0) {
                //Nothing highlighted, so change everything.
                sequence = textArea.value.toLowerCase();
                $(textAreaID).text(sequence);
                $('#highlight_' + id).text(sequence);
            }
            else {
                var lowerOut = sequence.toLowerCase();
                $(textAreaID).replaceSelectedText(lowerOut, "select");
                $('#highlight_' + id).replaceSelectedText(lowerOut, "select");
            }
        });
        $('#colorChanger_' + count).colorpicker().on('changeColor', function(ev) {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "#resizable_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

            var color = ev.color.toHex().toString();
            $(bigInterfaceID).css("background-color", color);
            $("#centralElement_" + id).css("background-color", color);
            $("#seqTextArea_" + id).css("background-color", "white");
        });


        $('#resizable_' + count).mouseup(function() {
            var id = $(this).attr('id').match(/\d/);
            var textAreaID = "#seqTextArea_" + id;
            var textArea = $(textAreaID)[0];
            var gcPattern = /[gc]/ig;
            var gcContent = 0;
            var selection = textArea.value.toString().substring(textArea.selectionStart, textArea.selectionEnd);
            var inCodonPosStart = (textArea.selectionStart % 3);
            var inCodonPosEnd = (textArea.selectionEnd % 3);
            var seqLength = $(textAreaID).val().length;
            var rowsTextArea = "#rowsTextArea_" + id;
            var columnsLast = "#columnLast_" + id;
            var posCell = "#positionCell_" + id;
            var gcCell = "#gcCell_" + id;
            var lenCell = "#lengthCell_" + id;
            // Update rows display
            if (seqLength === 0) {
                $(rowsTextArea).text("");
            }
            else {
                var hasScrollBar = 0;
                if ($(textAreaID).hasScrollBar()) {
                    $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth - 1));
                    hasScrollBar = 1;
                } else {
                    $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth));
                }
                windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - hasScrollBar);
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
                        $(rowsTextArea).text(lineNumber);
                        kk++;
                    }
                }
            }

            if (textArea.selectionStart === textArea.selectionEnd) {
                var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")";
                $(posCell).html(posDisplay);

                while (gcPattern.test(textArea.value.toString())) {
                    gcContent++;
                }
                gcContent = Math.round((gcContent / (textArea.value.toString().length)) * 100);
                $(gcCell).html(gcContent);
                $(lenCell).html(seqLength);
            }
            else {
                var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")-" + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
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
            var id = $(this).attr('id').match(/\d/);
            var textAreaID = "#seqTextArea_" + id;
            var textArea = $(textAreaID)[0];
            // Grab current sequence length
            var seqLength = $(textAreaID).val().length;
            var rowsTextArea = "#rowsTextArea_" + id;
            var columnsLast = "#columnLast_" + id;
            var posCell = "#positionCell_" + id;
            var gcCell = "#gcCell_" + id;
            var lengthCell = "#lengthCell_" + id;
            // Update rows display
            if (seqLength === 0) {
                $(rowsTextArea).text("");
            }
            else {
                var hasScrollBar = 0;
                if ($(textAreaID).hasScrollBar()) {
                    $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth - 1));
                    hasScrollBar = 1;
                } else {
                    $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth));
                }
                windows[id].numOfCols = Math.floor($('#seqTextArea_' + id).width() / charWidth - hasScrollBar);
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
                        $(rowsTextArea).text(lineNumber);
                        kk++;
                    }
                }
            }

            var gcPattern = /[gc]/ig;
            var gcContent = 0;
            var selection = textArea.value.toString().substring(textArea.selectionStart, textArea.selectionEnd);
            var inCodonPosStart = (textArea.selectionStart % 3);
            var inCodonPosEnd = (textArea.selectionEnd % 3);
            if (textArea.selectionStart === textArea.selectionEnd) {
                var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")";
                $(posCell).html(posDisplay);

                while (gcPattern.test(textArea.value.toString())) {
                    gcContent++;
                }
                gcContent = Math.round((gcContent / (textArea.value.toString().length)) * 100);
                $(gcCell).html(gcContent);

                $(lengthCell).html(seqLength);
            }
            else {
                var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")-" + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
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
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: newSequence shortcode called from seqTextArea_' + id);
        });

        jwerty.key('alt+s', false);
        jwerty.key('alt+s', function() {
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: saveSequence shortcode selected from seqTextArea_' + id);
        });

        jwerty.key('esc', false);
        jwerty.key('esc', function() {
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: close shortcode selected from seqTextArea_' + id);
        });

        jwerty.key('alt+q', false);
        // When shortcut Alt+q is pressed, call nextForwardORF function
        jwerty.key('alt+q', function() {
            var idPattern = /\d/;
            var id = (document.activeElement.id).match(idPattern);     // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            nextForwardORF(id, textAreaID);
        });

        jwerty.key('alt+w', false);
        // When shortcut Alt+w is pressed, call previousForwardORF function
        jwerty.key('alt+w', function() {
            var idPattern = /\d/;
            var id = (document.activeElement.id).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            previousForwardORF(id, textAreaID);
        });

        jwerty.key('alt+e', false);
        // When shortcut Alt+e is pressed, call nextReverseORF function
        jwerty.key('alt+a', function() {
            var idPattern = /\d/;
            var id = (document.activeElement.id).match(idPattern);     // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            nextReverseORF(id, textAreaID);
        });

        jwerty.key('alt+r', false);
        // When shortcut Alt+r is pressed, call previousReverseORF function
        jwerty.key('alt+r', function() {
            var idPattern = /\d/;
            var id = (document.activeElement.id).match(idPattern);     // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            previousReverseORF(id, textAreaID);
        });

        jwerty.key('ctrl+/', false);
        jwerty.key('ctrl+/', function() {
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: search shortcode selected in seqTextArea_' + id);
        });

        jwerty.key('alt+2', false);
        jwerty.key('alt+2', function() {
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: features shortcode selected in seqTextArea_' + id);
        });

        jwerty.key('alt+3', false);
        jwerty.key('alt+3', function() {
            var id = (document.activeElement.id).match(/\d/);
            alert('ID: selection shortcode selected in seqTextArea_' + id);
        });

        jwerty.key('a', function() {
            var id = (document.activeElement.id).match(/\d/);
            windows[id].needToResetORFList = 1;
        });
        jwerty.key('c', function() {
            var id = (document.activeElement.id).match(/\d/);
            windows[id].needToResetORFList = 1;
        });
        jwerty.key('t', function() {
            var id = (document.activeElement.id).match(/\d/);
            windows[id].needToResetORFList = 1;
        });
        jwerty.key('g', function() {
            var id = (document.activeElement.id).match(/\d/);
            windows[id].needToResetORFList = 1;
        });
//    /***************************************************************************************/
//    /* Menu Item Event Handlers */
//
        $('#newSequence_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            alert("New Sequence menu item chosen for " + bigInterfaceID);
        });

        $('#saveSequence_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            alert("Save Sequence menu item chosen for " + bigInterfaceID);
        });

        $('#close_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            alert("Close menu item chosen for " + bigInterfaceID);
        });

        $('#nextForwardORF_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            nextForwardORF(id, textAreaID);
        });

        $('#previousForwardORF_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            previousForwardORF(id, textAreaID);
        });

        $('#nextReverseORF_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            nextReverseORF(id, textAreaID);
        });

        $('#previousReverseORF_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var textAreaID = "#seqTextArea_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
            previousReverseORF(id, textAreaID);
        });

        $('#search_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            alert("Search menu item chosen for " + bigInterfaceID);
        });
        $('#features_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

            // This hardcodes a sequence into the current seqTextArea
            //TODO: Alter this to take current text area value and determine if features are present
//            $('#seqTextArea_' + id).val("TCAATAAAACTATGGGGTAAAGAAGAACAAAAAATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTACTATTACGAGTTTTGGCTACAAGAAGGCTTTTTCTTATCCTCATGAATCGGATAATACTATGCTATTTCCTATGCTTATATTGGCTCTATTTACTTTTTTTGTTGGAGCCATAGCAATTCCTTTTAATCAAGAAGGACTACATTTGGATATATTATCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAATTCAAATGATTTTGAGGATTGGTATCAATTTTTAACAAATGCAACTCTTTCAGTGAGTATAGCCTGTTTCGGAATATTTACAGCATTCCTTTTATATAAGCCTTTTTATTCATCTTTACAAAATTTGAACTTACTAAATTTATTTTCGAAAGGGGGTCCTAAAAGAATTTTTTTGGATAAAATAATATACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTCATTTTTTTGATAGGCGAGTAATCGATGGAATTACAAATGGAGTACGCATCACAAGTTTTTTTATAGGCGAAGGTATCAAATATT");
            windows[id]._annotations = generateAnnotations($('#seqTextArea_' + id).val(), windows[id]._features);
            var parsed = generateHighlights($('#seqTextArea_' + id).val(), windows[id]._annotations);
            $('#highlight_' + id).html(parsed);
            $('#highlight_' + id).css("z-index", -1);
            $('#highlight_' + id + 'span').css("color", "transparent");
            $('#seqTextArea_' + id).css("color", "black");
        });
        $('#selection_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            alert("Selection Highlight menu item chosen for " + bigInterfaceID);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//        <div id="testerArea">
//    one div
//    <button id="button">button</button>
//</div>
//<div id="testerArea2">
//    other div
//</div>
//<script>
//    
//    $('#button').click(function(){
//        $(this).text("i changed my text")
//        $('#testerArea2').append($(this));
//        
//        
//        alert('button moved but function still bound')
//    })
//</script>

        $('.resize').click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "#resizable_" + id; // concatenate the window id number on the end of "#resizable_"

//            if (resize === 0) {
//                $(bigInterfaceID).css("minWidth", "400px");
//                $(bigInterfaceID).css("width", "400px");
//                $('#menuRow').append('<div class="span1"><div class="pull-left>"' + '                '>
//');
//");
//
////                $("#revComp_" + id).parent().parent().parent().html('<div class="span1"><div class="pull-left"><button id="colorChanger_' + id + '" class="colorChanger btn"><i class="icon-tint"></i></button></div></div><div class="span1"><div class="btn-group" style="margin-left:5px;"><button class="btn dropdown-toggle" data-toggle="dropdown"><i class="icon-th-list"></i><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li class="dropdown-submenu" role="menuitem"><a tabindex="-1" href="#">File</a><ul class="dropdown-menu" style="width:225px"><li><a id="newSequence_' + id + '" class="newSequence" href="#">New Sequence<span class="shortcut pull-right">Alt+N</span></a></li><li><a id="openSequence_' + id + '" class="openSequence" href="#">Open Sequence<span class="shortcut pull-right">Alt+O</span></a></li><li><a id="saveSequence_' + id + '" class="saveSequence" href="#">Save Sequence<span class="shortcut pull-right">Alt+S</span></a></li><li><a id="close_' + id + '" class="closeOption" href="#">Close<span class="shortcut pull-right">Esc</span></a></li></ul></li><li class="dropdown-submenu" role="menuitem"><a tabindex="-1" href="#">Find</a><ul class="dropdown-menu" style="width:250px"><li><a id="nextForwardORF_' + id + '" class="nextForwardORF" href="#">Next Forward ORF<span class="shortcut pull-right">Alt+Q</span></a></li><li><a id="previousForwardORF_' + id + '" class="previousForwardORF" href="#">Previous Forward ORF<span class="shortcut pull-right">Alt+W</span></a></li><li><a id="nextReverseORF_' + id + '" class="nextReverseORF" href="#">Next Reverse ORF<span class="shortcut pull-right">Alt+E</span></a></li><li><a id="previousReverseORF_' + id + '" class="previousReverseORF" href="#">Previous Reverse ORF<span class="shortcut pull-right">Alt+R</span></a></li><li><a id="search_' + id + '" class="search" href="#">Search<span class="shortcut pull-right">Ctrl+/</span></a></li></ul></li><li class="dropdown-submenu" role="menuitem"><a tabindex="-1" href="#">Highlight</a><ul class="dropdown-menu"><li><a id="features_' + id + '" class="features" href="#">Features<span class="shortcut pull-right">Alt+2</span></a></li><li><a id="selection_' + id + '" class="selection" href="#">Selection<span class="shortcut pull-right">Alt+3</span></a></li></ul></li><li><a id="revComp_' + id + '" class="revComp" href="#">Reverse Complement</a></li><li><a id="translate_' + id + '" class="translate" href="#">Translate</a></li><li><a id="uppercase_' + id + '" class="uppercase" href="#">To Uppercase</a></li><li><a id="lowercase_' + id + '" class="lowercase" href="#">To Lowercase</a></li></ul></div></div><div class="offset8 span2"><ul class="menu pull-right"><li class="btn-group"><button id="resize_' + id + '" class="resize btn"><i class="icon-fullscreen"></i></button><button id=_' + id + '"closeWindow" class="closeWindow btn"><i class="icon-remove"></i></button></li></ul></div>');
////                $("#positionCell_" + id).parent().parent().parent().parent().parent().html('<div class="offset1 span10"><table style="width:100%"><tr><th>Position:</th><td id="positionCell_' + id + '" class="positionCell">0(0)</td><th>Temp:</th><td id="tempCell_' + id + '" class="tempCell">0C</td><th>Feature:</th><td id="featureCell_' + id + '" class="featureCell">XbaI</td></tr><tbody><tr><th>Length:</th><td id="lengthCell_' + id + '" class="lengthCell">100</td><th>%GC</th><td id="gcCell_' + id + '" class="gcCell">50</td><td></td></tr></tbody></table></div>');
//                resize = 1;
//            }
//            else if (resize === 1) {
//                $(bigInterfaceID).css("minWidth", "650px");
//                $(bigInterfaceID).css("width", "650px");
//                resize = 0;
//            }
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $('#closeWindow_' + count).click(function() {
            var idPattern = /\d/;
            var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            var bigInterfaceID = "bigInterface_" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
            $('#resizable_' + id).remove();
        });

        //layer switching for hover over
        $('#seqTextArea_' + count).mousedown(function() {
            var idPattern = /\d/;
            var idNumber = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            $('#highlight_' + idNumber).css("z-index", -1);
            $('#seqTextArea_' + idNumber).css("color", "black");
        });
        $('#highlight_' + count).mousedown(function() {
            var idPattern = /\d/;
            var idNumber = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            $('#highlight_' + idNumber).css("z-index", -1);
            $('#seqTextArea_' + idNumber).css("color", "black");
        });
        $('#seqTextArea_' + count).mouseleave(function() {
            var idPattern = /\d/;
            var idNumber = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
            $('#highlight_' + idNumber).css("z-index", 1);
            $('#highlight_' + idNumber + ' span').css("color", "black");
        });


        //key events
        $('#seqTextArea_' + count).keydown(function() {
            var idPattern = /\d/;
            var idNumber = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window

            _sequence = $('#seqTextArea_' + idNumber).val();
            $('#highlight_' + idNumber + ' span').css("color", "transparent");
            changeLength++;
        });

        $('#seqTextArea_' + count).keyup(function() {
            var idPattern = /\d/;
            var idNumber = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window

            var textArea = $('#seqTextArea_' + idNumber)[0];
            var unparsed = $('#seqTextArea_' + idNumber).val();
            changeLength = (unparsed.length - _sequence.length) * changeLength;
            if (changeLength !== 0) {
                _annotations = updateAnnotationIndices(textArea.selectionEnd, _annotations, changeLength);
            }
            changeLength = 0;
            var parsed = generateHighlights(unparsed, _annotations);

            //set the html of the highlight layer
            $('#highlight_' + idNumber).html(parsed);
            $('#highlight_' + idNumber).css("z-index", -1);
            $('#highlight_' + idNumber + ' span').css("color", "transparent");
            $('#seqTextArea_' + idNumber).css("color", "black");
        });

        // LAST STEP: Increment count variable
        count++;
    });


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
                    alert(lineNumber);
                    $('#rowsTextArea_' + count).text(lineNumber);
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


    /*
     * Next Forward ORF function
     * @return: Highlights Next Forward ORF
     */
    function nextForwardORF(id, textAreaID) {
        if (windows[id].needToResetORFList) {
            var forwardArrayAndIndex = getForwardORFS($(textAreaID).val().toString());
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
                $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
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
                $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
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
            var reverseArrayAndIndex = getReverseORFS($(textAreaID).val().toString());
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
                $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
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
                $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
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
            var forwardArrayAndIndex = getForwardORFS($(textAreaID).val().toString());
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
                $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
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
                $(textAreaID).setSelection(windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF] - ((windows[id].forwardArrayAndIndex[0].forwardCurrentORF[windows[id].forwardLoopCountORF]).length), windows[id].forwardArrayAndIndex[0].forwardIndex[windows[id].forwardLoopCountORF]);
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
            var reverseArrayAndIndex = getReverseORFS($(textAreaID).val().toString());
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
                $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
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
                $(textAreaID).setSelection(windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF] - ((windows[id].reverseArrayAndIndex[0].reverseCurrentORF[windows[id].reverseLoopCountORF]).length), windows[id].reverseArrayAndIndex[0].reverseIndex[windows[id].reverseLoopCountORF]);
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
        for (var i = 0; i < unresolvedAnnotations.length; i++) {
        }
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
                    var spanSequence = sequence.substring(ind[mm], ind[mm + 1] - 1);
                    toReturn.push({features: featuresRepresented, sequence: spanSequence, start: ind[mm], end: ind[mm + 1], color: spanOverlapping[spanOverlapping.length - 1].color});
                }
                else {
                    var spanSequence = sequence.substring(ind[mm], ind[mm + 1] - 1);
                    toReturn.push({features: spanOverlapping[0].features, sequence: spanSequence, start: ind[mm], end: ind[mm + 1], color: spanOverlapping[0].color});
                }
            }
        }
        return toReturn;
    };

    var updateAnnotationIndices = function(index, annotations, changeLength) {
        var updatedAnnotations = [];
        if (changeLength !== 0) {
            for (var i = 0; i < annotations.length; i++) {
                var start = annotations[i].start;
                var end = annotations[i].end;
                if (start + changeLength >= index) {
                    //change is before annotation
                    annotations[i].start = start + changeLength;
                    annotations[i].end = end + changeLength;
                }
                if (index > start + changeLength && index < end + changeLength) {
                    //ignore features that should be removed
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
        //iterate through each feature and append regular text or a span
        if (annotationsToDraw.length > 0) {
            //append start of string
            toReturn = sequence.substring(0, annotationsToDraw[0].start) + '<span title="' + annotationsToDraw[0].features + '" style="background-color:' + annotationsToDraw[0].color + '">' + sequence.substring(annotationsToDraw[0].start, annotationsToDraw[0].end) + '</span>';
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
            //append end of string
            toReturn = toReturn + sequence.substring(annotationsToDraw[annotationsToDraw.length - 1].end, sequence.length);
        } else {
            toReturn = sequence;
        }
        return toReturn;
    };










    var samples = [];
    //Create dummy Genbank sequence/feature samples
    var sample1 = {sequence: "aaaagctacaggggccaatgacgcccctagacagtttttaacccaaaa",
        features: []};
//                {name: "feature4", sequence: "aaaag", color: "brown"}
    var sample2 = {sequence: "ATGGAGCATACATATCAATATTCATGGATCATACCGTTTGTGCCACTTCCAATTCCTATTTTAATAGGAATTGGACTCCTACTTTTTCCGACGGCAACAAAAAATCTTCGTCGTATGTGGGCTCTTCCCAATATTTTATTGTTAAGTATAGTTATGATTTTTTCGGTCGATCTGTCCATTCAGCAAATAAATAAAAGTTCTATCTATCAATATGTATGGTCTTGGACCATCAATAATGATTTTTCTTTCGAGTTTGGCTACTTTATTGATTCGCTTACCTAGTTCGAATTTGATAAAATTTATATTTTTTGGGAATTAGTTGGAATGTGTTCTTATCTATTAATAGGGTTTTGGTTCACACGACCCGCTGCGGCAAACGCCTGTCAAAAAGCATTTGTAACTAATCGGATAGGCGATTTTGGTTTATTATTAGGAATCTTAGGTTTTTATTGGATAACGGGAAGTTTCGAATTTCAAGATTTGTTCGAAATATTTAATAACTTGATTTATAATAATGAGGTTCAGTTTTTATTTGTTACTTTATGTGCCTCTTTATTA",
        features: [{name: "feature1", sequence: "TTGTGCCACTTCCAATTCCTATTTTAATAGGAATTGGAC", color: "red"},
            {name: "feature3", sequence: "CAACAAAAAATCTTCGTCGTATGTGGGCTCTTCCCAATAT", color: "green"},
            {name: "feature4", sequence: "TTGTTAAGTATAGTTATGATTTTTTCGGTCGATCTGTCCATTCAGCAAATAAATAAAAGTTCTATCTATCAATATGTATGGTCTTGGACCATCAATAATGATTTTTCTTTCGAGTTTGGCTACTTTATTGATTCGCTTACCTAGTTCGAATTTGATAAAATTTATATTTTTTGGGAATTAGTTGGAATGTGTTCTTATCTATTAATAGGGTTTTGGTTCACACGACCCGCTGCGGCAAACGCCTGTCAAAAAGCATTTGTAACTAATCGGATAGGCGATTTTGGTTTATTATTAGGAATCTTAGGTTTTTATTGGATAACGGGAAGTTTCGAATTTCAAGATTTGTTCGAAATATTTAATAACTTGATTTATAATAA", color: "yellow"}]
    };
    var sample3 = {sequence: "TCAATAAAACTATGGGGTAAAGAAGAACAAAAAATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTACTATTACGAGTTTTGGCTACAAGAAGGCTTTTTCTTATCCTCATGAATCGGATAATACTATGCTATTTCCTATGCTTATATTGGCTCTATTTACTTTTTTTGTTGGAGCCATAGCAATTCCTTTTAATCAAGAAGGACTACATTTGGATATATTATCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAATTCAAATGATTTTGAGGATTGGTATCAATTTTTAACAAATGCAACTCTTTCAGTGAGTATAGCCTGTTTCGGAATATTTACAGCATTCCTTTTATATAAGCCTTTTTATTCATCTTTACAAAATTTGAACTTACTAAATTTATTTTCGAAAGGGGGTCCTAAAAGAATTTTTTTGGATAAAATAATATACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTCATTTTTTTGATAGGCGAGTAATCGATGGAATTACAAATGGAGTACGCATCACAAGTTTTTTTATAGGCGAAGGTATCAAATATT",
        features: [{name: "feature1", sequence: "ATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAA", color: "red"},
            {name: "feature2", sequence: "TATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTAC", color: "cyan"},
            {name: "feature3", sequence: "TCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAA", color: "green"},
            {name: "feature4", sequence: "ACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTC", color: "yellow"}]
    };
    samples.push(sample1);
    samples.push(sample2);
    samples.push(sample3);

    // TEST CODE: hardcodes features for each window.
    //generate feature list
    var _features = []; //stores current features
    var _annotations = [];
    for (var j = 0; j < samples[2]["features"].length; j++) {
        var currentFeature = samples[2].features[j];
        _features.push({name: currentFeature.name, sequence: currentFeature.sequence, color: currentFeature.color});
    }


    $('#annotate').click(function() {
        $('#seqTextArea_0').val("TCAATAAAACTATGGGGTAAAGAAGAACAAAAAATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTACTATTACGAGTTTTGGCTACAAGAAGGCTTTTTCTTATCCTCATGAATCGGATAATACTATGCTATTTCCTATGCTTATATTGGCTCTATTTACTTTTTTTGTTGGAGCCATAGCAATTCCTTTTAATCAAGAAGGACTACATTTGGATATATTATCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAATTCAAATGATTTTGAGGATTGGTATCAATTTTTAACAAATGCAACTCTTTCAGTGAGTATAGCCTGTTTCGGAATATTTACAGCATTCCTTTTATATAAGCCTTTTTATTCATCTTTACAAAATTTGAACTTACTAAATTTATTTTCGAAAGGGGGTCCTAAAAGAATTTTTTTGGATAAAATAATATACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTCATTTTTTTGATAGGCGAGTAATCGATGGAATTACAAATGGAGTACGCATCACAAGTTTTTTTATAGGCGAAGGTATCAAATATT");
        _annotations = generateAnnotations($('#seqTextArea_0').val(), _features);
        var parsed = generateHighlights($('#seqTextArea_0').val(), _annotations);
        $('#highlight_0').html(parsed);
        $('#highlight_0').css("z-index", -1);
        $('#highlight_0 span').css("color", "transparent");
        $('#seqTextArea_0').css("color", "black");
    });
});
