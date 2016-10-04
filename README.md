# My CODE2040 Technical Assessment
Visit the live version of the repo here: https://mandemeskel.github.io/code2040App/  <br/>
<br/>
You can't make the API calls necessary to see the site working because the site is hosted securely, HTTPS, while the API is using HTTP. This discrepancy makes modern browsers panic; browsers deny all requests to insecure, HTTP, resources while in a secure, HTTPS, environment, regardless of CORS, cross-origin resource sharing. However, you can still enjoy the magic of CSS3, just can't make any API calls.

The assessment was centered around making a call to an API to get a problem and sending the solution back to the API for validation.



# Stack: <br/>
HTML5 <br/>
CSS3 - media queries and transitions <br/>
JS/ES6 - sort of, I did use 'let' and promises XD <br/>
AngularJS - filter, factory, AJAX, services, and one very lonely controller <br/> 

This was fun; I enjoyed using AngularJS. Some would say this was over engineered - I'm one of those people that would say that - but this was fun - did I say that already? - and relaxing. In retrospect, I'm glad I went this route; I learned far more doing this then simply booting up an HTTP server with Python or using curl. Finally learned the difference between factories and services - services are initialized, you can use "this" in them while factories aren't, why the difference? No idea but it does seem rather misleading. However, all services eventually call a factory: http://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html

All this time I have been using services like factories... XD 
