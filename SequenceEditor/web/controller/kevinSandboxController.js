/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    /***************************************************************************************/
    var seqLength = $('#seqTextArea').text().length;

    //i've added a hidden span on kevinSandbox.html with 0px padding; 
    $('#lengthCell').html(seqLength);

    //this span contains 10 characters.
    var charWidth = $('#measureSpan').width() / 10;
    var numberOfCols = Math.floor($('#seqTextArea').width() / charWidth);
    //initialize column width text
    $('#columnLast').text(numberOfCols);

    if (seqLength > 0) {
        var kk = 0;
        var lineNumber = "";
        var numberOfRows = Math.ceil(seqLength / numberOfCols);
        while (kk < numberOfRows) {
            if (kk === 0) {
                lineNumber += "1";
                $('#rowsTextArea').text(lineNumber);
                kk++;
            }
            else {
                lineNumber += "\r\n" + (numberOfCols * (kk));
                $('#rowsTextArea').text(lineNumber);
                kk++;
            }
        }
    }

    //link scrollbars together
    $('#seqTextArea').scroll(function() {
        $('#rowsTextArea').scrollTop($(this).scrollTop());
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
    function revComp(sequence, isDna) {
        isDna = true;   //Temporarily set isDna to true. TODO: remove when logic is in place to provide this info to function
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
    ;

    /*
     * Translate function returns codon representation of sequence
     * @param {type} sequence
     * @returns {String}
     */
    function translate(sequence) {
        var translatedSeq = "";
        var ii = 0;
        var triplet = "";

        while (ii < (sequence.length) - 2) {
            sequence = sequence.toUpperCase();
            triplet = sequence.substring(ii, ii + 3);
            //translatedSeq += "X";
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
                    translatedSeq += "STOP";
                    break;
                case "TAG":
                    translatedSeq += "STOP";
                    break;
                case "TGA":
                    translatedSeq += "STOP";
                    break;
                default:
                    translatedSeq += "X";
                    break;
            }
            ii += 3;
        }
        return translatedSeq;
    }
    ;

    // Checks to see if an element has a scrollbar
    (function($) {
        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.innerHeight();
        };
    })(jQuery);

    function getForwardORFS() {
        var text = ($('#seqTextArea')[0]).value.toString();
        var seqPattern = /atg(?:[atgc]{3}(?!taa|tag|tga))*(?:[atcg]{3})(?:taa|tag|tga)/ig;
        var forwardIndeces = [];
        while (seqPattern.test(text) === true) {
            forwardIndeces.push(seqPattern.lastIndex);
        }
        var arrayForwardORF = text.match(seqPattern);
        if (arrayForwardORF === null) {
            return ["", 0];
        }
        else {
            var numORF = arrayForwardORF.length;
        }
        return [arrayForwardORF, numORF, forwardIndeces];
    }
    ;

    function getReverseORFS() {
        var text = ($('#seqTextArea')[0]).value.toString();
        var seqPattern = /(?:tta|cta|tca)(?:[atgc]{3}(?!cat))*(?:[atcg]{3})(?:cat)/ig;
        var reverseIndeces = [];
        while (seqPattern.test(text) === true) {
            reverseIndeces.push(seqPattern.lastIndex);
        }
        var arrayReverseORF = text.match(seqPattern);
        if (arrayReverseORF === null) {
            return ["", 0];
        }
        else {
            var numORF = arrayReverseORF.length;
        }
        return [arrayReverseORF, numORF, reverseIndeces];
    }
    ;

    var forwardNextOrPrevious = 1;       // Integer: 2 if no iteration has been processed yet, 1 if iterating to next forward ORF, 0 if iterating to previous forward ORF
    var needToResetORFList = 0;     // Boolean: True if a change in the sequence is detected. Otherwise, 0.
    var forwardLoopCountORF = 0;
    var forwardArrayAndIndex = getForwardORFS();
    var forwardCurrentORF = forwardArrayAndIndex[0];
    var forwardNumORF = forwardArrayAndIndex[1];
    var forwardIndex = forwardArrayAndIndex[2];

    /*
     * Next Forward ORF function
     * @return: Highlights Next Forward ORF
     */
    function nextForwardORF() {
        if (needToResetORFList) {
            forwardArrayAndIndex = getForwardORFS();
            forwardCurrentORF = forwardArrayAndIndex[0];
            forwardNumORF = forwardArrayAndIndex[1];
            forwardIndex = forwardArrayAndIndex[2];
            if (forwardLoopCountORF >= forwardNumORF) {
                forwardLoopCountORF = 0;
            }
            needToResetORFList = 0;
        }

        if (forwardNumORF !== 0) {
            if (forwardNextOrPrevious === 2 || forwardNextOrPrevious === 1) {
                $('#seqTextArea').setSelection(forwardIndex[forwardLoopCountORF] - ((forwardCurrentORF[forwardLoopCountORF]).length), forwardIndex[forwardLoopCountORF]);
                forwardLoopCountORF++;
                if (forwardLoopCountORF >= forwardNumORF) {
                    forwardLoopCountORF = 0;
                } else {
                    // Do nothing
                }
            }
            else if (forwardNextOrPrevious === 0) {
                forwardLoopCountORF += 2;
                if (forwardLoopCountORF >= forwardNumORF) {
                    forwardLoopCountORF = (forwardLoopCountORF - (forwardNumORF - 1)) - 1;
                } else {
                    // Do nothing
                }
                $('#seqTextArea').setSelection(forwardIndex[forwardLoopCountORF] - ((forwardCurrentORF[forwardLoopCountORF]).length), forwardIndex[forwardLoopCountORF]);
                forwardLoopCountORF++;
                if (forwardLoopCountORF >= forwardNumORF) {
                    forwardLoopCountORF = 0;
                } else {
                    // Do nothing
                }
            }
        }
        else {
            //Do nothing. No ORFs to iterate through.
        }
        forwardNextOrPrevious = 1;
    }
    ;

    var reverseNextOrPrevious = 2;          // Integer: 2 if no iteration has been processed yet, 1 if iterating to next forward ORF, 0 if iterating to previous forward ORF
    var reverseLoopCountORF = 0;
    var reverseArrayAndIndex = getReverseORFS();
    var reverseCurrentORF = reverseArrayAndIndex[0];
    var reverseNumORF = reverseArrayAndIndex[1];
    var reverseIndex = reverseArrayAndIndex[2];

    /*
     * Next Reverse ORF function
     * @return: Highlights Next Reverse ORF
     */
    function nextReverseORF() {
        if (needToResetORFList) {
            reverseArrayAndIndex = getReverseORFS();
            reverseCurrentORF = reverseArrayAndIndex[0];
            reverseNumORF = reverseArrayAndIndex[1];
            reverseIndex = reverseArrayAndIndex[2];
            if (reverseLoopCountORF >= reverseNumORF) {
                reverseLoopCountORF = 0;
            }
            needToResetORFList = 0;
        }

        if (reverseNumORF !== 0) {
            if (reverseNextOrPrevious === 2 || reverseNextOrPrevious === 1) {
                $('#seqTextArea').setSelection(reverseIndex[reverseLoopCountORF] - ((reverseCurrentORF[reverseLoopCountORF]).length), reverseIndex[reverseLoopCountORF]);
                reverseLoopCountORF++;
                if (reverseLoopCountORF >= reverseNumORF) {
                    reverseLoopCountORF = 0;
                } else {
                    // Do nothing
                }
            }
            else if (reverseNextOrPrevious === 0) {
                reverseLoopCountORF += 2;
                if (reverseLoopCountORF >= reverseNumORF) {
                    reverseLoopCountORF = (reverseLoopCountORF - (reverseNumORF - 1)) - 1;
                } else {
                    // Do nothing
                }
                $('#seqTextArea').setSelection(reverseIndex[reverseLoopCountORF] - ((reverseCurrentORF[reverseLoopCountORF]).length), reverseIndex[reverseLoopCountORF]);
                reverseLoopCountORF++;
                if (reverseLoopCountORF >= reverseNumORF) {
                    reverseLoopCountORF = 0;
                } else {
                    // Do nothing
                }
            }
        }
        reverseNextOrPrevious = 1;
    }
    ;

    function previousForwardORF() {
        if (needToResetORFList) {
            forwardArrayAndIndex = getForwardORFS();
            forwardCurrentORF = forwardArrayAndIndex[0];
            forwardNumORF = forwardArrayAndIndex[1];
            forwardIndex = forwardArrayAndIndex[2];
            if (forwardLoopCountORF >= forwardNumORF) {
                forwardLoopCountORF = 0;
            }
            needToResetORFList = 0;
        }

        if (forwardNumORF !== 0) {
            if (forwardNextOrPrevious === 0 || forwardNextOrPrevious === 2) {
                $('#seqTextArea').setSelection(forwardIndex[forwardLoopCountORF] - ((forwardCurrentORF[forwardLoopCountORF]).length), forwardIndex[forwardLoopCountORF]);
                forwardLoopCountORF--;
                if (forwardLoopCountORF < 0) {
                    forwardLoopCountORF = forwardNumORF - 1;
                } else {
                    // Do nothing
                }
            }
            else if (forwardNextOrPrevious === 1) {
                forwardLoopCountORF -= 2;
                if (forwardLoopCountORF < 0) {
                    forwardLoopCountORF = forwardNumORF + forwardLoopCountORF;
                } else {
                    // Do nothing
                }
                $('#seqTextArea').setSelection(forwardIndex[forwardLoopCountORF] - ((forwardCurrentORF[forwardLoopCountORF]).length), forwardIndex[forwardLoopCountORF]);
                forwardLoopCountORF--;
                if (forwardLoopCountORF < 0) {
                    forwardLoopCountORF = forwardNumORF - 1;
                } else {
                    // Do nothing
                }
            }
        }
        forwardNextOrPrevious = 0;
    }
    ;

    function previousReverseORF() {
        if (needToResetORFList) {
            reverseArrayAndIndex = getReverseORFS();
            reverseCurrentORF = reverseArrayAndIndex[0];
            reverseNumORF = reverseArrayAndIndex[1];
            reverseIndex = reverseArrayAndIndex[2];
            if (reverseLoopCountORF >= reverseNumORF) {
                reverseLoopCountORF = 0;
            }
            needToResetORFList = 0;
        }

        if (reverseNumORF !== 0) {
            if (reverseNextOrPrevious === 0 || reverseNextOrPrevious === 2) {
                $('#seqTextArea').setSelection(reverseIndex[reverseLoopCountORF] - ((reverseCurrentORF[reverseLoopCountORF]).length), reverseIndex[reverseLoopCountORF]);
                reverseLoopCountORF--;
                if (reverseLoopCountORF < 0) {
                    reverseLoopCountORF = reverseNumORF - 1;
                } else {
                    // Do nothing
                }
            }
            else if (reverseNextOrPrevious === 1) {
                reverseLoopCountORF -= 2;
                if (reverseLoopCountORF < 0) {
                    reverseLoopCountORF = reverseNumORF + reverseLoopCountORF;
                } else {
                    // Do nothing
                }
                $('#seqTextArea').setSelection(reverseIndex[reverseLoopCountORF] - ((reverseCurrentORF[reverseLoopCountORF]).length), reverseIndex[reverseLoopCountORF]);
                reverseLoopCountORF--;
                if (reverseLoopCountORF < 0) {
                    reverseLoopCountORF = reverseNumORF - 1;
                } else {
                    // Do nothing
                }
            }
        }
        reverseNextOrPrevious = 0;
    }
    ;

    /***************************************************************************************/
    /* Event Handlers */

    /* 
     * Updates column width whenever window is resized
     */
    $(window).resize(function() {
        var scrollBar = 0;
        if ($('#seqTextArea').hasScrollBar()) {
            scrollBar = scrollBar + 1;
        }
        $('#columnLast').text(Math.floor($('#seqTextArea').width() / charWidth - scrollBar));
        //TODO: Implement rows listing upon resizing
    });


    /*
     * Binds the Reverse Complement function (revComp()) to the revComp button click. 
     */
    $('#revComp').click(function() {
        var textArea = $('#seqTextArea')[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value;
            var revCompOut = revComp(sequence);
            $('#seqTextArea').text(revCompOut);
        }
        else {
            var revCompOut = revComp(sequence);
            $('#seqTextArea').replaceSelectedText(revCompOut, "select");
        }
    });


    /*
     * Translate function displays the sequence's codon representation.
     */
    $('#translate').click(function() {
        var textArea = $('#seqTextArea')[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value;
        }
        var transOut = translate(sequence);
        $('#seqTextArea').setSelection(textArea.selectionStart, textArea.selectionEnd);
        alert(transOut);
    });


    /*
     * Uppercase function makes all selected text uppercase.
     */
    $('#uppercase').click(function() {
        var textArea = $('#seqTextArea')[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value.toUpperCase();
            $('#seqTextArea').text(sequence);
        }
        else {
            var upperOut = sequence.toUpperCase();
            $('#seqTextArea').replaceSelectedText(upperOut, "select");
        }
    });


    /*
     * Lowercase function makes all selected text lowercase.
     */
    $('#lowercase').click(function() {
        var textArea = $('#seqTextArea')[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value.toLowerCase();
            $('#seqTextArea').text(sequence);
        }
        else {
            var lowerOut = sequence.toLowerCase();
            $('#seqTextArea').replaceSelectedText(lowerOut, "select");
        }
    });


    $('#colorChanger').colorpicker().on('changeColor', function(ev) {
        var color = ev.color.toHex().toString();
        $('#bigInterface').css("background-color", color);
    });

    document.onmouseup = function() {
        var textArea = $('#seqTextArea')[0];
        var gcPattern = /[gc]/ig;
        var gcContent = 0;
        var selection = textArea.value.toString().substring(textArea.selectionStart, textArea.selectionEnd);
        var inCodonPosStart = (textArea.selectionStart % 3);
        var inCodonPosEnd = (textArea.selectionEnd % 3);
        if (textArea.selectionStart === textArea.selectionEnd) {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")";
            $('#positionCell').html(posDisplay);

            while (gcPattern.test(textArea.value.toString())) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (textArea.value.toString().length)) * 100);
            $('#gcCell').html(gcContent);
        }
        else {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
            $('#positionCell').html(posDisplay);

            while (gcPattern.test(selection)) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (selection.length)) * 100);
            $('#gcCell').html(gcContent);
        }
    };


    document.onkeyup = function() {
        var textArea = $('#seqTextArea')[0];
        // Grab current sequence length
        seqLength = $('#seqTextArea').val().length;
        $('#lengthCell').html(seqLength);

        // Update rows display
        if (seqLength === 0) {
            $('#rowsTextArea').text("");
        }
        else {
            var hasScrollBar = 0;
            if ($('#seqTextArea').hasScrollBar()) {
                $('#columnLast').text(Math.floor($('#seqTextArea').width() / charWidth - 1));
                hasScrollBar = 1;
            }
            var kk = 0;
            var lineNumber = "";
            var numberOfRows = Math.ceil(seqLength / (numberOfCols - hasScrollBar));
            while (kk < numberOfRows) {
                if (kk === 0) {
                    lineNumber += "1";
                    $('#rowsTextArea').text(lineNumber);
                    kk++;
                }
                else {
                    lineNumber += "\r\n" + ((numberOfCols - hasScrollBar) * (kk));
                    $('#rowsTextArea').text(lineNumber);
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
            $('#positionCell').html(posDisplay);

            while (gcPattern.test(textArea.value.toString())) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (textArea.value.toString().length)) * 100);
            $('#gcCell').html(gcContent);
        }
        else {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
            $('#positionCell').html(posDisplay);

            while (gcPattern.test(selection)) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (selection.length)) * 100);
            $('#gcCell').html(gcContent);
        }

        needToResetORFList = 1;
    };

    /***************************************************************************************/
    /* Hotkey Event Handlers */


    jwerty.key('alt+n', false);
    jwerty.key('alt+n', function() {
        alert('ID: newSequence');
    });

    jwerty.key('alt+o', false);
    jwerty.key('alt+o', function() {
        alert('ID: openSequence');
    });

    jwerty.key('alt+s', false);
    jwerty.key('alt+s', function() {
        alert('ID: saveSequence');
    });

    jwerty.key('esc', false);
    jwerty.key('esc', function() {
        alert('ID: close');
    });

    jwerty.key('alt+q', false);
    jwerty.key('alt+q', nextForwardORF);        // When shortcut Alt+q is pressed, call nextForwardORF function

    jwerty.key('alt+w', false);
    jwerty.key('alt+w', previousForwardORF);    // When shortcut Alt+w is pressed, call previousForwardORF function

    jwerty.key('alt+a', false);
    jwerty.key('alt+a', nextReverseORF);        // When shortcut Alt+e is pressed, call nextReverseORF function

    jwerty.key('alt+r', false);
    jwerty.key('alt+r', previousReverseORF);    // When shortcut Alt+r is pressed, call previousReverseORF function

    jwerty.key('ctrl+/', false);
    jwerty.key('ctrl+/', function() {
        alert('ID: search');
    });

    jwerty.key('alt+2', false);
    jwerty.key('alt+2', function() {
        alert('ID: features');
    });

    jwerty.key('alt+3', false);
    jwerty.key('alt+3', function() {
        alert('ID: selection');
    });

    jwerty.key('a', function() {
        needToResetORFList = 1;
    });

    jwerty.key('c', function() {
        needToResetORFList = 1;
    });

    jwerty.key('t', function() {
        needToResetORFList = 1;
    });

    jwerty.key('g', function() {
        needToResetORFList = 1;
    });
    /***************************************************************************************/
    /* Menu Item Event Handlers */

    $('#newSequence').click(function() {
        alert('New Sequence menu item chosen');
    });

    $('#openSequence').click(function() {
        $.get("SequenceEditorServlet", {"command": "genbank"}, function(response) {            
            $('#seqTextArea').text((response[0].Sequence));
//            $.each(response, function(index, d) {
//                    alert(d.Sequence);
//            });
        });
    });

    $('#saveSequence').click(function() {
        alert('Save Sequence menu item chosen');
    });

    $('#close').click(function() {
        alert('Close menu item chosen');
    });

    $('#nextForwardORF').click(nextForwardORF);         // Upon click call nextForwardORF function

    $('#previousForwardORF').click(previousForwardORF);

    $('#nextReverseORF').click(nextReverseORF);

    $('#previousReverseORF').click(previousReverseORF);

    $('#search').click(function() {
        alert('Search item chosen');
    });

    $('#features').click(function() {
        alert('Features item chosen');
    });

    $('#selection').click(function() {
        alert('Selection item chosen');
    });

    $('#resize').click(function() {
        alert('Resize button chosen');
    });

    $('#closeWindow').click(function() {
        alert('Close Window button chosen');
    });
});

