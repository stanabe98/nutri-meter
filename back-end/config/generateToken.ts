import jwt from "jsonwebtoken";
            
const generateToken = (id: any) => {
  return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "5d" });
};

export default generateToken;
