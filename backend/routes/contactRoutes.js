import { sendContactEmail } from "../utils/mailer.js";

export const contact = async (req,res) =>{
    const {name,email,subject,message} = req.body;
    try{
        await sendContactEmail(name,email,subject,message)
        return res.status(200).json({msg:"Email Sent Successfully"})
    }catch(error){
        console.error(error.message)
    }
    
}