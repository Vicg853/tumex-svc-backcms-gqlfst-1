<p align="center">
  <a href="https://victorgomez.dev">
    <img alt="Portfolio logo" src="./.github/resources/Animated.gif" width="60" height="60" />
  </a>
</p>

### **General info**
Hi 👋! This is my main CMS data source. Well... it is not an usual CMS using WordPress, or other, but a from scratch custom one. Although, it isn't that of a big deal, is just a small preference... 

Along that, my objective was to learn more about apollo, prisma and graphql.
Hope you like it 😄!

---
### **Technologies**
Project is created with:
* Apollo the graphql server: v3.6.7
* Prisma the Node.js and TypeScript ORM: v3.12.0
* Express the back-end server framework: v4.18.1
* Typescript magic: v4.6.4
* type-graphql typescript interface: v1.1.1
* For other secondary libs/fmwk, give a look into the [package.json](https://github.com/Vicg853/tumex-svc-backcms-gqlfst-1/blob/main/package.json) file

---
### **Setup**
  > Note: Node version >= 14.x must be installed in your local environment
  > Recomended: ``yarn``, but you may use npm if you want 

  *After downloading/cloning the repository and assuring yourself you are allowed to copy this repo...*

  * **Before running...**
    > ... add at least a ``` .env ``` file with the following variables (optional but recomended)
  ```.env
    PORT=... (e.g.: ``4000``)
    HOST=... (e.g.: ```localhost``)
    ROOT_PATH=... (e.g.: ``/``)
    DB_URL=... (You must use MongoDB, e.g.: ```mongodb+srv://user:<pass>@localhost:5000/mydb```)

    CORS=... (optional, e.g.: ``*``)
    HTTP_CATS_URL=... (optional, e.g.: ```https://http.cat/``)
  ```

  * **...Development**
  ```bash
   cd ./tumex-svc-backcms-gqlfst-1
   yarn dev:all 
  ```

  * **...Production**
  ```bash
   cd ./tumex-svc-backcms-gqlfst-1
   yarn build:all && yarn start
  ```

  * Access:
  **Voila, now, you're ready to access it via [``` localhost:4000 ```](http://localhost:4000)** (unless ``.env`` you defined a diferent value for PORT on your .env)

---

### **Testing**
Still not implemented...

---

### **Credits**

Special thanks to contributors/teams: 
- at NodeJS's for an amazing runtime env
- folks at typescript for the magic type help tool 
- Apollo's team for this amazing graphql server tool
- express people for this tool, my backend bff
- at Prisma's for such an astonishing ORM
- and all the teams/contributors on other packages used here
