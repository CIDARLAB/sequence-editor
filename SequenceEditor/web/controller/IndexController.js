/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() { //don't run javascript until page is loaded
    //**********************************************/
    var i = 0;
    $('#button').click(function(){
        //$("#bPAR").append("<button id="+ i++ +" style='font-weight:bold' class='btn btn-success'>"+ i +"</button>");
        $("#bPAR").append("<table id="+ i++ +" class='myBOX' style='background-color:lightgrey; height: 320px; width: 400px; border: 3px solid black; display: inline-table'>\n\
            <tr>\n\
                <td>\n\
                    <button id="+ i +" class='btn btn-danger' style='font-weight:bold; position: relative; left: 90.7%'>X</button>\n\
                </td>\n\
            </tr>\n\
            <tr>\n\
                <td id="+ i +" style='text-align: center'>\n\
                    <textarea rows='8' cols='100' style='width: 320px; height: 200px; vertical-align: 50px'></textarea>\n\
                </td>\n\
            </tr>\n\
        </table>");
    });
    
    $('#reset').click(function(){
        $("button").remove(".myBOX");
        i=0;
    });
//**************************************************/

});

