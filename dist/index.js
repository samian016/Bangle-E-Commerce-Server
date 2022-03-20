"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const errorHandel = (err, req, res, next) => {
    console.log(err.message, err.statusCode);
    const message = `${err.message} : ${err.statusCode}`;
    res.send(message);
};
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const { query } = require('express');
dotenv_1.default.config();
app.use(cors());
app.use(express.json());
/* Database here */
/* Database here */
/* Database here */
/* Database here */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xh4av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield console.log("Server and Database connection succesfully!");
            const BanglaEcommerce = client.db("Bangla-E-commerce");
            const users = BanglaEcommerce.collection("users");
            const categoris = BanglaEcommerce.collection("category");
            const productsCollection = BanglaEcommerce.collection("products");
            const subscribersCollection = BanglaEcommerce.collection("subscribers");
            const featuredProductsCollection = BanglaEcommerce.collection("featuredProducts");
            const blogCollection = BanglaEcommerce.collection("blogs");
            // storing users 
            // new user 
            app.post("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const result = yield users.insertOne(user);
                // console.log('heating');
                res.send(result);
            }));
            // existing user 
            app.put("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const filter = { email: user.email };
                const options = { upsert: true };
                const updateDoc = { $set: user };
                const result = yield users.updateOne(filter, updateDoc, options);
                // console.log('heating');
                res.json(result);
            }));
            /* Category part */
            app.put("/category/:category", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const category = req.body;
                // console.log("object");
                const filter = { categoryName: category.categoryName };
                const options = { upsert: true };
                const updateDoc = { $set: category };
                const result = yield categoris.updateOne(filter, updateDoc, options);
                // console.log(result, "hetting");
                res.json(result);
            }));
            app.get("/categories", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = categoris.find({});
                const result = yield cursor.toArray();
                // console.log(result);
                res.send(result);
            }));
            app.post('/user', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const email = req.body.email;
                // console.log(email);
                const cursor = yield users.findOne({ email: email });
                if (cursor) {
                    res.json(cursor);
                }
                else {
                    console.log("not found");
                }
            }));
            app.patch('/user', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const updateUser = req.body;
                const filter = { email: updateUser === null || updateUser === void 0 ? void 0 : updateUser.email };
                const result = yield users.updateOne({ email: updateUser.email }, { $set: { displayName: updateUser.displayName, address: updateUser.address, contact: updateUser.contact } });
                res.json(result);
            }));
            app.put("/make/admin", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const filter = { email: user.admin };
                console.log(filter);
                const updateDoc = { $set: { isAdmin: true } };
                const result = yield users.updateOne(filter, updateDoc);
                res.json(result);
            }));
            /* this is something */
            app.get("/users/:email", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const email = req.params.email;
                const query = { email: email };
                const user = yield users.findOne(query);
                let isAdmin = false;
                if (user === null || user === void 0 ? void 0 : user.isAdmin) {
                    // console.log(user.isAdmin);
                    isAdmin = true;
                }
                res.json({ admin: isAdmin });
            }));
            app.delete("/delete/category/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                // console.log(id);
                const query = { _id: ObjectId(id) };
                const result = yield categoris.deleteOne(query);
                console.log(id);
                res.json(result);
            }));
            app.put("/categoryWise", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = req.body.name.toLocaleLowerCase();
                const query = { Category: cursor };
                // console.log(cursor);
                const result = yield productsCollection.find(query).toArray();
                // console.log(result);
                res.json(result);
            }));
            app.get("/single/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = yield categoris.findOne(query);
                res.json(result);
            }));
            app.get("/products", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = productsCollection.find({
                    isApproved: true
                });
                // console.log("ioujghi");
                const result = yield cursor.toArray();
                // console.log(result);
                res.send(result);
            }));
            app.get("/productForapprove", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = productsCollection.find({
                    isApproved: false
                });
                // console.log("ioujghi");
                const result = yield cursor.toArray();
                // console.log(result);
                res.send(result);
            }));
            //Single Product Data
            app.get("/products/:productID", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = req.params.productID;
                console.log(cursor);
                const query = { _id: ObjectId(cursor) };
                const result = yield productsCollection.find(query).toArray();
                res.json(result);
            }));
            app.post("/products/add", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const products = req.body;
                const result = yield productsCollection.insertOne(products);
                res.json(result);
            }));
            // Put from Samian 
            app.put("/products/update/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const result = yield productsCollection.updateOne(filter, updateDoc, options);
                res.json(result);
            }));
            // Delete
            app.delete('/products/delete/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = yield productsCollection.deleteOne(query);
                console.log(id);
                res.json(result);
            }));
            // Newsletter
            app.post("/newsletter", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const subscriber = req.body;
                const result = yield subscribersCollection.insertOne(subscriber);
                // console.log('heating');
                res.send(result);
            }));
            app.post("/featuredProducts/add", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const featuredProducts = req.body;
                featuredProducts.StartDate.toLocaleString();
                featuredProducts.EndDate.toLocaleString();
                const result = yield featuredProductsCollection.insertOne(featuredProducts);
                res.json(result);
            }));
            app.get('/featuredProducts', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = featuredProductsCollection.find({ Status: "Yes" });
                console.log(cursor);
                const result = yield cursor.toArray();
                res.send(result);
            }));
            ///// Blog /////
            // Blog Add
            app.post("/blog/add", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const blogs = req.body;
                const result = yield blogCollection.insertOne(blogs);
                res.send(result);
            }));
            // Get All Blogs
            app.get("/blogs", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = blogCollection.find({ isApproved: true });
                const result = yield cursor.toArray();
                res.send(result);
            }));
            app.get("/blogs/dashboard", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = blogCollection.find({});
                const result = yield cursor.toArray();
                res.send(result);
            }));
            // Blog Post Approve
            app.put("/blogs/dashboard/approve/:blogId", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const myData = req.params.blogId;
                console.log(myData);
                const query = { _id: ObjectId(myData) };
                const updateDoc = { $set: { isApproved: true } };
                const result = yield blogCollection.updateOne(query, updateDoc);
                res.json(result);
            }));
            // Get Single Blog
            app.get("/singleBlog/:blogID", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.blogID;
                const query = { _id: ObjectId(id) };
                const result = yield blogCollection.find(query).toArray();
                res.json(result);
            }));
            // Blog delete
            app.delete("/blogs/delete/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = req.params.id;
                console.log(cursor);
                const query = { _id: ObjectId(cursor) };
                const result = yield blogCollection.deleteOne(query);
                res.send(result);
            }));
            app.get('/vendors', (req, res) => __awaiter(this, void 0, void 0, function* () {
                console.log("came");
                const cursor = users.find({ AccountType: "vendor" });
                const result = yield cursor.toArray();
                res.send(result);
            }));
            /* nobel vai here */
            /* alamgir vai here */
            /* alamgir vai here */
            /* write your code before this middle ware, this was youse to unable routes */
            app.use(() => {
                throw (0, http_errors_1.default)(404, "route not found");
            });
            app.use(errorHandel);
        }
        finally {
            //   await client.close();
        }
    });
}
run().catch(console.dir);
/* Database here */
/* Database here */
/* Database here */
/* Database here */
app.get("/", (req, res) => {
    // console.log("all is ok and port:", port);
    res.send(`server is running on port: ${port}`);
});
app.listen(port, () => {
    console.log("server is running now on port:", port);
});
exports.default = app;
