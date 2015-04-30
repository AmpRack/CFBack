<h2>Codify_Forum</h2>
<hr/> 
<p>Node.js, Bower, and Grunt are required. To use, decompress libraries.rar, and add the included /app/ folder. If you registered an account before April 8th, make sure you re-register your account. 

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
 
 
 <h2>To-Do List</h2>
 <p>See change.log for recent changes! (Last updated 4-29-15)</p>
 <ul>
 <li><b>Login</b> - Need to style error messages (#error p) </li>
 <li><b>Nav</b> - New comment notifier needs to work. </li>
 <li><b>Nav</b> - While the function is built, the search needs to be hooked up.</li>
 <li><b>Main</b> - Reply count needs to be fixed, incorporated properly.</li>
 <li><b>Main</b> - Post Queue needs to be built, to control how many posts per page.</li>
 <li><b>Profile</b> - 'Change password' function needs error handling.
 <li><del><b>Profile</b> - Maybe take 'Upload avatar' 'edit profile' and 'change password' and consolidate that to a single menu?</del>(updated 4/29: <em>moved to edit profile module</em>)</li>
 </ul>
 
