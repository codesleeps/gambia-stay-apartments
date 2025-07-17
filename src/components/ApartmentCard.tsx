import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Waves } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import OptimizedImage from './OptimizedImage';

// Generic apartment images
const genericImages = [
  '/apartment-1.jpg',
  '/apartment-2.jpg',
  '/apartment-3.jpg',
  '/apartment-4.jpg',
  '/apartment-5.jpg',
  '/apartment-6.jpg',
];

interface Apartment {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image_url: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
}

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Get optimized image URL based on apartment ID
  const getImageUrl = () => {
    // Use actual apartment images if available
    if (apartment.image_url && apartment.image_url !== '/placeholder.svg' && apartment.image_url !== '') {
      return apartment.image_url;
    }
    
    const apartmentId = apartment.id || '1';
    
    // Handle different image naming patterns for specific apartments
    if (apartmentId === '2') {
      return `/images/apartments/apt2-800x600.jpg`;
    } else if (apartmentId === '5') {
      return `/images/apartments/apt5_800x600.jpg`;
    } else if (apartmentId === '6') {
      return `/images/apartments/apt6-800x600.jpg`;
    }
    
    // Default pattern for other apartments
    return `/images/apartments/apartment-${apartmentId}-800x600.jpg`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      default:
        return <Waves className="w-4 h-4" />;
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card className="card-hover overflow-hidden group">
        <CardHeader className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
            <OptimizedImage
              src={getImageUrl()}
              alt={`${apartment.name} in ${apartment.location}`}
              width={800}
              height={600}
              className="w-full h-full group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 600px, 800px"
              priority={false}
              fallbackSrc="/images/placeholder-apartment.jpg"
              onError={(e) => console.error(`Failed to load image for ${apartment.name}`, e)}
              onLoad={() => console.log(`Successfully loaded image for ${apartment.name}`)}
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-primary border-0">
                ${apartment.price}/night
              </Badge>
            </div>
            <div className="absolute top-4 left-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{apartment.rating}</span>
              <span className="text-xs text-muted-foreground">({apartment.reviews})</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {apartment.location}
          </div>
          
          <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
            {apartment.name}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{apartment.bedrooms} bed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{apartment.bathrooms} bath</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{apartment.max_guests} guests</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {apartment.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </Badge>
            ))}
            {apartment.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{apartment.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <Button 
            className="w-full booking-gradient hover:opacity-90 transition-opacity"
            onClick={handleBookNow}
          >
            {user ? 'Book Now' : 'Login to Book'}
          </Button>
        </CardContent>
      </Card>

      <BookingModal
        apartment={apartment}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default ApartmentCard;
