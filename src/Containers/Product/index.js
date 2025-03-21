import React, {useEffect, useState} from 'react'
import Backwhite from '../../Assets/back_white1.svg'
import backdark from '../../Assets/back_dark1.svg'
import { Button, Spinner, Dialog, Card, CardBody, CardFooter, Typography, Switch } from '@material-tailwind/react'
import { useNavigate,useLocation, Link} from 'react-router-dom'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth, makeApiGetCallWithAuthCheggout } from '../../Services/Api' 
import "./style.css"
import rightSign from '../../Assets/rightSign.svg'
import wrongSign from '../../Assets/wrongSign.svg'

import coin from '../../Assets/coin.svg'
import voucher from '../../Assets/voucher.svg'
import packageIcon from '../../Assets/package.svg'
import CouponDialog from '../../Components/CouponDailog'
import AddressDialogs from '../../Components/AddressDailog'
import BillingDetailsDialog from '../../Components/BillingDailog'
import deleveryTick from '../../Assets/deleveryTick.svg'
import copy from '../../Assets/copy.svg'
import paymentNext from '../../Assets/paymentNext.svg'
import banner from '../../Assets/scratchbanner.png'
import PaymentErrorHandler from '../../Components/PaymentErrorHandler'

function Product() {
  const [coupon, setCoupon] = useState({})
  const [offerdeets, setOfferDeets] = useState([]);
  const [tnc, setTnc] = useState([])
  const [luma, setLuma] = useState(false)
  const [walpoints, setWalpoints] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const [modal, setModal] = useState('')
  const [errmessage, setErrmessage] = useState('')
  const [sessionmsg, setSessionmsg] = useState('')
  const [offerkey, setOfferkey] = useState('')

  const [paymentStatus, setPaymnetStatus] = useState('')
  const [paymentMessage, setPaymnetMessage] = useState('')

  const [couponDailog, setCouponDailog] = useState(false)
  const [addresserror, setAddressError] = useState(false)
  const [billingDailog, setBillingDailog] = useState(false)
  const [openAdd, setOpenAdd] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [orderDetails, setOrderDetails] = useState({})
  const [productDeliverable, setProductDeliverable] = useState(false);
  const [rewardApplied,setRewardApplied] = useState(false)
  const [rewardAmountApplaied,setRewardAmountApplaied] = useState(0)
  const navigate = useNavigate();
  const location = useLocation()
  const offerId = sessionStorage.getItem('id');
  const queryParams = new URLSearchParams(window.location.search);
  const hdnRefNumber = queryParams.get('hdnRefNumber');
  const transactionId = queryParams.get('transactionId');
  const [showAll, setShowAll] = useState(false);
  const token = queryParams.get('token');
  const sessionId = queryParams.get('sessionid');
  const virtualId = queryParams.get('virtualid');
  const bankName = queryParams.get('bankName');
  
   const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
          setWidth(window.innerWidth);
      }
      useEffect(() => {
          window.addEventListener('resize', handleWindowSizeChange);
          return () => {
              window.removeEventListener('resize', handleWindowSizeChange);
          }
      }, []);
      const isMobile = width <= 400;
      
  useEffect(() => {
    console.log(location.state)
  
  if(hdnRefNumber && !modal && !isloading){
    setIsloading(true);
    sessionStorage.setItem('order_id',hdnRefNumber)
    let data ={
      order_id: hdnRefNumber,
      razorpay_payment_id: transactionId,
      razorpay_amount: "1",
      offer_id: offerId,
    }
    makeApiCallWithAuth('checkPaymentStatus', data)
    .then((response) => {
      console.log("getpayres",response.data)
      if(response?.data?.status === 200){
        sessionStorage.setItem('coupon',JSON.stringify(response.data.data))
        // setOrderDetails(response.data.data)
        // setPaymentStatus('success')
        // setModal('success')
        setPaymnetStatus('success')
        setPaymnetMessage(response?.data?.message)
        setIsloading(false);
        // navigate('/handlePayment',{state:{status:'success',message:response?.data?.message,id:offerId}})
      }
      else if(response?.data?.status === 402){
        let order_id = sessionStorage.getItem('order_id')
        
        let offerdeets = JSON.parse(sessionStorage.getItem('coupon') || '{}');
        setIsloading(false);
        setPaymnetStatus('pending')
        setPaymnetMessage(response?.data?.message)
        console.log(order_id,offerdeets)
        sessionStorage.setItem('coupon',JSON.stringify(
          {
            ...offerdeets,
            order_id: order_id,
            redeem_status : 2,
            created_at:response?.data?.data?.created_at
          }
        ))
        
        // navigate('/handlePayment',{state:{status:'pending',message:response?.data?.message,id:offerId}})
      }
      else if(response?.data?.status === 403){
        setIsloading(false);
        setPaymnetStatus('failure')
        setPaymnetMessage(response?.data?.message)
        setTimeout(()=>{
          setPaymnetStatus('')
        },2000)
        // navigate('/handlePayment',{state:{status:'failure',message:response?.data?.message,id:offerId}})
      }
      else{
        if(!modal){
        setModal('failed')
        setErrmessage(response.data?.message)
        setIsloading(false);
        }
      }
    })
    .catch((e) => {console.log("err", e); setIsloading(false);});
    setIsloading(false);
    }

  },[]);

  useEffect(() => {
      setIsloading(true)
      if(offerId){
        console.log("offid1",offerId)
      makeApiCallWithAuth('getOfferDetails',{offer_id: offerId})
      .then((response) => {
        console.log(response.data)
          if (response.data?.data) {
            setOfferDeets(response.data.data[0])
            setProductDeliverable(response.data.data[0]?.offer_format == 2)
            setTnc(response.data.data[0]?.tnc?.split("\r\n"))
            sessionStorage.setItem('product_pic', response.data.data[0]?.product_pic)
            sessionStorage.setItem('coupon',JSON.stringify(response.data.data[0]))
            var c = response.data.data[0].up_color.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709        
            if(luma < 200) {setLuma(true)}
            setIsloading(false)
          }
      })
      .catch((e) => console.log("err", e))
    
    }
    else{
      console.log("offid2",offerId)
      if (token) {
        sessionStorage.setItem('token', token)
      }

      if (token || sessionId) {
        const data = {
          applicationId: "pwa1",
          token: token ? token : '',
          virtualId: virtualId ? virtualId : '',
          SessionId: sessionId ? sessionId : '',
          bName: bankName ? bankName : '',
          deviceType: "WEB",
          GenerateSessionInfo: sessionId ? true : false,
        }
        makeApiCall('validateToken', data)
        .then((response) => {
        if(sessionId){
          if(response.data?.data[0]?.token){
            sessionStorage.setItem('token', response.data.data[0].token)
            window.location.reload();
          }
          else if(!sessionStorage.getItem('token')){
            if(!modal){
              setModal('failed')
              setSessionmsg('Invalid Session!')
              setErrmessage('Please try again.')
            }
          }
          }
          if(token){
            if(!response.data?.data[0]?.token){
              sessionStorage.setItem('token','')
              if(!modal){
                setModal('failed')
              }
            }
          }
        })
        .catch((e) => console.log("err", e))
        setIsloading(false)
      }
      else{
        if(!sessionStorage.getItem('token')){
          if(!modal){
            setModal('failed')
          }
        }
      }
      let offerkey = window.location.pathname.split("/").pop()

      if(offerkey !=='product'){
      sessionStorage.setItem('id', offerkey)}

      if(hdnRefNumber)return
      makeApiCallWithAuth('getOfferDetails',{offer_id: offerkey})
      .then((response) => {
        console.log(response.data)
          if (response.data?.data) {
            setOfferDeets(response.data.data[0])
            setTnc(response.data.data[0]?.tnc?.split("\r\n"))
            var c = response.data.data[0].up_color.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709        
            if(luma < 200) {setLuma(true)}
          }
      })
      .catch((e) => console.log("err", e))
      

    }
    if(hdnRefNumber)return
    makeApiGetCallWithAuth('GetPWAWalletPoints')
      .then((response) => {
        //console.log(response.data.data.walletPoints)
          if (response.data?.data?.walletPoints) {
            setWalpoints(response.data?.data?.walletPoints)
          }
      })
      .catch((e) => console.log("err", e))
  
  },[]);

  const handlePay = () => {
    const picked = (rewardApplied ? 2 : 1)
    setIsloading(true);
    makeApiCallWithAuth('trackEvent', {event: 3, offer: sessionStorage.getItem('id'), mop: picked})
    .then((response) => {
      console.log("resp",response.data)
    })
    .catch((e) => console.log("err", e))

    makeApiCallWithAuth('validationCheck',{mop: picked, offer_id: sessionStorage.getItem('id'), ...(productDeliverable ? selectedAddress : {})})
    .then((response) => {
      console.log(response?.data?.data?.url)
      if(response?.data?.data?.url){
        let paymenturl = response.data.data.url;
        setIsloading(false);
        window.location.href = paymenturl;
      }
      else if (response?.data?.data?.order_id){
        sessionStorage.setItem('coupon',JSON.stringify(response.data.data))
        setIsloading(false);
        setPaymnetStatus('success')
        setPaymnetMessage(response?.data?.message)
        
        // navigate('/handlePayment',{state:{status:'success',message:response?.data?.message,id:offerId}})
          }
      else if(response?.data?.data?.errorstring === "Failed"){
        setIsloading(false);
        if(!modal){
          setModal('failed')
          setErrmessage('Something Went Wrong')
          setIsloading(false);
          }
      }
      else if(response?.data?.status === 200){
        sessionStorage.setItem('coupon',JSON.stringify(response.data.data))
        setIsloading(false);
        setPaymnetStatus('success')
        setPaymnetMessage(response?.data?.message)
        // navigate('/handlePayment',{state:{status:'success',message:response?.data?.message,id:offerId}})
      }
      else{
        setIsloading(false);
        if(!modal){
          setModal('failed')
          setErrmessage(response.data?.message)
          setIsloading(false);
          }
      }
    })
    .catch((e) => {console.log("err", e);setIsloading(false);})
   
  }

  const handleCloseModal=() => {
    setModal('false')
  }

  const handleClickPay = () => {
    if (selectedAddress?.address || !productDeliverable) {
      setBillingDailog(true);
    } else {
        setAddressError(true)
        setTimeout(() => {
          setAddressError(false);
        }, 3000);
    }
  }

  useEffect (()=>{
    // let price
    
    // if(offerdeets?.offer_type === '2'){
    //   price = (offerdeets?.original_price-((offerdeets?.offer_percentage*offerdeets?.original_price)/100)).toFixed(0)

    // }else{
    //   price = Number(offerdeets?.original_price-offerdeets?.offer_percentage).toFixed(0)
    // }
    let price = offerdeets?.amount
    if (price>=walpoints){
      setRewardAmountApplaied(walpoints)
    }else{
      setRewardAmountApplaied(price)
    }

  },[walpoints,offerdeets])

  const CustomCard = ({icon,iconBg, text, children}) => {
    return(
      <div 
        className={`mt-3 flex justify-between items-center p-3 my-2 border border-gray-300 rounded-2xl shadow-sm bg-white 
         ${ iconBg==='#FCF8De' && rewardApplied ? 'bg-gradient-to-l from-[#C8EEC9] from-[0rem] via-[#EFFAEF] via-[5rem] to-transparent !border-1 !border-[#00B101]' : ''}`}
      >
      {icon && 
      <div className={`p-3 rounded-full`} style={{ backgroundColor: iconBg }}>
      <img src={icon} alt="icon" className="w-8 h-8" />
      </div>
      }
      <p className="flex-1 text-gray-800 font-medium text-lg ml-3">{text}</p>
      <div className='p-2'>
      {children}
      </div>
    </div>
    )
  }

  return (
    <div className='container overflow-y-auto h-screen'>
      {isloading && 
      <div className="spinner-overlay z-30">
          <div className="spinner-container">
          <Spinner  size="lg" classNames={{circle1: "border-b-[#27374D]"  }}/>
          </div>
      </div>
      }
      {offerdeets?.product_name &&
      <>
      <div className="h-[15.5rem] top-0 relative mb-[4.2rem]">
        {luma?
        <img src={Backwhite} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/')}}/>  
        :
        <img src={backdark} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/')}}/>
        }

        <div className='absolute -bottom-5 translate-y-1/2 right-1/2 translate-x-1/2 z-10  flex flex-col items-center'>
          <div className="w-fit bg-tranferent rounded-full p- aspect-square flex items-center shadow-md">
          <img src={offerdeets?.brand_logo} className="w-16" alt="" />
          </div>
          <span className='font-sans font-[600] opacity-80 text-base text-[#000] mt-1 h-5'>{offerdeets?.brand_name}</span>
        </div>
        
        <div className={`absolute w-screen -mt-10 h-72`} style={{ backgroundColor: `${offerdeets?.down_color}`}}>
          <div className={`relative w-screen -mt-10 h-44 rounded-br-[30px]`} style={{ backgroundColor: `${offerdeets?.up_color}`}}></div>
            <div className={`relative w-screen -mt-10 h-44 rounded-bl-[260px] rounded-br-[310px]`} style={{ backgroundColor: `${offerdeets?.up_color}`}}>
            <div className="absolute  left-1/2 -translate-x-1/2 bottom-5">
              <img src={offerdeets?.product_pic} className="w-48 h-48" alt="" />
            </div>
          </div>

        </div>
       
      </div>
      </>
      }
      <h1 className={`text-center w-full font-sans text-2xl font-semibold text-[#000] pt-1`} >{offerdeets?.product_name}</h1>
      
      <div className='text-2xl flex flex-wrap items-center py-1 px-2 justify-center font-semibold'>
      {(Number(offerdeets?.original_price).toFixed(0))>0 &&
      <span className={` font-bold z-10 text-black p1-2`}>
        <span className="line-through opacity-30 text-2xl">₹{ Number(offerdeets?.original_price).toFixed(0)}</span>
      </span>
      }
      <div className="flex justify-center w-fit px-2 bg-white text-xl">
        {(offerdeets?.offer_type === '2')?
          <span className="text-[#009A2B] font-bold ">Get for {Math.round(offerdeets?.offer_percentage)}% OFF</span>
          :
          <span className="text-[#009A2B] font-bold ">Get for {Math.round(offerdeets?.offer_percentage)} OFF</span>
        }
      </div>
      <span className='text-black w-full text-center font-bold text-3xl mt-1'>₹{offerdeets?.amount}</span>
       {/* <span className='text-black w-full text-center font-bold text-2xl px-2'>
      {(offerdeets?.offer_type === '2')?
        <span>₹{(offerdeets?.original_price-((offerdeets?.offer_percentage*offerdeets?.original_price)/100)).toFixed(0)}</span>
        :
        <span>₹{Number(offerdeets?.original_price-offerdeets?.offer_percentage).toFixed(0)}</span>
        }
      </span> */}
      </div>
      <div className="px-3 pt-1 rounded-t-2xl bg-[#F9F9F9]" style={{ height: `calc(100vh - 450px)` }}>
        <CustomCard 
          icon={voucher} 
          iconBg='#e6f5fd' 
          text={coupon.code ?
            <div className='flex flex-col'>
              <p className='flex-1 text-gray-800 font-medium text-lg'>"{coupon.code}" applied</p>
              {coupon?.discount && (
                <>
                  <p className='text-sm'>
                    <span className='text-[#00B102]'>Saved {coupon?.discount}</span> on this order
                  </p>
                </>
              )}
          </div>
             : 
             'Apply Coupon Code'
            } 
        >
          {coupon.code ? 
          <span className='text-[#EA655E] text-lg' onClick={()=>setCoupon({})}>Remove</span>
          :
          <Button className='bg-white border-none shadow-none w-fit p-0'><img src={backdark} className='rotate-180 w-3'></img></Button>
          }
        </CustomCard>
        <CustomCard icon={coin} iconBg='#FCF8De' 
        text={
          <div className='flex flex-col'>{console.log(selectedAddress)}
              <p className='flex-1 text-gray-800 font-medium text-lg'>Use Rewards</p>
              {walpoints>=0 && (
                <>
                  <p className='text-sm'>
                  Available balance { walpoints}
                  </p>
                </>
              ) }
          </div>
        }
        >
          <Switch
          disabled = {rewardAmountApplaied === 0}
          checked={rewardApplied}
          onClick={()=>setRewardApplied((pre)=>!pre)}
          id="custom-switch-component"
          ripple={false}
          className="h-full w-full checked:bg-[#2ec946]"
          // containerProps={{
          //   className: "w-11 h-6",
          // }}
          // circleProps={{
          //   className: "before:hidden left-0.5 border-none",
          // }}
        />
        </CustomCard>
        {( productDeliverable ) &&
          <CustomCard 
          icon={packageIcon} 
          iconBg='#FCF7DF' 
          text={
            <div className='flex flex-col'>{console.log(selectedAddress)}
              <p className='flex-1 text-gray-800 font-medium text-lg'>Delivering to</p>
              {selectedAddress?.address ? (
                <>
                  <p className='text-sm'>
                    {selectedAddress?.address}, 
                    {selectedAddress?.city}
                  </p>
                </>
              ) : (
                <p className='text-sm text-gray-500'>No address selected</p>
              )}
            </div>
          }
        >
          <Button  onClick={()=>{setOpenSelect(true)}} className='bg-white border-none shadow-none w-fit p-0'><img src={backdark} className='rotate-180 w-3'></img></Button>
        </CustomCard>
        }
        {addresserror &&
          <p className=' text-red-600  p-1 rounded-md my-1 -mt-1 text-sm pl-2'>Please select an address.</p>
        }
        
        <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-3 p-2 pb-2 bg-[#FFFFFF]">
          <div className="text-[#000] text-xl font-medium tracking-wide pl-2 py-3">Details</div>
          <div className="list-decimal text-[#000] text-sm font-normal pl-2">
            <ul className="pl-5 list-decimal font-sans">
            <li className="pb-3">Avail the deal by redeeming your points</li>
            <li className="pb-3">You will get a coupon code.</li>
            <li className="pb-3">Click on 'Redeem Now' and you will be redirected to the brand website</li>
            <li className="pb-3">Add product to cart and apply the coupon code during checkout.</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-3 p-2 pb-2 bg-[#FFFFFF]">
          <div className="text-[#000] text-xl font-medium tracking-wide pl-2 py-3">Terms and Conditions</div>
          <div className="text-[#000] text-sm font-normal pl-2">
            {tnc &&
            <div>
              <ul className="pl-5 list-decimal text-[#000] text-sm font-normal font-sans">
                {tnc.slice(0, showAll ? tnc.length : 3).map((tn, index) => (
                  <li key={index} className="pb-3">{tn}</li>
                ))}
              </ul>
        
              {tnc.length > 3 && (
                <button 
                  onClick={() => setShowAll(!showAll)} 
                  className="text-[#019EEC] text-lg font-medium mt-2"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              )}
            </div>
            }
          </div>
        </div>
        <div className="py-20"></div>
          <div className="fixed bottom-0 left-0 w-full p-2 bg-white flex flex-row justify-between z-10 border border-t-4 h-fit rounded-t-2xl">
          <div className='flex flex-col justify-center '>
            <span className="font-bold line-through pr-2 opacity-40">₹{ Number(offerdeets?.original_price).toFixed(0)}</span>
            <div className="flex text-2xl font-bold w-fit text-[#000] bg-white">
            {/* {(offerdeets?.offer_type === '2')?
              <span>₹ {(offerdeets?.original_price-((offerdeets?.offer_percentage*offerdeets?.original_price)/100)).toFixed(0)-(rewardApplied ? rewardAmountApplaied : 0)}</span>
              :
              <span>₹ {Number(offerdeets?.original_price-offerdeets?.offer_percentage).toFixed(0)-(rewardApplied ? rewardAmountApplaied : 0)}</span>
            } */}
            {(offerdeets?.offer_type === '2')?
              <span>₹ {offerdeets?.amount-(rewardApplied ? rewardAmountApplaied : 0)}</span>
              :
              <span>₹ {offerdeets?.amount-(rewardApplied ? rewardAmountApplaied : 0)}</span>
            } 
            <img src={paymentNext} className='pl-4'></img>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full p-2 bg-white flex flex-row justify-between z-10 border border-t-4 h-fit rounded-t-2xl">
          <div className='flex flex-col justify-center '>
            {(Number(offerdeets?.original_price).toFixed(0))>0 &&
              <span className="font-bold line-through pr-2 opacity-40">₹{ Number(offerdeets?.original_price).toFixed(0)}</span>
            }
            <div className="flex text-2xl font-bold w-fit text-[#000] bg-white">
            {(offerdeets?.offer_type === '2')?
              <span>₹ {offerdeets?.amount-(rewardApplied ? rewardAmountApplaied : 0)}</span>
              :
              <span>₹ {offerdeets?.amount-(rewardApplied ? rewardAmountApplaied : 0)}</span>
            } 
            <img onClick={handleClickPay} src={backdark} className='rotate-180 ml-4'></img>
            </div>
          </div>
          <div className=''>
            <Button onClick={handlePay} className="w-full bg-buttonBg text-lg font-medium capitalize">
            Pay Now
            </Button>
          </div>
          </div>
          </div>
      </div>

    <Dialog
            size="xs"
            open={modal === 'success'}
            //handler={handleCloseModal}
            className="bg-red shadow-none flex self-center w-auto"
        >
            <Card className="border-1 border-slate-200 w-full">
                <CardBody className="flex flex-col gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 -top-4 bg-lime-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center">
                            <img src={rightSign} alt="Right Sign" />
                        </div>
                    </div>

                    <Typography variant="h5" color="blue-gray" className="text-center mt-5">
                        Awesome!
                    </Typography>
                    <div className="text-gray-600 font-medium text-center">Your Booking has been Confirmed
                        </div>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" color="bg-lime-500" className="bg-lime-500 text-white" onClick={handleCloseModal} fullWidth>
                        OK
                    </Button>
                </CardFooter>
            </Card>
    </Dialog>
    <Dialog
        size="xs"
        open={modal === 'failed'}
        handler={handleCloseModal}
        className="bg-red shadow-none flex self-center w-auto"
    >
        <Card className="border-1 border-slate-200 w-full">
            <CardBody className="flex flex-col gap-6">
                <div className="relative">
                    <div className="h-20 w-20 -top-4 bg-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center pb-2">
                        <img src={wrongSign} alt="Wrong Sign" />
                    </div>
                </div>

                <Typography variant="h5" color="blue-gray" className="text-center mt-5">
                    {sessionmsg?sessionmsg:'Transaction Failed!'}
                </Typography>
                <div className="text-gray-600 font-medium text-center">{errmessage?errmessage:'Something went wrong. Please try again.'}
                    </div>
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="gradient" color="bg-red-500" className="bg-red-500 text-white"  onClick={handleCloseModal} fullWidth>
                    OK
                </Button>
            </CardFooter>
        </Card>
    </Dialog>

    <CouponDialog open={couponDailog} setOpen={setCouponDailog} setCoupon={setCoupon}></CouponDialog>
    <AddressDialogs 
        openAdd={openAdd} 
        setOpenAdd={setOpenAdd} 
        openSelect={openSelect} 
        setOpenSelect={setOpenSelect} 
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
    />
    <BillingDetailsDialog 
    setIsLoading = {setIsloading}
    handlePay = {handlePay}
    // data={{
    //   rewardApplied : 
    //   rewardApplied ? rewardAmountApplaied : 0,
    //   original_price: offerdeets?.original_price,
    //   discounted_price: 
    //     offerdeets?.offer_type !== '2'
    //       ? Number(offerdeets?.original_price - offerdeets?.offer_percentage).toFixed(0)
    //       : Number(offerdeets?.original_price - ((offerdeets?.offer_percentage * offerdeets?.original_price) / 100)).toFixed(0)
    // }} 
    data={{
      rewardApplied : 
      rewardApplied ? rewardAmountApplaied : 0,
      original_price: offerdeets?.amount,
      discounted_price: offerdeets?.amount-0
        // offerdeets?.offer_type !== '2'
        //   ? Number(offerdeets?.original_price - offerdeets?.offer_percentage).toFixed(0)
        //   : Number(offerdeets?.original_price - ((offerdeets?.offer_percentage * offerdeets?.original_price) / 100)).toFixed(0)
      
    }} 
      open={billingDailog} onClose={() => setBillingDailog(false)} 
    />
    {paymentStatus &&
    <PaymentErrorHandler status={paymentStatus} message={paymentMessage} id={offerId}></PaymentErrorHandler>
    }
    </div>
  )
}

export default Product
