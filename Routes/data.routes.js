const { Router } = require("express")
const mongoose = require("mongoose");
const axios = require('axios')


const dataController = Router()


const datascheme = new mongoose.Schema({
    data: Array
});

const DataModel = mongoose.model("data", datascheme);




async function alldata() {
    console.log("1111111")
    let result1 = await axios.get("https://zohocrmdata.vercel.app/getdata");
    console.log("22222")
    await new Promise(resolve => setTimeout(resolve, 1000 * 10));
    console.log("33333")
    let result2 = await axios.get("https://zohocrmdata.vercel.app/getdata");
    console.log("44444")
    await new Promise(resolve => setTimeout(resolve, 1000 * 10));
    console.log("555555")
    let bulkData = await bulkapi(result2.data.accessToken, result1.data.nextGet);
    console.log("66666")
    //console.log(bulkData.data)
    return bulkData.data;
}


async function bulkapi(accessToken, nextGet) {
    let data = await axios.get(`https://zohobulkapi.vercel.app/getdata?accessToken=${accessToken}&nextGet=${nextGet}`);
    return data;
}

// //////////////////functions//////////////////////

async function writeData(data) {
    let jdata = {
        "data": data
    }
    const result = await DataModel.updateOne({ _id: '63da16a4f853f245bb15c049' }, { $set: jdata })
    return result
}


// //////////////////////timers////////////////////////


let requestin30min = false
let timeoutId;

function debouncedFunction() {
    requestin30min = true
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        requestin30min = false
        timeoutId = null;
    }, 1000 * 60 * 5);
}



setInterval(() => {
    if (requestin30min) {
        alldata().then((res) => {
            console.log(res.length, "737373")
            writeData(res).then((res) => {
                console.log(res, "757575")
            }).catch((err) => {
                console.log(err, "777777")
            })
        })
    }
}, 1000 * 60 * 0.7);


//////////////////writing/////////////////////////

dataController.get("/get", async (req, res) => {

    debouncedFunction()
    const result = await DataModel.find()
    res.send(result)

})



module.exports = {
    dataController
}
