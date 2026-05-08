import { PropertyDetail } from "@/types/property-detail";

export const mockDetails: PropertyDetail = {
  id: "1",
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
    },
  ],
  title: "Cozy Mountain Retreat",
  description:
    "Escape to this charming mountain retreat with stunning views and cozy amenities. Perfect for a romantic getaway or a peaceful solo retreat. Enjoy hiking trails, a private hot tub, and a fireplace to keep you warm on chilly nights. Book your stay now and experience the ultimate mountain escape!",
  rating: 4.85,
  totalReviews: 128,
  address: "Aspen, Colorado",
  price: 215,
  isFavorite: false,
  reviews: [
    {
      id: "review-1",
      user: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      comment: "Amazing place! Had a wonderful time. Highly recommend it.",
      rating: 5,
      datetime: "2025-11-15T10:30:00Z",
      userImages: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      id: "review-2",
      user: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=5",
      comment:
        "Beautiful location and cozy amenities. Would love to visit again.",
      rating: 4.5,
      datetime: "2025-10-22T08:15:00Z",
    },
    {
      id: "review-3",
      user: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=9",
      comment:
        "A perfect getaway spot with stunning views. The hot tub was a highlight!",
      rating: 4.8,
      datetime: "2025-09-05T14:00:00Z",
      userImages: [
        "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      id: "review-4",
      user: "Bob Brown",
      avatar: "https://i.pravatar.cc/150?img=12",
      comment:
        "Loved the private hot tub and hiking trails. A bit pricey but worth it for the experience.",
      rating: 4.7,
      datetime: "2025-08-18T11:45:00Z",
    },
    {
      id: "review-5",
      user: "Charlie Davis",
      avatar: "https://i.pravatar.cc/150?img=15",
      comment:
        "A bit pricey, but worth it for the experience. The views were breathtaking and the amenities were top-notch.",
      rating: 4.2,
      datetime: "2025-07-30T09:00:00Z",
    },
  ],
  convenient: [
    "Free Wi-Fi",
    "Kitchen",
    "Hot Tub",
    "Fireplace",
    "Mountain Views",
    "Hiking Trails",
    "Pet-Friendly",
    "Parking",
    "Air Conditioning",
    "Washer/Dryer",
    "TV",
    "Outdoor Grill",
    "Breakfast Included",
    "24/7 Check-in",
    "Luggage Drop-off",
    "Long-term Stays Allowed",
    "Family/Kid Friendly",
    "Suitable for Events",
    "Smoking Allowed",
    "Wheelchair Accessible",
  ],
};
