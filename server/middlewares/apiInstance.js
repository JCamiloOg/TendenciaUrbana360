import brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.APIKEY

const apiInstace = new brevo.TransactionalEmailsApi();

apiInstace.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, key)


export default apiInstace