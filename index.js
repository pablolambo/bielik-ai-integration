import axios from 'axios';
import dotenv from 'dotenv';
import Replicate from "replicate";

dotenv.config();
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const replicate = new Replicate();

const input = {
    input: "Wygeneruj listę kroków do wysłania zgłoszenia znaku towarowego do Urzędu Patentowego"
};

const output = await replicate.run("aleksanderobuchowski/bielik-11b-v2.3-instruct:dc287cda645e8f80c83ccb1b01c8c8fe8d652b4040c073e3c75112f20f983a2a", { input });
console.log(output);