#Roles Based Authentication

A small web app to manage a parking yard plus other services such as a battery rental  shop and a Tyre clinic.

Cuurently Im working on the crud section but as of now.You can use the auth section.

Make sure to have an instance of Mongodb running on your computer.

How to run the website locally
Clone repository.
Install dependecies, command: $: npm install
Run website, command: $: npm run dev
Open provided link by the server in your browser: e.g http://localhost:5000/


Open the registration page and register a super user.Ive currently set the admin(super-user)'s email to 'superuser@parkville.com'.You can change it to anything you prefer under the .env file.

register other users too and test out the functionality.
Super admin can view all pages whislt other users are restricted to specific pages.

super admin can manage user roles, An admin cannot remove themselves as admin but require the help of another admin account to change their role.

More to come in the future!

Routes are protected!Enjoy!!


Technologies used
Bootstrap:Front End FrameWork
JavaScript
NodejsJS:
EJS

