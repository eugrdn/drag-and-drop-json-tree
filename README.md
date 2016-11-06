Drag-and-Drop-Tree
=================

_This is the test task for WEB-dev._

## Description

Task conditions and restrictions:
* use Angular (>1.3) for Front-end
* use Nodejs for Back-end with one of the frameworks (express/totaljs/sailsjs/hapi/koajs)
* can't use external Angular modules
* can't use external librarys like jQuery and etc.
* create node adding deleting and saving functions

*Goals:*
- [x] reading json from file func
- [x] display json in a DOM tree on the WEB page
- [x] parsing func json->DOM & DOM->json
- [x] adding/removing nodes func
- [x] drag'n'drop nodes func 
- [x] saving result in the file func
- [x] edit nodes func  

## Installation

```bash
git clone https://github.com/rodinwow/drag-and-drop-json-tree.git
cd drag-and-drop-json-tree
npm install
npm start
# in browser
http://localhost:3000
```

# P.S.
The current json is placed in `./users_data`. To use your own json file place it at this folder and change file to path in *./handlers/fileProcesser.js*:

`var file = './users_data/treeJson.json';`

###Preview:

![alt tag](https://github.com/rodinwow/screenshots/blob/master/d'n'd-tree.png)