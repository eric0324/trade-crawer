const request = require('request')
const cheerio = require('cheerio')
const fsLibrary  = require('fs') 

for (let i = 1 ; i<=100 ; i++ ){
    parseTradePage('https://trade.1111.com.tw/Comp_Info.aspx?vNo=' + i);
}

let result = '';
function parseTradePage(url, id) {
    request(url, (err, res, body) => {
        const $ = cheerio.load(body)
        const mutitle = $("h1").text();
        result = result + mutitle + ', '

        const word_p1 = $(".word_p1").text();

        // Email.
        const email_re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
        let email = word_p1.match(email_re);
        if (email){
            email = email[0].replace('Email：', '');
            email = email.replace('Email:', '');
            result = result + email + ', ';
        } else {
            result = result + ', '
        }
        
        // Cell phone number.
        const phone_re = /09\d{2}-?\d{3}-?\d{3}/
        let phone = word_p1.match(phone_re)
        if (phone){
            phone = phone[0].replace('-', '');
            result = result + phone + ', '
        } else {
            result = result + ', '
        }
        
        // Tel phone number.
        let tel_re = /\(?(\d{2})\)?[\s\-]?(\d{4})\-?(\d{4})/
        let tel = word_p1.match(tel_re)
        if (!tel){
            let tel_re = /\(?(\d{2})\)?[\s\-]?(\d{3})\-?(\d{4})/
            tel = word_p1.match(tel_re)
        }
        if (!tel){
            let tel_re = /\(?(\d{2})\)?[\s\-]?(\d{4})\-?(\d{3})/
            tel = word_p1.match(tel_re)
        }
        if (tel) {
            tel = tel[0].replace("-", "");
            tel = tel.replace("(", "");
            tel = tel.replace(")", "");
            result = result + tel
        } else {
            result = result + ','
        }

        // Add new line.
        result = result + '\n'

        fsLibrary.writeFile('newfile.txt', result, (error) => { 
            // In case of a error throw err exception. 
            if (error) throw err; 
        }) 
    }) 
}
