# Codify_Forum
This is the entire project, with all libraries in place. First, a quick rundown of each folder;

 bower_components/     -   Holds all of the angular.js files, bootstrap, jquery, etc
 node_modules/         -   Grunt server files, VERY useful for testing
 test/                 -   For running spec tests
 app/                  -   The website itself. Most of the folders here are nothing new.
 app/views/            -   The html template pages, to be injected into index.html
 scripts/app.js        -   The master controller, connects views to controllers
 scripts/controllers   -   Controllers inject data to the html, by way of ng-properties
 scripts/services      -   Services connect to firebase, and transfers data
 scripts/filters       -   Useful for any last-minute changes, post-processing
 
 
 # Current Status
 + Users can use their email address to register a new account
 + Users can login with their email address and password
 + Users can post a link with a title to firebase
 - The scripts for commenting and posting are messed up; Data is being saved to firebase, but not showing up on screen...
 > Next up will be post-labels for sorting
 
 
 # ng-properties, html tips
  Angular adds new html inline-property tags (check em out <a href="https://docs.angularjs.org/api/ng/directive">here</a>). A couple more notable ones used in the site right now are ng-show="", ng-include="", ng-click="". 
  
 ng-show="(bool)" toggles an element on or off depending on some expression. For the site, it toggles elements with Auth.signedIn()
 
 ng-include="/something.html" is the actual html injecting function. Usually, you just assign it to an empty div.
 
 ng-click="" performs an action when the attached element is clicked. 
