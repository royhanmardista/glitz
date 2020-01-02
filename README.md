# glitz
glintz like web, that helps searching for jobs. The server and client is deployed in gcp http://glintzzz.royhan-mardista.online/home

## Description

Glintzzz is job portal website I perposely disign to work similar with glints, hence the name, but of course not all the features are implemented here hehe. This website use identical technology with let's todo but I use additional libraries like GCS-upload and express-validator, also I implemented better navigation guard and data fetching than let's Todo.

## API documentation

https://documenter.getpostman.com/view/9288133/SW14UGTA?version=latest

## Fitures

- at the front page all non-authenticated users are allowed to search jobs from third parties which are themuse and github
- to get access token user can register manually posting username, email, and password or use google oauth to get access token
- authenticated users can search internal jobs and company in glintzzz. The search key words include name, location, skilla and experience
- all users can also view job details that includes name, location company name, description, required skills and required experience
- if you are the owner of the company you can also view the applicants data in every job you have posted
- all users can also view company details that includes name, location, description, and all job posted in the company
- authenticated users can bookmarks the job they are interested in and view them in favorites page. The server will also check before adding job to favorites to prevent diplicate jobs
- authenticated users are allowed to create one company with unique name and url landing page
- after creating company user can post any jobs in the company with unique name within the company
- authenticated users can only apply to all jobs except his own, but only after completing his profile first. this profile includes fullname, phone, location, university, experience, skills  and description. I use third party apis to get location and university
- when user apply to any company the employer will now allowed to view the users detail profile.
- after applying application will be save in applied jobs page, in this page you can check the company name, number of applicants in your applied job and your application status.
- user can also cancel his application in this page
- when first apply your application will have status of 'waiting evaluation'
- the employer can view the applicant data in job details page, he can view the each applicants detail profile then change the application status to 'not suitable' or 'accepted'


## Framework and Libraries

### FrontEnd(vue.js, vuex)

- moment
- bootsrap-vue
- alertify
- axios
- quill editor
- google oauth
- vue router

### BackEnd(node.js)

- express
- express validator
- gcs-updload
- google-auth-library
- mongoose
- axios
- moment
- cors
- bcryptjs
- jsonwebtoken
- mongoose-unique-validator
- morgan

### Database

- mongoDB

### TTD

- Mocha js
- Chai
