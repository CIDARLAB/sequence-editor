$(document).ready(function() { //don't run javascript until page is loaded
    //**********************************************/
    var sequences = {"AcuIRM": "GATCTgttgacggctaGCTCAGTCCTAGGTACAGTGCTAGCTCTCTGGAGATTAACGAGGAGAAATACTAGATGGTTCATGATCATAAgcttgaattagccaaacttattcgcaactatgagacgaatagaaaagaatgtctaaattccagatataatgaaacacttttacgaagtgattatcttgatccattttttgaacttcttggctgggatattaaaaataaagctggaaaaccgactaatgaaagagaggttgtcttggaagaggcacttaaagcaagtgcatctgaacattctaaaaaaccagattatacattcagacttttttctgaaagaaagtttttcttggaagctaaaaaaccatcagttcatattgaatcggataatgaaactgctaaacaagtgcgaagatatggctttaccgccaaactaaaaatttcagttttatcaaattttgaatatttagttatttatgatacctctgtaaaggttgatggtgatgatacctttaataaggcacgtataaaaaaataccattacacagagtatgaaactcactttgatgaaatttgtgacttattaggaagagagtccgtttactctgggaattttgataaagaatggttgagtatcgaaaataaaattaatcacttttctgtagataccttatttttaaaacagattaatacatggcgtctattgcttggtgaagaaatctataagtatcaacctacgatacaagagaatgagcttaatgacattgtacagagctatctgaatagaattatttttttgagagtctgtgaagatagaaatttagagacttatcagacattactgaattttgcttcaagtaatgatttctccgctcttattgataagtttaagcaggcagatcgttgctataattcaggcctatttgatcaattgcttacagagcaaattattgaggatattagttctgtattttgggtaatcattaagcaattatattatccagaaagtccttattcatttagtgtgttctcttcggatattttaggtaatatttacgaaatatttttatctgagaaattagtaattaatcaaagcagagttgagttagtcaagaaaccagagaatttagatagagacattgtcacaacaccaacctttattattaatgacatcttgagaaatacggttctaccgaagtgctatggaaaaacagatatagaaattctacagctaaaatttgctgatattgcttgtggttcgggagcatttttactggagttgttccaattacttaatgatactctagttgactattatttaagtagtgatacttctcaattaattccaacaggtatcggtacttataagctgtcttatgaaatcaagagaaaggttctattaagttgtatttttggcatagataaggacttaaatgctgtagaggctgcaaagttcggattgttgctaaaattattagagggtgaagacgtacaatctatagctaatattagaccagttctcccagatttattagataacatactttttggtaacagtttattagaaccagaaaaagtcgagcttgatcatcaggtagaagtaaatccgttagatttttcGGATCTGaaAtttgatgtaattgttggcaaccctccatatatgaaatcagaggatatgaagaatattactcctttggagttacctttatataagaaaaactatgtttctgcttataagcaatttgataaatatttcttgttcttagagcggggtttagctctattaaaagaagagggaatacttggatatattgttccaagtaaatttactaaagtgggtgcagggaaaaagttacgggaattactaacagataagggttatcttgactctattgtttcttttggtgctaatcaaatatttcaggataaaacaacttatacttgtttacttattttaagaaaaactccAcatactgattttaaatatgcagaggttcgtaatttaattgactggaaagtgcgtaaagctgatgctatggaattttcctctcaacaactgagtacattgcaaagtgatgcgtggattttaattccatctgaattaatctcagtttatcatcagatattagcacaaagccaaaagctagaggatattgtcggtattgataatatatttaatgggattcaaaccagtgctaatgatgtctatatttttgtgccaactcatgaggatactgaaaactattattttataaagaaaggacaagagtacaaaattgaaaaggaaattacgaagccttattttaaaacaacgagtggtgaggataacttatatacttaccgtactttcaagcctaatgcccgagtcatttatccgtatactcaaactgagagtagtgtagaactaattcctttagatgaaatacgagaaatttttcctttagcatacaaatatttaatgtcgcttaagttcgttttaagtagccccaaacgagatataaaacctagacctaaaacaacaaatgaatggcataggtatggacggcatcaaagtctcgataattgtgggttgagtcagaaaattattgtaggtgtgctttcagttggtgataagtacgctatagatacttatggaacgttgatttcatcaggcggtacggctggatactgtgtggttgctcttccagatgattgtaaatattcaatttattatttacaggcaattttaaactcaaaatatttagagtggtttagtgccttacatggagaagttttccgaggtggttatattgctaggggaactaaggtgcttaagaacttgcctattaggaaaattgattttgataatcttgaagaagcaaatctacatgatctaattgcgaccaagcaaaaagagcttatagagatttatgacaaaatagatgttaatgtaaataataaaagagttctgaccccattgcaacgtatgtttaaacgagagaaagaggttttagaccaattgttgagtcgactgtataacttaggtgtagatgattccttgatcccttatattaaggatttgtatgaagctcattaaG",
        "start": "atg",
        "stop": "TAA",
        "p15 plasmid":"GATCTgttgacggctaGCTCAGTCCTAGGTACAGTGCTAGCTCTCTGGAGATTAACGAGGAGAAATACTAGATGGTTCATGATCATAAgcttgaattagccaaacttattcgcaactatgagacgaatagaaaagaatgtctaaattccagatataatgaaacacttttacgaagtgattatcttgatccattttttgaacttcttggctgggatattaaaaataaagctggaaaaccgactaatgaaagagaggttgtcttggaagaggcacttaaagcaagtgcatctgaacattctaaaaaaccagattatacattcagacttttttctgaaagaaagtttttcttggaagctaaaaaaccatcagttcatattgaatcggataatgaaactgctaaacaagtgcgaagatatggctttaccgccaaactaaaaatttcagttttatcaaattttgaatatttagttatttatgatacctctgtaaaggttgatggtgatgatacctttaataaggcacgtataaaaaaataccattacacagagtatgaaactcactttgatgaaatttgtgacttattaggaagagagtccgtttactctgggaattttgataaagaatggttgagtatcgaaaataaaattaatcacttttctgtagataccttatttttaaaacagattaatacatggcgtctattgcttggtgaagaaatctataagtatcaacctacgatacaagagaatgagcttaatgacattgtacagagctatctgaatagaattatttttttgagagtctgtgaagatagaaatttagagacttatcagacattactgaattttgcttcaagtaatgatttctccgctcttattgataagtttaagcaggcagatcgttgctataattcaggcctatttgatcaattgcttacagagcaaattattgaggatattagttctgtattttgggtaatcattaagcaattatattatccagaaagtccttattcatttagtgtgttctcttcggatattttaggtaatatttacgaaatatttttatctgagaaattagtaattaatcaaagcagagttgagttagtcaagaaaccagagaatttagatagagacattgtcacaacaccaacctttattattaatgacatcttgagaaatacggttctaccgaagtgctatggaaaaacagatatagaaattctacagctaaaatttgctgatattgcttgtggttcgggagcatttttactggagttgttccaattacttaatgatactctagttgactattatttaagtagtgatacttctcaattaattccaacaggtatcggtacttataagctgtcttatgaaatcaagagaaaggttctattaagttgtatttttggcatagataaggacttaaatgctgtagaggctgcaaagttcggattgttgctaaaattattagagggtgaagacgtacaatctatagctaatattagaccagttctcccagatttattagataacatactttttggtaacagtttattagaaccagaaaaagtcgagcttgatcatcaggtagaagtaaatccgttagatttttcGGATCTGaaAtttgatgtaattgttggcaaccctccatatatgaaatcagaggatatgaagaatattactcctttggagttacctttatataagaaaaactatgtttctgcttataagcaatttgataaatatttcttgttcttagagcggggtttagctctattaaaagaagagggaatacttggatatattgttccaagtaaatttactaaagtgggtgcagggaaaaagttacgggaattactaacagataagggttatcttgactctattgtttcttttggtgctaatcaaatatttcaggataaaacaacttatacttgtttacttattttaagaaaaactccAcatactgattttaaatatgcagaggttcgtaatttaattgactggaaagtgcgtaaagctgatgctatggaattttcctctcaacaactgagtacattgcaaagtgatgcgtggattttaattccatctgaattaatctcagtttatcatcagatattagcacaaagccaaaagctagaggatattgtcggtattgataatatatttaatgggattcaaaccagtgctaatgatgtctatatttttgtgccaactcatgaggatactgaaaactattattttataaagaaaggacaagagtacaaaattgaaaaggaaattacgaagccttattttaaaacaacgagtggtgaggataacttatatacttaccgtactttcaagcctaatgcccgagtcatttatccgtatactcaaactgagagtagtgtagaactaattcctttagatgaaatacgagaaatttttcctttagcatacaaatatttaatgtcgcttaagttcgttttaagtagccccaaacgagatataaaacctagacctaaaacaacaaatgaatggcataggtatggacggcatcaaagtctcgataattgtgggttgagtcagaaaattattgtaggtgtgctttcagttggtgataagtacgctatagatacttatggaacgttgatttcatcaggcggtacggctggatactgtgtggttgctcttccagatgattgtaaatattcaatttattatttacaggcaattttaaactcaaaatatttagagtggtttagtgccttacatggagaagttttccgaggtggttatattgctaggggaactaaggtgcttaagaacttgcctattaggaaaattgattttgataatcttgaagaagcaaatctacatgatctaattgcgaccaagcaaaaagagcttatagagatttatgacaaaatagatgttaatgtaaataataaaagagttctgaccccattgcaacgtatgtttaaacgagagaaagaggttttagaccaattgttgagtcgactgtataacttaggtgtagatgattccttgatcccttatattaaggatttgtatgaagctcattaaGGATCCtaaCTCGAcgtgcaggcttcctcgctcactgactcgctgcgctcggtcgttcggctgcggcgagcggtatcagctcactcaaaggcggtaatCAATTCGACCCAGCTTTCTTGTACAAAGTTGGCATTATAAAAAATAATTGCTCATCAATTTGTTGCAACGAACAGGTCACTATCAGTCAAAATAAAATCATTATTTGCCATCCAGCTGATATCCCCTATAGTGAGTCGTATTACATGGTCATAGCTGTTTCCTGGCAGCTCTGGCCCGTGTCTCAAAATCTCTGATGTTACATTGCACAAGATAAAAATATATCATCATGCCTCCTCTAGACCAGCCAGGACAGAAATGCCTCGACTTCGCTGCTGCCCAAGGTTGCCGGGTGACGCACACCGTGGAAACGGATGAAGGCACGAACCCAGTGGACATAAGCCTGTTCGGTTCGTAAGCTGTAATGCAAGTAGCGTATGCGCTCACGCAACTGGTCCAGAACCTTGACCGAACGCAGCGGTGGTAACGGCGCAGTGGCGGTTTTCATGGCTTGTTATGACTGTTTTTTTGGGGTACAGTCTATGCCTCGGGCATCCAAGCAGCAAGCGCGTTACGCCGTGGGTCGATGTTTGATGTTATGGAGCAGCAACGATGTTACGCAGCAGGGCAGTCGCCCTAAAACAAAGTTAAACATCATGAGGGAAGCGGTGATCGCCGAAGTATCGACTCAACTATCAGAGGTAGTTGGCGTCATCGAGCGCCATCTCGAACCGACGTTGCTGGCCGTACATTTGTACGGCTCCGCAGTGGATGGCGGCCTGAAGCCACACAGTGATATTGATTTGCTGGTTACGGTGACCGTAAGGCTTGATGAAACAACGCGGCGAGCTTTGATCAACGACCTTTTGGAAACTTCGGCTTCCCCTGGAGAGAGCGAGATTCTCCGCGCTGTAGAAGTCACCATTGTTGTGCACGACGACATCATTCCGTGGCGTTATCCAGCTAAGCGCGAACTGCAATTTGGAGAATGGCAGCGCAATGACATTCTTGCAGGTATCTTCGAGCCAGCCACGATCGACATTGATCTGGCTATCTTGCTGACAAAAGCAAGAGAACATAGCGTTGCCTTGGTAGGTCCAGCGGCGGAGGAACTCTTTGATCCGGTTCCTGAACAGGATCTATTTGAGGCGCTAAATGAAACCTTAACGCTATGGAACTCGCCGCCCGACTGGGCTGGCGATGAGCGAAATGTAGTGCTTACGTTGTCCCGCATTTGGTACAGCGCAGTAACCGGCAAAATCGCGCCGAAGGATGTCGCTGCCGACTGGGCAATGGAGCGCCTGCCGGCCCAGTATCAGCCCGTCATACTTGAAGCTAGACAGGCTTATCTTGGACAAGAAGAAGATCGCTTGGCCTCGCGCGCAGATCAGTTGGAAGAATTTGTCCACTACGTGAAAGGCGAGATCACCAAGGTAGTCGGCAAATAACCCTCGAGCCACCcatgaccaaaatcccttaacgGCATGCgcaccgccggacatcagcgctagcggagtgtatactggcttactatgttggcactgatgagggtgtcagtgaagtgcttcatgtggcaggagaaaaaaggctgcaccggtgcgtcagcagaatatgtgatacaggatatattccgcttcctcgctcactgactcgctacgctcggtcgttcgactgcggcgagcggaaatggcttacgaacggggcggagatttcctggaagatgccaggaagatacttaacagggaagtgagagggccgcggcaaagccgtttttccataggctccgcccccctgacaagcatcacgaaatctgacgctcaaatcagtggtggcgaaacccgacaggactataaagataccaggcgtttccccctggcggctccctcgtgcgctctcctgttcctgcctttcggtttaccggtgtcattccgctgttatggccgcgtttgtctcattccacgcctgacactcagttccgggtaggcagttcgctccaagctggactgtatgcacgaaccccccgttcagtccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggaaagacatgcaaaagcaccactggcagcagccactggtaattgatttagaggagttagtcttgaagtcatgcgccggttaaggctaaactgaaaggacaagttttggtgactgcgctcctccaagccagttacctcggttcaaagagttggtagctcagagaaccttcgaaaaaccgccctgcaaggcggttttttcgttttcagagcaagagattacgcgcagaccaaaacgatctcaagaagatcatcttattaatcagataaaatatttctagAGGCCTcccctgattctgtggataaccGTcctaggTGTAAAACGACGGCCAGTCTTAAGCTCGGGCCCCAAATAATGATTTTATTTTGACTGATAGTGACCTGTTCGTTGCAACAAATTGATGAGCAATGCTTTTTTATAATGCCAACTTTGTACAAAAAAGCAGGCTCCGAATTGgtatcacgaggcagaatttcagataaaaaaaatccttagctttcgctaaggatgatttctggaattcatgA",
        "p15ori":"tagcggagtgtatactggcttactatgttggcactgatgagggtgtcagtgaagtgcttcatgtggcaggagaaaaaaggctgcaccggtgcgtcagcagaatatgtgatacaggatatattccgcttcctcgctcactgactcgctacgctcggtcgttcgactgcggcgagcggaaatggcttacgaacggggcggagatttcctggaagatgccaggaagatacttaacagggaagtgagagggccgcggcaaagccgtttttccataggctccgcccccctgacaagcatcacgaaatctgacgctcaaatcagtggtggcgaaacccgacaggactataaagataccaggcgtttccccctggcggctccctcgtgcgctctcctgttcctgcctttcggtttaccggtgtcattccgctgttatggccgcgtttgtctcattccacgcctgacactcagttccgggtaggcagttcgctccaagctggactgtatgcacgaaccccccgttcagtccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggaaagacatgcaaaagcaccactggcagcagccactggtaattgatttagaggagttagtcttgaagtcatgcgccggttaaggctaaactgaaaggacaagttttggtgactgcgctcctccaagccagttacctcggttcaaagagttggtagctcagagaaccttcgaaaaaccgccctgcaaggcggttttttcgttttcagagcaagagattacgcgcagaccaaaacgatctcaagaagatcatcttattaatcagataaaatatt"
    };



    var i = 0;
    $('#button').click(function() {
        //$("#bPAR").append("<button id="+ i++ +" style='font-weight:bold' class='btn btn-success'>"+ i +"</button>");
        
        //try to avoid using new line characters '\n'; use a '+' to concatenate strings when they are too long
        
        //all ids should be unique;if a value will be shared amongst several elements; store it in the val attribute or in a class
        //you can also use a jQuery data store
        
        //if you find yourself doing a lot of styling; put the styling into a css file; reference the css file in the header section of your html page
        
        //I noticed you do a lot of positioning and sizing for styling; don't worry about this. We can use the bootstrap grid system for this
        //http://twitter.github.io/bootstrap/scaffolding.html

        $("#bPAR").append("<table id='table" + i + "' class='textBOX' style='background-color:lightgrey; height: 320px; width: 400px; border: 3px solid black; display: inline-table'>\n\
            <tr>\n\
                <td>\n\
                    <button id='close" + i + "' class='btn btn-danger' style='font-weight:bold; position: relative; left: 90.7%'>X</button>\n\
                </td>\n\
            </tr>\n\
            <tr>\n\
                <td id='textArea" + i + "' style='text-align: center'>\n\
                    <textarea rows='8' cols='100' style='width: 320px; height: 200px; vertical-align: 50px'></textarea>\n\
                </td>\n\
            </tr>\n\
        </table>"); //if your button, table and cells all have the same id; how can you identify them individually?
        i++;
        
        //document.getElementById('textArea1').value = 'test';
        //alert(sequences);
        //mytextbox.value += sequences.start;
      
        
        //don't bind functions to buttons until the html has been written; you can now bind a function to your buttons
        $('button').click(function(){
            //I'll leave it up to you to figure out what the proper IDs are
            var id = $(this).attr("id"); //why do I do this instead of the following?
            id = 'table'+(id.charAt(id.length-1));
            //id = '#'+id;
            //alert(id);
            
            $("#"+id).remove();
        });
    });
    
    var classname = 'textBOX';
    $('#reset').click(function() {
        $("."+classname).remove();
        i = 0;
    });
//**************************************************/

});

