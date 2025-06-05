import { Card, Chip, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ShopCard = () => {
return (
    <Card className='w-[18rem]'>
            <div className={`${true?'cursor-pointer':'cursor-not-allowed'} relative`}>
                <img className='w-full h-[10rem] rounded-t-md object-cover'
                src="https://penbodisplay.com/wp-content/uploads/2024/10/computer-shop-interior-design2.jpg" alt="" />
                     <Chip
                     size="small"	
                     className="absolute top-2 left-2"
                     color={true ? "success" : "error"}
                     label={true ? "Open" : "Closed"}
                     />
            </div>
            <div className='p-4 textPart lg:flex w-full justify-between'>
                    <div className='space-y-1'>
                            <p className='font-semibold text-lg'>SellX Computers</p>
                            <p className='text-gray-500 text-sm'>
                                    Built for Performance. Priced for You.
                            </p>
                    </div>
                    <div>
                            <IconButton>
                                    {true
                                        ? <FavoriteIcon sx={{ color: '#e91e63' }} />
                                        : <FavoriteBorderIcon sx={{ color: 'gray' }} />
                                    }
                            </IconButton>
                    </div>
            </div>
    </Card>
)
}

export default ShopCard