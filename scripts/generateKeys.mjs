import crypto from "crypto";
import fs from 'fs';

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding:{
        type:"pkcs1",
        format:"pem",
    },
    privateKeyEncoding:{
        type:"pkcs1",
        format:"pem",
    }
})


// console.log("Public key", publicKey)
// console.log("Private key", privateKey)

fs.writeFileSync("certs/private.pem", privateKey)
fs.writeFileSync("certs/public.pem", publicKey)



// to generate these keys run in terminal following command
// node scripts/generateKeys.mjs