var express = require('express');
var router = express.Router();
var tool = require('../auto-filter')


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/v1', async function (req, res, next) {
    try {
        const raw_data = await tool.preFilter('data/Book2.xlsx')

        const data1st = await tool.getPhone11(raw_data)

        const data = await tool.getListLastName(data1st.original_data)

        // const response = data.arrLastName
        const response = await tool.redirectToAPI(data.arrLastName, data.original_data)
        await tool.exportFile(response)

        return res.json({
            count: response.length,
            data: response
        })
    } catch (error) {
        console.log(error);
    }

});

router.get('/v1/data', async function (req, res, next) {
    return res.send(JSON.parse(await tool.readFileExcel("result.txt")))
});

module.exports = router;
