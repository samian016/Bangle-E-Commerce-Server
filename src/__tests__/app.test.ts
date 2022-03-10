import { ServerEvents, ServerType } from "mongodb";
import app from "../index";
const request = require('supertest');


describe("GET / - a simple api endpoint", () => {
   
    test("Hello API Request", async () => {
        const result = await request(app).get("/");
        expect(result.text).toEqual("server is running on port: 5000");
        expect(result.statusCode).toEqual(200);
    });
   
});