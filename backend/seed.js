const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Manager = require('./models/Manager');
const Queue = require('./models/Queue');
const Token = require('./models/Token');

const seedData = async () => {
  console.log('--- Starting QueueFlow Database Seeder ---');
  await connectDB();

  try {
    const demoEmail = 'demo.manager@queueflow.io';
    const demoPassword = 'QueueFlow2026!';

    // Remove existing demo data to ensure clean state
    const existing = await Manager.findOne({ email: demoEmail });
    if (existing) {
      await Token.deleteMany({ managerId: existing._id });
      await Queue.deleteMany({ managerId: existing._id });
      await Manager.deleteOne({ _id: existing._id });
      console.log('Cleaned up previous demo manager records.');
    }

    // 1. Create Demo Manager
    const manager = await Manager.create({
      name: 'Alex Henderson',
      email: demoEmail,
      password: demoPassword,
    });
    console.log(`Created Demo Manager: ${manager.name} (${manager.email})`);

    // 2. Create 3 Queues
    const q1 = await Queue.create({
      name: 'Customer Support',
      description: 'General inquiries, account activations, and member services',
      prefix: 'CS',
      tokenCounter: 8,
      managerId: manager._id,
    });

    const q2 = await Queue.create({
      name: 'Billing Counter',
      description: 'Payments, invoice settlements, and refunds counter',
      prefix: 'BIL',
      tokenCounter: 6,
      managerId: manager._id,
    });

    const q3 = await Queue.create({
      name: 'Technical Support',
      description: 'Hardware diagnostics, software debugging, and device setup',
      prefix: 'TECH',
      tokenCounter: 5,
      managerId: manager._id,
    });

    console.log('Created Queues: Customer Support (CS), Billing Counter (BIL), Technical Support (TECH)');

    const now = Date.now();
    const minMs = 60 * 1000;
    const hourMs = 60 * minMs;
    const dayMs = 24 * hourMs;

    // Tokens for Queue 1 (Customer Support)
    const tokens = [
      // Completed tokens over past few days
      {
        tokenNumber: 'CS-001',
        sequence: 1,
        customerName: 'Marcus Vance',
        phoneNumber: '+1 (555) 234-5678',
        queueId: q1._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 3 * dayMs - 2 * hourMs),
        serviceStartedAt: new Date(now - 3 * dayMs - 1.8 * hourMs),
        serviceCompletedAt: new Date(now - 3 * dayMs - 1.6 * hourMs),
      },
      {
        tokenNumber: 'CS-002',
        sequence: 2,
        customerName: 'Elena Rostova',
        phoneNumber: '+1 (555) 345-6789',
        queueId: q1._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 2 * dayMs - 4 * hourMs),
        serviceStartedAt: new Date(now - 2 * dayMs - 3.7 * hourMs),
        serviceCompletedAt: new Date(now - 2 * dayMs - 3.5 * hourMs),
      },
      {
        tokenNumber: 'CS-003',
        sequence: 3,
        customerName: 'Liam O\'Connor',
        phoneNumber: '+1 (555) 456-7890',
        queueId: q1._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 1 * dayMs - 3 * hourMs),
        serviceStartedAt: new Date(now - 1 * dayMs - 2.8 * hourMs),
        serviceCompletedAt: new Date(now - 1 * dayMs - 2.5 * hourMs),
      },
      {
        tokenNumber: 'CS-004',
        sequence: 4,
        customerName: 'Aria Montgomery',
        phoneNumber: '+1 (555) 567-8901',
        queueId: q1._id,
        managerId: manager._id,
        status: 'CANCELLED',
        position: 0,
        createdAt: new Date(now - 1 * dayMs - 1 * hourMs),
      },
      // Currently SERVING Token
      {
        tokenNumber: 'CS-005',
        sequence: 5,
        customerName: 'David Kim',
        phoneNumber: '+1 (555) 678-9012',
        queueId: q1._id,
        managerId: manager._id,
        status: 'SERVING',
        position: 0,
        createdAt: new Date(now - 25 * minMs),
        serviceStartedAt: new Date(now - 4 * minMs),
      },
      // WAITING Tokens (ordered by position 1, 2, 3)
      {
        tokenNumber: 'CS-006',
        sequence: 6,
        customerName: 'Sophia Chen',
        phoneNumber: '+1 (555) 789-0123',
        queueId: q1._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 1,
        createdAt: new Date(now - 18 * minMs),
      },
      {
        tokenNumber: 'CS-007',
        sequence: 7,
        customerName: 'Ethan Wright',
        phoneNumber: '+1 (555) 890-1234',
        queueId: q1._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 2,
        createdAt: new Date(now - 10 * minMs),
      },
      {
        tokenNumber: 'CS-008',
        sequence: 8,
        customerName: 'Olivia Martinez',
        phoneNumber: '+1 (555) 901-2345',
        queueId: q1._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 3,
        createdAt: new Date(now - 3 * minMs),
      },

      // Tokens for Queue 2 (Billing Desk)
      {
        tokenNumber: 'BIL-001',
        sequence: 1,
        customerName: 'James Wilson',
        phoneNumber: '+1 (555) 111-2222',
        queueId: q2._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 2 * dayMs),
        serviceStartedAt: new Date(now - 2 * dayMs + 10 * minMs),
        serviceCompletedAt: new Date(now - 2 * dayMs + 22 * minMs),
      },
      {
        tokenNumber: 'BIL-002',
        sequence: 2,
        customerName: 'Grace Hopper',
        phoneNumber: '+1 (555) 222-3333',
        queueId: q2._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 1 * dayMs + 2 * hourMs),
        serviceStartedAt: new Date(now - 1 * dayMs + 2.2 * hourMs),
        serviceCompletedAt: new Date(now - 1 * dayMs + 2.4 * hourMs),
      },
      {
        tokenNumber: 'BIL-003',
        sequence: 3,
        customerName: 'Lucas Scott',
        phoneNumber: '+1 (555) 333-4444',
        queueId: q2._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 1,
        createdAt: new Date(now - 15 * minMs),
      },
      {
        tokenNumber: 'BIL-004',
        sequence: 4,
        customerName: 'Hannah Abbott',
        phoneNumber: '+1 (555) 444-5555',
        queueId: q2._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 2,
        createdAt: new Date(now - 8 * minMs),
      },

      // Tokens for Queue 3 (Technical Support)
      {
        tokenNumber: 'TECH-001',
        sequence: 1,
        customerName: 'Robert Taylor',
        phoneNumber: '+1 (555) 666-7777',
        queueId: q3._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 4 * dayMs),
        serviceStartedAt: new Date(now - 4 * dayMs + 15 * minMs),
        serviceCompletedAt: new Date(now - 4 * dayMs + 35 * minMs),
      },
      {
        tokenNumber: 'TECH-002',
        sequence: 2,
        customerName: 'Chloe Bennett',
        phoneNumber: '+1 (555) 777-8888',
        queueId: q3._id,
        managerId: manager._id,
        status: 'COMPLETED',
        position: 0,
        createdAt: new Date(now - 2 * dayMs),
        serviceStartedAt: new Date(now - 2 * dayMs + 12 * minMs),
        serviceCompletedAt: new Date(now - 2 * dayMs + 30 * minMs),
      },
      {
        tokenNumber: 'TECH-003',
        sequence: 3,
        customerName: 'Benjamin Franklin',
        phoneNumber: '+1 (555) 888-9999',
        queueId: q3._id,
        managerId: manager._id,
        status: 'WAITING',
        position: 1,
        createdAt: new Date(now - 12 * minMs),
      },
    ];

    await Token.insertMany(tokens);
    console.log(`Successfully seeded ${tokens.length} tokens across 3 queues!`);

    console.log('\n=============================================');
    console.log('   QUEUEFLOW DEMO SEED COMPLETED SUCCESSFULLY');
    console.log('=============================================');
    console.log('Manager Email:    demo.manager@queueflow.io');
    console.log('Manager Password: QueueFlow2026!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
