// Test script to debug authentication
console.log('🔍 Testing authentication flow...');

// Test 1: Check if backend is responding
fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123'
    })
})
.then(response => {
    console.log('📡 Backend response status:', response.status);
    return response.json();
})
.then(data => {
    console.log('✅ Login response:', data);
    
    // Store the token like the app would
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    console.log('💾 Stored in localStorage:');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User:', localStorage.getItem('user'));
    
    // Test profile endpoint
    return fetch('http://localhost:5000/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${data.token}`
        }
    });
})
.then(response => {
    console.log('👤 Profile endpoint status:', response.status);
    return response.json();
})
.then(profileData => {
    console.log('👤 Profile data:', profileData);
})
.catch(error => {
    console.error('❌ Test failed:', error);
});

// Test localStorage
console.log('🗄️ Current localStorage state:');
console.log('Token exists:', !!localStorage.getItem('token'));
console.log('User exists:', !!localStorage.getItem('user'));
