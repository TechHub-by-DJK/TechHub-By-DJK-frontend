import React from 'react'
import { Avatar, Badge, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  return (
    <div className='px-5 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between items-center'>
          <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
            <div className='logo font-semibold text-gray-300 text-2xl'>TechHUB</div>
          </div>
          <div className='flex items-center space-x-2 lg:space-x-10'>
            <div className=''>
              <IconButton>
                <SearchIcon sx={{fontSize: "1.5rem"}} />
              </IconButton>
            </div>
            <div className=''>
              <Avatar sx={{bgcolor:"white", color:pink.A400}}>
                C
              </Avatar>        
            </div>

            <div className=''>
              <IconButton>
                <Badge color="black" badgeContent={4} sx={{"& .MuiBadge-dot": {backgroundColor: pink[500]}}}>
                  <ShoppingCartIcon sx={{fontSize: "1.5rem"}} />
                </Badge>
              </IconButton>      
            </div>
          </div>
    </div>
  )
}

export default Navbar