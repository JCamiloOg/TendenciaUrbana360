import Brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.APIKEY

const apiInstace = new Brevo.TransactionalEmailsApi();

apiInstace.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, key)


export default apiInstace