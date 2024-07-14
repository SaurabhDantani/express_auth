import 'reflect-metadata';
import { DataSource,  } from 'typeorm';
import {Member} from './models/members';
import { Business } from './models/business';
import { Address_ } from './models/address';
import { Tenant } from './models/tenant';
import Announcement from './models/announcement';
import Payment from './models/payment';
import { MemberShip } from './models/memberShip';
import { MemberShipHistory } from './models/memberShipHistory';
import { CommitteeRoles } from './models/committeeRoles';
import { Committee } from './models/committee';
import { Events } from './models/event';

import * as dotenv from 'dotenv';
import "./"
import { EnrollEvent } from './models/enrollEvent';
dotenv.config();
// for testing  
export const dataSource = new DataSource({
    type:'postgres',
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    username: 'postgres.vpcjuvgfiecgztcsgeck',
    password: 'cP540n5MbKDUMr3J',
    database:'postgres',//'family', //familytwo
    synchronize:true,
    migrationsRun: true,
    logging: false,
    // cache: {
    //     type: "database",
    //     duration: 30000
    // },
    entities: [Member,Business,Address_,Tenant,Announcement,Payment,MemberShip,MemberShipHistory,CommitteeRoles,Committee,Events,EnrollEvent],
    migrations: ["/migrations/**/*.ts"],
});

//for production
let { PROD_USER, PROD_PASSWORD, PROD_HOST, PROD_PORT, PROD_DATABASE_NAME } = process.env;
// export const dataSource = new DataSource({
//     type:'postgres',
//     host:"samajapp.postgres.database.azure.com",
//     port: 5432,
//     username: "samajadmin",
//     password: "Fss@@123456789",
//     database:"demoFamily",//'family', //familytwo
//     ssl:true,
//     extra:{
//         ssl:{
//             rejectUnauthorized:true
//         }
//     },
//     synchronize:true,
//     migrationsRun: true,
//     logging: false,
//     // cache: {
//     //     type: "database",
//     //     duration: 30000
//     // },
//     entities: [Member,Business,Address_,Tenant,Announcement,Payment,MemberShip,MemberShipHistory,CommitteeRoles,Committee,Events],
//     migrations: ["/migrations/**/*.ts"],
// });