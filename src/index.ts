import { ErrorRequestHandler, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import dotenv from "dotenv";
import http from "http";

const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port: string | Number = process.env.PORT || 5000;

const errorHandel: ErrorRequestHandler = (err: HttpError, req, res, next) => {
    console.log(err.message, err.statusCode);
    const message: string = `${err.message} : ${err.statusCode}`;
    res.send(message
    )
}
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const { query } = require('express');
dotenv.config();




app.use(cors());
app.use(express.json());






/* Database here */
/* Database here */
/* Database here */
/* Database here */

const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xh4av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        await console.log("Server and Database connection succesfully!");
        const BanglaEcommerce = client.db("Bangla-E-commerce");
        const users = BanglaEcommerce.collection("users");
        const categoris = BanglaEcommerce.collection("category");
        const productsCollection = BanglaEcommerce.collection("products");
        const subscribersCollection = BanglaEcommerce.collection("subscribers");



        // storing users 
        // new user 
        app.post("/users", async (req: Request, res: Response) => {
            const user: { email: string | null, displayName: string | null, AccountType: string } = req.body;
            const result = await users.insertOne(user);
            // console.log('heating');
            res.send(result);
        })

        // existing user 
        app.put("/users", async (req: Request, res: Response) => {
            const user: { email: string | null, displayName: string | null, AccountType: string } = req.body;
            const filter: { email: string | null } = { email: user.email };
            const options: { upsert: boolean } = { upsert: true };
            const updateDoc: { $set: { email: string | null, displayName: string | null, AccountType: string } } = { $set: user };
            const result = await users.updateOne(filter, updateDoc, options);
            // console.log('heating');
            res.json(result);
        })

        /* Category part */
        app.put("/category/:category", async (req: Request, res: Response) => {
            const category: string = req.params.category;
            const filter: { categoryName: string } = { categoryName: category };
            const options: { upsert: boolean } = { upsert: true };
            const updateDoc: { $set: { categoryName: string } } = { $set: { categoryName: category } };
            const result = await categoris.updateOne(filter, updateDoc, options);
            console.log(result, "hetting");
            res.json(result);
        })

        app.get("/categories", async (req: Request, res: Response) => {
            const cursor = categoris.find({});
            const result: {
                _id: string,
                categoryName: string,
            } = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        app.post('/user', async (req: Request, res: Response) => {
            const email: string = req.body.email;
            // console.log(email);
            const cursor = await users.findOne({ email: email })
            if (cursor) {


                res.json(cursor);

            }
            else {
                console.log("not found");
            }
        })
        app.patch('/user', async (req: Request, res: Response) => {
            const updateUser: { email: string | undefined, displayName: string | undefined, address: string, contact: string, } = req.body;
            const filter: { email: string | undefined } = { email: updateUser?.email };
            const result = await users.updateOne({ email: updateUser.email }, { $set: { displayName: updateUser.displayName, address: updateUser.address, contact: updateUser.contact } });
            res.json(result);
        })


        app.put("/make/admin", async (req: Request, res: Response) => {
            const user = req.body;
            const filter = { email: user.admin };

            console.log(filter);
            const updateDoc = { $set: { isAdmin: true } };
            const result = await users.updateOne(filter, updateDoc);
            res.json(result);
        });

/* this is something */


        app.get("/users/:email", async (req: Request, res: Response) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await users.findOne(query);
            let isAdmin = false;
            if (user?.isAdmin) {
                // console.log(user.isAdmin);
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });
        /* shohag vai here */

        


        /* shohag vai here */




        /* emon vai here */




        /* emon vai here */



        /**********************************/
        /********* Mizan Bhai Here *********/
        /**********************************/

        interface IProducts {
            _id?: string;
            ProductTitle: string,
            Category: string,
            Stock: number,
            image: string,
            rating?: number,
            shortDescription: string,
            additionalInfo: string,
            regularPrice: number,
            discountPrice: number,
            discountPercentage?: number,
            sku?: string,
            isApproved?: boolean,
            adminChecked?: boolean,
            sellerID?: string
        }

        app.get("/products", async (req: Request, res: Response) => {
            const cursor = productsCollection.find({});
            console.log("ioujghi");
            const result: {
                _id: string,
                productTitle: string,
            } = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })


       

        //Single Product Data
        app.get("/products/:productID", async (req: Request, res: Response) => {
            const cursor = req.params.productID;
            console.log(cursor);
            const query = { _id: ObjectId(cursor) };
            const result = await productsCollection.find(query).toArray();
            res.json(result);
        })

        app.post("/products/add", async (req: Request, res: Response) => {
            const products: IProducts = req.body;
            const result = await productsCollection.insertOne(products);
            res.json(result);
        })

        // Put from Samian 
        app.put("/products/update/:id", async (req: Request, res: Response) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ProductTitle: status.ProductTitle,
                    image: status.image,
                    shortDescription: status.shortDescription,
                    Stock: status.Stock,
                    Category: status.Category,
                    regularPrice: status.regularPrice,
                    discountPrice: status.discountPrice,
                    additionalInfo: status.additionalInfo,
                    discountPercentage: status.discountPercentage
                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Delete

        app.delete('/products/delete/:id', async (req: Request, res: Response) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

        // Newsletter
        app.post("/newsletter", async (req: Request, res: Response) => {
            const subscriber: { email: string | null} = req.body;
            const result = await subscribersCollection.insertOne(subscriber);
            // console.log('heating');
            res.send(result);
        })

        /* mizan vai here */



        /* nobel Start vai here */

        app.get('/vendors', async (req: Request, res: Response) => {
            console.log("came");
            const cursor = users.find({ AccountType: "vendor" });
            const result = await cursor.toArray();
            res.send(result);
        })
        

        /* nobel End vai here */



        /* alamgir vai here */



        /* alamgir vai here */






        /* write your code before this middle ware, this was youse to unable routes */
        app.use(() => {
            throw createHttpError(404, "route not found");
        })
        app.use(errorHandel);
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

/* Database here */
/* Database here */
/* Database here */
/* Database here */





app.get("/", (req: Request, res: Response) => {
    // console.log("all is ok and port:", port);
    res.send(`server is running on port: ${port}`);
})


app.listen(port, () => {
    console.log("server is running now on port:", port);

})


export default app