const express = require("express");
const router = express.Router();


const GetAbl = require("../abl/activity/getAbl"); 
const ListAbl = require("../abl/activity/listAbl"); 
const CreateAbl = require("../abl/activity/createAbl"); 
const UpdateAbl = require("../abl/activity/updateAbl"); 
const DeleteAbl = require("../abl/activity/deleteAbl"); 


router.get("/get", GetAbl);


router.get("/list", ListAbl);


router.post("/create", CreateAbl);


router.post("/update", UpdateAbl);


router.post("/delete", DeleteAbl);

module.exports = router;
