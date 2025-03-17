import React, {useEffect, useState} from 'react'
import backdark from '../../Assets/back_dark1.svg'
import myntralogo from '../../Assets/myntralogo.png'
import nyka from '../../Assets/nyka.png'
import Line from '../../Assets/Line.svg'
import scissor from '../../Assets/scissor.svg'
import move from '../../Assets/move.svg'
import clipboard from '../../Assets/clipboard.svg'
import { useNavigate, Link } from 'react-router-dom'
import { makeApiGetCallWithAuth } from '../../Services/Api'
import { Spinner } from '@material-tailwind/react'
import emptyoutlet from '../../Assets/emptyoutlet.svg'


function Mycoupon() {

  const [alloffers, setAlloffers] = useState([]);

  const [isloading, setIsloading] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    setIsloading(true)
    makeApiGetCallWithAuth('getMyOffers')
    .then((response) => {
      setIsloading(false)
      if (response.data?.data) {
        setAlloffers(response.data.data)
      }
     })
     .catch((e) => {console.log("err", e); setIsloading(false)})

  },[])

  const onLinkClick = (currentoffer) => {
    sessionStorage.setItem('coupon',JSON.stringify(currentoffer))
  }

return(

    <div className='container max-w-full'>
      <div className="sticky top-0 z-30 grid grid-rows-2 grid-cols-12 grid-flow-col gap-1 h-16 bg-white rounded-b-xl border-b-1">
       <div className="row-span-2 row-start-1 col-start-1  col-span-7 items-center flex justify-start pl-3">
        <img src={backdark} className="" alt="backdark" onClick={()=>{navigate('/')}} />
        <div className="text-[#27374D] text-xl font-medium pl-3">My Deals</div>
        </div>
      </div>

      <div className="px-3 overflow-scroll" style={{ height: `calc(100vh - 50px)` }}>
      { isloading?
            <div className='flex self-center p-10 justify-center'>
            <Spinner  size="lg" classNames={{circle1: "border-b-[#27374D]"  }}/>
            </div>
            :
            <>
      
      {alloffers?.length > 0 ?
            alloffers.slice(0).reverse().map((offer) =>
      <>
      <Link onClick={()=>{onLinkClick(offer)}} to='/couponinfo'>
      <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-md h-fit mt-3 mb-2 flex">
      <div className="w-28 h-32 border-[#D9D9D9] border-2 m-2 rounded-md flex justify-center">
      <div className="flex self-center p-2">
      <img src={offer?.coupon_page_logo} className="" alt="logo" />
      </div>
      </div>
      <img src={Line} className="ml-2" alt="line" />
      <img src={scissor} className="mt-5 -ml-2 h-5 z-10 " alt="line" />

      <div className="pl-3 pt-2">
      {(offer?.offer_type === '2')?
      <div className="text-[#021555] text-lg font-medium tracking-wide">{offer?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(offer.offer_percentage)}% Off</div>
      :
      <div className="text-[#021555] text-lg font-medium tracking-wide">{offer?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(offer.offer_percentage)} Off</div>
      }
      <div className="opacity-60 text-[#021555] text-sm font-normal leading-snug tracking-wide">On min. purchase of ₹{offer.min_order} </div>
      <div className="flex pt-2"><div className="text-[#021555] text-opacity-70 text-sm font-normal leading-snug tracking-wide">Code: <span className="text-[#021555] text-opacity-70 text-sm font-semibold leading-snug tracking-wide">{offer.redeem_code}</span></div><div>{(offer?.redeem_code !== 'pending') && <img src={clipboard} className="pl-1 -mt-1 h-5 z-30" alt="clipboard" onClick={() => {navigator.clipboard.writeText(offer.redeem_code)}}/>}</div></div>
      <div><span className="text-[#021555] text-opacity-70 text-sm font-normal leading-snug tracking-wide">Expiry: </span><span className="text-[#021555] text-opacity-70 text-sm font-semibold leading-snug tracking-wide">{new Date(offer.offer_validity).toUTCString().slice(4,16)}</span></div>
      <div className="flex pt-1"><div className="text-[#27374D] text-lg font-normal leading-snug tracking-wide">View Coupon</div><div><img src={move} className="mt-1.5 pl-1 h-3.5" alt="move" /></div></div>
      </div>
      </div>
      </Link>
      </>
      )
      :
      <>
      <div className="flex self-center justify-center ">
      <img className="px-32 pt-40" src={emptyoutlet}/>
      </div>
      <h1 className="flex self-center pt-5 text-gray-400 justify-center pb-5 text-center">You Have No Active Deals To Avail Great Discounts!</h1>
      <div className='flex self-center justify-center'><div className='flex self-center justify-center border-2 rounded-full p-1.5 border-[#27374D] font-semibold w-80' onClick={()=>{navigate('/')}}>Explore Now</div></div>
      </>
      }
      </>
      }
      </div>
      </div>
)}

export default Mycoupon

