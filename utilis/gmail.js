import {google} from "googleapis"
import nodemailer from "nodemailer"
import "dotenv/config"

const oAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT_ID,process.env.OAUTH_CLIENT_SECRET,process.env.REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:process.env.GMAIL_REFRESH_TOKEN})

const sendEmail = async function (toGmail,otp){
    try{
        console.log(toGmail)
        const GMAIL_ACCESS_TOKEN = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:process.env.AUTH_USER_EMAIL,
            clientId:process.env.OAUTH_CLIENT_ID,
            clientSecret:process.env.OAUTH_CLIENT_SECRET,
            refreshToken:process.env.GMAIL_REFRESH_TOKEN,
            accessToken:GMAIL_ACCESS_TOKEN
            }
        })
        const mailOption = {
            from :`FROM CAS FOR AGENCY SIGN IN OTP📧 <${process.env.AUTH_USER_EMAIL}>`,
            to:String(toGmail),
            subject:'OTP FOR AGENCY SIGN IN',
            text:'OTP',
            html  : `<b>OTP : ${otp}<b>`

        }
        const result = await transport.sendMail(mailOption)
        console.log(result)
    }catch(err){
        console.log(err)
    }
}
export {sendEmail}
