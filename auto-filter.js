const path = require('path')
const xlsx = require('node-xlsx')
const fs = require('fs')
const fetch = require('node-fetch')
require('dotenv').config();
class Tool {
    constructor() { }

    async initResultFile() {

    }

    async preFilter(name) {

        const filePath = path.resolve(__dirname, name)

        let _arr = []
        const workSheetsFromFile = xlsx.parse(filePath);
        let data = workSheetsFromFile[0]['data']

        data.forEach(element => {
            if (element !== undefined) {
                _arr.push(element);
            }
        });
        return _arr
    }

    async excuteFilter() {

    }

    async appendFile() {

    }

    async exportFile(response) {
        let path = "result.txt";
        let content = JSON.stringify(response)
        return fs.writeFile(path, content, function (err) {
            if (err) {
                console.log("Error: " + err);
            }
            else {
                console.log("Successfully!");
            }
        });
    }

    async readFileExcel(name) {
        // const filePath = path.resolve("/var/www/credit-check-tool/credit-check-tool/", name);
        const filePath = path.resolve(__dirname, name);

        const file = fs.readFileSync(filePath, 'utf-8');
        return file;
    }

    async removeEmptyElement() {

    }

    async getListLastName(raw_data) {
        let original_data = []
        let dataAfter1stClean = []
        let attempt = null
        for (let i = 0; i < raw_data.length; i++) {
            attempt = raw_data[i]
            if (attempt.length !== 0) {
                const name = (attempt.split("|")[0]);
                const lastName = name.trim().split(' ').at(-1)
                dataAfter1stClean.push(lastName)
                original_data.push(attempt)
            }
        }

        return {
            arrLastName: dataAfter1stClean,
            original_data: original_data

        }
    }


    async getPhone11(raw_data) {
        let original_data = []
        let dataAfter1stClean = []
        let attempt = null
        for (let j = 0; j < raw_data.length; j++) {
            attempt = raw_data[j][0]
            if (attempt) {
                const _arr = attempt.split('|')
                let tmp = null

                console.log(_arr);
                for (let index = 0; index < _arr.length; index++) {
                    tmp = Number(_arr[index].replace(/[^0-9]/g, ''))
                    if (tmp.toString().length == 11 || tmp.toString().length == 10) {

                        console.log("OK: ", tmp);
                        dataAfter1stClean.push(attempt)
                        original_data.push(attempt)
                    } else {
                        console.log("FAILED: ", tmp);
                    }
                }
            }
        }

        return {
            arrLastName: dataAfter1stClean,
            original_data: original_data

        }
    }

    async redirectToAPI(arrLastName, original_data) {
        let response = []
        let data = null
        for (let i = 0; i < arrLastName.length; i++) {

            data = {
                first_name: arrLastName[i],
                country: ""
            }

            console.log()

            let infoUser = await fetch(
                `${process.env.GENDER_API_HOST}`,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${process.env.FIX_TOKEN_GENDER_API}`
                    }
                });

            const finalResult = await infoUser.json()

            if (finalResult['result_found'] && finalResult['gender'] === 'male') {

                if (this.filterNumber(original_data[i].toString())) {
                    response.push(`${original_data[i].toString()}`)
                    console.log("Element: ", i, "---", finalResult['first_name'], '-- HAS PHONE NUMBER --- OK ')
                }
            } else {
                console.log("Element: ", i, "---", finalResult['first_name'], ' --- FAILED ')
            }
        }

        return response

    }


    filterNumber(str) {
        const _arr = str.split('|')
        let tmp = null
        for (let i = 5; i < _arr.length; i++) {
            tmp = Number(_arr[i].replace(/[^0-9]/g, ''))
            if (tmp.toString().length == 10 || tmp.toString().length == 11) {
                return true
            }
        }
        return false
    }

    async start() {

    }

}

const tool = new Tool()

module.exports = tool;
