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
     * @param {type} isDna
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
        };
        return reverseComp;
    };
    
    function translate() {
        
    }
    
    /***************************************************************************************/
    /* Event Handlers */
    
    /*
     * Binds the Reverse Complement function (revComp()) to the revComp button click. 
     */
    $('#revComp').click(function(){
        var sequence = $('#seqTextArea').text();
        var revCompOut = revComp(sequence); 
       $('#seqTextArea').text(revCompOut);
    });
});

