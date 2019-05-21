# Vue.js PWA on Docker

> A Vue.js project

## Build Setup

DEV
```
 docker build -t someonesgarden/vp .
 docker run -it -p 8080:80 --rm --name vp someonesgarden/vp
```


NODE
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
