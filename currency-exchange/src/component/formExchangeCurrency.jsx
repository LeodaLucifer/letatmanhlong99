import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Box, TextField, Grid, Typography, FormControl, Autocomplete, IconButton, InputAdornment } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AlertComponent from "./alert";
import "../styles.css"

const ExchangeForm = () => {
  const [open, setOpen] = useState(false)
  const [currency, setCurrency] = useState([])
  const [fromCurrency, setfromCurrency] = useState("")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [exchangeRate, setExchangeRate] = useState(null)
  const [inputMoney, setInputMoney] = useState(1)
  const [result, setResult] = useState(0)
  const [message, setMessage] = useState({ success: "", error: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios(process.env.REACT_APP_URL)
      .then((data) => {
        let result = data.data
        const uniqueCurrencies = Array.from(
          new Map(result.map(item => [item.currency, item])).values()
        );
        setCurrency(uniqueCurrencies)
      })
  }, [])

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      let fromCur = currency?.find(cur => ((cur.currency == fromCurrency)))
      let toCur = currency?.find(cur => ((cur.currency == toCurrency)))
      let rate = ((fromCur?.price && toCur?.price) ? fromCur.price / toCur.price : 0)
      setExchangeRate(rate)
    }
  }, [fromCurrency, toCurrency]);

  const convertExchange = () => {
    console.log(inputMoney)
    if ((!fromCurrency || !toCurrency || inputMoney == "" || isNaN(inputMoney))) {
      setResult(0)
      setOpen(true)
      setMessage(message => ({
        ...message,
        success: "",
        error: "All Fields are required and Token need to be in number"
      }))
    }
    else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setResult((inputMoney * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 8 }))
        setOpen(true)
        setMessage(message => ({
          ...message,
          success: "Swap Successfully",
          error: ""
        }))
      }, 2000)
    }
  }
  const autoCompleteCur = (value, setValue) => {
    return (
      <Autocomplete
        value={value || ""}
        disablePortal
        options={currency.map((curr) => curr.currency)}
        sx={{ maxWidth: 300 }}
        renderOption={(props, option) => (
          <li {...props}>
            <img src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${option}.svg`} width={20} height={20} />
            {option}
          </li>
        )
        }
        getOptionLabel={(option) => option}
        onInputChange={(e, newValue) => { setValue(newValue) }}
        onChange={(e, newValue) => {
          setValue(newValue)
        }}
        renderInput={(params) =>
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                value && <img src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${value}.svg`} />
              )
            }}
          />}
      />
    );
  }

  const swapCurrency = () => {
    let fromCur = fromCurrency;
    setfromCurrency(toCurrency)
    setToCurrency(fromCur)

  }
  return (
    <>
      <Container sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Box sx={{
          minWidth: '370px',
          minHeight: "420px",
          width: "60%",
          height: "50%",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
          textAlign: 'center'
        }}>
          <Typography textAlign='center' variant="h5" component="div">Token Swap</Typography>
          <Grid container padding={1}>
            <Grid container justifyContent='center' alignItems='center' display='flex'>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth sx={{ maxWidth: '300px' }}>
                  {autoCompleteCur(fromCurrency, setfromCurrency)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} justifyContent='center' display='flex'>
                <IconButton onClick={() => swapCurrency()} sx={{ display: { xs: "none", md: "block" } }}>
                  <SwapHorizIcon />
                </IconButton>
                <IconButton onClick={() => swapCurrency()} sx={{ display: { xs: "block", md: "none" } }}>
                  <SwapVertIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth sx={{ maxWidth: '300px' }}>
                  {autoCompleteCur(toCurrency, setToCurrency)}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent='center' display='flex' padding={2}>
              <Grid item xs={12} padding='5px'>
                <TextField placeholder="Input Number" type="text" variant='standard' fullWidth onChange={(e) => { setInputMoney(e.target.value) }} value={inputMoney || ""}
                  InputProps={{
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          <Typography color='white'>{`${fromCurrency || ""}`}</Typography>
                        </InputAdornment>
                      </>
                    )
                  }}
                  sx={{
                    '& MuiInput-input': {
                      color: "blue"
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} padding='5px'>
                <Typography
                  noWrap
                  color='white'
                  textAlign='left' variant="p" fontWeight='bold' fontSize='24px' component='div'>{`${result} ${toCurrency || ""}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <LoadingButton
              sx={{ minWidth: '200px' }} variant="contained"
              onClick={() => convertExchange()}
              loading={loading}
              loadingPosition="end"
              endIcon={<ArrowForwardIcon />}
            >Swap</LoadingButton>
          </Box>
        </Box>
      </Container>
      <AlertComponent open={open} setOpen={setOpen} message={message} />
    </>
  )
}

export default ExchangeForm