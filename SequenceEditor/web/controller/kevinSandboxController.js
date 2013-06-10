/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
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


    /***************************************************************************************/
    /* Event Handlers */

    /*
     * Binds the Reverse Complement function (revComp()) to the revComp button click. 
     */
    $('#revComp').click(function() {
        var textArea = $('#seqTextArea')[0];
        var sequence = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        if (sequence.length === 0) {
            //Nothing highlighted, so change everything.
            sequence = textArea.value;
        }
        var revCompOut = revComp(sequence);
        $('#seqTextArea').text(revCompOut);
    });

    $('#translate').click(function() {
        var sequence = $('#seqTextArea').text();
        var transOut = translate(sequence);
        $('#seqTextArea').text(transOut);
    });

    $('#uppercase').click(function() {
        var sequence = $('#seqTextArea').text().toUpperCase();
        $('#seqTextArea').text(sequence);
    });

    $('#lowercase').click(function() {
        var sequence = $('#seqTextArea').text().toLowerCase();
        $('#seqTextArea').text(sequence);
    });

    $('#colorChanger').colorpicker().on('changeColor', function(ev) {
        var color = ev.color.toHex().toString();
        $('#bigInterface').css("background-color", color);
    });

    document.onmouseup = function() {
//        textArea = $('#seqTextArea')[0];
//        seqText = textArea.value;
//        highlightedText = seqText.substring(textArea.selectionStart, textArea.selectionEnd);
//        if (textArea.selectionStart === textArea.selectionEnd) {
//            // Do nothing if nothing is highlighted
//            highlightedText = "";
//        }
//        else {
//            //$('#seqTextArea').text("start: "+textArea.selectionStart+" end: "+textArea.selectionEnd+" total:"+textArea.value.length+" columns: "+textArea.cols);
//            highlightedText = seqText.substring(textArea.selectionStart, textArea.selectionEnd);
//            alert(highlightedText + " .... " + seqText);
//        }
    };
//

});

