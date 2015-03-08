<h2>Codify_Forum</h2>
<hr/>
This is the entire project, with all libraries in place. First, a quick rundown of each folder;

 <b>bower_components/</b>     -   Holds all of the angular.js files, bootstrap, jquery, etc<br/>
 <b>node_modules/</b>         -   Grunt server files, VERY useful for testing<br/>
 <b>test/</b>                 -   For running spec tests<br/>
 <b>app/</b>                  -   The website itself. Most of the folders here are nothing new.<br/>
 <b>app/views/</b>            -   The html template pages, to be injected into index.html<br/>
 <b>scripts/app.js</b>        -   The master controller, connects views to controllers<br/>
 <b>scripts/controllers</b>   -   Controllers inject data to the html, by way of ng-properties<br/>
 <b>scripts/services</b>      -   Services connect to firebase, and transfers data<br/>
 <b>scripts/filters</b>       -   Useful for any last-minute changes, post-processing<br/>
 
 
 <h2>Current Status</h2>
 <ul>
 <li>+ Users can use their email address to register a new account</li>
 <li>+ Users can login with their email address and password</li>
 <li>+ Users can post a link with a title to firebase</li>
 <li>- The scripts for commenting and posting are messed up; Data is being saved to firebase, but not showing up on screen...</li>
 <li>= Next up will be post-labels for sorting</li>
 </ul>
 
 
 <h2>ng-properties, html tips</h2>
  <p>Angular adds new html inline-property tags (check em out <a href="https://docs.angularjs.org/api/ng/directive">here</a>). A couple more notable ones used in the site right now are ng-show="", ng-include="", ng-click="". </p>
  
 <b>ng-show="(bool)"</b> toggles an element on or off depending on some expression. For the site, it toggles elements with Auth.signedIn()
 
 <b>ng-include="/something.html"</b> is the actual html injecting function. Usually, you just assign it to an empty div.
 
 <b>ng-click="function()"</b> performs an action when the attached element is clicked. 
