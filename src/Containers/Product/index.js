import React, {useEffect, useState} from 'react'
import Backwhite from '../../Assets/back_white1.svg'
import backdark from '../../Assets/back_dark1.svg'
import { Button, Spinner, Dialog, Card, CardBody, CardFooter, Typography, Switch } from '@material-tailwind/react'
import { useNavigate, Link} from 'react-router-dom'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth } from '../../Services/Api' 
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

  const [couponDailog, setCouponDailog] = useState(false)
  const [addresserror, setAddressError] = useState(false)
  const [billingDailog, setBillingDailog] = useState(false)
  const [openAdd, setOpenAdd] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('');
  const [productDeliverable, setProductDeliverable] = useState(true);
  const [rewardApplied,setRewardApplied] = useState(false)
  const navigate = useNavigate();
  const offerId = sessionStorage.getItem('id');
  const queryParams = new URLSearchParams(window.location.search);
  const hdnRefNumber = queryParams.get('hdnRefNumber');
  const transactionId = queryParams.get('transactionId');
  const amount = queryParams.get('amount');

  const token = queryParams.get('token');
  const sessionId = queryParams.get('sessionid');
  const virtualId = queryParams.get('virtualid');
  const bankName = queryParams.get('bankName');
  
  useEffect(() => {
  if(hdnRefNumber && !modal && !isloading){
    setIsloading(true);
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
       //setPaymentStatus('sucess')
       //setModal('success')
      }
      else{
        if(!modal){
        setModal('failed')
        setErrmessage(response.data?.message)
        setIsloading(false);
        }
      }
    })
    .catch((e) => {console.log("err", e); setIsloading(false);})
    }
  },[]);

  useEffect(() => {
    if(offerId){
      console.log("offid1",offerId)
    makeApiCallWithAuth('getOfferDetails',{offer_id: offerId})
    .then((response) => {
      console.log(response.data)
        if (response.data?.data) {
          setOfferDeets(response.data.data[0])
          setProductDeliverable(response.data.data[0]?.offer_format == 2)
          setTnc(response.data.data[0]?.tnc.split("\r\n"))
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
    }
    else{
      if(!sessionStorage.getItem('token')){
        if(!modal){
          setModal('failed')
        }
      }
    }
    let offerkey = window.location.pathname.split("/").pop()
    sessionStorage.setItem('id', offerkey)
    makeApiCallWithAuth('getOfferDetails',{offer_id: offerkey})
    .then((response) => {
      console.log(response.data)
        if (response.data?.data) {
          setOfferDeets(response.data.data[0])
          setTnc(response.data.data[0]?.tnc.split("\r\n"))
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
   
   makeApiGetCallWithAuth('GetPWAWalletPoints')
    .then((response) => {
      //console.log(response.data.data.walletPoints)
        if (response.data?.data?.walletPoints) {
          setWalpoints(response.data?.data?.walletPoints)
        }
    })
    .catch((e) => console.log("err", e))

  },[]);

  const handlePay = (picked) => {
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
      else if(response?.data?.data?.errorstring === "Failed"){
        setIsloading(false);
        if(!modal){
          setModal('failed')
          setErrmessage('Something Went Wrong')
          //setIsloading(false);
          }
      }
      else if(response?.data?.status === 200){
        sessionStorage.setItem('coupon',JSON.stringify(response.data.data))
        setIsloading(false);
        navigate('/redeem')
      }
      else{
        setIsloading(false);
        if(!modal){
          setModal('failed')
          setErrmessage(response.data?.message)
          //setIsloading(false);
          }
      }
    })
    .catch((e) => {console.log("err", e);setIsloading(false);})
   
  }

  const handleCloseModal=() => {
    setModal('false')
  }

  const handleClickPay = () => {
    if (selectedAddress.address || !productDeliverable) {
      setBillingDailog(true);
    } else {
        setAddressError(true)
        setTimeout(() => {
          setAddressError(false);
        }, 3000);
    }
  }
  const CustomCard = ({icon,iconBg, text, children}) => {
    return(
      <div className={`mt-3 flex justify-between items-center p-3 my-2 border border-gray-300 rounded-2xl shadow-sm bg-white ${ text=== 'Use ₹100 Rewards' && rewardApplied ? 'bg-gradient-to-l from-[#C8EEC9] from-[3rem] via-[#EFFAEF] via-[6rem] to-transparent border-2 border-[#00B10266]' : ''}`}>
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
      <div className="h-[15.5rem] top-0 relative mb-20">
        {luma?
        <img src={Backwhite} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/')}}/>  
        :
        <img src={backdark} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/')}}/>
        }

        <div className='absolute -bottom-5 translate-y-1/2 right-1/2 translate-x-1/2 z-10  flex flex-col items-center'>
          <div className="w-fit bg-white rounded-full p-3 aspect-square flex items-center shadow-lg">
          <img src={offerdeets?.brand_logo} className="w-16" alt="" />
          </div>
          <span className='font-sans font-medium text-base text-customGray mt-2 h-5'>{offerdeets?.brand_name}</span>
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
      {paymentStatus !== 'sucess' &&
      <>
      <h1 className={`text-center w-full font-sans text-2xl font-semibold text-customGray pt-3`} >{offerdeets?.product_name}</h1>
      
      <div className='text-2xl flex flex-wrap items-center py-2 px-2 justify-center font-semibold'>
      <span className={` font-bold z-10 text-black`}>
        <span className="line-through opacity-50">₹{ Number(offerdeets?.original_price).toFixed(0)}</span>
      </span>

      <div className="flex justify-center w-fit px-2 bg-white">
        {(offerdeets?.offer_type === '2')?
          <span className="text-[#009A2B] font-semibold ">Get for {Math.round(offerdeets?.offer_percentage)}% OFF</span>
          :
          <span className="text-[#009A2B] font-semibold ">Get for {Math.round(offerdeets?.offer_percentage)} OFF</span>
        }
      </div>
      
      <span className='text-black w-full pt-2 text-center font-bold text-3xl'>
      {(offerdeets?.offer_type === '2')?
        <span>₹{(offerdeets?.original_price-((offerdeets?.offer_percentage*offerdeets?.original_price)/100)).toFixed(0)}</span>
        :
        <span>₹{Number(offerdeets?.original_price-offerdeets?.offer_percentage).toFixed(0)}</span>
        }
      </span> 
      </div>
      </>
      }
      {paymentStatus === 'sucess' &&
      <>
        <div className='flex flex-col gap-2'>
        <h1 className={`text-center w-full font-sans text-2xl font-semibold text-customGray pt-3`} >{offerdeets?.product_name}</h1>
        { !productDeliverable && 
        <>
          <p className='text-center text-base font-medium text-customGray font-sans '>
            Expires on February 22, 2025
          </p>
          <div className='my-2 mx-3 border-2 border-dashed border-black rounded-full flex flex-row items-center justify-between p-1'>
          <span className='px-3 font-medium text-xl text-customGray'>TF601XVHVJ</span>
          <Button variant='text' className='flex gap-2 items-center'>
            <span className='text-sm font-light'>Copy Code</span>
            <img src={copy}></img>
          </Button>
          </div>
        </>
        
        }
       </div>
        <div className={`relative flex flex-col border rounded-xl p-3 my-2 shadow-md mx-3 ${productDeliverable ? 'mb-12' : 'mb-5'} text-black`}>
          <h1 className='font-semibold text-lg '>Order Details</h1>
          <p className=''>Availed for 1 pts</p>
          <div className='flex font-normal justify-between'>
          <span>Order ID : 22336070437</span>
          <span>1 Nov, 12:05 PM</span>
          </div>
          {productDeliverable && 
          <div className='absolute bottom-0 translate-y-8 flex gap-1'><img src={deleveryTick} className='w-4'></img>Expected delivery date Jan 01, 2025</div>
          }
        </div>
      </>
      }

      <div className="px-3 bg-[#F9F9F9]" style={{ height: `calc(100vh - 450px)` }}>
        {paymentStatus !== 'sucess' &&
        <>
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
          <Button onClick={()=>setCouponDailog(true)} className='bg-white border-none shadow-none w-fit p-0'><img src={backdark} className='rotate-180 w-3'></img></Button>
          }
          </CustomCard>
        <CustomCard icon={coin} iconBg='#FCF8DF' text='Use ₹100 Rewards'>
          <Switch
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
        </>
        }
        {( productDeliverable ) &&
          <CustomCard 
          icon={packageIcon} 
          iconBg='#FCF7DF' 
          text={
            <div className='flex flex-col'>
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
          <Button onClick={()=>{setOpenSelect(true)}} className='bg-white border-none shadow-none w-fit p-0'><img src={backdark} className='rotate-180 w-3'></img></Button>
        </CustomCard>
        }
        {addresserror &&
          <p className=' text-red-600  p-1 rounded-md my-1 -mt-1 text-sm pl-2'>Please select an address.</p>
        }
        
        <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-3 p-2 pb-2 bg-[#FFFFFF]">
          <div className="text-[#021555] text-xl font-medium tracking-wide pl-2 py-3">Details</div>
          <div className="list-decimal text-[#021555] text-sm font-normal pl-2">
            <ul className="pl-5 list-decimal ">
            <li className="pb-1">Avail the deal by redeeming your points</li>
            <li className="pb-1">You will get a coupon code.</li>
            <li className="pb-1">Click on 'Redeem Now' and you will be redirected to the brand website</li>
            <li className="pb-1">Add product to cart and apply the coupon code during checkout.</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-3 p-2 pb-2 bg-[#FFFFFF]">
          <div className="text-[#021555] text-xl font-medium tracking-wide pl-2 py-3">Terms and Conditions</div>
          <div className="text-[#021555] text-sm font-normal pl-2">
            {tnc &&
            <ul className="pl-5 list-decimal ">
              {tnc.map((tn) => 
              <li className="pb-1">{tn}</li>
              )}
            </ul>
            }
          </div>
        </div>

        <div className="py-20"></div>
        {paymentStatus !== 'sucess' && 
        <>
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white flex flex-row justify-between z-10 border border-t-4 h-fit rounded-t-2xl">
          <div className='flex flex-col'>
            <span className="font-bold line-through pr-2 opacity-40">₹{ Number(offerdeets?.original_price).toFixed(0)}</span>
            <div className="flex text-2xl font-bold w-fit text-customGray bg-white">
            {(offerdeets?.offer_type === '2')?
              <span>₹ {(offerdeets?.original_price-((offerdeets?.offer_percentage*offerdeets?.original_price)/100)).toFixed(0)}</span>
              :
              <span>₹ {Number(offerdeets?.original_price-offerdeets?.offer_percentage).toFixed(0)}</span>
            }
            </div>
          </div>
          <div className=''>
            <Button onClick={handleClickPay} className="w-full bg-buttonBg text-lg font-medium capitalize">
              Pay instantly
            </Button>
          </div>
          </div>
        </>
        }
        
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
                    <Button variant="gradient" color="bg-lime-500" className="bg-lime-500 text-white" onClick={()=>{navigate('/redeem')}} fullWidth>
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
    data={{
      original_price: offerdeets?.original_price,
      discounted_price: 
        offerdeets?.offer_type !== '2'
          ? Number(offerdeets?.original_price - offerdeets?.offer_percentage).toFixed(0)
          : Number(offerdeets?.original_price - ((offerdeets?.offer_percentage * offerdeets?.original_price) / 100)).toFixed(0)
    }} 
      open={billingDailog} onClose={() => setBillingDailog(false)} 
    />
  </div>
  )
}

export default Product
