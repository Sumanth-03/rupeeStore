import React, {useEffect, useState} from 'react'
import SearchInput from '../../Components/SearchInput/SearchInput'
import Search from '../../Assets/search1.svg'
import Coupon from '../../Assets/my_coupon1.svg'
import Allbrands from '../../Assets/allicon.png'
import Grocery from '../../Assets/Grocery.svg'
import laptop from '../../Assets/laptop.png'
import backdark from '../../Assets/back_dark1.svg'
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, Spinner, Button, Dialog, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react'
import { useNavigate, Link } from 'react-router-dom'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth } from '../../Services/Api' 
import {isMobile} from 'react-device-detect';
import wrongSign from '../../Assets/wrongSign.svg'
import "./style.css"
import offerBg from '../../Assets/offferBg.svg'

import {jwtDecode} from 'jwt-decode';

const data = [
  {
    label: "All ",
    value: "html",
    image: Allbrands,
    desc: `It really matters and then like it really doesn't matter.
    What matters is the people who are sparked by it. And the people 
    who are like offended by it, it doesn't matter.`,
  },
  {
    label: "Grocery",
    value: "react",
    image: Grocery,
    desc: `Because it's about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  },
  {
    label: "Groccery",
    value: "reaxct",
    image: Grocery,
    desc: `Because it'ss about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  },
  {
    label: "Laptops",
    value: "vue",
    image: laptop,
    desc: `We're not always in the position that we want to be at.
    We're constantly growing. We're constantly making mistakes. We're
    constantly trying to express ourselves and actualize our dreams.`,
  },
  {
    label: "Mobiles",
    value: "angular",
    image: Grocery,
    desc: `Because it's about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  },
  {
    label: "Music",
    value: "svelte",
    image: laptop,
    desc: `We're not always in the position that we want to be at.
    We're constantly growing. We're constantly making mistakes. We're
    constantly trying to express ourselves and actualize our dreams.`,
  },
  {
    label: "Musiic",
    value: "sveate",
    image: laptop,
    desc: `We're nots always in the position that we want to be at.
    We're constantly growing. We're constantly making mistakes. We're
    constantly trying to express ourselves and actualize our dreams.`,
  },
];

function Home() {

  const [searchopen, setSearchopen] = useState(false)
  const [secondleg, setSecondleg] = useState(false);
  const [alloffers, setAlloffers] = useState([]);
  const [luma, setLuma] = useState(true)
  const [allCategories, setAllCategories] = useState([]);
  const [filterCat, setFilterCat] = useState([]);

  const [bannerfile, setBannerfile] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [modal, setModal] = useState('')
  const [bannerscroll, setBannerscroll] = useState(false);
  const [bannerscroll2, setBannerscroll2] = useState(false);
  const [apiscroll, setApiscroll] = useState(false);
  const [activeTab, setActiveTab] = React.useState(1);
  const [isloading, setIsloading] = useState(false)

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const sessionId = queryParams.get('sessionid');
  const virtualId = queryParams.get('virtualid');
  const bankName = queryParams.get('bankName');

  if (token) {
    sessionStorage.setItem('token', token)
  }

  useEffect(() => {
    if(!sessionStorage.getItem('refferer')){
      sessionStorage.setItem('refferer', document.referrer)
    }
  },[]);

  useEffect(() => {
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
        console.log("resp",response.data)
        if(sessionId){
        if(response.data?.data[0]?.token){
          sessionStorage.setItem('token', response.data.data[0].token)
          window.location.reload();
          
        }
        else if(!sessionStorage.getItem('token')){
          if(!modal){
            setModal('failed')
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
  },[]);

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      setIsloading(true);

      makeApiGetCallWithAuth('getBanner')
        .then((response) => {
          console.log(response.data)
            if (response.data?.data) {
              setBannerfile(response.data.data[0])
            }
        })
        .catch((e) => console.log("err", e))

      makeApiGetCallWithAuth('getOffers')
        .then((response) => {
          console.log(response.data)
          setIsloading(false);
            if (response.data?.data) {
              setAlloffers(response.data.data)
              setFilterValue(response.data.data)
              
            }
        })
        .catch((e) => {console.log("err", e);setIsloading(false);})

      makeApiGetCallWithAuth('getCategories')
        .then((response) => {
          console.log(response.data)
            if (response.data?.data) {
              setAllCategories(response.data.data)
            }
        })
        .catch((e) => console.log("err", e))
    }
  },[]);

  
  useEffect(() => {
    if(filterValue){
      const filterCategory = allCategories?.filter((item) => {  
          return filterValue.some(t => t.offer_category === item.id)
      })
      //console.log("filterCategory", filterCategory)
      setFilterCat(filterCategory)
    }
  },[filterValue, allCategories]);

  let decoded = '';
  const Token = token || sessionStorage.getItem("token");

  try {
    if (Token && typeof Token === "string" && Token.trim() !== "") {
      decoded = jwtDecode(Token);
    } else {
      decoded = null;
    }
  } catch (error) {
    decoded = null; 
  }

  const handleChange = (data) => {
    const filterBySearch = alloffers?.filter((item) => { 
        if (item.product_name.toLowerCase() 
            .includes(data.toLowerCase()) || item.brand_name
        .toLowerCase() 
        .includes(data.toLowerCase())) { return item; } 
    }) 
    setFilterValue(filterBySearch);
  }
  
  const onLinkClick = (currentid) => {
    sessionStorage.setItem('id',currentid);

    makeApiCallWithAuth('trackEvent', {event: 2, offer: currentid})
    .then((response) => {
      console.log("resp",response.data)
    })
    .catch((e) => console.log("err", e))
    //navigate('/product');
  }

  const lumaCalculate = (color) => {
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue
    
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709        
    return luma
    if(luma < 200) {setLuma(true)}
  }

  const handleCloseModal=() => {
    setModal('false')
    navigate('/exitpwa')
  }

  const handleScroll = (event) => {
       if(event.target.scrollTop.toFixed() > 160 && !bannerscroll2){
        setBannerscroll2(false)
          if(!apiscroll){
            makeApiCallWithAuth('trackEvent', {event: 1 })
              .then((response) => {
                console.log("resp",response.data)
              
              })
              .catch((e) => console.log("err", e))
                  setApiscroll(true)
                }
          }
          else{
            setBannerscroll2(false)
          }
     };
     const handleScroll2 = (event) => {
      if(event.target.scrollTop.toFixed() < 1){
         setBannerscroll2(true)
     }
     else{
      //setBannerscroll(true)
     }
    };

    const items = filterValue.filter((item)=>{
      return item.offer_category===activeTab
    })

  return (
    <Tabs value={activeTab} className="w-full">
    <div id="parent" className={`container max-w-full relative`} onScroll={handleScroll} style={{ height: `calc(100vh - 10px)` , overflow: 'auto'}}>
      <div className="sticky top-0 z-30 grid grid-rows-1 grid-cols-12 grid-flow-col gap-1 h-16 bg-white rounded-b-xl border-b-1">

        <div className="row-span-1 row-start-1 col-start-1 col-span-5 self-center z-10 pl-2 flex justify-start pt-1" >
          {isMobile?
          <Link to='/exitpwa'><img src={backdark} className="h-6 w-full mt-1" alt=""/> </Link>
          : 
          <Link to={sessionStorage.getItem('refferer')}><img src={backdark} className="h-6 w-full mt-1" alt=""/> </Link> 
          }
          <div className="row-span-1 row-start-1 items-center text-slate-700 text-2xl font-semibold flex justify-start pl-2">Hot Deals </div>
        </div>
        
        <div className="row-span-1 col-start-6 col-span-8 flex items-center justify-end pr-3 gap-3">
          {searchopen &&
              <div className='col-span-6 w-full pt-0.5'>  
                <SearchInput handleChange={handleChange}/>
              </div>
          }
          {filterValue?.length > 50 && <img src={Search} alt="search" onClick={()=>{setSearchopen(!searchopen)}}/>}
          <div className="flex">
          {!searchopen && <div className='border-2  rounded-full p-1.5 border-[#27374D] font-semibold' onClick={()=>{navigate('/coupons')}}>My Deals</div>}
          </div>
        </div>
      </div>
        
    <div className="px-3 bg-transparent">
        
      <div className={`h-40  rounded-3xl flex pb-2 justify-center ${isloading?'animate-pulse bg-green-100':'bg-white'}`}>
        {bannerfile && 
        (bannerfile?.banner_click_link === '0') ?
        <img src={bannerfile?.file_data} className="animate-none rounded-3xl w-96" alt="" />
        :
        <Link to={'/exitpwa?launch='+bannerfile?.banner_click_link}><img src={bannerfile?.file_data} className="animate-none rounded-3xl w-96" alt="" />
        </Link>
        }
      </div>
      <TabsHeader
        className="flex rounded-none bg-transparent p-0 overflow-x-auto pt-2"
        indicatorProps={{
          className:
            "text-black bg-transparent border-2 border-black  rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_4px_10px_rgba(0,0,0,0.1)]",
        }}
      >
        <Tab
            key={1}
            value={1}
            onClick={() => setActiveTab(1)}
            className={activeTab === 1 ? "text-slate-700 text-xs font-normal" : "mb-[10px] text-slate-300 opacity-80 text-xs font-normal"}
          >
            <div className={`${activeTab !== 1 ? 'shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_4px_10px_rgba(0,0,0,0.1)]':''} p-2 px-4 rounded-xl w-[120px]`}>
              <span className="text-black font-medium text-base">View all</span>
            </div>
          </Tab>
        {filterCat.map(({ category_name, id, file_data }) => (
          <Tab
            key={id}
            value={id}
            onClick={() => setActiveTab(id)}
            className={activeTab === id ? "text-slate-700 text-xs font-normal " : "mb-[10px] text-slate-300 opacity-80 text-xs font-normal "}
          >
            <div className={`${activeTab !== id ? 'shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_4px_10px_rgba(0,0,0,0.1)]': ''} p-2 px-4 rounded-xl w-[120px]`}>
              <span className=" font-medium text-base">{category_name}</span>
            </div>
          </Tab>
        ))}
      </TabsHeader>
        <TabsBody>
        <TabPanel key={1} value={1}>
          <div>
          <div className={`bg-white -mx-5 -my-5 px-2 pt-3 -translate-y-2 z-50`} onScroll={handleScroll2} >
            { isloading?
            <div className='flex self-center p-10 justify-center'>
            <Spinner  size="lg" classNames={{circle1: "border-b-[#27374D]" }}/>
            </div>
            :
           <div className="grid grid-cols-2 gap-2 place-items-center">
            {filterValue &&
            filterValue.sort((a, b) => (a.dealRank > b.dealRank) ? 1 : -1).map((offer) =>
            <>
            {(offer?.offer_category) &&
            <Link onClick={()=>{onLinkClick(offer.id)}} to={'/product/'+offer.id}>
            <div className="relative flex justify-center">
              <div className={`h-60 w-11/12 rounded-lg border border-gray-300 flex justify-center overflow-clip`} style={{ backgroundColor: `${offer?.down_color}`}}>
              <div className="absolute top-0 z-10 rounded-full"><img src={offer?.brand_logo} className="p-1 w-16 h-16" alt="logo" /></div>
              <div className="absolute top-14 h-12 w-10/12 flex justify-center"><span className={`font-bold leading-none line-clamp-2 z-10 flex self-center text-center pb-1 ${(offer?.product_name.length > 13)?'text-base ':'text-lg'} ${(lumaCalculate(offer?.up_color) < 200)?'text-white':'text-black'}`}>{offer?.product_name}</span></div>
              <div className={`absolute z-10 ${(offer?.product_name.length < 16)?'top-24':'top-24'}`}>
              <div className="z-10 flex justify-center w-fit h-7 rounded-lg px-2 px-4 relative">
              {(offer?.offer_type === '2')?
              <span className="z-10 relative text-[#27374D] font-semibold text-sm p-1">{offer?.uptoflat === "1"?'UP TO':'FLAT'} { Math.round(offer?.offer_percentage)}% OFF</span>
              :
              <span className="z-10 relative text-[#27374D] font-semibold text-sm p-1">{offer?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(offer?.offer_percentage)} OFF</span>
              }
              <img className='z-0 absolute w-full h-full' src={offerBg}></img>
              </div>
              </div>
              <div className={`relative w-44 h-48 `} >
              <div className={`absolute w-60 h-48 rounded-bl-[120px] rounded-br-[120px] rounded-tl-[8px] rounded-tr-[8px] left-[50%] -translate-x-1/2`} style={{ backgroundColor: `${offer?.up_color}`}}>
              </div>
              <div className="absolute -bottom-11 right-0">
                <img src={offer?.product_pic} className="w-28 h-28" alt="product_img" /> 
              </div>
              </div>
              </div>
            </div>
            </Link>
            }
            </>
            )}
            </div>
          }
            <div className="py-28"/>
            </div>
          </div>
          </TabPanel>
            
          {activeTab !== 1 && filterCat.map(({ id, desc }) => (
          <TabPanel key={id} value={id} style={{ height: `calc(${items.length*250}px)`}}>
            <div className={`bg-white -mx-5 -my-5 px-2 pt-3 }`} onScroll={handleScroll2} style={{ height: `calc(100vh - 110px)` }}>
              <div className="grid grid-cols-2 gap-2 place-items-center overflow-hidden">
              {filterValue &&
              filterValue.sort((a, b) => (a.dealRank > b.dealRank) ? 1 : -1).map((offer) =>
                <>
                {(offer?.offer_category === id && (offer?.id !== '78' || decoded?.bankName === 'BOB')) &&
                 <Link onClick={()=>{onLinkClick(offer.id)}} to={'/product/'+offer.id}>
                 <div className="relative flex justify-center">
                   <div className={`h-60 w-11/12 rounded-lg border border-gray-300 flex justify-center overflow-clip`} style={{ backgroundColor: `${offer?.down_color}`}}>
                   <div className="absolute top-0 z-10 rounded-full"><img src={offer?.brand_logo} className="p-1 w-16 h-16" alt="logo" /></div>
                   <div className="absolute top-14 h-12 w-10/12 flex justify-center"><span className={`font-bold leading-none line-clamp-2 z-10 flex self-center text-center pb-1 ${(offer?.product_name.length > 13)?'text-base ':'text-lg'} ${(lumaCalculate(offer?.up_color) < 200)?'text-white':'text-black'}`}>{offer?.product_name}</span></div>
                   <div className={`absolute z-10 ${(offer?.product_name.length < 16)?'top-24':'top-24'}`}>
                   <div className="z-10 flex justify-center w-fit h-7 rounded-lg px-2 px-4 relative">
                   {(offer?.offer_type === '2')?
                   <span className="z-10 relative text-[#27374D] font-semibold text-sm p-1">{offer?.uptoflat === "1"?'UP TO':'FLAT'} { Math.round(offer?.offer_percentage)}% OFF</span>
                   :
                   <span className="z-10 relative text-[#27374D] font-semibold text-sm p-1">{offer?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(offer?.offer_percentage)} OFF</span>
                   }
                   <img className='z-0 absolute w-full h-full' src={offerBg}></img>
                   </div>
                   </div>
                   <div className={`relative w-44 h-48 `} >
                   <div className={`absolute w-60 h-48 rounded-bl-[120px] rounded-br-[120px] rounded-tl-[8px] rounded-tr-[8px] left-[50%] -translate-x-1/2`} style={{ backgroundColor: `${offer?.up_color}`}}>
                   </div>
                   <div className="absolute -bottom-11 right-0">
                     <img src={offer?.product_pic} className="w-28 h-28" alt="product_img" /> 
                   </div>
                   </div>
                   </div>
                 </div>
                 </Link>
                }
                </>
              )}
              </div>
                <div className="py-28"/>
            </div>
          </TabPanel>
        ))}
        </TabsBody>
      </div>
    </div>

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
                {'Invalid Session!'}
            </Typography>
            <div className="text-gray-600 font-medium text-center">
              Please try again.
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" color="bg-red-500" className="bg-red-500 text-white"  onClick={handleCloseModal} fullWidth>
                EXIT
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </Tabs>
  )
}

export default Home
