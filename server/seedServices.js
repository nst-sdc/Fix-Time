// seedServices.js
const mongoose = require('mongoose');
const Service = require('./src/models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fixtime';

const services = [
  // Beauty & Personal Care
  {
    name: 'Haircut & Styling', category: 'Beauty', description: 'Professional haircut and styling by expert stylists.', price: 350, duration: 45, provider: 'Style Studio', location: '123 Fashion Ave, City',
  },
  {
    name: 'Beard Grooming', category: 'Beauty', description: 'Complete beard trim, shape and maintenance.', price: 200, duration: 30, provider: 'Men\'s Grooming Center', location: '456 Style Blvd, City',
  },
  {
    name: 'Hair Coloring / Smoothening', category: 'Beauty', description: 'Professional hair coloring or smoothening treatment.', price: 1200, duration: 120, provider: 'Color Masters', location: '789 Beauty Way, City',
  },
  {
    name: 'Manicure & Pedicure', category: 'Beauty', description: 'Relaxing manicure and pedicure session.', price: 600, duration: 60, provider: 'Nail Spa', location: '321 Glam St, City',
  },
  {
    name: 'Facial & Skin Treatment', category: 'Beauty', description: 'Rejuvenating facial and skin care treatment.', price: 800, duration: 75, provider: 'Glow Clinic', location: '654 Radiant Rd, City',
  },
  {
    name: 'Bridal/Party Makeup Sessions', category: 'Beauty', description: 'Professional makeup for special occasions.', price: 2500, duration: 90, provider: 'Makeup Artistry', location: '111 Event Ave, City',
  },
  {
    name: 'Spa & Massage Appointments', category: 'Beauty', description: 'Relaxing full body massage and spa treatment.', price: 1500, duration: 90, provider: 'Relaxation Spa', location: '567 Calm Ave, City',
  },
  {
    name: 'Waxing / Threading Services', category: 'Beauty', description: 'Smooth waxing and threading for all skin types.', price: 400, duration: 40, provider: 'Smooth Touch', location: '222 Silk St, City',
  },

  // Healthcare & Wellness
  {
    name: 'General Physician Appointments', category: 'Healthcare', description: 'Consultation with experienced general physicians.', price: 500, duration: 30, provider: 'City Health Clinic', location: '101 Main St, City',
  },
  {
    name: 'Dentist Checkups', category: 'Healthcare', description: 'Complete dental examination and cleaning.', price: 700, duration: 45, provider: 'Smile Dentistry', location: '789 Health St, City',
  },
  {
    name: 'Eye Specialist Consultations', category: 'Healthcare', description: 'Eye checkup and vision assessment.', price: 600, duration: 30, provider: 'Vision Care', location: '202 Optic Ave, City',
  },
  {
    name: 'Physiotherapy Sessions', category: 'Healthcare', description: 'Personalized physiotherapy for pain relief.', price: 800, duration: 60, provider: 'Physio Plus', location: '303 Rehab Rd, City',
  },
  {
    name: 'Lab Test Bookings (blood test, X-rays)', category: 'Healthcare', description: 'Book lab tests and X-rays with certified labs.', price: 1200, duration: 20, provider: 'LabX', location: '404 Test Lane, City',
  },
  {
    name: 'Vaccination Slots (especially flu, COVID)', category: 'Healthcare', description: 'Book vaccination appointments for all ages.', price: 0, duration: 15, provider: 'ImmunizeNow', location: '505 Vax Blvd, City',
  },
  {
    name: 'Mental Health Counselling', category: 'Healthcare', description: 'Confidential mental health counseling sessions.', price: 1000, duration: 60, provider: 'MindCare', location: '606 Calm St, City',
  },
  {
    name: 'Dietician/Nutritionist Consultations', category: 'Healthcare', description: 'Personalized diet and nutrition advice.', price: 900, duration: 45, provider: 'NutriWell', location: '707 Health Ave, City',
  },

  // Home & Repair Services
  {
    name: 'Electrician Booking', category: 'Home Repair', description: 'Certified electrician for all home electrical needs.', price: 350, duration: 60, provider: 'PowerFix', location: '808 Spark St, City',
  },
  {
    name: 'Plumber Booking', category: 'Home Repair', description: 'Professional plumbing repair and maintenance.', price: 400, duration: 60, provider: 'Fast Fix Plumbing', location: '909 Waterworks, City',
  },
  {
    name: 'AC Repair & Servicing', category: 'Home Repair', description: 'AC repair and regular servicing.', price: 1200, duration: 90, provider: 'CoolAir', location: '1010 Chill Ave, City',
  },
  {
    name: 'Water Purifier Maintenance', category: 'Home Repair', description: 'Maintenance and repair of water purifiers.', price: 500, duration: 45, provider: 'PureLife', location: '1111 Aqua Rd, City',
  },
  {
    name: 'Carpenter Appointments', category: 'Home Repair', description: 'Expert carpentry for home and office.', price: 600, duration: 60, provider: 'WoodWorks', location: '1212 Timber St, City',
  },
  {
    name: 'Pest Control Scheduling', category: 'Home Repair', description: 'Safe and effective pest control services.', price: 1500, duration: 120, provider: 'PestAway', location: '1313 Bug Blvd, City',
  },
  {
    name: 'Appliance Repairs (washing machine, fridge, etc.)', category: 'Home Repair', description: 'Repairs for all major home appliances.', price: 800, duration: 60, provider: 'FixItAll', location: '1414 Appliance Ave, City',
  },

  // Education & Coaching
  {
    name: 'Tuition Sessions (Math, Science, etc.)', category: 'Education', description: 'Private tuition for school and college subjects.', price: 500, duration: 60, provider: 'EduCare', location: '1515 Study Lane, City',
  },
  {
    name: 'Music Lessons (Guitar, Piano)', category: 'Education', description: 'Learn music from professional instructors.', price: 700, duration: 60, provider: 'MusicMania', location: '1616 Melody Rd, City',
  },
  {
    name: 'Dance Classes', category: 'Education', description: 'Group and solo dance classes for all ages.', price: 600, duration: 60, provider: 'DanceHub', location: '1717 Rhythm St, City',
  },
  {
    name: 'Art & Craft Workshops', category: 'Education', description: 'Creative art and craft workshops.', price: 400, duration: 90, provider: 'Artistry', location: '1818 Canvas Ave, City',
  },
  {
    name: 'Language Learning Sessions', category: 'Education', description: 'Learn new languages with expert tutors.', price: 800, duration: 60, provider: 'LinguaPro', location: '1919 Polyglot St, City',
  },
  {
    name: 'Fitness / Yoga Trainers', category: 'Education', description: 'Personal fitness and yoga training.', price: 1000, duration: 60, provider: 'FitLife', location: '2020 Wellness Rd, City',
  },

  // Government / Legal Services
  {
    name: 'Driving License Appointment', category: 'Government', description: 'Book your driving license test or renewal.', price: 200, duration: 30, provider: 'RTO Office', location: '2121 License Lane, City',
  },
  {
    name: 'Passport Verification Slot Booking', category: 'Government', description: 'Book a slot for passport verification.', price: 0, duration: 20, provider: 'Passport Seva Kendra', location: '2222 Passport Ave, City',
  },
  {
    name: 'Aadhar Update Booking', category: 'Government', description: 'Book a slot for Aadhar card update.', price: 0, duration: 20, provider: 'UIDAI Center', location: '2323 ID St, City',
  },
  {
    name: 'Legal Consultation (Advocate visit)', category: 'Government', description: 'Consult with a legal expert or advocate.', price: 1500, duration: 60, provider: 'LegalEase', location: '2424 Law Ave, City',
  },
  {
    name: 'Property Registration / Stamp Duty Token', category: 'Government', description: 'Book a slot for property registration.', price: 5000, duration: 60, provider: 'Registrar Office', location: '2525 Registry Rd, City',
  },

  // Hotel & Restaurant
  {
    name: 'Table Reservation', category: 'Restaurant', description: 'Reserve a table at your favorite restaurant.', price: 0, duration: 90, provider: 'The Grand Dine', location: '2626 Food St, City',
  },
  {
    name: 'Room Booking', category: 'Restaurant', description: 'Book a comfortable room for your stay in the city.', price: 3500, duration: 1440, provider: 'City Comfort Hotel', location: '88 Stay St, Delhi',
  },
  {
    name: 'Buffet Slot Reservation', category: 'Restaurant', description: 'Reserve your slot for our unlimited buffet experience.', price: 799, duration: 120, provider: 'Buffet Bliss', location: '55 Feast Ave, Bangalore',
  },
  {
    name: 'Private Dining Booking', category: 'Restaurant', description: 'Book a private dining room for special occasions.', price: 3000, duration: 180, provider: 'Elite Eats', location: '2828 Elite Rd, City',
  },
  {
    name: 'Conference Room Reservation', category: 'Restaurant', description: 'Book a conference room for meetings.', price: 4000, duration: 180, provider: 'BizMeet', location: '3131 Business Rd, City',
  },
  {
    name: 'Special Event Catering', category: 'Restaurant', description: 'Catering for special events and parties.', price: 5000, duration: 240, provider: 'EventCaterers', location: 'Catering House, City',
  },

  // Private Events
  {
    name: 'Webinar Booking', category: 'Events', description: 'Book a slot for your next educational webinar.', price: 200, duration: 60, provider: 'EduWeb Events', location: 'Online Only',
  },
  {
    name: 'Seminar Registration', category: 'Events', description: 'Register for upcoming seminars on various topics.', price: 500, duration: 120, provider: 'SeminarPro', location: '123 Seminar Hall, Delhi',
  },
  {
    name: 'Birthday Party Reservation', category: 'Events', description: 'Book a venue and services for birthday parties.', price: 3000, duration: 180, provider: 'PartyTime Planners', location: '77 Celebration Rd, Mumbai',
  },
  {
    name: 'Wedding Venue Booking', category: 'Events', description: 'Book a wedding hall for your big day.', price: 50000, duration: 600, provider: 'Wedding Bliss', location: '3030 Marriage Ave, City',
  },
  {
    name: 'Corporate Event Planning', category: 'Events', description: 'Professional planning for corporate events.', price: 10000, duration: 480, provider: 'BizEvents', location: 'Corporate Park, City',
  },
  {
    name: 'Anniversary Celebration Booking', category: 'Events', description: 'Book a venue for anniversary celebrations.', price: 4000, duration: 240, provider: 'Anniversary Events', location: 'Anniversary Hall, City',
  },

  // Retail & Local Businesses
  {
    name: 'Tailor Appointments (custom fitting)', category: 'Retail', description: 'Book a fitting session for custom clothing.', price: 400, duration: 45, provider: 'StitchMaster Tailors', location: '12 Fashion St, Mumbai',
  },
  {
    name: 'Jeweller Consultation (custom design)', category: 'Retail', description: 'Consult with our experts for custom jewelry designs.', price: 0, duration: 30, provider: 'Sparkle Jewels', location: '88 Gold Ave, Delhi',
  },
  {
    name: 'Boutique Trials / Booking', category: 'Retail', description: 'Book a trial session for the latest fashion.', price: 100, duration: 30, provider: 'Chic Boutique', location: '55 Style Rd, Bangalore',
  },
  {
    name: 'Pet Grooming Services', category: 'Retail', description: 'Professional grooming for your pets.', price: 600, duration: 60, provider: 'PetCare', location: '22 Pet Lane, Pune',
  },
  {
    name: 'Custom Gift Makers or Artists', category: 'Retail', description: 'Order custom gifts from local artists.', price: 350, duration: 30, provider: 'GiftArtisans', location: '44 Gift St, Hyderabad',
  },
  {
    name: 'Local Laundry / Dry Cleaning Pickup-Slots', category: 'Retail', description: 'Laundry pickup and drop service.', price: 200, duration: 120, provider: 'CleanSpin', location: '3333 Laundry Lane, City',
  },

  // Automobile Services
  {
    name: 'Car/Bike Servicing', category: 'Automobile', description: 'Routine servicing for cars and bikes.', price: 800, duration: 90, provider: 'AutoCare Garage', location: '12 Motorway, Mumbai',
  },
  {
    name: 'Pollution Check Booking', category: 'Automobile', description: 'Certified pollution check for all vehicles.', price: 200, duration: 30, provider: 'GreenTest Center', location: '88 Clean Dr, Pune',
  },
  {
    name: 'RTO Agent Consultations', category: 'Automobile', description: 'RTO paperwork and consultation services.', price: 500, duration: 45, provider: 'RTO Assist', location: '22 License Rd, Delhi',
  },
  {
    name: 'Tire & Oil Change', category: 'Automobile', description: 'Quick tire and oil change for all vehicles.', price: 600, duration: 40, provider: 'QuickLube', location: '55 Service Ln, Bangalore',
  },
  {
    name: 'Vehicle Cleaning / Detailing Services', category: 'Automobile', description: 'Professional vehicle cleaning and detailing.', price: 450, duration: 60, provider: 'ShinePro Detailing', location: '33 Shine St, Hyderabad',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services.`);
  } catch (err) {
    console.error('Error seeding services:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed(); 