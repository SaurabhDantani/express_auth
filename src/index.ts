import express, { Express, Request, Response } from "express";
import dbUtils from "./utils/db.utils";
const cors = require("cors");
import * as routes from "./routes"
const app: Express = express();
const port: any = process.env.PORT || 8080;
import bodyParser from "body-parser";
import { MemberRoleEnum, RelationEnum } from "./utils/enumData";
import { Member } from "./models/members";
import * as bcrypt from 'bcrypt';
import passport from 'passport'
import Jwt from "jsonwebtoken";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authEjs from "./utils/auth";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());



app.use(passport.initialize());
app.use(express.json());

//all paths here
routes.registerRoutes(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use("/public", express.static('public'));

const connect = async () => {
  const conn = await dbUtils.init();
};
connect();


const showConnection =() => {
  app.get('/',(req:Request,res:Response)=> {
    return res.render('index')
    // res.json("Node server running correctly")
  })
  
  app.get('/register', async (req:Request,res:Response) => {
    // const { username, password } = req.body;
    console.log(req.body)
    const firstName = "demo"
    const password = "1234"
    const email = "demo@gmail.com"
    const tenantId:any = null;
    try {
        const connection = await dbUtils.getDefaultConnection();
        const memberRepo = connection.getRepository(Member)

        const userExists = await memberRepo
        .createQueryBuilder("member")        
        .where("member.Email = :Email", { Email: email })
        .getOne();            
      if (userExists) {                        
        return res.status(409).json({message:"Email Id exists"})
      }

      const member:any  = memberRepo.create({
        Name: firstName,
        Email: email,
        Password: password,
        DOB: new Date(),
        Relation:RelationEnum.Head,
        Status:true,
        TenantId:tenantId,
        RoleId:MemberRoleEnum.Admin,
      });
      await memberRepo.save(member);

      // return res.status(200).json({
      //   userName:email,
      //   password:password,
      //   message:"SuperAdmin register successfully",
      // });
      res.render('register')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error });
    }
  });
}

app.get('/login', async (req:Request,res:Response) => {
    const password = "1234"
    const email = "demo@gmail.com"
  try {
    const connection = await dbUtils.getDefaultConnection();
    const memberRepo = connection.getRepository(Member)

    const member: any = await memberRepo.createQueryBuilder("member")
      .where("member.Email = :Email", { Email: email })
      .leftJoinAndSelect("member.TenantId", "TenantId")
      .addSelect("TenantId.id AS tenantId")
      .getOne()

    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("==================== user found",member)
    if (member.Password === null) {
      return res.status(401).json({ message: "the User not allowed to login and password null" });
    }

    const isPasswordValid = await bcrypt.compareSync(password, member.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // const token = Jwt.sign({ member }, "ILove_Node", { expiresIn: '8h' });
    const token = Jwt.sign({ member }, process.env.AUTH_SECRET_KEY || 'default_secret_key', { expiresIn: '8h' });
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/protected')
    // console.log("user token", token)

    return res.render('protected')
    // return res.status(200).json({ token, role: member.RoleId, id: member.id, status: member.Status, name: member.Name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error", error });
  }
})

app.get('/protected', authEjs,async(req:Request, res:Response)=>{
  res.send("protect route working")
  // return res.render('protected')
})

app.listen(port, () => {
  showConnection()
  console.log(`listening on port${port}`);
});

// app.listen(port, '192.168.1.6', ()   => {
//   console.log(`Server is running on http://192.168.1.6:${port}`);
// });