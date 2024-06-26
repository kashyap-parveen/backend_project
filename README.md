## backend packeges
```javascript
npm i express mongoose dotenv prettier cookie-parser cors mongoose-aggregate-paginate-v2 bcrypt jsonwebtoken multer cloudinary

app.use(cors())

.env
import 'dotenv/config'

```

### git code
##### …or create a new repository on the command line
```javascript
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:kashyap-parveen/[project_name].git
git push -u origin main


git remote add origin git@github.com:kashyap-parveen/backend_project.git
git branch -M main
git push -u origin main
```


##### …or push an existing repository from the command line
```javascript
git remote add origin git@github.com:kashyap-parveen/backend_project.git
git branch -M main
git push -u origin main
```


#### Mongoose database connect process
```javascript
import mongoose from "mongoose";
import {DB_NAME} from "./constants";
import express from "express";
import 'dotenv/config';



const app = express();
const port = process.env.PORT || 4000;

;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGOODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error: ",error);
            throw error;
        })
        app.listen(port,()=>{
            console.log(`Your app is listen Port No ${port}`);
        })
        
    } catch (error) {
        console.log(`Error in Connection in mongoDB: ${error}`);
        throw error;
        
    }
})();
```


### server error code list
```javascript
1. Informational responses (100 – 199)
2. Successful responses (200 – 299)
3. Redirection messages (300 – 399)
4. Client error responses (400 – 499)
5. Server error responses (500 – 599)
```



###### uniqueSuffix
```javascript
filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
```

