import passport from 'passport'
import Jwt from "jsonwebtoken";
import { Express } from 'express';

const authEjs = (req:any, res:any, next:any) => {
    debugger
    console.log("=========== auth tokens", req)
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json('Access Denied: No Token Provided!',req);
    // res.json(req)
  }
  try {
    const decoded = Jwt.verify(token, process.env.AUTH_SECRET_KEY || 'default_secret_key');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token');
  }
};

export default authEjs;
