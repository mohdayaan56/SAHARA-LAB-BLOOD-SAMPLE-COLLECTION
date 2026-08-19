/* ============================================================
   Database Seed Script
   Seeds staff (admin + lab boys) and demo bookings
   Run: node src/utils/seed.js
   ============================================================ */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Sahara Lab database...\n');

  // ── Staff ─────────────────────────────────────────────────
  const adminHash  = await bcrypt.hash('admin123', 10);
  const pin1Hash   = await bcrypt.hash('1234',     10);
  const pin2Hash   = await bcrypt.hash('5678',     10);

  const admin = await prisma.staff.upsert({
    where:  { staffCode: 'AD001' },
    update: {},
    create: {
      staffCode:    'AD001',
      name:         'Dr. Admin',
      role:         'ADMIN',
      username:     'admin',
      passwordHash: adminHash,
      phone:        '9000000001',
    },
  });

  const lb1 = await prisma.staff.upsert({
    where:  { staffCode: 'LB001' },
    update: {},
    create: {
      staffCode: 'LB001',
      name:      'Raj Kumar',
      role:      'LABBOY',
      pin:       pin1Hash,
      phone:     '9000000002',
    },
  });

  const lb2 = await prisma.staff.upsert({
    where:  { staffCode: 'LB002' },
    update: {},
    create: {
      staffCode: 'LB002',
      name:      'Priya Sharma',
      role:      'LABBOY',
      pin:       pin2Hash,
      phone:     '9000000003',
    },
  });

  console.log('✅ Staff seeded:', admin.name, lb1.name, lb2.name);

  // ── Demo Bookings (with multi-month history for analytics) ─
  const bookings = [
    // --- GANESH RAO: Visit 1 (June 2026) --------------------
    {
      id: 'SHL-1506-0001',
      status: 'READY',
      patientName: 'Ganesh Rao', patientPhone: '9876543210',
      patientAddress: '42, Jubilee Hills, Road No. 36, Hyderabad – 500033',
      patientAge: '52', patientGender: 'MALE',
      preferredDate: '2026-06-15', preferredTime: '07:30',
      notes: 'Initial checkup for diabetic management',
      assignedTo: lb1.id,
      collectionNotes: 'Sample collected at 7:30 AM.',
      collectedAt: new Date('2026-06-15T02:00:00.000Z'),
      createdAt: new Date('2026-06-14T04:00:00.000Z'),
      tests: ['fbs', 'lipid', 'hba1c', 'cbc'],
      report: {
        results: [
          { testId: 'fbs', testName: 'Fasting Blood Sugar (FBS)', subtests: [
            { name: 'Glucose (Fasting)', value: '142', unit: 'mg/dL', reference: '70 – 100', flag: 'high' }
          ]},
          { testId: 'hba1c', testName: 'HbA1c (Glycated Hemoglobin)', subtests: [
            { name: 'HbA1c', value: '8.4', unit: '%', reference: '< 5.7 Normal', flag: 'high' }
          ]},
          { testId: 'lipid', testName: 'Lipid Profile', subtests: [
            { name: 'Total Cholesterol', value: '230', unit: 'mg/dL', reference: '< 200', flag: 'high' },
            { name: 'HDL Cholesterol',   value: '35',  unit: 'mg/dL', reference: '> 40 (M)', flag: 'low' },
            { name: 'LDL Cholesterol',   value: '160', unit: 'mg/dL', reference: '< 100', flag: 'high' },
            { name: 'VLDL Cholesterol',  value: '35',  unit: 'mg/dL', reference: '< 30', flag: 'high' },
            { name: 'Triglycerides',     value: '210', unit: 'mg/dL', reference: '< 150', flag: 'high' },
            { name: 'Total/HDL Ratio',   value: '6.5', unit: '',       reference: '< 5.0', flag: 'high' },
          ]},
          { testId: 'cbc', testName: 'Complete Blood Count (CBC)', subtests: [
            { name: 'Hemoglobin', value: '13.6', unit: 'g/dL', reference: '13.0 – 17.0', flag: 'normal' },
            { name: 'Platelet Count', value: '2.4', unit: 'lakh/μL', reference: '1.5 – 4.5', flag: 'normal' },
            { name: 'WBC Count', value: '7200', unit: 'cells/μL', reference: '4000 – 11000', flag: 'normal' },
          ]},
        ],
        remarks: 'Elevated HbA1c (8.4%) and fasting sugar indicate uncontrolled Type 2 Diabetes. Moderate dyslipidemia present.',
        reportedBy: 'Dr. Lab Admin',
        reportedAt: new Date('2026-06-15T08:00:00.000Z'),
      },
    },

    // --- GANESH RAO: Visit 2 (July 2026) --------------------
    {
      id: 'SHL-1607-0001',
      status: 'READY',
      patientName: 'Ganesh Rao', patientPhone: '9876543210',
      patientAddress: '42, Jubilee Hills, Road No. 36, Hyderabad – 500033',
      patientAge: '52', patientGender: 'MALE',
      preferredDate: '2026-07-16', preferredTime: '07:15',
      notes: 'Follow-up 1 month post medication adjustment',
      assignedTo: lb1.id,
      collectionNotes: 'Sample collected at 7:15 AM.',
      collectedAt: new Date('2026-07-16T01:45:00.000Z'),
      createdAt: new Date('2026-07-15T04:00:00.000Z'),
      tests: ['fbs', 'lipid', 'hba1c', 'cbc'],
      report: {
        results: [
          { testId: 'fbs', testName: 'Fasting Blood Sugar (FBS)', subtests: [
            { name: 'Glucose (Fasting)', value: '134', unit: 'mg/dL', reference: '70 – 100', flag: 'high' }
          ]},
          { testId: 'hba1c', testName: 'HbA1c (Glycated Hemoglobin)', subtests: [
            { name: 'HbA1c', value: '8.0', unit: '%', reference: '< 5.7 Normal', flag: 'high' }
          ]},
          { testId: 'lipid', testName: 'Lipid Profile', subtests: [
            { name: 'Total Cholesterol', value: '220', unit: 'mg/dL', reference: '< 200', flag: 'high' },
            { name: 'HDL Cholesterol',   value: '36',  unit: 'mg/dL', reference: '> 40 (M)', flag: 'low' },
            { name: 'LDL Cholesterol',   value: '152', unit: 'mg/dL', reference: '< 100', flag: 'high' },
            { name: 'VLDL Cholesterol',  value: '32',  unit: 'mg/dL', reference: '< 30', flag: 'high' },
            { name: 'Triglycerides',     value: '195', unit: 'mg/dL', reference: '< 150', flag: 'high' },
            { name: 'Total/HDL Ratio',   value: '6.1', unit: '',       reference: '< 5.0', flag: 'high' },
          ]},
          { testId: 'cbc', testName: 'Complete Blood Count (CBC)', subtests: [
            { name: 'Hemoglobin', value: '13.9', unit: 'g/dL', reference: '13.0 – 17.0', flag: 'normal' },
            { name: 'Platelet Count', value: '2.5', unit: 'lakh/μL', reference: '1.5 – 4.5', flag: 'normal' },
            { name: 'WBC Count', value: '6900', unit: 'cells/μL', reference: '4000 – 11000', flag: 'normal' },
          ]},
        ],
        remarks: 'Encouraging improvement: Fasting sugar down to 134 mg/dL and HbA1c reduced to 8.0%. Continue current prescription.',
        reportedBy: 'Dr. Lab Admin',
        reportedAt: new Date('2026-07-16T07:30:00.000Z'),
      },
    },

    // --- GANESH RAO: Visit 3 (August 2026) ------------------
    {
      id: 'SHL-1608-0001',
      status: 'READY',
      patientName: 'Ganesh Rao', patientPhone: '9876543210',
      patientAddress: '42, Jubilee Hills, Road No. 36, Hyderabad – 500033',
      patientAge: '52', patientGender: 'MALE',
      preferredDate: '2026-08-17', preferredTime: '07:00',
      notes: 'Patient is diabetic, fasting since 10 PM',
      assignedTo: lb1.id,
      collectionNotes: 'Sample collected at 7:15 AM. Patient was fasting as instructed.',
      collectedAt: new Date('2026-08-17T01:45:00.000Z'),
      createdAt: new Date('2026-08-16T04:00:00.000Z'),
      tests: ['fbs', 'lipid', 'hba1c', 'cbc'],
      report: {
        results: [
          { testId: 'fbs', testName: 'Fasting Blood Sugar (FBS)', subtests: [
            { name: 'Glucose (Fasting)', value: '128', unit: 'mg/dL', reference: '70 – 100', flag: 'high' }
          ]},
          { testId: 'hba1c', testName: 'HbA1c (Glycated Hemoglobin)', subtests: [
            { name: 'HbA1c', value: '7.8', unit: '%', reference: '< 5.7 Normal', flag: 'high' }
          ]},
          { testId: 'lipid', testName: 'Lipid Profile', subtests: [
            { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', reference: '< 200', flag: 'high' },
            { name: 'HDL Cholesterol',   value: '38',  unit: 'mg/dL', reference: '> 40 (M)', flag: 'low' },
            { name: 'LDL Cholesterol',   value: '145', unit: 'mg/dL', reference: '< 100', flag: 'high' },
            { name: 'VLDL Cholesterol',  value: '26',  unit: 'mg/dL', reference: '< 30', flag: 'normal' },
            { name: 'Triglycerides',     value: '185', unit: 'mg/dL', reference: '< 150', flag: 'high' },
            { name: 'Total/HDL Ratio',   value: '5.7', unit: '',       reference: '< 5.0', flag: 'high' },
          ]},
          { testId: 'cbc', testName: 'Complete Blood Count (CBC)', subtests: [
            { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', reference: '13.0 – 17.0', flag: 'normal' },
            { name: 'Platelet Count', value: '2.6', unit: 'lakh/μL', reference: '1.5 – 4.5', flag: 'normal' },
            { name: 'WBC Count', value: '6600', unit: 'cells/μL', reference: '4000 – 11000', flag: 'normal' },
          ]},
        ],
        remarks: 'Consistent positive response: HbA1c reduced to 7.8% (down from 8.4%). Total cholesterol and triglycerides improving.',
        reportedBy: 'Dr. Lab Admin',
        reportedAt: new Date('2026-08-17T07:30:00.000Z'),
      },
    },

    // --- PREETHI DEVI: Visit 1 (July 2026) ------------------
    {
      id: 'SHL-1007-0002',
      status: 'READY',
      patientName: 'Preethi Devi', patientPhone: '9871234567',
      patientAddress: '15, Banjara Hills, Road No. 12, Hyderabad – 500034',
      patientAge: '35', patientGender: 'FEMALE',
      preferredDate: '2026-07-10', preferredTime: '08:30',
      notes: 'Fatigue and vitamin deficiency check',
      assignedTo: lb2.id,
      collectionNotes: 'Sample collected successfully.',
      collectedAt: new Date('2026-07-10T03:00:00.000Z'),
      createdAt: new Date('2026-07-09T04:45:00.000Z'),
      tests: ['thyroid3', 'vitd', 'vitb12'],
      report: {
        results: [
          { testId: 'thyroid3', testName: 'Thyroid Profile (T3, T4, TSH)', subtests: [
            { name: 'T3 (Triiodothyronine)', value: '110', unit: 'ng/dL', reference: '80 – 200', flag: 'normal' },
            { name: 'T4 (Thyroxine)', value: '7.8', unit: 'μg/dL', reference: '5.0 – 12.0', flag: 'normal' },
            { name: 'TSH', value: '5.4', unit: 'mIU/L', reference: '0.4 – 4.0', flag: 'high' },
          ]},
          { testId: 'vitd', testName: 'Vitamin D (25-OH)', subtests: [
            { name: 'Vitamin D (25-OH)', value: '18.2', unit: 'ng/mL', reference: '30 – 100', flag: 'low' }
          ]},
          { testId: 'vitb12', testName: 'Vitamin B12', subtests: [
            { name: 'Vitamin B12', value: '190', unit: 'pg/mL', reference: '200 – 900', flag: 'low' }
          ]},
        ],
        remarks: 'Mild subclinical hypothyroidism (TSH 5.4) with Vitamin D and B12 deficiencies.',
        reportedBy: 'Dr. Lab Admin',
        reportedAt: new Date('2026-07-10T08:00:00.000Z'),
      },
    },

    // --- PREETHI DEVI: Visit 2 (August 2026) ----------------
    {
      id: 'SHL-1708-0002',
      status: 'PROCESSING',
      patientName: 'Preethi Devi', patientPhone: '9871234567',
      patientAddress: '15, Banjara Hills, Road No. 12, Hyderabad – 500034',
      patientAge: '35', patientGender: 'FEMALE',
      preferredDate: '2026-08-18', preferredTime: '08:00',
      notes: '',
      assignedTo: lb2.id,
      collectionNotes: 'Sample collected successfully. Patient was calm and cooperative.',
      collectedAt: new Date('2026-08-18T02:30:00.000Z'),
      createdAt: new Date('2026-08-17T04:45:00.000Z'),
      tests: ['cbc', 'thyroid3', 'vitd', 'vitb12'],
      report: null,
    },

    // --- OTHER PATIENTS -------------------------------------
    {
      id: 'SHL-1808-0003',
      status: 'COLLECTED',
      patientName: 'Suresh Kumar', patientPhone: '9988776655',
      patientAddress: '8, Madhapur, HITEC City Area, Hyderabad – 500081',
      patientAge: '45', patientGender: 'MALE',
      preferredDate: '2026-08-18', preferredTime: '09:00',
      notes: 'Morning fasting sample required',
      assignedTo: lb1.id,
      collectionNotes: '',
      collectedAt: new Date('2026-08-18T03:45:00.000Z'),
      createdAt: new Date('2026-08-18T01:30:00.000Z'),
      tests: ['kft', 'urine', 'uric'],
      report: null,
    },
    {
      id: 'SHL-1808-0004',
      status: 'ASSIGNED',
      patientName: 'Fatima Begum', patientPhone: '9900112233',
      patientAddress: '22, Tolichowki, Hyderabad – 500008',
      patientAge: '60', patientGender: 'FEMALE',
      preferredDate: '2026-08-19', preferredTime: '07:30',
      notes: 'Elderly patient – please handle gently',
      assignedTo: lb2.id,
      collectionNotes: '',
      collectedAt: null,
      createdAt: new Date('2026-08-18T03:00:00.000Z'),
      tests: [],
      report: null,
    },
    {
      id: 'SHL-1808-0005',
      status: 'BOOKED',
      patientName: 'Mohammed Rafi', patientPhone: '9812345678',
      patientAddress: '5, Nampally, Hyderabad – 500001',
      patientAge: '38', patientGender: 'MALE',
      preferredDate: '2026-08-20', preferredTime: '08:00',
      notes: '',
      assignedTo: null,
      collectionNotes: '',
      collectedAt: null,
      createdAt: new Date('2026-08-18T04:15:00.000Z'),
      tests: [],
      report: null,
    },
  ];

  for (const b of bookings) {
    const { tests, report, ...bookingData } = b;

    const booking = await prisma.booking.upsert({
      where:  { id: bookingData.id },
      update: {},
      create: {
        ...bookingData,
        tests: {
          create: tests.map(testId => ({ testId })),
        },
      },
    });

    if (report) {
      await prisma.report.upsert({
        where:  { bookingId: booking.id },
        update: {},
        create: {
          bookingId:  booking.id,
          results:    report.results,
          remarks:    report.remarks,
          reportedBy: report.reportedBy,
          reportedAt: report.reportedAt,
        },
      });
    }

    console.log(`✅ Booking seeded: ${booking.id} (${booking.status})`);
  }

  console.log('\n🎉 Seed complete! Login: admin / admin123');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
