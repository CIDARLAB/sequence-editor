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

    //checks to see if an element has a scrollbar
    (function($) {
        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.innerHeight();
        };
    })(jQuery);

    function getForwardORFS() {
        var text = ($('#seqTextArea')[0]).value.toString();
        var seqPattern = /atg(?:[atgc]{3}(?!taa|tag|tga))*(?:[atcg]{3})(?:taa|tag|tga)/ig;
        var arrayForwardORF = text.match(seqPattern);
        var numORF = arrayForwardORF.length;
        return [arrayForwardORF, numORF];
    }
    ;

    /*
     * Next Forward ORF function
     * @returns Alert with all forward ORFs found. TODO: highlight ORFs in consecutive order.
     */
    var needToResetORFList = 0;     // Boolean: True if a change in the sequence is detected. Otherwise, 0.
    var loopCountORF = 0;
    var arrayAndIndex = getForwardORFS();
    var currentORF = arrayAndIndex[0];
    var numORF = arrayAndIndex[1];

    function nextForwardORF() {
        if (needToResetORFList) {
            arrayAndIndex = getForwardORFS();
            currentORF = arrayAndIndex[0];
            numORF = arrayAndIndex[1];
            needToResetORFList = 0;
        }
        if (loopCountORF < numORF) {
            alert(currentORF[loopCountORF]);
            loopCountORF++;
        }
        else {
            loopCountORF = 0;
            alert(currentORF[loopCountORF]);
            loopCountORF++;
        }
    }
    ;

    function nextReverseORF() {
        var text = ($('#seqTextArea')[0]).value.toString();
        var seqPattern = /(?:tta|cta|tca)(?:[atgc]{3}(?!tta|cta|tca))*(?:[atcg]{3})(?:cat)/ig;
        alert(text.match(seqPattern));
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
        var inCodonPosStart = (textArea.selectionStart % 3);
        var inCodonPosEnd = (textArea.selectionEnd % 3);
        if (textArea.selectionStart === textArea.selectionEnd) {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")";
            $('#positionCell').html(posDisplay);
        }
        else {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
            $('#positionCell').html(posDisplay);
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

        var inCodonPosStart = (textArea.selectionStart % 3);
        var inCodonPosEnd = (textArea.selectionEnd % 3);
        if (textArea.selectionStart === textArea.selectionEnd) {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ")";
            $('#positionCell').html(posDisplay);
        }
        else {
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
            $('#positionCell').html(posDisplay);
        }
    };

    /***************************************************************************************/
    /* Hotkey Event Handlers */


    jwerty.key('alt+n', false);
    jwerty.key('alt+n', function() {
        alert('ID: newSequence');
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
    jwerty.key('alt+w', function() {
        alert('ID: previousForwardORF');
    });

    jwerty.key('alt+e', false);
    jwerty.key('alt+e', function() {
        alert('ID: nextReverseORF');
    });

    jwerty.key('alt+r', false);
    jwerty.key('alt+r', function() {
        alert('ID: previousReverseORF');
    });

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

    $('#saveSequence').click(function() {
        alert('Save Sequence menu item chosen');
    });

    $('#close').click(function() {
        alert('Close menu item chosen');
    });

    $('#undo').click(function() {
        alert('Undo menu item chosen');
    });

    $('#redo').click(function() {
        alert('Redo menu item chosen');
    });

    $('#cut').click(function() {
        alert('Cut menu item chosen');
    });

    $('#copy').click(function() {
        alert('Copy menu item chosen');
    });

    $('#paste').click(function() {
        alert('Paste menu item chosen');
    });

    $('#delete').click(function() {
        alert('Delete menu item chosen');
    });

    $('#nextForwardORF').click(nextForwardORF);         // Upon click call nextForwardORF function

    $('#previousForwardORF').click(function() {
        alert('Previous Forward ORF item chosen');
    });

    $('#nextReverseORF').click(nextReverseORF);

    $('#previousReverseORF').click(function() {
        alert('Previous Reverse ORF item chosen');
    });

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

