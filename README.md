<ul>
  <li>First I created a S3 bucket</li>
  <li>After that I created two lambda functions for Get and Post with IAM permissions to for the S3 buckets for getting, listing anf putting new objects</li>
  <li>In Get Function: Created a functions which reads all json files and store ther objects in single list and return it</li>
  <li>In Post Function: Created a functions which reads user provided data such as input as objects and create an file using math random finction and store that data in created file on S3</li>
  <li>Created API Getway for Get and Post methods endpoint</li>
</ul>
