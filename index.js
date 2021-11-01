const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');




// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i2xld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        //console.log('database connected sucessfully');
        const database = client.db('travelInformation');
        const packageCollection =  database.collection('package');
        const orderCollection =  database.collection('orders')
        //get package
        app.get('/package', async(req,res)=>{
            const cursor = packageCollection.find({});
            const packages =  await cursor.toArray();
            res.send(packages)
        });
        //get package
         // POST API For New Package
         app.post('/package', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            console.log('Got New Package', req.body);
            res.json(result);
        })
        app.get('/orders', async(req,res)=>{
            const cursor = orderCollection.find({});
            const orders =  await cursor.toArray();
            res.send(orders)
        });
          
      // Add Orders API
      app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    });
     // GET api for getting orders by USERID
     app.get('/orders/:uid', async (req, res) => {
        const USERID = req.params.uid;
        console.log(USERID)
        const query = { userID: USERID };
        const eachUserOrderData = await orderCollection.find(query).toArray();
        console.log(eachUserOrderData)
        res.json(eachUserOrderData);
    });
     //  Delete API
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        console.log('deleting user with id', id);
        res.json(result);
      });
       // PUT API FOR UPDATE
       app.put('/orders/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const updatedOrder = req.body;
        console.log(updatedOrder)
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
       const updateDoc = {
            $set: {
                orderStatus: 'Approved',
            }
        }
        const result = await orderCollection.updateOne(filter, updateDoc, options);

        console.log('Update Hitted ', id);
        res.json(result);

    })
  
  
    }
    
    
    finally{
        //await client.close();
    }
}
        


run().catch(console.dir)

//tourism-travel
//EM0bJvp9q7PF9Sis
app.get('/', (req, res) => {
    res.send('Travel server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})