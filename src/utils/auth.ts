import passport from 'passport'
import Jwt from "jsonwebtoken";
import { Express } from 'express';

const authEjs = (req:any, res:any, next:any) => {
    debugger
    console.log("=========== auth tokens", req)
  const token = req.cookie;
  if (!token) {
    return res.status(401).json('Access Denied: No Token Provided!',req);
    // res.json(req)
  }
  try {
    const decoded = Jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token');
  }
};

export default authEjs;
