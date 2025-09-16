import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "No token, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export default auth;