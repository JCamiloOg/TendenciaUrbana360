import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const brevo = new BrevoClient({ apiKey: process.env.APIKEY });

export default brevo;