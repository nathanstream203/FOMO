const jwt = require("jsonwebtoken");

const secret = "your_super_secret_key";

const token = jwt.sign(
        { fid: 1, type: "access" },
        "key",
        { expiresIn: "1h" });
        
console.log(token);