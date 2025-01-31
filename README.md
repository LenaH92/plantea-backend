# plantea
<br>

## Description
A blog and information gathering website about growing plants, how to cure diseases and contribute and learn as you wish. 
All the information regarding the plant and diseases information content belongs to [perenual](https://perenual.com/) 
<br>

## User stories
- **404** - Sorry, either doesn't exist or not implemented yet!
- **login-signup** - Without these, you can still search for plants, see all the blog posts of other usrs, see random plant suggestions of the day and some tips and info about diseases, but it is necessary to write and comment
- **logout** - easy with one click
- **homepage** - Overview of what we provide. Search plants, take a look at blog posts, see our very easy to follow rules, learn about the dev team, your profile info etc. Everything easy to access with once click from here
- **plant-search-results** - From our homepage, you can easily search for a plant that you have in mind and learn its scientific name, watering and sunlight requirements for a healthy growth
- **all blogs** - Even without signing up or logging in, you can see all the contributors and fellow user comments 
- **user-profile** - As a user you can add your profile details, see all your contributions as a commentor or author
- **create a blog entry** - As a user the most fun part is to be able to share as much as you want, upload any photos in case you cannot find a match on our database, or have the option to search the matching plant information you need
- **make a comment** - well, you learn from each other, share and appreciate, just with a sign up
- **random plants** - how about some tips and tricks to cure your plant or discover new ones with each click?
- **about** - learn more about the dev team if you like

## API routes (back-end)
- GET /auth
  - auth success 

- GET /auth/signup
  - if username or email is already there will pop-up fail message
- POST /auth/signup
  - body:
    - username
    - email
    - password
    - first name
    - 
- POST /auth/login
  - redirects to /profile if user logged in

- POST /auth/logout
  - body: (empty)

- GET /blogs
  - renders all blog entries
- GET/DELETE/PUT /blogs/:blogid
  -  see the details of the post with comments with an option to edit or delete if you are the contributor
- POST /blogs/new
  - add a blog entry with a selected plant detail from the db provided or with your own photos, as long as you are logged in
- PUT/DELETE/POST /comments/:commentid
  - add, delete, edit a comment to a blog post
- GET /plants/random
  - renders 20 random plants from the db with each refresh
  - redirects to /game-search-results if user presses button
- GET /plants/search
  - find the plant that you search for in the db, if exists
- GET /plants/:plantId
 - see the watering, sunlight, scientific and common name of the plant you selected from the db
  
- PUT/GET /profile
  - renders user-profile or edit user profile details with your credentials, photo and bio
<br>

### Git
Repos
- [Frontend](https://github.com/MariiaTararaeva/plantea-frontend)
- [Backend](https://github.com/LenaH92/plantea-backend)

## Deployment
- [Deployment](https://plantea.netlify.app/)

<br>

### Slides
- [Prezi](https://prezi.com/view/zsIWZbeqtELWzqhrytd8/)
