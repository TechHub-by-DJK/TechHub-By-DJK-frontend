import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { topPc } from './TopPc';
import CarousalItem from './CarousalItem';

const MultiItemCarousal = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
    };

  return (
    <div>
        <Slider {...settings}>
            {topPc.map((item) =>(
                <CarousalItem image={item.image} title={item.title}/> ))}
        </Slider>
    </div>
  )
}

export default MultiItemCarousal