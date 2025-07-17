const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Service = require('./models/Service');

const app = express();

// Configure CORS with more specific options
app.use(cors({
  origin: 'https://fix-time-7.vercel.app',
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const appointmentRoutes = require('./routes/appointments');
const serviceRoutes = require('./routes/services');
const providerRoutes = require('./routes/providers');
const notificationRoutes = require('./routes/notifications');

// Setup routes
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);
app.use('/providers', providerRoutes);
app.use('/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Temporary debug endpoints for development
app.get('/debug/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({}, { password: 0 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug/services', async (req, res) => {
  try {
    const Service = require('./models/Service');
    const services = await Service.find({});
    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug/appointments', async (req, res) => {
  try {
    const Appointment = require('./models/Appointment');
    const appointments = await Appointment.find({})
      .populate('userId', 'fullName email')
      .populate('serviceId', 'name category');
    res.json({ count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug/reviews', async (req, res) => {
  try {
    const Review = require('./models/Review');
    const reviews = await Review.find({})
      .populate('userId', 'fullName email')
      .populate('serviceId', 'name category');
    res.json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug/providers', async (req, res) => {
  try {
    const Provider = require('./models/Provider');
    const providers = await Provider.find({})
      .populate('userId', 'fullName email phoneNumber')
      .select('-documents');
    res.json({ count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a general error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// --- Idempotent seeding logic ---
const seededServices = [
  // Beauty & Personal Care
  {
    name: "Haircut & Styling",
    category: "Beauty & Personal Care",
    description: "Professional haircut and styling by expert stylists",
    price: 45,
    duration: 60,
    provider: "Style Studio",
    location: "123 Fashion Ave",
    contact: "stylist@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM"]
  },
  {
    name: "Beard Grooming",
    category: "Beauty & Personal Care",
    description: "Complete beard trim, shape and maintenance",
    price: 30,
    duration: 30,
    provider: "Men's Grooming Center",
    location: "456 Style Blvd",
    contact: "grooming@example.com",
    timeSlots: ["9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM"]
  },
  {
    name: "Hair Coloring / Smoothening",
    category: "Beauty & Personal Care",
    description: "Professional hair coloring or smoothening treatment",
    price: 80,
    duration: 120,
    provider: "Color Masters",
    location: "789 Beauty Way",
    contact: "colors@example.com",
    timeSlots: ["10:00 AM - 12:00 PM", "1:00 PM - 3:00 PM", "3:00 PM - 5:00 PM"]
  },
  {
    name: "Manicure & Pedicure",
    category: "Beauty & Personal Care",
    description: "Complete nail care for hands and feet",
    price: 50,
    duration: 60,
    provider: "Nail Perfection",
    location: "101 Nail Ave",
    contact: "nails@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM"]
  },
  {
    name: "Facial & Skin Treatment",
    category: "Beauty & Personal Care",
    description: "Rejuvenating facial and skin care treatments",
    price: 70,
    duration: 60,
    provider: "Glow Spa",
    location: "202 Radiance St",
    contact: "glow@example.com",
    timeSlots: ["10:00 AM - 11:00 AM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM"]
  },
  {
    name: "Bridal/Party Makeup Sessions",
    category: "Beauty & Personal Care",
    description: "Professional makeup for special occasions",
    price: 120,
    duration: 90,
    provider: "Glamour Studio",
    location: "303 Elegance Blvd",
    contact: "glamour@example.com",
    timeSlots: ["8:00 AM - 9:30 AM", "10:00 AM - 11:30 AM", "12:00 PM - 1:30 PM"]
  },
  {
    name: "Spa & Massage",
    category: "Beauty & Personal Care",
    description: "Relaxing full body massage and spa treatment",
    price: 90,
    duration: 90,
    provider: "Relaxation Spa",
    location: "404 Serenity Ave",
    contact: "relax@example.com",
    timeSlots: ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "2:00 PM - 3:30 PM"]
  },
  {
    name: "Waxing / Threading Services",
    category: "Beauty & Personal Care",
    description: "Hair removal services for face and body",
    price: 35,
    duration: 30,
    provider: "Smooth Skin Center",
    location: "505 Smooth St",
    contact: "smooth@example.com",
    timeSlots: ["9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM"]
  },
  
  // Automobile Services
  {
    name: "Car/Bike Servicing",
    category: "Automobile",
    description: "Complete servicing for cars and bikes",
    price: 100,
    duration: 120,
    provider: "Auto Care Center",
    location: "123 Motor Ave",
    contact: "autocare@example.com",
    timeSlots: ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "1:00 PM - 3:00 PM"]
  },
  {
    name: "Pollution Check Booking",
    category: "Automobile",
    description: "Vehicle emission and pollution certification",
    price: 30,
    duration: 30,
    provider: "Green Auto",
    location: "456 Clean Air Blvd",
    contact: "greencheck@example.com",
    timeSlots: ["9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM"]
  },
  {
    name: "RTO Agent Consultations",
    category: "Automobile",
    description: "Consultation for vehicle registration and documentation",
    price: 50,
    duration: 45,
    provider: "RTO Solutions",
    location: "789 Registration St",
    contact: "rto@example.com",
    timeSlots: ["10:00 AM - 10:45 AM", "11:00 AM - 11:45 AM", "12:00 PM - 12:45 PM"]
  },
  {
    name: "Tire & Oil Change",
    category: "Automobile",
    description: "Quick tire replacement and oil change service",
    price: 60,
    duration: 45,
    provider: "Quick Auto Service",
    location: "101 Maintenance Ave",
    contact: "quickauto@example.com",
    timeSlots: ["8:00 AM - 8:45 AM", "9:00 AM - 9:45 AM", "10:00 AM - 10:45 AM"]
  },
  {
    name: "Vehicle Cleaning / Detailing Services",
    category: "Automobile",
    description: "Complete interior and exterior cleaning and detailing",
    price: 80,
    duration: 120,
    provider: "Sparkle Auto",
    location: "202 Clean Car St",
    contact: "sparkle@example.com",
    timeSlots: ["9:00 AM - 11:00 AM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM"]
  },
  
  // Healthcare & Wellness
  {
    name: "General Physician Appointments",
    category: "Healthcare & Wellness",
    description: "Consultation with a general physician for common health issues",
    price: 50,
    duration: 30,
    provider: "HealthFirst Clinic",
    location: "123 Wellness Ave",
    contact: "doctor@example.com",
    timeSlots: ["9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM"]
  },
  {
    name: "Dentist Checkups",
    category: "Healthcare & Wellness",
    description: "Routine dental examination and cleaning",
    price: 70,
    duration: 45,
    provider: "Smile Dental Care",
    location: "456 Tooth Ave",
    contact: "dentist@example.com",
    timeSlots: ["10:00 AM - 10:45 AM", "11:00 AM - 11:45 AM", "2:00 PM - 2:45 PM"]
  },
  {
    name: "Eye Specialist Consultations",
    category: "Healthcare & Wellness",
    description: "Eye examination and vision care consultation",
    price: 60,
    duration: 30,
    provider: "Clear Vision Center",
    location: "789 Sight St",
    contact: "eyes@example.com",
    timeSlots: ["9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM"]
  },
  {
    name: "Physiotherapy Sessions",
    category: "Healthcare & Wellness",
    description: "Physical therapy for injuries and rehabilitation",
    price: 80,
    duration: 60,
    provider: "Motion Therapy",
    location: "101 Movement Blvd",
    contact: "physio@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"]
  },
  {
    name: "Lab Test Bookings",
    category: "Healthcare & Wellness",
    description: "Medical laboratory tests and diagnostics",
    price: 40,
    duration: 20,
    provider: "Precise Diagnostics",
    location: "202 Test Ave",
    contact: "lab@example.com",
    timeSlots: ["8:00 AM - 8:20 AM", "8:20 AM - 8:40 AM", "8:40 AM - 9:00 AM"]
  },
  {
    name: "Vaccination Slots",
    category: "Healthcare & Wellness",
    description: "Routine and seasonal vaccinations",
    price: 30,
    duration: 15,
    provider: "Immunity Health Center",
    location: "303 Vaccine St",
    contact: "vaccines@example.com",
    timeSlots: ["9:00 AM - 9:15 AM", "9:15 AM - 9:30 AM", "9:30 AM - 9:45 AM"]
  },
  {
    name: "Mental Health Counselling",
    category: "Healthcare & Wellness",
    description: "Professional counseling and therapy sessions",
    price: 90,
    duration: 60,
    provider: "Mind Wellness Center",
    location: "404 Peace Ave",
    contact: "counselor@example.com",
    timeSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM"]
  },
  {
    name: "Nutritionist Consultations",
    category: "Healthcare & Wellness",
    description: "Personalized nutrition planning and dietary advice",
    price: 70,
    duration: 45,
    provider: "Healthy Eating Center",
    location: "505 Nutrition Blvd",
    contact: "nutrition@example.com",
    timeSlots: ["9:00 AM - 9:45 AM", "10:00 AM - 10:45 AM", "11:00 AM - 11:45 AM"]
  },
  
  // Home Repair
  {
    name: "Plumbing Services",
    category: "Home Repair",
    description: "Professional plumbing repair and maintenance",
    price: 80,
    duration: 60,
    provider: "Fast Fix Plumbing",
    location: "123 Pipe St",
    contact: "plumber@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"]
  },
  {
    name: "Electrical Repairs",
    category: "Home Repair",
    description: "Electrical system repairs and installations",
    price: 90,
    duration: 60,
    provider: "Power Electricians",
    location: "456 Circuit Ave",
    contact: "electrician@example.com",
    timeSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM"]
  },
  {
    name: "HVAC Maintenance",
    category: "Home Repair",
    description: "Heating, ventilation, and air conditioning services",
    price: 100,
    duration: 90,
    provider: "Cool Air Services",
    location: "789 Comfort Blvd",
    contact: "hvac@example.com",
    timeSlots: ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "2:00 PM - 3:30 PM"]
  },
  {
    name: "Cleaning Services",
    category: "Home Repair",
    description: "Professional home cleaning and sanitation",
    price: 70,
    duration: 120,
    provider: "Spotless Cleaners",
    location: "101 Clean Home St",
    contact: "clean@example.com",
    timeSlots: ["9:00 AM - 11:00 AM", "12:00 PM - 2:00 PM", "3:00 PM - 5:00 PM"]
  },
  {
    name: "Painting Services",
    category: "Home Repair",
    description: "Interior and exterior painting for homes",
    price: 120,
    duration: 240,
    provider: "Perfect Paint",
    location: "202 Color Ave",
    contact: "paint@example.com",
    timeSlots: ["8:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"]
  },
  {
    name: "Carpentry & Furniture",
    category: "Home Repair",
    description: "Custom carpentry and furniture repair",
    price: 90,
    duration: 120,
    provider: "Wood Crafters",
    location: "303 Timber St",
    contact: "carpenter@example.com",
    timeSlots: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM", "3:00 PM - 5:00 PM"]
  },
  {
    name: "General Handyman",
    category: "Home Repair",
    description: "Various home repair and maintenance tasks",
    price: 60,
    duration: 60,
    provider: "Fix-It-All Services",
    location: "404 Repair Blvd",
    contact: "handyman@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"]
  },
  
  // Hotels & Restaurants
  {
    name: "Hotel Room Reservations",
    category: "Hotels & Restaurants",
    description: "Book comfortable hotel rooms for your stay",
    price: 150,
    duration: 1440, // 24 hours
    provider: "Comfort Inn",
    location: "123 Hospitality Ave",
    contact: "reservations@example.com",
    timeSlots: ["Check-in: 2:00 PM", "Check-out: 12:00 PM"]
  },
  {
    name: "Restaurant Table Bookings",
    category: "Hotels & Restaurants",
    description: "Reserve tables at popular restaurants",
    price: 0,
    duration: 120,
    provider: "Gourmet Dining",
    location: "456 Taste Blvd",
    contact: "dining@example.com",
    timeSlots: ["6:00 PM - 8:00 PM", "7:00 PM - 9:00 PM", "8:00 PM - 10:00 PM"]
  },
  {
    name: "Catering Services",
    category: "Hotels & Restaurants",
    description: "Professional catering for events and parties",
    price: 500,
    duration: 240,
    provider: "Delicious Catering",
    location: "789 Flavor St",
    contact: "catering@example.com",
    timeSlots: ["Lunch: 11:00 AM - 3:00 PM", "Dinner: 5:00 PM - 9:00 PM"]
  },
  {
    name: "Event Space Reservations",
    category: "Hotels & Restaurants",
    description: "Book venues for conferences and celebrations",
    price: 300,
    duration: 240,
    provider: "Grand Ballroom",
    location: "101 Event Center Ave",
    contact: "events@example.com",
    timeSlots: ["Morning: 8:00 AM - 12:00 PM", "Afternoon: 1:00 PM - 5:00 PM", "Evening: 6:00 PM - 10:00 PM"]
  },
  {
    name: "Concierge Services",
    category: "Hotels & Restaurants",
    description: "Premium concierge assistance for hotel guests",
    price: 50,
    duration: 60,
    provider: "Elite Concierge",
    location: "202 Service Blvd",
    contact: "concierge@example.com",
    timeSlots: ["9:00 AM - 10:00 AM", "2:00 PM - 3:00 PM", "7:00 PM - 8:00 PM"]
  },
  
  // Private Events
  {
    name: "Wedding Planning",
    category: "Private Events",
    description: "Complete wedding planning and coordination services",
    price: 1200,
    duration: 120,
    provider: "Perfect Day Planners",
    location: "123 Celebration Ave",
    contact: "weddings@example.com",
    timeSlots: ["Mon-Fri: 10:00 AM - 12:00 PM", "Sat: 9:00 AM - 11:00 AM"]
  },
  {
    name: "Birthday Party Organization",
    category: "Private Events",
    description: "Birthday party planning for all ages",
    price: 300,
    duration: 90,
    provider: "Happy Celebrations",
    location: "456 Party Blvd",
    contact: "birthdays@example.com",
    timeSlots: ["Weekdays: 4:00 PM - 5:30 PM", "Weekends: 10:00 AM - 11:30 AM"]
  },
  {
    name: "DJ & Music Services",
    category: "Private Events",
    description: "Professional DJ services for events",
    price: 200,
    duration: 60,
    provider: "Beat Masters",
    location: "789 Music St",
    contact: "dj@example.com",
    timeSlots: ["Mon-Thu: 6:00 PM - 7:00 PM", "Fri-Sat: 7:00 PM - 8:00 PM"]
  },
  {
    name: "Event Photography",
    category: "Private Events",
    description: "Professional photography for special occasions",
    price: 250,
    duration: 60,
    provider: "Capture Moments",
    location: "101 Photo Ave",
    contact: "photos@example.com",
    timeSlots: ["Weekdays: 11:00 AM - 12:00 PM", "Weekends: 2:00 PM - 3:00 PM"]
  },
  {
    name: "Gift & Decor Services",
    category: "Private Events",
    description: "Event decoration and gift arrangement services",
    price: 150,
    duration: 90,
    provider: "Elegant Designs",
    location: "202 Decor Blvd",
    contact: "decor@example.com",
    timeSlots: ["Tue-Thu: 10:00 AM - 11:30 AM", "Fri-Sat: 1:00 PM - 2:30 PM"]
  },
  
  // Education & Coaching
  {
    name: "Academic Tutoring",
    category: "Education & Coaching",
    description: "One-on-one tutoring for students of all levels",
    price: 40,
    duration: 60,
    provider: "Smart Learning Center",
    location: "123 Knowledge Ave",
    contact: "tutoring@example.com",
    timeSlots: ["Mon-Fri: 3:00 PM - 4:00 PM", "Mon-Fri: 4:00 PM - 5:00 PM", "Sat: 10:00 AM - 11:00 AM"]
  },
  {
    name: "Career Counseling",
    category: "Education & Coaching",
    description: "Professional guidance for career development",
    price: 70,
    duration: 60,
    provider: "Career Path Advisors",
    location: "456 Success Blvd",
    contact: "careers@example.com",
    timeSlots: ["Tue: 10:00 AM - 11:00 AM", "Thu: 2:00 PM - 3:00 PM", "Sat: 11:00 AM - 12:00 PM"]
  },
  {
    name: "Language Classes",
    category: "Education & Coaching",
    description: "Group and private language instruction",
    price: 35,
    duration: 90,
    provider: "Global Languages",
    location: "789 Communication St",
    contact: "languages@example.com",
    timeSlots: ["Mon-Wed: 5:00 PM - 6:30 PM", "Thu-Fri: 6:00 PM - 7:30 PM"]
  },
  {
    name: "Music Lessons",
    category: "Education & Coaching",
    description: "Private music instruction for various instruments",
    price: 45,
    duration: 45,
    provider: "Harmony Music School",
    location: "101 Melody Ave",
    contact: "music@example.com",
    timeSlots: ["Mon-Fri: 3:00 PM - 3:45 PM", "Mon-Fri: 4:00 PM - 4:45 PM", "Sat: 10:00 AM - 10:45 AM"]
  },
  {
    name: "Programming & Tech Courses",
    category: "Education & Coaching",
    description: "Courses in programming and technology skills",
    price: 60,
    duration: 120,
    provider: "Code Academy",
    location: "202 Tech Blvd",
    contact: "tech@example.com",
    timeSlots: ["Tue-Thu: 6:00 PM - 8:00 PM", "Sat: 10:00 AM - 12:00 PM"]
  },
  
  // Government & Legal
  {
    name: "Legal Consultations",
    category: "Government & Legal",
    description: "Professional legal advice and consultation",
    price: 100,
    duration: 60,
    provider: "Justice Law Firm",
    location: "123 Legal Ave",
    contact: "legal@example.com",
    timeSlots: ["Mon-Fri: 9:00 AM - 10:00 AM", "Mon-Fri: 2:00 PM - 3:00 PM"]
  },
  {
    name: "Passport & Visa Services",
    category: "Government & Legal",
    description: "Assistance with passport and visa applications",
    price: 80,
    duration: 45,
    provider: "Travel Documents Center",
    location: "456 Passport Blvd",
    contact: "passport@example.com",
    timeSlots: ["Mon-Thu: 10:00 AM - 10:45 AM", "Mon-Thu: 11:00 AM - 11:45 AM"]
  },
  {
    name: "Document Notarization",
    category: "Government & Legal",
    description: "Official notarization of important documents",
    price: 40,
    duration: 30,
    provider: "Notary Express",
    location: "789 Document St",
    contact: "notary@example.com",
    timeSlots: ["Mon-Fri: 9:00 AM - 9:30 AM", "Mon-Fri: 9:30 AM - 10:00 AM", "Mon-Fri: 10:00 AM - 10:30 AM"]
  },
  {
    name: "Court Appointment Scheduling",
    category: "Government & Legal",
    description: "Assistance with scheduling court appearances",
    price: 50,
    duration: 30,
    provider: "Court Services",
    location: "101 Justice Ave",
    contact: "court@example.com",
    timeSlots: ["Mon-Fri: 10:00 AM - 10:30 AM", "Mon-Fri: 10:30 AM - 11:00 AM"]
  },
  {
    name: "ID & License Services",
    category: "Government & Legal",
    description: "Help with ID cards and license applications",
    price: 60,
    duration: 45,
    provider: "Identity Center",
    location: "202 License Blvd",
    contact: "identity@example.com",
    timeSlots: ["Mon-Wed: 9:00 AM - 9:45 AM", "Mon-Wed: 10:00 AM - 10:45 AM"]
  },
  
  // Retail & Local Businesses
  {
    name: "Retail Store Appointments",
    category: "Retail & Local Businesses",
    description: "Personal shopping appointments at retail stores",
    price: 0,
    duration: 60,
    provider: "Exclusive Retail",
    location: "123 Shopping Ave",
    contact: "retail@example.com",
    timeSlots: ["Mon-Sat: 10:00 AM - 11:00 AM", "Mon-Sat: 3:00 PM - 4:00 PM"]
  },
  {
    name: "Personal Shopping Services",
    category: "Retail & Local Businesses",
    description: "Personalized shopping assistance and styling",
    price: 70,
    duration: 90,
    provider: "Style Experts",
    location: "456 Fashion Blvd",
    contact: "shopping@example.com",
    timeSlots: ["Tue-Sat: 11:00 AM - 12:30 PM", "Tue-Sat: 2:00 PM - 3:30 PM"]
  },
  {
    name: "Jewelry Consultations",
    category: "Retail & Local Businesses",
    description: "Expert advice on jewelry selection and customization",
    price: 0,
    duration: 45,
    provider: "Gem Gallery",
    location: "789 Jewel St",
    contact: "jewelry@example.com",
    timeSlots: ["Mon-Fri: 11:00 AM - 11:45 AM", "Mon-Fri: 4:00 PM - 4:45 PM", "Sat: 10:00 AM - 10:45 AM"]
  },
  {
    name: "Clothing & Tailoring Services",
    category: "Retail & Local Businesses",
    description: "Custom tailoring and clothing alterations",
    price: 40,
    duration: 30,
    provider: "Perfect Fit Tailors",
    location: "101 Stitch Ave",
    contact: "tailor@example.com",
    timeSlots: ["Mon-Fri: 10:00 AM - 10:30 AM", "Mon-Fri: 10:30 AM - 11:00 AM", "Mon-Fri: 11:00 AM - 11:30 AM"]
  },
  {
    name: "Eyewear Fitting Services",
    category: "Retail & Local Businesses",
    description: "Professional eyewear selection and fitting",
    price: 0,
    duration: 30,
    provider: "Clear Vision Opticals",
    location: "202 Glasses Blvd",
    contact: "eyewear@example.com",
    timeSlots: ["Mon-Sat: 10:00 AM - 10:30 AM", "Mon-Sat: 11:00 AM - 11:30 AM", "Mon-Sat: 12:00 PM - 12:30 PM"]
  }
];

async function ensureSeededServices() {
  for (const seed of seededServices) {
    const exists = await Service.findOne({ name: seed.name, category: seed.category });
    if (!exists) {
      await Service.create(seed);
    }
  }
  console.log('Seeded services ensured.');
}

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixtime')
  .then(async () => {
    console.log('MongoDB connected successfully');
    await ensureSeededServices();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with error
  });
