/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() { //don't run javascript until page is loaded
    //**********************************************/
    var i = 0;
    $('#button').click(function(){
        $("#bPAR").append("<button id="+ i++ +" style='font-weight:bold' class='btn btn-success'>"+ i +"</button>");
    });
    
    $('#reset').click(function(){
        $("button").remove(".btn-success");
        i=0;
    });
//**************************************************/
});

