import { useState, useEffect } from 'react';
import axios from 'axios'
import {NumericFormat} from 'react-number-format'


export default function App() {

  const [response, setResponse] = useState(null);
  const [moeda1, setMoeda1] = useState('Real');
  const [moeda2, setMoeda2] = useState('Dolar');
  const [valor, setValor] = useState('0');
  const [result, setResult] = useState('0');
  
  //Consulta na API

  const fetchQuotes = async () => {
    try {
      const res = await axios.get("https://economia.awesomeapi.com.br/last/USD-BRL,BRL-USD,EUR-BRL,BRL-EUR,USD-EUR,EUR-USD",{
        headers: {},
        params: {}
      })

      setResponse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchQuotes()
    calcular()
  },[valor,result])

  // Pegando os valores
  let dolarParaReal = response?.['USDBRL']['high'] || 404
  let realParaDolar = response?.['BRLUSD']['high'] || 404
  let euroParaReal = response?.['EURBRL']['high']  || 404
  let realParaEuro = response?.['BRLEUR']['high']  || 404
  let euroParaDolar = response?.['EURUSD']['high']  || 404
  let dolarParaEuro = response?.['USDEUR']['high']  || 404

  const calcular = ()=>{

    let valorReal = moeda1 == 'Real' ? valor.replace('R$ ', '') : moeda1 == 'Dolar' ? valor.replace('$ ', '') : valor.replace(' €', '')
    
    if(moeda1 == 'Real' && moeda2 == 'Dolar'){
      console.log(valorReal)
      setResult(((parseInt(valorReal) * realParaDolar).toLocaleString('en', { style: 'currency', currency: 'USD' })).toString())
    }else if(moeda1 == 'Dolar' && moeda2 == 'Real'){
      setResult(((parseInt(valorReal) * dolarParaReal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })).toString())
    }else if(moeda1 == 'Real' && moeda2 == 'Euro'){
      setResult(((parseInt(valorReal) * realParaEuro).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })).toString())
    }else if(moeda1 == 'Euro' && moeda2 == 'Real'){
      setResult(((parseInt(valorReal) * euroParaReal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })).toString())
    }else if(moeda1 == 'Euro' && moeda2 == 'Dolar'){
      setResult(((parseInt(valorReal) * euroParaDolar).toLocaleString('en', { style: 'currency', currency: 'USD' })).toString())
    }else if(moeda1 == 'Dolar' && moeda2 == 'Euro'){
      setResult(((parseInt(valorReal) * dolarParaEuro).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })).toString())
    }else if(moeda1 == 'Dolar' && moeda2 == 'Dolar'){
      setResult(parseInt(valorReal).toLocaleString('en', { style: 'currency', currency: 'USD' }).toString())
    }else if(moeda1 == 'Real' && moeda2 == 'Real'){
      setResult(parseInt(valorReal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).toString())
    }else if(moeda1 == 'Euro' && moeda2 == 'Euro'){
      setResult(parseInt(valorReal).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).toString())
    }
  }

  return (
    <div style={{background:'#000', height:"100vh", padding:"1rem", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:'column'}}>
      <div style={{width:"30rem", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem"}}>
        <select name="select1" id="" style={{width:"11.2rem", height:"2rem"}} value={moeda1} onChange={e => setMoeda1(e.target.value)}>
          <option value="Real"selected>Real</option>
          <option value="Dolar">Dolar</option>
          <option value="Euro">Euro</option>
        </select>
        <select name="" id="" style={{width:"11.1rem", height:"2.25rem"}} value={moeda2} onChange={e => setMoeda2(e.target.value)}>
          <option value="Real">Real</option>
          <option value="Dolar" selected>Dolar</option>
          <option value="Euro">Euro</option>
        </select>
      </div>
      
      <div style={{width:"30rem", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <NumericFormat
        prefix={ moeda1 == 'Real' ? 'R$ ' : moeda1 == 'Dolar' ? '$ ' : ''}
        suffix={moeda1 == 'Euro' ? ' €' : ''} 
        decimalScale={2}
        decimalSeparator=','
        style={{width:"10rem",height:"2rem", padding:"0 0.5rem"}}
        value={valor}
        onChange={e => {setValor(e.target.value.toString());}}
        placeholder={
          moeda1 === 'Real' ?
          'R$ 0,00'
          : moeda1 === 'Dolar' ?
          '$ 0.00'
          : moeda1 == 'Euro' ?
          '0,00 €'
          : moeda1
        }
        />
        <span style={{minWidth:"10rem",height:"2rem", background:"#fff",padding:"0 0.5rem"}}>{
          result === '$NaN' ?
            '$ 0.00'
            : result === 'R$ NaN' ?
              'R$ 0,00'
            : result === 'NaN €' ?
              '0,00 €'
            : result
        }</span>
      </div>
    </div>
  )
}