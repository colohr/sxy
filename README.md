SXY
=============
A GraphQL express server to run multiple graph endpoints. 

Note: I use the name "graph" to identify each folder which becomes a graphql endpoint.
 1. Adds commonly used scalars (sxy-specific) like Date, DateTime, Decimal (Float), Text (String)
 2. Automatically loads graphs from a main structure folder when app is started.
    * Example graph: 
        * a-graph/Item/index.js (required)
            * export a resolver object (required but can be empty if resolving elsewhere)
        * a-graph/Item/Item.graphql (required)
        * a-graph/Item/scalars/scalars.graphql (optional)
        * a-graph/Item/scalars/Scalar-Name.js (optional if scalars is included to resolve)
        * a-graph/Item-2/index.js 
        * a-graph/Item-2/query.js (optional)
            * exports default to a Query resolver
            * if mutation is needed an object with In, Out 
                * In refers to mutation
                * Out refers to query
            * Will add resolvers to Query, Mutation when initialized
        * a-graph/Item-2/Item-2.graphql (required)
        * a-graph/Query/index.js (required)
            * export object with Input, Output objects for resolvers
        * a-graph/Query/Query.graphql (required)
 3. Includes scalar support that initializes resolvers when a scalars subfolder exists in graph folder.
 4. Includes support for basic-auth when viewing the graph ui (graphiql).
 5. Includes support for SQLite DB & is automatically added to graph folder for storage.
    * uses "sequalize" for SQLite control
    * sxy-specific scalars are used to resolve value to a SQLite schema type
 6. Includes support to connect MongoDB databases
 7. Includes support to connect firebase databases
 8. Includes a graphql interface for each graph

Install `sxy` 
-------------
```
  npm i sxy
```

Configure your app
-------------
```js
    const sxy = require('sxy')
    //to see the default structure use sxy.app_example
    sxy.app_example = {
	                    //used to add basic-auth to your graphiql iterfaces 
                        "admin":{
                          "path":"ui",
                          "users":{
                            "user":"pass"
                          }
                        },
                        //firebase is null by default
                        "firebase":{
                        	//initializes admin service account
                            "account":"path/to/serviceAccountKey.json", //will join path too app.root 
                            "url": "https://app-name.firebaseio.com" //databaseURL for firebase-admin service account
                        },
                        //set graph folders used for your app
                        "graph":{
                          //used to route the graph endpoint
                          "main":"/api", //used as a subpath for graphs if not app.path
                          "ui":"/ui", //used to access the graph graphql interface
                          "path":"/graph", //used to access the graph data (endpoint of graph)
                          "structs":"/structs" //the directory in filesystem to load graph structures + automatically joins app.root so just provide name 
                        },
                        "host":"http://localhost", //the app host
                        "path":"/api", //the path of your app 
                        "port":7777, //the app port
                        "root":"/", //the root directory of your app - defaults to process.cwd() or can also be set in sxy.app(root)
                        //used to set static folders for your app
                        "statics":{
                          "public":true, //if true uses path.join(root,key) for directory & sets it to the app.path in the express router
                          "/bower_components":"bower_components" //if value === 'string' then directory for folder becomes path.join(root,'string') + key is used for express router
                        }
                      }
    
```

SXY
-------------
```js
const sxy = require('sxy')

//to run your app
//will create a app.json configuration at process.cwd() if it doesn't exists
sxy.app().then(main_url=>{
    console.log(`App running at: ${main_url}`)
}).catch(console.error)

```


Reasons of module are for better education & simplicity:
-------------
While I love to work with graphql, graphiql & apollo modules, there are a few issues that would not allow me to easily install a graphql endpoint because of the
use of unsupported js.  The use of export/import for example and the need to use babel to run a service, in my opinion, did not keep the "easy-of-use" development & great functionality
that graphql offers.  For similar reasons, when attempting to setup the graphql schema, with may ways of achieving this the standard graphql & apollo tools did not allow me to 
easily customize how I wanted to resolve & define scalars.  Additionally I wanted to easily run multiple graphqls & so that became the main focus of this module.
  
On a different note.  I have been focusing of reducing complexity in my code so I have started authoring it using different terminology which differs from the default.  Mainly for developers starting up, the wording used to
describe modules my be difficult to understand & could potentially lead to some giving up on using the language or the technology.  This is the reason I have chosen to add such things as Text (String), Decimal (Float) & other more commonly used 
wording as default scalars.  


Examples & more:
-------------
Currently since I am the only using "sxy" I am not quite sure what questions or examples are required.
If anyone would like to provide ideas that would benefit this module  I would gladly create examples based on those.
Contact me at: colohr.code@gmail.com or @the_va11y on twitter if you have insights on this.

