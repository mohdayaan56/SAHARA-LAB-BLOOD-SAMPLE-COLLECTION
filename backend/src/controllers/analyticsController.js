/* ============================================================
   Patient Health Analytics & Trends Controller
   ============================================================ */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── GET /api/patient/analytics ──────────────────────────────
// Query parameters: ?phone=9876543210 OR ?bookingId=SHL-1608-0001
const getPatientAnalytics = async (req, res, next) => {
  try {
    const { phone, bookingId, identifier } = req.query;
    const targetQuery = (phone || bookingId || identifier || '').trim();

    if (!targetQuery) {
      return res.status(400).json({ error: 'Please provide a patient phone number or booking ID.' });
    }

    // 1. Resolve patient phone number
    let patientPhone = '';
    if (/^\d{10}$/.test(targetQuery)) {
      patientPhone = targetQuery;
    } else {
      const match = await prisma.booking.findFirst({
        where: {
          OR: [
            { id: { equals: targetQuery, mode: 'insensitive' } },
            { patientPhone: targetQuery },
          ],
        },
      });
      if (match) patientPhone = match.patientPhone;
    }

    if (!patientPhone) {
      return res.status(404).json({ error: 'No patient record found for the provided identifier.' });
    }

    // 2. Fetch all bookings for this patient phone (with reports and tests)
    const bookings = await prisma.booking.findMany({
      where: { patientPhone },
      include: {
        tests: true,
        report: true,
        staff: { select: { name: true, staffCode: true } },
      },
      orderBy: { preferredDate: 'asc' },
    });

    if (!bookings.length) {
      return res.status(404).json({ error: 'No medical history found for this patient.' });
    }

    // 3. Patient Profile Summary
    const latestBooking = bookings[bookings.length - 1];
    const patientProfile = {
      name:        latestBooking.patientName,
      phone:       latestBooking.patientPhone,
      age:         latestBooking.patientAge || '—',
      gender:      latestBooking.patientGender.toLowerCase(),
      address:     latestBooking.patientAddress,
      totalVisits: bookings.length,
      firstVisit:  bookings[0].preferredDate,
      latestVisit: latestBooking.preferredDate,
    };

    // 4. Chronological Parameter Tracking across all completed reports
    const parameterMap = {}; // name -> [{ date, bookingId, value, numValue, unit, reference, flag }]
    const readyReports = bookings.filter(b => b.report && b.report.results);

    readyReports.forEach(b => {
      const date = b.preferredDate;
      const results = b.report.results || [];

      results.forEach(testGroup => {
        const subtests = testGroup.subtests || [];
        subtests.forEach(sub => {
          if (!sub.name) return;
          const paramKey = sub.name.trim();
          const cleanNum = parseFloat(String(sub.value || '').replace(/[^\d.-]/g, ''));

          if (!parameterMap[paramKey]) {
            parameterMap[paramKey] = {
              name:      paramKey,
              testName:  testGroup.testName || '',
              unit:      sub.unit || '',
              reference: sub.reference || '',
              history:   [],
            };
          }

          parameterMap[paramKey].history.push({
            date,
            bookingId: b.id,
            rawValue:  sub.value,
            value:     isNaN(cleanNum) ? null : cleanNum,
            unit:      sub.unit || parameterMap[paramKey].unit,
            reference: sub.reference || parameterMap[paramKey].reference,
            flag:      sub.flag || 'normal',
          });
        });
      });
    });

    // 5. Process Summaries & Trend Deltas for each tracked parameter
    const trackedParameters = Object.values(parameterMap)
      .filter(p => p.history.some(h => h.value !== null)) // only numeric/chartable parameters
      .map(p => {
        const validValues = p.history.filter(h => h.value !== null);
        const latest = validValues[validValues.length - 1];
        const previous = validValues.length > 1 ? validValues[validValues.length - 2] : null;
        const nums = validValues.map(h => h.value);

        const delta = previous !== null ? Number((latest.value - previous.value).toFixed(2)) : null;
        const deltaPercent = previous !== null && previous.value !== 0
          ? Number(((delta / previous.value) * 100).toFixed(1))
          : null;

        return {
          name:         p.name,
          testName:     p.testName,
          unit:         p.unit,
          reference:    p.reference,
          history:      p.history,
          latestValue:  latest ? latest.value : null,
          latestFlag:   latest ? latest.flag : 'normal',
          latestDate:   latest ? latest.date : null,
          previousValue: previous ? previous.value : null,
          delta,
          deltaPercent,
          min:          Math.min(...nums),
          max:          Math.max(...nums),
          count:        validValues.length,
        };
      });

    // 6. Curate Specific High-Value Categories (Diabetic, Lipid, Blood, Liver/Kidney)
    const categoryHighlights = {
      diabetes:   trackedParameters.filter(p => ['HbA1c', 'Glucose (Fasting)', 'Glucose (Random)', 'Glucose (2-hr PP)'].includes(p.name)),
      lipid:      trackedParameters.filter(p => ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL Cholesterol', 'Total/HDL Ratio'].includes(p.name)),
      cbc:        trackedParameters.filter(p => ['Hemoglobin', 'Platelet Count', 'WBC Count', 'RBC Count', 'ESR'].includes(p.name)),
      vitamins:   trackedParameters.filter(p => ['Vitamin D (25-OH)', 'Vitamin B12', 'TSH'].includes(p.name)),
      kidneyLiver: trackedParameters.filter(p => ['Serum Creatinine', 'Blood Urea', 'Uric Acid', 'SGOT (AST)', 'SGPT (ALT)', 'Total Bilirubin'].includes(p.name)),
    };

    // 7. Generate Clinical Insights
    const insights = [];

    // Diabetic insights
    const hba1c = trackedParameters.find(p => p.name === 'HbA1c');
    if (hba1c && hba1c.history.length > 1) {
      if (hba1c.delta < 0) {
        insights.push({
          type: 'positive',
          icon: 'ri-arrow-down-line',
          title: 'HbA1c Improvement',
          message: `Your HbA1c decreased from ${hba1c.previousValue}% to ${hba1c.latestValue}% (${Math.abs(hba1c.deltaPercent)}% drop), indicating improved blood sugar regulation.`,
        });
      } else if (hba1c.delta > 0) {
        insights.push({
          type: 'warning',
          icon: 'ri-arrow-up-line',
          title: 'HbA1c Elevated',
          message: `Your HbA1c increased to ${hba1c.latestValue}%. Please discuss medication and diet with your physician.`,
        });
      }
    }

    // Fasting Blood Sugar
    const fbs = trackedParameters.find(p => p.name === 'Glucose (Fasting)');
    if (fbs && fbs.history.length > 1) {
      if (fbs.delta < 0) {
        insights.push({
          type: 'positive',
          icon: 'ri-heart-pulse-line',
          title: 'Fasting Sugar Reduced',
          message: `Fasting Blood Glucose lowered by ${Math.abs(fbs.delta)} mg/dL to reach ${fbs.latestValue} mg/dL.`,
        });
      }
    }

    // Cholesterol
    const chol = trackedParameters.find(p => p.name === 'Total Cholesterol');
    if (chol && chol.history.length > 1) {
      if (chol.delta < 0) {
        insights.push({
          type: 'positive',
          icon: 'ri-shield-check-line',
          title: 'Total Cholesterol Down',
          message: `Total Cholesterol dropped from ${chol.previousValue} mg/dL to ${chol.latestValue} mg/dL.`,
        });
      }
    }

    // General flags
    const highParams = trackedParameters.filter(p => p.latestFlag === 'high');
    const lowParams  = trackedParameters.filter(p => p.latestFlag === 'low');

    if (highParams.length > 0) {
      insights.push({
        type: 'info',
        icon: 'ri-information-line',
        title: 'Parameters Above Reference Range',
        message: `${highParams.map(p => p.name).slice(0, 3).join(', ')} were reported above standard clinical reference thresholds in your latest test.`,
      });
    }

    if (lowParams.length > 0) {
      insights.push({
        type: 'warning',
        icon: 'ri-alert-line',
        title: 'Deficiency / Low Markers',
        message: `${lowParams.map(p => p.name).slice(0, 3).join(', ')} are currently below optimal threshold. Consider dietary adjustments or supplements.`,
      });
    }

    // 8. Chronological Timeline of Visits
    const timeline = bookings.map(b => ({
      id:            b.id,
      date:          b.preferredDate,
      time:          b.preferredTime,
      status:        b.status.toLowerCase(),
      testsCount:    b.tests ? b.tests.length : 0,
      testIds:       b.tests ? b.tests.map(t => t.testId) : [],
      hasReport:     Boolean(b.report),
      remarks:       b.report?.remarks || '',
      reportedAt:    b.report?.reportedAt || null,
      collectedAt:   b.collectedAt,
    })).reverse();

    res.json({
      patient:            patientProfile,
      trackedParameters,
      categoryHighlights,
      insights,
      timeline,
      readyReportsCount:  readyReports.length,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPatientAnalytics };
