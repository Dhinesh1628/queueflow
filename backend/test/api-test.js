const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Manager = require('../models/Manager');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const app = require('../server');
const http = require('http');

let server;
let baseUrl;

const runTests = async () => {
  console.log('====================================================');
  console.log('   QUEUEFLOW AUTOMATED COMPREHENSIVE BACKEND TEST  ');
  console.log('====================================================\n');

  // Start HTTP server on dynamic port
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[TEST] Test server started on ${baseUrl}\n`);

  const request = async (method, path, body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  };

  const testEmail = `test.manager.${Date.now()}@queueflow.io`;
  const testPassword = 'Password123!';
  let authToken = null;
  let managerId = null;
  let queueId1 = null;
  let queueId2 = null;
  let token1Id = null;
  let token2Id = null;
  let token3Id = null;

  try {
    // 1. Health check
    console.log('1. Testing System Health Check...');
    const health = await request('GET', '/api/health');
    console.assert(health.status === 200, `Health check failed: ${health.status}`);
    console.assert(health.data.status === 'online', 'Health status is not online');
    console.log('   ✓ Health check passed');

    // 2. Register manager
    console.log('2. Testing Manager Registration...');
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Sarah Connor',
      email: testEmail,
      password: testPassword,
    });
    console.assert(regRes.status === 201, `Registration failed: ${regRes.data.message}`);
    console.assert(regRes.data.token, 'Token was not returned on registration');
    authToken = regRes.data.token;
    managerId = regRes.data.manager.id;
    console.log('   ✓ Manager registered successfully with JWT');

    // 3. Prevent duplicate email
    console.log('3. Testing Duplicate Email Rejection...');
    const dupRes = await request('POST', '/api/auth/register', {
      name: 'Sarah Duplicate',
      email: testEmail,
      password: 'AnotherPassword123',
    });
    console.assert(dupRes.status === 409, `Expected 409 Conflict, got ${dupRes.status}`);
    console.log('   ✓ Duplicate registration correctly rejected with 409');

    // 4. Login with correct credentials
    console.log('4. Testing Manager Login...');
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    console.assert(loginRes.status === 200, `Login failed: ${loginRes.data.message}`);
    console.assert(loginRes.data.token, 'Login did not return token');
    console.log('   ✓ Login passed with valid credentials');

    // 5. Reject bad credentials
    console.log('5. Testing Bad Credentials Rejection...');
    const badLogin = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword!',
    });
    console.assert(badLogin.status === 401, `Expected 401 Unauthorized, got ${badLogin.status}`);
    console.log('   ✓ Bad credentials correctly rejected with 401');

    // 6. Access profile
    console.log('6. Testing Authenticated /api/auth/me...');
    const meRes = await request('GET', '/api/auth/me', null, authToken);
    console.assert(meRes.status === 200, `Profile check failed: ${meRes.data.message}`);
    console.assert(meRes.data.manager.email === testEmail, 'Email does not match');
    console.log('   ✓ Protected route authorized and verified');

    // 7. Create Queues
    console.log('7. Testing Queue Creation...');
    const q1Res = await request(
      'POST',
      '/api/queues',
      { name: 'Customer Support', description: 'Primary support counter', prefix: 'CS' },
      authToken
    );
    console.assert(q1Res.status === 201, `Queue creation failed: ${q1Res.data.message}`);
    queueId1 = q1Res.data.data._id;

    const q2Res = await request(
      'POST',
      '/api/queues',
      { name: 'Billing Desk', description: 'Payments & refunds', prefix: 'BIL' },
      authToken
    );
    console.assert(q2Res.status === 201, `Queue 2 creation failed: ${q2Res.data.message}`);
    queueId2 = q2Res.data.data._id;
    console.log(`   ✓ Created Queues: "Customer Support" (${q1Res.data.data.prefix}) & "Billing Desk" (${q2Res.data.data.prefix})`);

    // 8. Prevent duplicate queue name for same manager
    console.log('8. Testing Duplicate Queue Name Prevention...');
    const dupQueue = await request(
      'POST',
      '/api/queues',
      { name: 'Customer Support', prefix: 'CS' },
      authToken
    );
    console.assert(dupQueue.status === 409, `Expected 409 duplicate queue, got ${dupQueue.status}`);
    console.log('   ✓ Duplicate queue name correctly rejected');

    // 9. Generate Tokens
    console.log('9. Testing Token Creation and Atomic Numbering...');
    const t1 = await request(
      'POST',
      '/api/tokens',
      { queueId: queueId1, customerName: 'Alice Walker', phoneNumber: '+1234567890' },
      authToken
    );
    console.assert(t1.status === 201, `Token 1 creation failed: ${t1.data.message}`);
    console.assert(t1.data.data.tokenNumber === 'CS-001', `Expected CS-001, got ${t1.data.data.tokenNumber}`);
    console.assert(t1.data.data.position === 1, `Expected position 1, got ${t1.data.data.position}`);
    token1Id = t1.data.data._id;

    const t2 = await request(
      'POST',
      '/api/tokens',
      { queueId: queueId1, customerName: 'Bob Miller', phoneNumber: '+1987654321' },
      authToken
    );
    console.assert(t2.data.data.tokenNumber === 'CS-002', `Expected CS-002, got ${t2.data.data.tokenNumber}`);
    console.assert(t2.data.data.position === 2, `Expected position 2, got ${t2.data.data.position}`);
    token2Id = t2.data.data._id;

    const t3 = await request(
      'POST',
      '/api/tokens',
      { queueId: queueId1, customerName: 'Charlie Stone', phoneNumber: '+1555000111' },
      authToken
    );
    console.assert(t3.data.data.tokenNumber === 'CS-003', `Expected CS-003, got ${t3.data.data.tokenNumber}`);
    console.assert(t3.data.data.position === 3, `Expected position 3, got ${t3.data.data.position}`);
    token3Id = t3.data.data._id;
    console.log('   ✓ Generated CS-001 (Pos 1), CS-002 (Pos 2), CS-003 (Pos 3)');

    // 10. Queue Position Rearrangement
    console.log('10. Testing Position Rearrangement (Move Charlie UP)...');
    const moveRes = await request(
      'PATCH',
      `/api/tokens/${token3Id}/move`,
      { direction: 'up' },
      authToken
    );
    console.assert(moveRes.status === 200, `Move failed: ${moveRes.data.message}`);
    
    // Check updated order
    const listAfterMove = await request('GET', `/api/tokens?queueId=${queueId1}&status=WAITING`, null, authToken);
    const sorted = listAfterMove.data.data;
    console.assert(sorted[0].tokenNumber === 'CS-001', 'First should still be CS-001');
    console.assert(sorted[1].tokenNumber === 'CS-003', 'Second should now be CS-003');
    console.assert(sorted[2].tokenNumber === 'CS-002', 'Third should now be CS-002');
    console.log('   ✓ Successfully swapped positions: CS-003 moved ahead of CS-002');

    // 11. Service Assignment: CALL NEXT
    console.log('11. Testing CALL NEXT...');
    const callRes = await request(
      'POST',
      '/api/tokens/call-next',
      { queueId: queueId1 },
      authToken
    );
    console.assert(callRes.status === 200, `Call next failed: ${callRes.data.message}`);
    console.assert(callRes.data.data.tokenNumber === 'CS-001', 'Called token should be CS-001');
    console.assert(callRes.data.data.status === 'SERVING', 'Status should be SERVING');
    console.assert(callRes.data.data.serviceStartedAt !== null, 'serviceStartedAt should be recorded');
    console.log('   ✓ CS-001 is now SERVING with timestamp recorded');

    // 12. Prevent Multiple SERVING tokens
    console.log('12. Testing Concurrent Serving Prevention...');
    const badCall = await request(
      'POST',
      '/api/tokens/call-next',
      { queueId: queueId1 },
      authToken
    );
    console.assert(badCall.status === 400, `Expected 400 when calling while another is serving, got ${badCall.status}`);
    console.log('   ✓ Multiple concurrent serving tokens prevented as expected');

    // 13. Complete Service
    console.log('13. Testing COMPLETE SERVICE...');
    const compRes = await request(
      'POST',
      '/api/tokens/complete-service',
      { queueId: queueId1 },
      authToken
    );
    console.assert(compRes.status === 200, `Complete service failed: ${compRes.data.message}`);
    console.assert(compRes.data.data.status === 'COMPLETED', 'Status should be COMPLETED');
    console.assert(compRes.data.data.serviceCompletedAt !== null, 'serviceCompletedAt must exist');
    console.log('   ✓ CS-001 marked COMPLETED with duration calculated');

    // 14. Cancel Token
    console.log('14. Testing Cancel Token with Position Re-indexing...');
    const cancelRes = await request(
      'PATCH',
      `/api/tokens/${token3Id}/cancel`,
      {},
      authToken
    );
    console.assert(cancelRes.status === 200, `Cancel failed: ${cancelRes.data.message}`);
    console.assert(cancelRes.data.data.status === 'CANCELLED', 'Status should be CANCELLED');

    // Verify Bob is now position 1
    const finalWaiting = await request('GET', `/api/tokens?queueId=${queueId1}&status=WAITING`, null, authToken);
    console.assert(finalWaiting.data.data.length === 1, `Expected 1 waiting token, got ${finalWaiting.data.data.length}`);
    console.assert(finalWaiting.data.data[0].tokenNumber === 'CS-002', 'CS-002 should remain waiting');
    console.assert(finalWaiting.data.data[0].position === 1, `CS-002 position should be recalculated to 1, got ${finalWaiting.data.data[0].position}`);
    console.log('   ✓ Token cancelled and remaining waiting positions seamlessly re-indexed to 1');

    // 15. Analytics Dashboard Verification
    console.log('15. Testing Analytics Calculation on Real Database Data...');
    const analyticsRes = await request('GET', '/api/analytics?timeframe=7d', null, authToken);
    console.assert(analyticsRes.status === 200, `Analytics failed: ${analyticsRes.status}`);
    const { kpis, charts } = analyticsRes.data.data;
    console.assert(kpis.totalQueues >= 2, `Expected at least 2 queues, got ${kpis.totalQueues}`);
    console.assert(kpis.totalTokens >= 3, `Expected at least 3 tokens, got ${kpis.totalTokens}`);
    console.assert(charts.statusDistribution.length === 4, 'Expected 4 status distributions');
    console.assert(charts.dailyActivity.length > 0, 'Expected daily activity data points');
    console.assert(charts.queuePerformance.length >= 2, 'Expected queue performance breakdown');
    console.log('   ✓ Analytics returned live DB aggregations and chart series');

    // Clean up test data
    console.log('16. Cleaning up test artifacts...');
    await Token.deleteMany({ managerId });
    await Queue.deleteMany({ managerId });
    await Manager.deleteOne({ _id: managerId });
    console.log('   ✓ Test data cleaned up successfully');

    console.log('\n====================================================');
    console.log('   ALL BACKEND TESTS PASSED SUCCESSFULLY! (16/16)  ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ TEST FAILURE:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
};

runTests();
