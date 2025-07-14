const mongoose = require('mongoose');
const User = require('./models/User');
const Provider = require('./models/Provider');
const Service = require('./models/Service');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Fix-Time', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function setupTestData() {
  try {
    console.log('Setting up test data...');

    // Create test users if they don't exist
    const testUsers = [
      {
        fullName: 'John Customer',
        email: 'customer@test.com',
        phoneNumber: '1234567890',
        password: 'password123',
        address: '123 Customer Street, City',
        gender: 'male',
        role: 'customer'
      },
      {
        fullName: 'Sarah Provider',
        email: 'provider@test.com',
        phoneNumber: '0987654321',
        password: 'password123',
        address: '456 Provider Avenue, City',
        gender: 'female',
        role: 'provider'
      },
      {
        fullName: 'Mike Service Provider',
        email: 'mike@test.com',
        phoneNumber: '5555555555',
        password: 'password123',
        address: '789 Service Road, City',
        gender: 'male',
        role: 'provider'
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = new User(userData);
        await user.save();
        console.log(`Created user: ${user.fullName}`);
      }
      createdUsers.push(user);
    }

    // Create test providers if they don't exist
    const testProviders = [
      {
        userId: createdUsers[1]._id, // Sarah Provider
        businessName: 'Beauty Haven',
        businessDescription: 'Professional beauty and personal care services',
        businessCategory: 'Beauty & Personal Care',
        businessHours: '9:00 AM - 6:00 PM',
        location: '123 Beauty Street, City',
        contactEmail: 'sarah@beautyhaven.com',
        contactPhone: '555-0101',
        isVerified: true,
        specializations: ['Hair Styling', 'Facial Treatments', 'Makeup'],
        experience: 5
      },
      {
        userId: createdUsers[2]._id, // Mike Service Provider
        businessName: 'Auto Care Pro',
        businessDescription: 'Complete automotive services and maintenance',
        businessCategory: 'Automobile',
        businessHours: '8:00 AM - 5:00 PM',
        location: '456 Auto Drive, City',
        contactEmail: 'mike@autocarepro.com',
        contactPhone: '555-0202',
        isVerified: true,
        specializations: ['Car Servicing', 'Bike Maintenance', 'Pollution Check'],
        experience: 8
      }
    ];

    const createdProviders = [];
    for (const providerData of testProviders) {
      let provider = await Provider.findOne({ userId: providerData.userId });
      if (!provider) {
        provider = new Provider(providerData);
        await provider.save();
        console.log(`Created provider: ${provider.businessName}`);
      }
      createdProviders.push(provider);
    }

    // Update existing services to link with providers
    const services = await Service.find({});
    
    // Beauty services -> Sarah Provider
    const beautyServices = services.filter(s => 
      s.category === 'Beauty & Personal Care'
    );
    
    for (const service of beautyServices) {
      service.providerId = createdProviders[0]._id; // Sarah's provider ID
      service.provider = createdProviders[0].businessName;
      await service.save();
      console.log(`Linked service "${service.name}" to ${createdProviders[0].businessName}`);
    }

    // Auto services -> Mike Provider
    const autoServices = services.filter(s => 
      s.category === 'Automobile'
    );
    
    for (const service of autoServices) {
      service.providerId = createdProviders[1]._id; // Mike's provider ID
      service.provider = createdProviders[1].businessName;
      await service.save();
      console.log(`Linked service "${service.name}" to ${createdProviders[1].businessName}`);
    }

    // Update providers with their services
    createdProviders[0].services = beautyServices.map(s => s._id);
    await createdProviders[0].save();
    
    createdProviders[1].services = autoServices.map(s => s._id);
    await createdProviders[1].save();

    console.log('\n✅ Test data setup completed!');
    console.log('\nTest Accounts:');
    console.log('Customer: customer@test.com / password123');
    console.log('Provider 1: provider@test.com / password123');
    console.log('Provider 2: mike@test.com / password123');
    console.log('\nServices have been linked to providers for testing.');

  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the setup
setupTestData(); 