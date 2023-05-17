const axios = require("axios");
const dotenv = require('dotenv').config()

class TokenProvider {
    constructor() {
        this.token = null
        this.expireDate = null
    }
    async getToken() { 
        if(!this.token || this.expireDate > new Date()) {
            try {
                const res = await axios.post(`https://externalapiauthority.vetclick.co.il/V1/Authentication/GetToken${process.env.SECRET}`, {ApiKey: process.env.API_KEY, ApiPassword: process.env.API_PASSWORD})
                if(res.data.IsSuccess) {
                    this.token = res.data.Token
                    this.expireDate = res.data.ExpireDate
                } else {
                    console.warn('error in fetching the token')
                }
            } catch (error) {
                console.warn(`the error is: ${error}`)
            }
            
            
        }
        return this.token
        
    }        
}

module.exports = TokenProvider