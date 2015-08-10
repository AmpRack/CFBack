<h2>Conclave - An open-source social network</h2>
<hr/>
<p>Conclave is a lightweight social network platform. Originally built for <a href="http://www.codifyacademy.com/">Codify Academy</a> as a way for students, mentors, and alumni to have a central place to collaborate and assist each other, it's available now open-source. You can clone the repo and use as-is, or use it as a starting point for something bigger. For use out of the box, you will need your own Firebase account (see below) and an imgur api-key (for avatar uploading, optional). <a href="https://burning-heat-6468.firebaseapp.com/">Click here</a> for live example.</p>

<h3>Now contains such features as:</h3>
<ul>
	<li><b>Account Management</b><br />
		<p>Users can register an account with an email address, authenticated through Firebase.</p>
	</li>
	<li><b>User Profiles</b><br />
		<p>Track user info, and let users edit their own info.</p>
	</li>
	<li><b>Post questions, get replies</b><br />
		<p>Users can post info, reply to posts, and receive new-reply alerts.</p>
	</li>
	<li><b>Search and filter queries</b>
		<p>Search post content, or filter all posts by set criteria.</p>
	</li>
	<li><b>Mobile ready</b><br />
		<p>Responsive design makes this app display properly at any resolution.</p>
	</li>
	<li><b>Modular design</b><br />
		<p>Designed to be flexible and customizable; easily change or add your own features.</p>
	</li>
</ul><br />

<p>Conclave runs on AngularJS, and uses Firebase for data storage and login authentication. To use Conclave, you will need your own (free) <a href="https://www.firebase.com/">Firebase account</a>. Add your Firebase url to <i>scripts/app.js line:22</i>. Don't forget to set your own Firebase rules.</p>

<p>Conclave also uses <a href="https://github.com/Wildhoney/ngImgur">ng-Imgur</a> to upload user avatars to Imgur.com for hosting. To use this feature, add your Imgur api-key to <i>bower_components/ng-imgur/dist/ng-imgur.js line:30</i>.</p>

<p>This project is far from complete, but is ready for for public testing and usage. Everyone is encouraged to fork this repo, request new features, or report bugs.</p>
