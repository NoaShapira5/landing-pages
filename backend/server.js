const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require('dotenv').config()
const TokenProvider = require('./TokenProvider')
const path = require('path')

const router = express.Router();
const app = express();
const port = 5000;

const tokenProvider = new TokenProvider()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

router.post("/status", async (req, res) => {
  const { token } = req.body; // get token from the request we will create in index.js
  const secret = "SITE SECRET";
  await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`, // URL
    {
        secret: secret,
        response: token,
    }, // URL parameters
  );
  //return response based on the status of the post request
  if (res.status(200)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post("/getCities", async (req, res) => {
  const token = await tokenProvider.getToken()
  const resData = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Authority/GetCities', {Token: token})
  return res.status(200).json(resData.data)
})

router.post("/getToken", async (req, res) => {
  try {
    const resData = await axios.post(`https://externalapiauthority.vetclick.co.il/V1/Authentication/GetToken`, {ApiKey: process.env.API_KEY, ApiPassword: process.env.API_PASSWORD})
    res.status(200).json(resData.data)
  }
  catch (error) {
    console.warn(error)
    res.status(500).json(error)
  }

 
})

router.post("/getAnimalTypes", async(req, res) => {
  const token = await tokenProvider.getToken()
  const resData = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Authority/GetAnimalTypes', {Token: token})
  return res.status(200).json(resData.data)
})

router.post("/getInquiryTypes", async(req, res) => {
  const token = await tokenProvider.getToken()
  const resData = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Inquiries/GetInquiryTypes', {Token: token})
  return res.status(200).json(resData.data)
})

router.post("/getStreets", async(req, res) => {
  try {
    const {CityID} = req.body
    const token = await tokenProvider.getToken()
    const resData = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Authority/GetStreets', {Token: token, CityID })
    return res.status(200).json(resData.data)
  } catch (error) {
    res.json(error)
  }

})

router.post("/saveInquiry", async(req, res) => {
  try {
    let {formInput, ownerDetails, feederDetails} = req.body 
    const token = await tokenProvider.getToken()
    const {data} = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Owners/GetOwners', {SearchTerm: ownerDetails.phone, Token: token})
    if(data.Owners.length === 1) {
      formInput = {...formInput, ReporterOwnerID: data.Owners[0].ID, ReporterOwnerDisplayName: `${data.Owners[0].FirstName}, ${data.Owners[0].LastName}, ${data.Owners[0].Phone1}, ${data.Owners[0].EmailAddress}, ${data.Owners[0].Street} ${data.Owners[0].HouseNumber}, ${data.Owners[0].City}`}
    } else if(data.Owners.length === 0) {
      formInput = {...formInput, InquiryDetails: `${formInput.InquiryDetails} פונה - ${ownerDetails.firstName} ${ownerDetails.lastName} טלפון - ${ownerDetails.phone} אימייל - ${ownerDetails.email}`}
    }
    if(feederDetails) {
      const {data} = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Owners/GetOwners', {SearchTerm: feederDetails.phone, Token: token})
      if(data.Owners.length === 1) {
        formInput = {...formInput, FeederOwnerID: data.Owners[0].ID}
      } else if(data.Owners.length === 0) {
        formInput = {...formInput, InquiryDetails: `${formInput.InquiryDetails} מאכיל ${feederDetails.firstName} ${feederDetails.lastName} טלפון - ${feederDetails.phone} אימייל - ${feederDetails.email}`}
      }
    }  
    const resData = await axios.post('https://externalapiauthority.vetclick.co.il/V1/Inquiries/SaveInquiry', {...formInput, Token: token})
    return res.status(200).json(resData.data)
  } catch(error) {
    console.log(error.response)
  }
  
})

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // FIX: below code fixes app crashing on refresh in deployment
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
} else {
  app.get('/', (_, res) => {
      res.status(200).json({massage: 'Welcome to landing pages API'})
  })
}


app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});