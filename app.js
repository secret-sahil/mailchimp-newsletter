const express = require("express")
const bodyParsor = require("body-parser")
const request = require("request")
const https = require("https")
const app = express()

app.use(express.static('assets'))
app.use(bodyParsor.urlencoded({extended:true}))

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post('/',function(req,res){
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const URL = "https://us14.api.mailchimp.com/3.0/lists/1584682169"

    const options = {
        method: "POST",
        auth: "secret_sahil:ba925545a9ff88d10f92bc07fa671f9d-us14"
    }

    const request = https.request(URL, options, function(response){
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData)
    request.end()
})

app.post('/failure',function(req,res){
    res.redirect('/')
})

// process.env.PORT for heroku
app.listen(process.env.PORT || 3000,function(){
    console.log('Server is running at port 3000');
})

// API key
// ba925545a9ff88d10f92bc07fa671f9d-us14

// List/Audiance ID
// 1584682169