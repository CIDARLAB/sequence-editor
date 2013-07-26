Sequence Editor
===============
Purpose
---------------
Sequence Editor is a lightweight jQuery plugin that allows developers to quicky generate a viewer for DNA sequences. Sequence Editor was built as a proof-of-concept Clotho 3 application, and it provides several convenience methods for accessing data via the Clotho 3 api.

Key features of Sequence Editor include the following:
* Common calculations:
  * Melting Temperature
  * Reverse Complement
  * GC Content
* Feature highlighting with features pulled directly from Clotho3
* Sequence Alignment
* Drag and drop widgets
* Save and pull parts from Clotho 3

Usage
---------------
This section should describe how to use code.

Sequence Editor allows users to create many Sequence Editor widgets at once.

<code>
var sequenceEditorSession = SequenceEditor.newSession(); //starts a new session and connect to the default Clotho3 server
sequenceEditorSession.createNewWidget(); //create a new empty widget
</code>

All of Sequence Editor's functions can be accessed through its user interface. These functions can also be triggered programmatically. 

*Save a sequence*
<code>
var window = sequenceEditorSession.getWindow(0); //grab the first window
window.save();
</code>

*Reverse complement a sequence*
<code>
var window = sequenceEditorSession.getWindow(0); //grab the first window
window.revComp();
</code>

Development Guide
---------------
Describe the procedure we used to make sequence editor. 
* How do other people make clotho 3 apps like this?
* What is a clotho 3 app? Describe our philosophy

Installation Requirements
---------------
* jQuery 1.9+
* Twitter Bootstrap (css/javascript)
* Servlet Container (for sequence alignment functions)

Contact
---------------
Sequence Editor is created by:
* [Kevin Leshane][link to your homepage]
* [Jenhan Tao][Link to my nonexistant homepage]

API
---------------
Find a javadoc. Describe the following functions in that manner. 
* method name
* what method does
* inputs and what they are
* outputs