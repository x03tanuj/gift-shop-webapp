import http from 'http';
import app from './server.js';

// The server.js automatically listens on PORT, let's verify GET /api/health
const PORT = process.env.PORT || 5000;

const runTest = async () => {
  // Give server 500ms to initialize
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const res = await fetch(`http://localhost:${PORT}/api/health`);
    const status = res.status;
    const body = await res.json();

    console.log(`[TEST] HTTP Status: ${status}`);
    console.log(`[TEST] Response Body:`, JSON.stringify(body));

    if (status === 200 && body.status === 'ok') {
      console.log('✅ End-to-end health check passed!');
      process.exit(0);
    } else {
      console.error('❌ Health check did not return expected { status: "ok" }');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error pinging health check:', err.message);
    process.exit(1);
  }
};

runTest();
