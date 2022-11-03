const path = require('path')
const xlsx = require('node-xlsx')
const fs = require('fs')
const fetch = require('node-fetch')
require('dotenv').config();

class Helper {

    excute = async (path) => {
        const bump = await this.bumpData(path)

        const $cc_usa = await this.findCreditCardUS(bump)

        const $phone_usa = await this.findNumberPhoneUSA($cc_usa)

        const $list = await this.getLastName($phone_usa)

        const $final_data = await this.findMale($list)

         await this.exportFile($final_data)

        return $final_data
    }

    bumpData = (p) => {
        const filePath = path.resolve(__dirname, p)

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

    findCreditCardUS = (raw) => {
        let original_data = []
        let attempt = null
        for (let j = 0; j < raw.length; j++) {
            attempt = raw[j][0] + ""
            if (attempt.includes("United States") | attempt.includes("US") | attempt.includes("USA")) {
                original_data.push(attempt)
            }
        }
        return original_data
    }

    findNumberPhoneUSA = async (raw) => {
        let data = []
        let attempt = null
        let tmp = null
        var phoneno = /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/gm;
        let modifiedArray = null

        for (let i = 0; i < raw.length; i++) {
            modifiedArray = raw[i]

            modifiedArray = modifiedArray.replace('-', "")
            modifiedArray = modifiedArray.replace('(', "")
            modifiedArray = modifiedArray.replace(')', "")

            attempt = modifiedArray.split('|')
            for (let index = 0; index < attempt.length; index++) {

                if (attempt[index].match(phoneno)) {
                    data.push(raw[i]);
                }
            }
        }
        return data
    }

    getLastName = async (raw) => {
        let original = []
        let modified = []
        let attempt = null
        let lastName = null
        for (let i = 0; i < raw.length; i++) {
            attempt = raw[i].trim()

            if (attempt.length !== 0) {
                const listName = (attempt.split("|")[0]);
                lastName = listName.toString().split(' ').at(-1)
                if (lastName) {
                    modified.push(lastName)
                    original.push(attempt)
                }
                // for (let j = 0; j < listName.length; j++) {
                //     if (!Number(listName[j])) {
                //         lastName = this.parseName(listName[j])
                //         if (lastName) {
                //             dataAfter1stClean.push(lastName)
                //             original_data.push(attempt)
                //         }
                //     }
                // }
            }
        }
        return {
            modified,
            original

        }
    }

    findMale = async ($raw) => {
        let _arr = $raw.modified
        let original = $raw.original
        let decoded = null
        let url = null
        let response = []

        for (let i = 0; i < 4; i++) {
            url = `https://gender-api.com/get?name=${_arr[i]}&key=ewvTVHstsRMEYp2PQoBf288BfKtnAFnfuHfY`
            let infoUser = await fetch(url)

            decoded = await infoUser.json()
            console.log(decoded);

            if ( decoded['gender'] === 'male') {
                response.push(original[i])
            } else {}
        }
        return response
    }

    async exportFile(response) {
        let path = "final_nov.txt";
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
}


const helper = new Helper()

module.exports = helper;
