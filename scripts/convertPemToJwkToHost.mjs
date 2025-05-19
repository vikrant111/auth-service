import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';


const privateKey = fs.readFileSync('./certs/private.pem');

// Converts the private key into JWK format, but only the public part is included ('public' mode).
// { use: 'sig' } indicates this key will be used for signing (like JWTs).

const jwk = rsaPemToJwk(privateKey, {use: 'sig'}, 'public')


//paste this key inside the public/.well-known/jwks.json
console.log(JSON.stringify(jwk));
