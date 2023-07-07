const express = require('express')
const { db } = require('./firebase-auth')
// const { bucket } = require('./firebase-auth')
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express()
const path = require('path');
const { timeStamp } = require('console');
const port = process.env.PORT || 3000;
const ejs = require('ejs');
const { title } = require('process');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const multer = require('multer');



// const upload = multer({ storage: multer.memoryStorage() });

app.set('views','./views')
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static('assets'))

const currentTimestamp = admin.firestore.Timestamp.now();
var allDocuments = [];
var itDocuments = [];
var mechDocuments = [];
var civilDocuments = [];
var eceDocuments = [];
var eeeDocuments = [];
var instiDocuments = [];
// var arr = [ {title:"one"},{title:"two"}]


// const ejsContent = fs.readFileSync('views/news page.ejs', 'utf8');
// const dom = new JSDOM(ejsContent, { runScripts: 'dangerously' });



// app.use(express.static(path.join(__dirname, 'public')));

// app.post("/upload", uploadImage);

app.get('/', async (req, res) => {

  itDocuments = await fetchDocumentsFromFirebase('IT')
  mechDocuments = await fetchDocumentsFromFirebase('MECH')
  civilDocuments = await fetchDocumentsFromFirebase('CIVIL')
  eceDocuments = await fetchDocumentsFromFirebase('ECE')
  eeeDocuments = await fetchDocumentsFromFirebase('EEE')
  instiDocuments = await fetchDocumentsFromFirebase('Institutional')
  allDocuments = await fetchAll(itDocuments,mechDocuments,civilDocuments,eceDocuments,eeeDocuments,instiDocuments)

  res.render('index',{ itDocuments, mechDocuments, civilDocuments, eeeDocuments, eceDocuments,allDocuments, instiDocuments })

  
  // console.log(allDocuments)

});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, '\editorial.html'));
});
app.get('/about', (req, res) => {
  try {
    
  res.render('about',{allDocuments})
    // console.log( {itDocuments} )
  } catch (error) {
    // Handle the error
    console.log('Error:', error);
    res.render('error-page');
  }

});


app.get('/insti', async (req, res) => {
  try {
    const Documents = instiDocuments
  res.render('news list',{ Documents,heading:'INSTITUTIONAL NEWS',dept:'Institutional', allDocuments})
    // console.log( {itDocuments} )
  } catch (error) {
    // Handle the error
    console.log('Error:', error);
    res.render('error-page');
  }
});

app.get('/itnews', async (req, res) => {
    try {
      const Documents = itDocuments
    res.render('news list',{ Documents,heading:'IT NEWS',dept:'IT', allDocuments})
      // console.log( {itDocuments} )
    } catch (error) {
      // Handle the error
      console.log('Error:', error);
      res.render('error-page');
    }
  });


  app.get('/mechnews', async (req, res) => {
    try {
      const Documents = mechDocuments

    res.render('news list',{ Documents,heading:'MECH NEWS',dept:'MECH',allDocuments })
      // console.log( {documents} )
    } catch (error) {
      // Handle the error
      console.log('Error:', error);
      res.render('error-page');
    }
  });


  app.get('/civilnews', async (req, res) => {
    try {
      const Documents = civilDocuments

    res.render('news list',{ Documents,heading:'CIVIL NEWS',dept:'CIVIL',allDocuments })
      // console.log( {documents} )
    } catch (error) {
      // Handle the error
      console.log('Error:', error);
      res.render('error-page');
    }
  });


  app.get('/eeenews', async (req, res) => {
    try {
      const Documents = eeeDocuments

    res.render('news list',{ Documents,heading:'EEE NEWS',dept:'EEE',allDocuments })
      // console.log( {documents} )
    } catch (error) {
      // Handle the error
      console.log('Error:', error);
      res.render('error-page');
    }
  });


  app.get('/ecenews', async (req, res) => {
    try {
      const Documents = eceDocuments

    res.render('news list',{ Documents,heading:'ECE NEWS',dept:'ECE',allDocuments })
    //   console.log( {documents} )
    } catch (error) {
      // Handle the error
      console.log('Error:', error);
      res.render('error-page');
    }
  });


  app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '\login.html'));
  });


  app.post("/auth", async (req, res) => {
    
    const cred = await fetchDocumentOnlyFromFirebase('auth','jEffMUEpsyHxzZFGRgBN')

    if (req.body.user=== cred.user && req.body.psw===cred.psw) {
      // res.send({msg: "correct user"})
      await  res.sendFile(path.join(__dirname, '\editorial.html'));
    }

    else{
      await  res.sendFile(path.join(__dirname, '\q404.html'));

    }


    // console.log(req.body,cred)
})




app.post("/create", async (req, res) => {
    
    await  uploadnews(req.body.dept,req.body.title,req.body.author,req.body.desc,req.body.content,req.body.url);

    res.sendFile(path.join(__dirname, '\editorial.html'))
})


app.post('/delete', async (req, res) => {
    const delVal = req.body.delete;
    const deptVal = req.body.dept;

    await delDocFromFirebase(deptVal,delVal)

    res.send("the content has been deleted")
})


// app.post('/hometitle', async (req, res) => {
//   const titlVal = req.body.homtitle;
//   const deptVal = req.body.dept;

//   const val =await getDocFromFirebase(deptVal,titlVal)

//   // res.send("the content has been deleted")
//   console.log(val)
// })


app.get('/newspage', async (req, res) => {
    const documentId = req.query.id;
    const dept = req.query.dept;
    // const target= document.getElementById('content')
    // Perform further processing with the document ID, such as fetching the document from Firebase
    try {
        // Retrieve documents from Firebase collection
        const documents = await fetchDocumentOnlyFromFirebase(dept,documentId);
        const lines = documents.content.split('\n');
        
        
    
        // Render the page and pass the documents
      //   res.sendFile(path.join(__dirname, '\IT news.html'));
      res.render('news page',{ documents,lines,allDocuments })
    // res.send({documents})
        // console.log( {documents} )
      } catch (error) {
        // Handle the error
        console.log('Error:', error);
        res.render('error-page');
      }
    });
  



async function fetchDocumentsFromFirebase(coll) {
    
    const collectionRef = db.collection(coll);
  
    const documentsSnapshot = await collectionRef.get();
  
    const documents = documentsSnapshot.docs.map(doc =>{
        return {
          id: doc.id,
          title: doc.data().title,
          desc: doc.data().desc,
          url: doc.data().imgURL,
          author: doc.data().author,
          content: doc.data().content,
          dept: doc.data().dept,
          timestamp: doc.data().timestamp.toDate(),
          
          
        };
    });
    const sortedData = sortfunction(documents)
    return sortedData
  }

  async function sortfunction(documents){
    const sortedData =  await  documents.sort((a, b) => b.timestamp - a.timestamp);
    return sortedData
  }


  async function fetchAll(it,mech,civil,ece,eee,insti){
    const mergedArray = [...it, ...mech, ...civil, ...ece, ...eee, ...insti];
    const sortedData = sortfunction(mergedArray)
    return sortedData
  }

  async function delDocFromFirebase(coll,delVal){
    const snapshot = await db.collection(coll).where('title', '==', delVal).get();
        snapshot.forEach(function (doc) {
            db.collection(coll).doc(doc.id).delete();
        });
  }


  // async function getDocFromFirebase(coll,delVal){
  //   const snapshot = await db.collection(coll).where('title', '==', delVal).get();
  //       snapshot.forEach(function (doc) {
  //           const val =db.collection(coll).doc(doc.id);
  //           return val

  //       });
  // }


  async function fetchDocumentOnlyFromFirebase(coll,id) {
    try{
    
    const documentRef = db.collection(coll).doc(id);
  
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      return documentData;
    } else {
      console.log('Document does not exist');
      return null;
    }
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
  }



  async function uploadnews(coll,titl,auth,des,con,url) {
    try {
      const paragraphsString = con;
      const collectionRef = db.collection(coll);
      
  
      await collectionRef.add({ 
        title: titl,
        author: auth,
        desc: des,
        content: paragraphsString,
        timestamp:currentTimestamp,
        imgURL:url,
        dept:coll
        });
      // console.log('Paragraphs uploaded as a single document:', paragraphs);
    } catch (error) {
      console.log('Error uploading paragraphs:', error);
    }
  }



 



app.listen(port, () => console.log("server connected to port ${port}"))