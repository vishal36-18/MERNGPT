let IS_PROD = false;
const server = IS_PROD ?
    "https://merngptserver.onrender.com" :

    "http://localhost:5050"


export default server;