// web shot libary
const puppeteer = require('puppeteer')
const path = require('path');
// video library
var videoshow = require('videoshow')

const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

// init ffmpeg and ffprobe for videos 
ffmpeg.setFfmpegPath(path.join(__dirname, '..', '..', '/ffmpeg/bin/ffmpeg.exe'));
ffmpeg.setFfprobePath(path.join(__dirname, '..', '..', '/ffmpeg/bin/ffprobe.exe'));

// setup videoshow options
var videoOptions = {
    fps: 25,
    transition: false,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x640',
    outputOptions: ['-pix_fmt yuv420p'],
    format: 'mp4'
}
// seconds for video
var secondsToShowEachImage = 10;

// async function urlExist(url) {
//     try {
//         let browser = await puppeteer.launch();
//         let page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'load', timeout: 0 });
//         return true;
//     } catch (e) {
//         console.log(e.message);
//         return false;
//     }
// }


// check if website exist much faster in this function instaed function above 

/**
 * This function gets url and take screen shot if site exist , else return false
 */
async function takeScreenShot(url) {
    try {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({ path: 'screenshot.png' });
        await browser.close;
        return true;
    }
    catch (e) {
        console.log(e.message);
        return false;
    }


}


/**
 * This function creates name for output video with TimeSTAMP
 */
async function createPathWithTimeStamp() {
    return './outputs/video' + new Date().getTime() + '.mp4'
}


/**
 * This function creates 10 sec video form screenshot that taken with videoshow function
 * input : screenshot and name
 */
async function createMp4(screenshot, finalVideoPath) {

    var images = [{ path: screenshot, loop: secondsToShowEachImage },];
    // var finalVideoPath = './outputs/video' + new Date().getTime() + '.mp4';
    return new Promise((resolve, reject) =>
        videoshow(images, videoOptions)
            .save(finalVideoPath)
            .on('start', function (command) {
                console.log('Conversion started encoding ' + finalVideoPath + ' with command ' + command)
            })
            .on('error', function (err, stdout, stderr) {
                return Promise.reject(new Error(err))
            })
            .on('end', function (output) {
                console.log("Converstion completed!")
                resolve(output)
            }))

}

// Maybe check with Regullar Expression better 
// check if i need accept url by definition (with protocol https or http) if not need to change this function
/**
 * This function return true if string is valid url
 * input : string
 */
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}


exports.takeScreenShot = takeScreenShot;
exports.isValidHttpUrl = isValidHttpUrl;
exports.createPathWithTimeStamp = createPathWithTimeStamp;
exports.createMp4 = createMp4;