
import  express  from 'express';
const app = express();
import {getDownTredingStock} from './lib/getDownTrendingStock.js'
import {getBars} from './lib/getBars.js'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'


//To create an io server which will be a realtime server \

import * as io from 'socket.io-client';
const socket = io.connect('ws://localhost:5000/')
socket.emit('connection')
socket.on('connected',data=>{console.log(data)})
//-----------------------------------------------------//
import moment from 'moment'
import { getAccountValue } from './lib/getAccountValue.js';
dotenv.config();

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

const init =async (req,res,socket) =>  {
    const symbol = await getDownTredingStock();
    const checkAndOrder =async (socket) =>{
        const oneMinuteMS = 60000;
        const now = moment('2022-08-20')
        console.log(now)
        const start = moment(now).add(-2*oneMinuteMS,'milliseconds').toISOString();
        const end = moment(now).add(-oneMinuteMS,'milliseconds').toISOString();
        console.log("dates",now,start,end)

        const bars = await getBars(symbol,start,end,socket);
    //     const bars1= bars["bars"][0];
    //     const bars2=bars["bars"][1];
    //     if((bars1 && bars2) &&
    //         (bars1.c < bars1.o) && 
    //         (bars2.c > bars2.o) &&
    //         (bars2.c > bars1.o) &&
    //         (bars2.o < bars1.c) && 
    //         (bars2.v > bars1.v)
    //     ){
    //         let willingToSpend = getAccountValue();
    //         willingToSpend = Math.floor(willingToSpend * .1);

    //         let amt = Math.floor(willingToSpend/bars2.c);

    //         const purchase = await buyMarket({symbol,amt});

    //         sellStop({symbol,price:bars1.c,amt});

    //         const profitTarget = ((purchase.price-bars1.l)*2) + purchase.price;

    //         sellLimit({symbol,price:profitTarget,amt})
    //         console.log('amt',amt);

    //     }

    }
    checkAndOrder(socket);
    setInterval(checkAndOrder,60*1000);
}

app.get("/",(req,res)=>{
    req['socket']=socket;
    init(req,res,socket);
})


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running at PORT : ${PORT}`)
})