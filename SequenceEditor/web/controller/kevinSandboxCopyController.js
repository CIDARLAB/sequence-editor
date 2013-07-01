/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {

    /***************************************************************************************/
    //filter all characters besides known nucleotide codes for all seqTextAreas (codes from: http://www.bioinformatics.org/sms2/iupac.html) 
    $('.seqTextArea').filter_input({regex: '[actguryswkmbdhvnACTGURYSWKMBDHVN]'});


    /////////////////////////////////////////////////////////////////////////////////////
    //TODO: Need to do all of this between the comment-slash lines dynamically.

    //this span contains 10 characters.
    var charWidth = $('#measureSpan1').width() / 10;
    var numberOfCols1 = Math.floor($('#seqTextArea1').width() / charWidth);
    charWidth = $('#measureSpan2').width() / 10;
    var numberOfCols2 = Math.floor($('#seqTextArea2').width() / charWidth);

    var tempSeq = $('#seqTextArea1').text().length;
    var numberofRows1 = findNumOfRows(tempSeq, numberOfCols1);

    tempSeq = $('#seqTextArea2').text().length;
    var numberofRows2 = findNumOfRows(tempSeq, numberOfCols2);

    tempSeq = $('#seqTextArea1').text();
    var forwardArrayAndIndex1 = getForwardORFS(tempSeq);
    var reverseArrayAndIndex1 = getReverseORFS(tempSeq);

    tempSeq = $('#seqTextArea2').text();
    var forwardArrayAndIndex2 = getForwardORFS(tempSeq);
    var reverseArrayAndIndex2 = getReverseORFS(tempSeq);

    //JSON Object holding all necessary info for each window
    //TODO: calculate this info for each window as they are added
    var windows = [];
    var windowInfo1 = {sequence: $('#seqTextArea1').text(),
        seqLength: $('#seqTextArea1').text().length,
        numOfCols: numberOfCols1,
        numOfRows: numberofRows1,
        needToResetORFList: 0,
        forwardNextOrPrevious: 1,
        forwardLoopCountORF: 0,
        forwardArrayAndIndex: [{
                forwardCurrentORF: forwardArrayAndIndex1[0],
                forwardNumORF: forwardArrayAndIndex1[1],
                forwardIndex: forwardArrayAndIndex1[2]
            }],
        reverseNextOrPrevious: 2,
        reverseLoopCountORF: 0,
        reverseArrayAndIndex: [{
                reverseCurrentORF: reverseArrayAndIndex1[0],
                reverseNumORF: reverseArrayAndIndex1[1],
                reverseIndex: reverseArrayAndIndex1[2]
            }]
    };
    var windowInfo2 = {sequence: $('#seqTextArea2').text(),
        seqLength: $('#seqTextArea2').text().length,
        numOfCols: numberOfCols2,
        numOfRows: numberofRows2,
        needToResetORFList: 0,
        forwardNextOrPrevious: 1,
        forwardLoopCountORF: 0,
        forwardArrayAndIndex: [{
                forwardCurrentORF: forwardArrayAndIndex2[0],
                forwardNumORF: forwardArrayAndIndex2[1],
                forwardIndex: forwardArrayAndIndex2[2]
            }],
        reverseNextOrPrevious: 2,
        reverseLoopCountORF: 0,
        reverseArrayAndIndex: [{
                reverseCurrentORF: reverseArrayAndIndex2[0],
                reverseNumORF: reverseArrayAndIndex2[1],
                reverseIndex: reverseArrayAndIndex2[2]
            }]
    };

    windows.push(windowInfo1);
    windows.push(windowInfo2);

    /////////////////////////////////////////////////////////////////////////////////////


    //i've added a hidden span on kevinSandbox.html with 0px padding; 
    $('#lengthCell1').html(windows[0].seqLength);
    $('#lengthCell2').html(windows[1].seqLength);

    //initialize column width text
    $('#columnLast1').text(numberOfCols1);
    $('#columnLast2').text(numberOfCols2);


    function findNumOfRows(seqLength, numberOfCols) {
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
        return numberOfRows;
    }

    //link scrollbars together
//    $('#seqTextArea').scroll(function() {
//        $('#rowsTextArea').scrollTop($(this).scrollTop());
//    });


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

    // Checks to see if an element has a scrollbar
    (function($) {
        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.innerHeight();
        };
    })(jQuery);


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
            var forwardArrayAndIndex = getForwardORFS();
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
                windows[id].forwardLoopCountORF++;
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
                windows[id].forwardLoopCountORF++;
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
            var reverseArrayAndIndex = getReverseORFS();
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
                windows[id].reverseLoopCountORF++;
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
                windows[id].reverseLoopCountORF++;
                if (windows[id].reverseLoopCountORF >= windows[id].reverseArrayAndIndex[0].reverseNumORF) {
                    windows[id].reverseLoopCountORF = 0;
                }
            }
        }
        windows[id].reverseNextOrPrevious = 1;
    }

    function previousForwardORF(id, textAreaID) {
        if (windows[id].needToResetORFList) {
            var forwardArrayAndIndex = getForwardORFS();
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
                windows[id].forwardLoopCountORF--;
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
                windows[id].forwardLoopCountORF--;
                if (windows[id].forwardLoopCountORF < 0) {
                    windows[id].forwardLoopCountORF = windows[id].forwardArrayAndIndex[0].forwardNumORF - 1;
                }
            }
        }
        windows[id].forwardNextOrPrevious = 0;
    }

    function previousReverseORF(id, textAreaID) {
        if (windows[id].needToResetORFList) {
            var reverseArrayAndIndex = getReverseORFS();
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
                windows[id].reverseLoopCountORF--;
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
                windows[id].reverseLoopCountORF--;
                if (windows[id].reverseLoopCountORF < 0) {
                    windows[id].reverseLoopCountORF = windows[id].reverseArrayAndIndex[0].reverseNumORF - 1;
                }
            }
        }
        windows[id].reverseNextOrPrevious = 0;
    }

//    var spansToHighlight = [];
//    function resolveFeatureOverlap(orderedIndeces, features, indexCount) {
//        var kk = 0;
//        for (var ii = 0; ii < orderedIndeces.length; ii++) {
//            var overlappingFeatures = "";
//            var startingIndex = "";
//            var endingIndex = "";
//            var spanColor = "";
//            var count = 0;
//            for (var jj = kk; jj < indexCount; jj++) {
//                if (jj === kk) {
//                    startingIndex = orderedIndeces[ii];
//                    endingIndex = orderedIndeces[ii + 1];
//                }
//                if ((features[jj].start >= orderedIndeces[ii]) && (features[jj].start < orderedIndeces[ii + 1])) {
//                    overlappingFeatures += features[jj].name + ",";
//                    count = jj;
//                }
//                else if ((features[jj].start >= orderedIndeces[ii]) && (features[jj].end <= orderedIndeces[ii + 1])) {
////                    span.push(features[jj].name);
//                    overlappingFeatures += features[jj].name + ",";
//                    count = jj;
//                }
//                else if ((features[jj].end > orderedIndeces[ii]) && (features[jj].end <= orderedIndeces[ii + 1])) {
////                    span.push(features[jj].name);
//                    overlappingFeatures += features[jj].name + ",";
//                    count = jj;
//                }
//                else if ((features[jj].start <= orderedIndeces[ii]) && (features[jj].end >= orderedIndeces[ii + 1])) {
////                    span.push(features[jj].name);
//                    overlappingFeatures += features[jj].name + ",";
//                    count = jj;
//                }
//            }
//            overlappingFeatures = overlappingFeatures.substring(0, overlappingFeatures.length - 1);
//            if (overlappingFeatures === "") {
//                spanColor = "";
//            } else {
//                spanColor = features[count].color;
//            }
//            spansToHighlight.push({start: startingIndex, end: endingIndex, features: overlappingFeatures, color: spanColor});
////            alert(spansToHighlight[ii].features);
//        }
//    }
//
//    /***************************************************************************************/
//    /* Event Handlers */
//
//    jwerty.key('ctrl+9', false);
//    jwerty.key('ctrl+9', function() {
//        //call get request when two sequences are dragged together for alignment.
//        $.get("SequenceEditorServlet", {"command": "align", "sequence1": $('#seqTextArea').val().toString(), "sequence2": $('#seqTextArea').val().toString()}, function(response) {
//            //TODO: Display alignment text in new window
//            $('#seqTextArea').text(response);
//        });
//    });
//
//    /* 
//     * Updates column width whenever window is resized
//     */
//    $(window).resize(function() {
//        var scrollBar = 0;
//        if ($('#seqTextArea').hasScrollBar()) {
//            scrollBar = scrollBar + 1;
//        }
//        $('#columnLast').text(Math.floor($('#seqTextArea').width() / charWidth - scrollBar));
//
//        //TODO: Implement rows listing upon resizing
//    });


    /*
     * Binds the Reverse Complement function (revComp()) to the revComp button click. 
     */
    $('.revComp').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

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
    $('.translate').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id;
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
    $('.uppercase').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

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
    $('.lowercase').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

        var textArea = $(textAreaID)[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value.toLowerCase();
            $(textAreaID).text(sequence);
        }
        else {
            var lowerOut = sequence.toLowerCase();
            $(textAreaID).replaceSelectedText(lowerOut, "select");
        }
    });
    $('.colorChanger').colorpicker().on('changeColor', function(ev) {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "#bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area

        var color = ev.color.toHex().toString();
        $(bigInterfaceID).css("background-color", color);
    });


    $('.seqTextArea').mouseup(function() {
        var textAreaID = "#" + $(this).attr('id');
        var id = textAreaID.match(/\d/);
        var textArea = $(textAreaID)[0];
        var gcPattern = /[gc]/ig;
        var gcContent = 0;
        var selection = textArea.value.toString().substring(textArea.selectionStart, textArea.selectionEnd);
        var inCodonPosStart = (textArea.selectionStart % 3);
        var inCodonPosEnd = (textArea.selectionEnd % 3);
        var seqLength = $(textAreaID).val().length;
        var posCell = "#positionCell" + id;
        var gcCell = "#gcCell" + id;
        var lenCell = "#lengthCell" + id;

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
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
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


    $('.seqTextArea').keyup(function() {
        var textAreaID = "#" + $(this).attr('id');
        var id = textAreaID.match(/\d/);
        var textArea = $(textAreaID)[0];
        // Grab current sequence length
        var seqLength = $(textAreaID).val().length;
        var rowsTextArea = "#rowsTextArea" + id;
        var columnsLast = "#columnLast" + id;
        var posCell = "#positionCell" + id;
        var gcCell = "#gcCell" + id;
        var lengthCell = "#lengthCell" + id;
        // Update rows display
        if (seqLength === 0) {
            $(rowsTextArea).text("");
        }
        else {
            var hasScrollBar = 0;
            if ($(textAreaID).hasScrollBar()) {
                $(columnsLast).text(Math.floor($(textAreaID).width() / charWidth - 1));
                hasScrollBar = 1;
            }
            var kk = 0;
            var lineNumber = "";
            windows[id - 1].numOfRows = Math.ceil(seqLength / (windows[id - 1].numOfCols - hasScrollBar));
            while (kk < windows[id - 1].numOfRows) {
                if (kk === 0) {
                    lineNumber += "1";
                    $(rowsTextArea).text(lineNumber);
                    kk++;
                }
                else {
                    lineNumber += "\r\n" + ((windows[id - 1].numOfCols - hasScrollBar) * (kk));
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
            var posDisplay = textArea.selectionStart + "(" + inCodonPosStart + ") - " + textArea.selectionEnd + "(" + inCodonPosEnd + ")";
            $(posCell).html(posDisplay);

            while (gcPattern.test(selection)) {
                gcContent++;
            }
            gcContent = Math.round((gcContent / (selection.length)) * 100);
            $(gcCell).html(gcContent);

            var lengthDisplay = seqLength + "(" + selection.length + ")";
            $(lengthCell).html(lengthDisplay);
        }

        windows[id - 1].needToResetORFList = 1;
    });

    /***************************************************************************************/
    /* Hotkey Event Handlers */


    jwerty.key('alt+n', false);
    jwerty.key('alt+n', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: newSequence shortcode called from seqTextArea' + id);
    });

//    var sequence = "";
//    var features = [];
//    var indexCount = 0;
//    var orderedIndeces = [];
//    jwerty.key('alt+o', false);
//    jwerty.key('alt+o', function() {
//        $.get("SequenceEditorServlet", {"command": "genbank"}, function(response) {
//            $.each(response, function(index, d) {
//                if (d.name === "Sequence") {
//                    sequence = d.sequence;
//                    $('.seqTextArea').text(d.sequence);
//                }
//                else {
//                    var startIndex = sequence.indexOf(d.sequence);
//                    var endIndex = startIndex + (d.sequence).length;
//                    features.push({name: d.name, sequence: d.sequence, start: startIndex, end: endIndex, color: d.color});
//                    orderedIndeces.push(startIndex);
//                    orderedIndeces.push(endIndex);
//                    indexCount++;
//                }
//            });
//            orderedIndeces.sort(function(a, b) {
//                return a - b;
//            });
//            // Call function to determine feature overlaps.
//            resolveFeatureOverlap(orderedIndeces, features, indexCount);
//        });
//    });

    jwerty.key('alt+s', false);
    jwerty.key('alt+s', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: saveSequence shortcode selected from seqTextArea' + id);
    });

    jwerty.key('esc', false);
    jwerty.key('esc', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: close shortcode selected from seqTextArea' + id);
    });

    jwerty.key('alt+q', false);
    // When shortcut Alt+q is pressed, call nextForwardORF function
    jwerty.key('alt+q', function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        nextForwardORF(id, textAreaID);
    });

    jwerty.key('alt+w', false);
    // When shortcut Alt+w is pressed, call previousForwardORF function
    jwerty.key('alt+w', function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        previousForwardORF(id, textAreaID);
    });

    jwerty.key('alt+a', false);
    // When shortcut Alt+e is pressed, call nextReverseORF function
    jwerty.key('alt+a', function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        nextReverseORF(id, textAreaID);
    });

    jwerty.key('alt+r', false);
    // When shortcut Alt+r is pressed, call previousReverseORF function
    jwerty.key('alt+r', function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern);     // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id;               // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        previousReverseORF(id, textAreaID);
    });

    jwerty.key('ctrl+/', false);
    jwerty.key('ctrl+/', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: search shortcode selected in seqTextArea' + id);
    });

    jwerty.key('alt+2', false);
    jwerty.key('alt+2', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: features shortcode selected in seqTextArea' + id);
    });

    jwerty.key('alt+3', false);
    jwerty.key('alt+3', function() {
        var id = (document.activeElement.id).match(/\d/);
        alert('ID: selection shortcode selected in seqTextArea' + id);
    });

    jwerty.key('a', function() {
        var id = (document.activeElement.id).match(/\d/);
        windows[id - 1].needToResetORFList = 1;
    });
    jwerty.key('c', function() {
        var id = (document.activeElement.id).match(/\d/);
        windows[id - 1].needToResetORFList = 1;
    });
    jwerty.key('t', function() {
        var id = (document.activeElement.id).match(/\d/);
        windows[id - 1].needToResetORFList = 1;
    });
    jwerty.key('g', function() {
        var id = (document.activeElement.id).match(/\d/);
        windows[id - 1].needToResetORFList = 1;
    });
//    /***************************************************************************************/
//    /* Menu Item Event Handlers */
//
    $('.newSequence').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("New Sequence menu item chosen for " + bigInterfaceID);
    });
//
//    $('.openSequence').click(function() {
//        $.get("SequenceEditorServlet", {"command": "genbank"}, function(response) {
//            var sequence;
//            var features = [];
//            var indexCount = 0;
//            var orderedIndeces = [];
//            $.each(response, function(index, d) {
//                if (d.name === "Sequence") {
//                    sequence = d.sequence;
//                    $('.seqTextArea').text(d.sequence);
//                }
//                else {
//                    var startIndex = sequence.indexOf(d.sequence);
//                    var endIndex = startIndex + (d.sequence).length;
//                    features.push({name: d.name, sequence: d.sequence, start: startIndex, end: endIndex, color: d.color});
//                    orderedIndeces.push(startIndex);
//                    orderedIndeces.push(endIndex);
//                    indexCount++;
//                }
//            });
//            orderedIndeces.sort(function(a, b) {
//                return a - b;
//            });
//            // Call function to determine feature overlaps.
//            resolveFeatureOverlap(orderedIndeces, features, indexCount);
//        });
//    });
//
    $('.saveSequence').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Save Sequence menu item chosen for " + bigInterfaceID);
    });

    $('.close').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Close menu item chosen for " + bigInterfaceID);
    });

    $('.nextForwardORF').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        nextForwardORF(id, textAreaID);
    });

    $('.previousForwardORF').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        previousForwardORF(id, textAreaID);
    });

    $('.nextReverseORF').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        nextReverseORF(id, textAreaID);
    });

    $('.previousReverseORF').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var textAreaID = "#seqTextArea" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area f
        id = id - 1;
        previousReverseORF(id, textAreaID);
    });

    $('.search').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Search menu item chosen for " + bigInterfaceID);
    });
    $('.features').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Features Highlight menu item chosen for " + bigInterfaceID);
    });
    $('.selection').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Selection Highlight menu item chosen for " + bigInterfaceID);
    });
    $('.resize').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Resize menu item chosen for " + bigInterfaceID);
    });
    $('.closeWindow').click(function() {
        var idPattern = /\d/;
        var id = ($(this).attr('id')).match(idPattern); // match the id number associated with the current window
        var bigInterfaceID = "bigInterface" + id; // concatenate the window id number on the end of "seqTextArea" to explicitly change that text area
        alert("Close Window menu item chosen for " + bigInterfaceID);
    });
});

