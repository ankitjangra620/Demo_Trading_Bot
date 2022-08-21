
import fetch from "node-fetch"
export const getBars =async(symbol,start,end) =>{
    console.log('Getting Bars')
    try {
        const x= await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars?timeframe=1Min&start=${start}&end=${end}`,{
            headers:{
                'APCA-API-KEY-ID':process.env.ALPACA_ID,
                'APCA-API-SECRET-KEY':process.env.ALPACA_KEY,
            }
        }).then(e=>{
            return e.json();
        }).then(data=>{
            console.log(data)
            return data
        })
        return x;
    } catch (error) {
        console.log('error',error);
        return error.message;
    }
}
