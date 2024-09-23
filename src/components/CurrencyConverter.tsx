import { useState, useEffect } from "react";
import classes from './CurrencyConverter.module.css';

const CurrencyConverter = () =>{

    interface Post {
        "Id": string;
        "Currency": string;
        "PTBR": string;
        "ExchangeRate": number;
    }

    const [ getPost, setPost] = useState<Post[]>([]);
    const [ currency, setCurrency] = useState("BRL");
    const [ newCurrency, setNewCurrency ]  = useState("USD");
    const [ price, setPrice ] = useState<number>(0);
    const [ newPrice, setNewPrice ] = useState<number>(0);

    const fetchPosts = async () =>{
        try{
            const url: string = `/exchange.JSON`;
            const responseData = await fetch(url);
            const data = await responseData.json();
            setPost(data.ExchangeRates.BRL);
            console.log(responseData);
            console.log(getPost);
        } catch (err) {
        console.error("Error fetching data:", err);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const exchangedPrice = (price : number) =>{
        try{
            const oldCurrencyRate = getPost.find((item) => item.Currency === currency)?.["ExchangeRate"] || 1;
            const newCurrencyRate = getPost.find((item) => item.Currency === newCurrency)?.["ExchangeRate"] || 1;
            setNewPrice(()=>price*oldCurrencyRate/newCurrencyRate);
        }catch(err){
            console.error(err);
        }
    }

    return(
        <div>
            <form>
                <div className={classes.current}>
                    <div className={classes.priceDiv}>
                        <input type="number" value={price} min="0" onChange={(e) => setPrice(parseFloat(e.target.value))} />
                    </div>
                    <span>|</span>
                    <div className={classes.currencyDiv}>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            {getPost.map((value,index) => (
                                <option key={index} value={value.Currency}>{value.PTBR || value.Currency}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={classes.target}>
                    <div className={classes.priceDiv}>
                        <span className={classes.targetPrice}>{(newPrice.toFixed(2)).toString().replace(".",",")}</span>
                    </div>
                    <span>|</span>
                    <div className={classes.currencyDiv}>
                        <select value={newCurrency} onChange={(e) => setNewCurrency(e.target.value)}>
                        {getPost.map((value,index) => (
                            <option key={index} value={value.Currency}>{value.PTBR || value.Currency}</option>
                            ))} 
                        </select>
                    </div>
                </div>
            </form>
            <button onClick={() => exchangedPrice(price)}>Converter</button>
        </div>
    )
}

export default CurrencyConverter;