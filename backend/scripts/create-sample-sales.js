const axios = require('axios');

// Create sample sales to populate the reports
const createSampleSales = async () => {
  try {
    console.log('Creating sample sales data...');
    
    // First, login to get a valid token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@pharmacy.com',
      password: 'password123',
      role: 'admin'
    });
    
    const token = loginResponse.data.token;
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    console.log('   ✅ Login successful');
    
    // Create a few sample sales
    const sampleSales = [
      {
        items: [
          { productId: 1, quantity: 2, price: 5.99 },
          { productId: 3, quantity: 1, price: 3.99 }
        ],
        paymentMethod: 'cash',
        totalAmount: 15.97
      },
      {
        items: [
          { productId: 2, quantity: 3, price: 8.99 },
          { productId: 5, quantity: 1, price: 7.99 }
        ],
        paymentMethod: 'credit_card',
        totalAmount: 34.96
      },
      {
        items: [
          { productId: 4, quantity: 2, price: 12.99 }
        ],
        paymentMethod: 'cash',
        totalAmount: 25.98
      }
    ];
    
    console.log('2. Creating sample sales...');
    for (let i = 0; i < sampleSales.length; i++) {
      try {
        const response = await axios.post('http://localhost:5000/api/sales', sampleSales[i], {
          headers: authHeaders
        });
        console.log(`   ✅ Sale ${i + 1} created successfully (ID: ${response.data.id})`);
      } catch (error) {
        console.error(`   ❌ Error creating sale ${i + 1}:`, error.response ? {
          status: error.response.status,
          message: error.response.data?.message || error.response.statusText
        } : error.message);
      }
    }
    
    console.log('\n3. Verifying sales data...');
    try {
      const salesResponse = await axios.get('http://localhost:5000/api/sales', {
        headers: authHeaders
      });
      console.log(`   Total sales in system: ${salesResponse.data.sales?.length || salesResponse.data.length || 0}`);
    } catch (error) {
      console.error('   ❌ Error fetching sales:', error.response ? {
        status: error.response.status,
        message: error.response.data?.message || error.response.statusText
      } : error.message);
    }
    
    console.log('\n🎉 Sample sales creation completed!');
    
  } catch (error) {
    console.error('❌ Error during sample sales creation:', error.response ? {
      status: error.response.status,
      message: error.response.data?.message || error.response.statusText,
      data: error.response.data
    } : error.message);
  }
};

createSampleSales();