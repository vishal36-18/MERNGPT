let IS_PROD = true;
const server = IS_PROD ?
    "https://merngptserver.onrender.com" :

    "http://localhost:5050"


export default server;