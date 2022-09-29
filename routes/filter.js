var express = require('express');
var router = express.Router();
var tool = require('../auto-filter')


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/v1', async function (req, res, next) {
    try {
        const raw_data = await tool.preFilter('data-6k.xlsx')

        const data = await tool.getListLastName(raw_data)
        const response = await tool.redirectToAPI(data.arrLastName, data.original_data)
        await tool.exportFile(response)

        return res.json({
            data: response
        })
    } catch (error) {
        console.log(error);
    }

});


router.get('/v1/data', async function (req, res, next) {

    return res.send(JSON.parse(await tool.readFileExcel("summary_4_file.txt")))
});




module.exports = router;
