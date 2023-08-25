

# shikanji

shikanji is a static site generator which uses markdown files for content. 

It uses showdownjs to parse the markdown posts into html. shikanji is fast, lightweight and works well with smaller screen sizes.

To build on your local system, run npm start

The posts are divided by sections kept in sub-directories within the`_posts` directory.The`_pages` directory contains the navigation pages. which will create a `_site` subdirectory which contains the built site.

The styling is kept minimal and can be changed by modifying the `main.css` file in the`assets/css` subdirectory.

It is built to be deployed mainly on github pages, but can easily be modified/entended to work on other platforms as well.

