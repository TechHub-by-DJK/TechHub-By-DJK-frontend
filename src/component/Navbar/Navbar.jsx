import React from 'react'
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
              <IconButton>

              </IconButton>        
            </div>
          </div>
    </div>
  )
}

export default Navbar