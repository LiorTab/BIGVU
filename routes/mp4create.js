
// server
var express = require("express");
// route
var router = express.Router();
// utils
const mp4create_utils = require("./utils/mp4create_utils");

/**
 * This path gets url from json object and returns path to 10 sec mp4 !!!
 */
router.post("/", async (req, res, next) => {
    try {

        // check if json empty 
        let url = req.body.url;
        console.log(url)
        if (url == undefined) {
            throw { status: 400, message: "Missing Parameters" };
        }

        // check if url  is valid with network protocol ( HTTP or HTTPS)
        let valid_url = mp4create_utils.isValidHttpUrl(url);
        if (!valid_url) {
            throw { status: 400, message: "Broken URL" }
        }

        let urlExist = await mp4create_utils.takeScreenShot(url)
        if (!urlExist) {
            throw { status: 400, message: "Website is not accessible" }
        }
        console.log("Screenshot taken!")

        finalVideoPath = await mp4create_utils.createPathWithTimeStamp();
        await mp4create_utils.createMp4('screenshot.png', finalVideoPath);


        let result = { file: finalVideoPath }
        res.status(200).send(result)
    }

    catch (error) {
        next(error);
    }
});

module.exports = router;