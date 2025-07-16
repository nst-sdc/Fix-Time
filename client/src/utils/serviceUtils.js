/**
 * Adds mock ratings to services for demonstration purposes
 * In a real application, this data would come from the API
 * @param {Array} services - Array of service objects
 * @returns {Array} - Services with added rating data
 */
export const addRatingsToServices = (services) => {
  return services.map(service => ({
    ...service,
    id: service.id || `service-${Math.random().toString(36).substr(2, 9)}`,
    avgRating: (3 + Math.random() * 2).toFixed(1), // Random rating between 3-5
    totalReviews: Math.floor(Math.random() * 50) + 1 // Random number of reviews
  }));
};

/**
 * Fetches service ratings from the API
 * @param {string} serviceId - ID of the service
 * @returns {Promise} - Promise resolving to rating data
 */
export const fetchServiceRating = async (serviceId) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.get(`/api/services/${serviceId}/rating`);
    // return response.data;
    
    // Mock data for demonstration
    return {
      avgRating: (3 + Math.random() * 2).toFixed(1),
      totalReviews: Math.floor(Math.random() * 50) + 1
    };
  } catch (error) {
    console.error('Error fetching service rating:', error);
    return { avgRating: 0, totalReviews: 0 };
  }
}; 

/**
 * Checks if an appointment is in the past (date and time)
 * @param {string|Date} date - The appointment date (string or Date)
 * @param {string} time - The appointment time (e.g., '10:30 AM')
 * @returns {boolean} - True if the appointment is in the past
 */
export function isPastAppointment(date, time) {
  const now = new Date();
  const apptDate = new Date(date);
  if (!time) return apptDate < now; // fallback if time missing
  const [rawTime, period] = time.split(' ');
  let [hours, minutes] = rawTime.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  apptDate.setHours(hours, minutes, 0, 0);
  return apptDate < now;
} 