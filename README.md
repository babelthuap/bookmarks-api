# Boomarks API

_by Nicholas Neumann-Chun and Aleksey Malyshev_

## Features

- store links and tags with MongoDB

- each Link has a `title`, a `url`, and an array of associated `tags`

- each Tag has a `name` and an array of associated `links`

- can perform all CRUD operations on links and tags via the appropriate routes

## Installation

- run `npm install`, then `node server.js`

## Deployment

Deployed to Heroku under the name `aleksey-nicholas-bookmarks`. Check the GET requests at

- https://aleksey-nicholas-bookmarks.herokuapp.com/links and

- https://aleksey-nicholas-bookmarks.herokuapp.com/tags
