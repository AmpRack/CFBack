<h2>Codify_Forum</h2>
<hr/>
<p>Node.js, Bower, and Grunt are required. Due to folder-name length issues, the /node_modules/ folder is no longer included in libraries.zip. Please supply your own. Decompress libraries.zip, then add your /node_modules/ and the included /app/ folder. 

First, a quick rundown of each folder.</p>

<p>
 <b>bower_components/</b>     -   Holds all of the angular.js files, bootstrap, jquery, etc<br/>
 <b>node_modules/</b>         -   Grunt server files, VERY useful for testing<br/>
 <b>test/</b>                 -   For running spec tests<br/>
 <b>app/</b>                  -   The website itself. Most of the folders here are self explanatory.<br/>
 <b>app/views/</b>            -   The html template pages, to be injected into index.html<br/>
 <b>scripts/app.js</b>        -   The master controller, connects views to controllers<br/>
 <b>scripts/controllers</b>   -   Controllers inject data to the html, by way of ng-properties<br/>
 <b>scripts/services</b>      -   Services connect to firebase, and transfers data<br/>
 <b>scripts/filters</b>       -   Useful for any last-minute changes, post-processing<br/></p>
 
 
 <h2>Current Status</h2>
 <ul>
 <li>+ Users can use their email address to register a new account</li>
 <li>+ Users can login with their email address and password</li>
 <li>+ Users can post a link with a title to firebase</li>
 <li>+ The navbar can be used to logout, and is ready to link to the user profile.</li>
 <li>+ Posting is rough, but functional. </li>
 <li>+ User profiles are mostly linked, and display user posts. </li>
 <li>- The template for replies/comments is still broken.</li>
 <li>= Functionally, the last big thing to add is a post queue to control how many posts display at a time, and link to the 'load more posts' button.</li>
 <li>= There's also some work to be done on the profile controller and the user database in general, mostly reorganization.</li>
 <li>= The back-end libraries are reorganized, and migrating away from the boilerplate</li>
 </ul>
 
 
 <h2>ng-properties, html tips</h2>
  <p>Angular adds new html inline-property tags (check em out <a href="https://docs.angularjs.org/api/ng/directive">here</a>). A couple more notable ones used in the site right now are ng-show="", ng-include="", ng-click="". 
  
 <b>ng-show="(bool)"</b> toggles an element on or off depending on some expression. For the site, it toggles elements with Auth.signedIn()
 
 <b>ng-include="/something.html"</b> is the actual html injecting function. Usually, you just assign it to an empty div.
 
 <b>ng-click="function()"</b> performs an action when the attached element is clicked. </p>
