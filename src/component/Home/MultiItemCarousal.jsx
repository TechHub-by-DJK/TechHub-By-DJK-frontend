import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { Card, CardMedia, CardContent, Typography, Box, Rating, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MultiItemCarousal = ({ computers = [] }) => {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: computers.length > 3,
        speed: 500,
        slidesToShow: Math.min(5, computers.length),
        slidesToScroll: 1,
        autoplay: computers.length > 3,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(3, computers.length),
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: Math.min(2, computers.length),
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const ComputerCarouselItem = ({ computer }) => (
        <div className="px-2">
            <Card 
                sx={{ 
                    height: 300,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.05)'
                    }
                }}
                onClick={() => navigate(`/computer/${computer.id}`)}
            >
                <CardMedia
                    component="img"
                    height="150"
                    image={computer.images?.[0] || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400"}
                    alt={computer.name}
                />
                <CardContent sx={{ p: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '0.9rem', mb: 1 }} noWrap>
                        {computer.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={computer.rating || 4.5} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                            ({computer.rating || 4.5})
                        </Typography>
                    </Box>

                    <Chip 
                        label={computer.brand || 'Tech'} 
                        size="small" 
                        sx={{ mb: 1, fontSize: '0.7rem' }}
                    />
                    
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        LKR {(computer.price || 0).toLocaleString()}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );

    if (!computers || computers.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography color="text.secondary">
                    No featured products available
                </Typography>
            </Box>
        );
    }

    return (
        <div>
            <Slider {...settings}>
                {computers.map((computer) => (
                    <ComputerCarouselItem key={computer.id} computer={computer} />
                ))}
            </Slider>
        </div>
    )
}

export default MultiItemCarousal