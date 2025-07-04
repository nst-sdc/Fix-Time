// List of known services for filtering appointments
const KNOWN_SERVICES = [
  // Healthcare & Wellness
  "General Physician Appointments",
  "Dentist Checkups", 
  "Eye Specialist Consultations",
  "Physiotherapy Sessions",
  "Lab Test Bookings (blood test, X-rays)",
  "Vaccination Slots (especially flu, COVID)",
  "Mental Health Counselling",
  "Dietician/Nutritionist Consultations",
  
  // Beauty & Personal Care
  "Haircut & Styling",
  "Beard Grooming",
  "Hair Coloring / Smoothening",
  "Manicure & Pedicure",
  "Facial & Skin Treatment",
  "Bridal/Party Makeup Sessions",
  "Spa & Massage Appointments",
  "Waxing / Threading Services",
  
  // Home & Repair Services
  "Electrician Booking",
  "Plumber Booking",
  "AC Repair & Servicing",
  "Water Purifier Maintenance",
  "Carpenter Appointments",
  "Pest Control Scheduling",
  "Appliance Repairs (washing machine, fridge, etc.)",
  
  // Education & Coaching
  "Tuition Sessions (Math, Science, etc.)",
  "Music Lessons (Guitar, Piano)",
  "Dance Classes",
  "Art & Craft Workshops",
  "Language Learning Sessions",
  "Fitness / Yoga Trainers",
  
  // Government / Legal Services
  "Driving License Appointment",
  "Passport Verification Slot Booking",
  "Aadhar Update Booking",
  "Legal Consultation (Advocate visit)",
  "Property Registration / Stamp Duty Token",
  
  // Automobile Services
  "Car/Bike Servicing",
  "Pollution Check Booking",
  "RTO Agent Consultations",
  "Tire & Oil Change",
  "Vehicle Cleaning / Detailing Services",
  
  // Retail & Local Businesses
  "Tailor Appointments (custom fitting)",
  "Jeweller Consultation (custom design)",
  "Boutique Trials / Booking",
  "Pet Grooming Services",
  "Custom Gift Makers or Artists",
  "Local Laundry / Dry Cleaning Pickup-Slots",
  
  // Private Events
  "Webinar Booking",
  "Seminar Registration",
  "Birthday Party Reservation",
  "Wedding Venue Booking",
  "Corporate Event Planning",
  "Anniversary Celebration Booking",
  
  // Hotel & Restaurant
  "Table Reservation",
  "Room Booking",
  "Buffet Slot Reservation",
  "Private Dining Booking",
  "Conference Room Reservation",
  "Special Event Catering"
];

// Create a Set for faster lookups
const KNOWN_SERVICES_SET = new Set(KNOWN_SERVICES);

/**
 * Check if a service name is known/valid
 * @param {string} serviceName - The service name to check
 * @returns {boolean} - True if the service is known, false otherwise
 */
const isKnownService = (serviceName) => {
  return KNOWN_SERVICES_SET.has(serviceName);
};

/**
 * Check if a service name is known/valid (including database services)
 * @param {string} serviceName - The service name to check
 * @param {Object} Service - The Service model
 * @returns {Promise<boolean>} - True if the service is known or exists in database
 */
const isKnownServiceWithDB = async (serviceName, Service) => {
  // First check the static list
  if (KNOWN_SERVICES_SET.has(serviceName)) {
    return true;
  }
  
  // If not in static list, check if it exists in the database
  try {
    const service = await Service.findOne({ name: serviceName });
    return !!service; // Return true if service exists in database
  } catch (error) {
    console.error('Error checking service in database:', error);
    return false;
  }
};

/**
 * Filter appointments to only include known services
 * @param {Array} appointments - Array of appointment objects
 * @returns {Array} - Filtered appointments with only known services
 */
const filterKnownServices = (appointments) => {
  return appointments.filter(appointment => {
    const serviceName = appointment.serviceName || 
                       (appointment.serviceId && appointment.serviceId.name);
    return serviceName && isKnownService(serviceName);
  });
};

/**
 * Filter appointments to only include known services (including database services)
 * @param {Array} appointments - Array of appointment objects
 * @param {Object} Service - The Service model
 * @returns {Promise<Array>} - Filtered appointments with only known services
 */
const filterKnownServicesWithDB = async (appointments, Service) => {
  const filteredAppointments = [];
  
  for (const appointment of appointments) {
    const serviceName = appointment.serviceName || 
                       (appointment.serviceId && appointment.serviceId.name);
    
    if (serviceName && await isKnownServiceWithDB(serviceName, Service)) {
      filteredAppointments.push(appointment);
    }
  }
  
  return filteredAppointments;
};

module.exports = {
  KNOWN_SERVICES,
  KNOWN_SERVICES_SET,
  isKnownService,
  isKnownServiceWithDB,
  filterKnownServices,
  filterKnownServicesWithDB
}; 