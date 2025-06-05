import { Divider, FormControl, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const category=[
    "Laptop",
    "Gaming Laptop",
    "Gaming Build",
    "Desktop",
    "Desktop Build",
]

const brands=[
    "Dell",
    "HP",
    "Lenovo",
    "Acer",
    "Asus",
    "Apple",
    "MSI",
    "Razer",    
    "Gigabyte",
    "Alienware",
    "Samsung"
]

export const ShopDetails = () => {
return (
    <div className='px-5 lg:px-20 text-left'>
        <section>
            <h3 className='text-gray-500 py-2 mt-10 mb-7'>
                Home/Srilanka/SellX/Matara
            </h3>
            <div>
                <Grid container spacing={2} className='mt-5'>
                    <Grid item xs={12} lg={8}>
                        <img className='w-full h-[60vh] object-cover' src="https://lh3.googleusercontent.com/p/AF1QipNx0_jIVOWBTIQK3JrviTqWTl-uFQlQFZL-wBxU=s1360-w1360-h1020-rw" alt="" />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover' src="https://i.ytimg.com/vi/JyfktkmM9Qk/maxresdefault.jpg" alt="" />
                            </Grid>
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover' src="https://lh3.googleusercontent.com/p/AF1QipOWqPkkZxuYlc489_hfqZZhDOrVefotkYuxz8zT=s1360-w1360-h1020-rw" alt="" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className='pt-3 pb-5'>
                <div className="flex items-center mb-5 mt-5">
                    <img src="https://www.gallelaptop.lk/images/common/company_logo.png" alt="" className="h-17" />
                    <h1 className='text-4xl font-semibold'>- Matara</h1>
                </div>
                <p className='text-gray-500 flex items-center gap-3'>
                    <span>                    
                        Sell-X Computers in Matara is a reputable computer store situated on Kalidasa Road. As part of the Sell-X Computers (Pvt) Ltd. network, established in 2003, the Matara branch offers a comprehensive range of IT products and services. Their inventory includes desktop computers, laptops, printers, computer accessories, office automation products, and CCTV and security solutions. They are also known for their expertise in gaming computers
                    </span>
                </p>
                <p className='text-gray-500 flex items-center gap-3 mt-5'>
                    <LocationOnIcon/>
                    <span>                    
                    Kalidasa Road, Matara, Sri Lanka                    
                    </span>
                </p>
                <p className='text-orange-300 flex items-center gap-3 mt-5'>
                    <CalendarMonthIcon/>
                    <span>  
                           Monday - Sunday: 9:00 AM - 7:00 PM               
                    </span>
                </p>
            </div>
        </section>
        <Divider/>
        <section className='pt-[2rem] lg:flex relative'>
            <div className='space-y-10 lg:w-[20%] filter'>
                <div className='box space-y-5 lg:sticky top-28'>
                    <Typography variant='h5' sx={{paddingBottom:"1rem"}}>
                        Computer Type
                    </Typography>
                    <FormControl className='py-10 space-y-5' component={"fieldset"}>
                        <RadioGroup>

                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
            <div className='space-y-5 lg:w-[80%] lg:pl-10'>
               menu 
            </div>
        </section>
    </div>
)
}

//mekta dann type(computer category) ekt laptop,gaming lap, gaming build wge
//brand ekth add krnn 
//backend ekt dann components computer eke. like ram, cpu, gpu, etc
//nanotek wge ghpn Computer wlt compnent(ram, rom, graphic card) wenamai external component(screen, printer, powerbank wenamai)
//1.33