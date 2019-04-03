# Airstack

Build your own community curated resources list (Startup Stash, TemplateStash, WDStack, etc..) using Airtable and ReactJs.
==

Airstack is a free, open-source project that enables that creation of curated collections and niche topic directories. 
Create your own categorized list of Web resources. The whole premise of Airstack is that the app is easily managed, without coding, via the 
Airtable UI.

<https://airtable.com/>
<https://reactjs.org/>
<https://getbootstrap.com/>


Backend
===

The backend and data store is an Airtable "speadsheet" database, which is also used to configure and administer the Web app.
The Airtable database contains 3 core tables:

- Resource
Represents a single item that is designated by a URL.

 - Name (title/label)
 - Category (1 or more)
 - URL
 - Short
 - Full
 - Featured
 - Approved
 - SubmittedBy
 - ImgThumb
 - ImgLarge
 - FaviconUrl
 - Tags
 - Related
 - IsFree
 - Rating
 - DateCreated

- Category (topics)
Represents a topic/subject/bucket by which any Resource can be associated. 

- Name
- Resources (1 or more)
- Description
- ImgThumb
- ImgLarge

- App
Contains app-wide configaration options and global content.


Frontend
===

The frontend is currently built with ReactJs and Bootstrap 4. The React app contains the 
business logic, and performs API calls to the Airtable database.

React app structure
---

```
--- /src
------- /components
------- /layouts
------- /routes
------- /views
---------- /category
---------- /dashboard
---------- /resource
------- airtable.js
------- app.js
------- conf.json
------- env.json
------- helpers.js
------- index.js
```


Getting Started
===

- At <https://airtable.com> create account, and then "Copy Base": https://airtable.com/universe/exppC2xVnGVRRoC5i/airstack
- Generate an API key: https://airtable.com/account

In dev environment:

- Run `> npm install --save-dev`
- Edit the `env.json`, and enter your Airtable API settings
- Run `> npm start`

To build:
===
- Run `> npm run build`


Good to Know
===

- A Resource can be associated with multiple Categories
- Resources can have 0 or more related Tags
- Resources can have 0 or more related Resources

