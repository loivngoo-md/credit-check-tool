var express = require('express');
var router = express.Router();
var tool = require('../auto-filter')
var helper = require('../helper')



router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/v1', async function (req, res, next) {
    try {
        const raw_data = await tool.preFilter('data/Nov_3_2022/DaTA9.xlsx')

        const data1st = await tool.getPhone11(raw_data)

        const data = await tool.getListLastName(data1st.original_data)
        const response = data.arrLastName
        //   const response = await tool.redirectToAPI(data.arrLastName, data.original_data)
        await tool.exportFile(response)

        return res.json({
            count: response.length,
            data: response
        })
    } catch (error) {
        console.log(error);
    }

});

router.get('/cc', async function (req, res, next) {
    try {
        const path = 'data/Nov_3_2022/data10.xlsx'

        const data = await helper.excute(path)

        return res.json({
            count: data.length,
            data: data
        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/v1/data', async function (req, res, next) {
    return res.send(JSON.parse(await tool.readFileExcel("result.txt")))
});

module.exports = router;
