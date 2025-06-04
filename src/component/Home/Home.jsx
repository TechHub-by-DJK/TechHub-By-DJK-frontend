import React from 'react'
import './Home.css';
import MultiItemCarousal from './MultiItemCarousal';

const Home = () => {
  return (
    <div className=''>
        <section className='banner -z-50 relative flex flex-col justify-center items-center'>
            <div className='w-[50vw] z-10 text-center'>
                <p className='text-2xl lg:text-6xl font-bold z-10 py-5'>DJK's TechHUB</p>
                <p className='z-10 text-gray-300 text-xl lg:text-4xl'>DJK's TechHub - Fueling the Future, One Laptop at a Time.</p>
            </div>
            <div className='cover absolute top-0 left-0 right-0'>

            </div>
            <div className='fadout'>

            </div>
        </section>
        <section className='p-10 lg:py-10 lg:px-20'>
            <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Top Tech Picks</p>
            <MultiItemCarousal/>
        </section>
        <section className='px-5 lg:px-20'>
          <h1 className='text-2xl font-semibold text-gray-400 py-3'>Our Flagship Stores</h1>
          <div>
            
          </div>
        </section>
    </div>
  )
}

export default Home

//53:16