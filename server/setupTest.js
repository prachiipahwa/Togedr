const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api';

const setup = async () => {
  try {
    console.log('--- Starting Test Setup ---');

    // 1. Register User A (Creator)
    const userA_Response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User A',
      email: `userA-${Date.now()}@example.com`,
      password: 'password123',
    });
    const userA = userA_Response.data;
    console.log('✅ User A created.');

    // 2. Register User B (Joiner)
    const userB_Response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User B',
      email: `userB-${Date.now()}@example.com`,
      password: 'password456',
    });
    const userB = userB_Response.data;
    console.log('✅ User B created.');

    // 3. User A creates an activity
    const activity_Response = await axios.post(`${BASE_URL}/activities`,
      {
        title: 'Test Activity for Swiping',
        description: 'A test activity',
        tag: 'Test',
        time: new Date(),
        location: { type: 'Point', coordinates: [0, 0] },
      },
      { headers: { Authorization: `Bearer ${userA.token}` } }
    );
    const activity = activity_Response.data;
    console.log('✅ Activity created.');

    // 4. User B joins the activity
    await axios.post(`${BASE_URL}/activities/${activity._id}/join`,
      {},
      { headers: { Authorization: `Bearer ${userB.token}` } }
    );
    console.log('✅ User B joined activity.');

    // 5. User A completes the activity
    await axios.put(`${BASE_URL}/activities/${activity._id}/complete`,
      {},
      { headers: { Authorization: `Bearer ${userA.token}` } }
    );
    console.log('✅ Activity marked as complete.');

    // --- Final Output ---
    console.log(`
\n--- ✅ SETUP COMPLETE ✅ ---
You are now ready to test the swipe functionality.
Use the following details in Thunder Client / Postman:

Activity ID:    ${activity._id}

User A ID:        ${userA._id}
User A Token:     ${userA.token}

User B ID:        ${userB._id}
User B Token:     ${userB.token}
-----------------------------------`);

  } catch (error) {
    console.error('--- ❌ SETUP FAILED ❌ ---');
    console.error(error.response ? error.response.data : error.message);
  }
};

setup();