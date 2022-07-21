const jwt = require("jsonwebtoken");
const { jwtConfig } = require("./config");

const { secret, expiresIn } = jwt;

const getToken = user => {
    const safeData = {
        id: user.id,
        email: user.email
    };

    const token = jwt.sign(
        { data: safeData },
        secret,
        { expiresIn: parseInt(expiresIn, 10) }
    );

    return token;
};


module.exports = { getToken };
