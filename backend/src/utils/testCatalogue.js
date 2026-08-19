/* ============================================================
   Test Catalogue — Sahara Lab
   Ported from app.js TEST_CATALOGUE (source of truth)
   ============================================================ */

const TEST_CATALOGUE = [
  // ---- HAEMATOLOGY ----------------------------------------
  {
    id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Haematology', price: 250,
    subTests: [
      { name: 'Hemoglobin',        unit: 'g/dL',      refMale: '13.0 – 17.0', refFemale: '12.0 – 16.0' },
      { name: 'RBC Count',         unit: 'mill/μL',   refMale: '4.5 – 5.5',   refFemale: '4.0 – 5.0' },
      { name: 'WBC Count',         unit: 'cells/μL',  ref: '4000 – 11000' },
      { name: 'Platelet Count',    unit: 'lakh/μL',   ref: '1.5 – 4.5' },
      { name: 'Hematocrit (PCV)',  unit: '%',         refMale: '40 – 50',     refFemale: '36 – 46' },
      { name: 'MCV',               unit: 'fL',        ref: '80 – 100' },
      { name: 'MCH',               unit: 'pg',        ref: '27 – 32' },
      { name: 'MCHC',              unit: 'g/dL',      ref: '31.5 – 34.5' },
      { name: 'Neutrophils',       unit: '%',         ref: '40 – 70' },
      { name: 'Lymphocytes',       unit: '%',         ref: '20 – 40' },
      { name: 'Monocytes',         unit: '%',         ref: '2 – 8' },
      { name: 'Eosinophils',       unit: '%',         ref: '1 – 4' },
      { name: 'Basophils',         unit: '%',         ref: '0 – 1' },
      { name: 'ESR',               unit: 'mm/hr',     refMale: '0 – 15',      refFemale: '0 – 20' },
    ]
  },
  { id: 'esr', name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Haematology', price: 80,
    subTests: [{ name: 'ESR', unit: 'mm/hr', refMale: '0 – 15', refFemale: '0 – 20' }] },
  { id: 'iron', name: 'Iron Studies', category: 'Haematology', price: 400,
    subTests: [
      { name: 'Serum Iron',             unit: 'μg/dL',  refMale: '65 – 175', refFemale: '50 – 170' },
      { name: 'TIBC',                   unit: 'μg/dL',  ref: '250 – 370' },
      { name: 'Transferrin Saturation', unit: '%',      ref: '20 – 50' },
      { name: 'Serum Ferritin',         unit: 'ng/mL',  refMale: '12 – 300', refFemale: '12 – 150' },
    ]
  },
  // ---- BLOOD SUGAR ----------------------------------------
  { id: 'fbs',   name: 'Fasting Blood Sugar (FBS)',       category: 'Biochemistry', price: 80,
    subTests: [{ name: 'Glucose (Fasting)', unit: 'mg/dL', ref: '70 – 100' }] },
  { id: 'ppbs',  name: 'Post Prandial Blood Sugar (PPBS)', category: 'Biochemistry', price: 80,
    subTests: [{ name: 'Glucose (2-hr PP)', unit: 'mg/dL', ref: '< 140' }] },
  { id: 'rbs',   name: 'Random Blood Sugar (RBS)',         category: 'Biochemistry', price: 80,
    subTests: [{ name: 'Glucose (Random)', unit: 'mg/dL', ref: '70 – 140' }] },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)',     category: 'Biochemistry', price: 350,
    subTests: [{ name: 'HbA1c', unit: '%', ref: '< 5.7 Normal | 5.7–6.4 Pre-diabetic | ≥ 6.5 Diabetic' }] },
  // ---- LIPID PROFILE --------------------------------------
  { id: 'lipid', name: 'Lipid Profile', category: 'Biochemistry', price: 450,
    subTests: [
      { name: 'Total Cholesterol', unit: 'mg/dL', ref: '< 200' },
      { name: 'HDL Cholesterol',   unit: 'mg/dL', refMale: '> 40', refFemale: '> 50' },
      { name: 'LDL Cholesterol',   unit: 'mg/dL', ref: '< 100' },
      { name: 'VLDL Cholesterol',  unit: 'mg/dL', ref: '< 30' },
      { name: 'Triglycerides',     unit: 'mg/dL', ref: '< 150' },
      { name: 'Total/HDL Ratio',   unit: '',       ref: '< 5.0' },
    ]
  },
  // ---- LFT ------------------------------------------------
  { id: 'lft', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 500,
    subTests: [
      { name: 'Total Bilirubin',      unit: 'mg/dL', ref: '0.3 – 1.2' },
      { name: 'Direct Bilirubin',     unit: 'mg/dL', ref: '0.0 – 0.4' },
      { name: 'Indirect Bilirubin',   unit: 'mg/dL', ref: '0.1 – 0.8' },
      { name: 'SGOT (AST)',           unit: 'U/L',   ref: '10 – 40' },
      { name: 'SGPT (ALT)',           unit: 'U/L',   ref: '7 – 56' },
      { name: 'Alkaline Phosphatase', unit: 'U/L',   ref: '44 – 147' },
      { name: 'Total Protein',        unit: 'g/dL',  ref: '6.3 – 8.2' },
      { name: 'Albumin',              unit: 'g/dL',  ref: '3.5 – 5.0' },
      { name: 'Globulin',             unit: 'g/dL',  ref: '2.3 – 3.5' },
      { name: 'A/G Ratio',            unit: '',      ref: '1.2 – 2.2' },
      { name: 'GGT',                  unit: 'U/L',   refMale: '7 – 47', refFemale: '5 – 25' },
    ]
  },
  // ---- KFT ------------------------------------------------
  { id: 'kft', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: 450,
    subTests: [
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL',            ref: '7 – 25' },
      { name: 'Serum Creatinine',          unit: 'mg/dL',            refMale: '0.7 – 1.2', refFemale: '0.5 – 1.0' },
      { name: 'Uric Acid',                 unit: 'mg/dL',            refMale: '3.5 – 7.2', refFemale: '2.6 – 6.0' },
      { name: 'Sodium (Na)',               unit: 'mEq/L',            ref: '136 – 145' },
      { name: 'Potassium (K)',             unit: 'mEq/L',            ref: '3.5 – 5.1' },
      { name: 'Chloride (Cl)',             unit: 'mEq/L',            ref: '98 – 107' },
      { name: 'Calcium',                   unit: 'mg/dL',            ref: '8.6 – 10.2' },
      { name: 'Phosphorus',               unit: 'mg/dL',             ref: '2.5 – 4.5' },
      { name: 'eGFR',                     unit: 'mL/min/1.73m²',    ref: '> 60' },
    ]
  },
  // ---- THYROID --------------------------------------------
  { id: 'tsh',     name: 'TSH (Thyroid Stimulating Hormone)', category: 'Endocrinology', price: 250,
    subTests: [{ name: 'TSH', unit: 'mIU/L', ref: '0.4 – 4.0' }] },
  { id: 'thyroid3', name: 'Thyroid Profile (T3, T4, TSH)',   category: 'Endocrinology', price: 500,
    subTests: [
      { name: 'T3 (Triiodothyronine)', unit: 'ng/dL',  ref: '80 – 200' },
      { name: 'T4 (Thyroxine)',        unit: 'μg/dL',  ref: '5.0 – 12.0' },
      { name: 'TSH',                   unit: 'mIU/L',  ref: '0.4 – 4.0' },
    ]
  },
  // ---- VITAMINS -------------------------------------------
  { id: 'vitd',  name: 'Vitamin D (25-OH)', category: 'Vitamins', price: 600,
    subTests: [{ name: 'Vitamin D (25-OH)', unit: 'ng/mL', ref: '30 – 100 (Optimal > 40)' }] },
  { id: 'vitb12', name: 'Vitamin B12',      category: 'Vitamins', price: 500,
    subTests: [{ name: 'Vitamin B12', unit: 'pg/mL', ref: '200 – 900' }] },
  // ---- URINE -----------------------------------------------
  { id: 'urine', name: 'Urine Routine & Microscopy', category: 'Microbiology', price: 120,
    subTests: [
      { name: 'Colour',            unit: '',      ref: 'Pale Yellow' },
      { name: 'Appearance',        unit: '',      ref: 'Clear' },
      { name: 'pH',                unit: '',      ref: '4.5 – 8.0' },
      { name: 'Specific Gravity',  unit: '',      ref: '1.005 – 1.030' },
      { name: 'Protein',           unit: '',      ref: 'Absent / Negative' },
      { name: 'Glucose',           unit: '',      ref: 'Absent / Negative' },
      { name: 'Ketones',           unit: '',      ref: 'Absent / Negative' },
      { name: 'Blood / RBCs',      unit: '/HPF',  ref: '0 – 2' },
      { name: 'Pus Cells (WBC)',   unit: '/HPF',  ref: '0 – 5' },
      { name: 'Epithelial Cells',  unit: '',      ref: 'Few' },
      { name: 'Casts',             unit: '',      ref: 'Absent' },
      { name: 'Bacteria',          unit: '',      ref: 'Absent' },
    ]
  },
  // ---- SEROLOGY -------------------------------------------
  { id: 'hbsag',  name: 'HBsAg (Hepatitis B)',      category: 'Serology', price: 150,
    subTests: [{ name: 'HBsAg',              unit: '', ref: 'Non-Reactive' }] },
  { id: 'hiv',    name: 'HIV I & II Antibody',      category: 'Serology', price: 150,
    subTests: [{ name: 'HIV I & II Antibody', unit: '', ref: 'Non-Reactive' }] },
  { id: 'hcv',    name: 'Anti-HCV (Hepatitis C)',   category: 'Serology', price: 200,
    subTests: [{ name: 'Anti-HCV',            unit: '', ref: 'Non-Reactive' }] },
  { id: 'vdrl',   name: 'VDRL (Syphilis)',           category: 'Serology', price: 100,
    subTests: [{ name: 'VDRL',                unit: '', ref: 'Non-Reactive' }] },
  { id: 'dengue', name: 'Dengue NS1 Antigen',        category: 'Serology', price: 300,
    subTests: [{ name: 'Dengue NS1 Antigen',  unit: '', ref: 'Non-Reactive' }] },
  { id: 'malaria', name: 'Malaria (Rapid Test)',     category: 'Serology', price: 150,
    subTests: [
      { name: 'Plasmodium falciparum', unit: '', ref: 'Negative' },
      { name: 'Plasmodium vivax',      unit: '', ref: 'Negative' },
    ]
  },
  { id: 'widal', name: 'Widal Test (Typhoid)', category: 'Serology', price: 150,
    subTests: [
      { name: 'Salmonella typhi O',  unit: 'Titer', ref: '< 1:80' },
      { name: 'Salmonella typhi H',  unit: 'Titer', ref: '< 1:80' },
      { name: 'S. para-typhi AH',   unit: 'Titer', ref: '< 1:80' },
      { name: 'S. para-typhi BH',   unit: 'Titer', ref: '< 1:80' },
    ]
  },
  // ---- BIOCHEMISTRY (individual) --------------------------
  { id: 'crp',         name: 'C-Reactive Protein (CRP)',           category: 'Biochemistry', price: 200,
    subTests: [{ name: 'CRP',             unit: 'mg/L',  ref: '< 5.0' }] },
  { id: 'ra',          name: 'RA Factor (Rheumatoid Arthritis)',   category: 'Biochemistry', price: 200,
    subTests: [{ name: 'RA Factor',       unit: 'IU/mL', ref: '< 14' }] },
  { id: 'sgot',        name: 'SGOT / AST',                         category: 'Biochemistry', price: 100,
    subTests: [{ name: 'SGOT (AST)',      unit: 'U/L',   ref: '10 – 40' }] },
  { id: 'sgpt',        name: 'SGPT / ALT',                         category: 'Biochemistry', price: 100,
    subTests: [{ name: 'SGPT (ALT)',      unit: 'U/L',   ref: '7 – 56' }] },
  { id: 'creatinine',  name: 'Creatinine (Serum)',                 category: 'Biochemistry', price: 120,
    subTests: [{ name: 'Creatinine',      unit: 'mg/dL', refMale: '0.7 – 1.2', refFemale: '0.5 – 1.0' }] },
  { id: 'urea',        name: 'Blood Urea',                         category: 'Biochemistry', price: 100,
    subTests: [{ name: 'Blood Urea',      unit: 'mg/dL', ref: '15 – 45' }] },
  { id: 'uric',        name: 'Uric Acid (Serum)',                  category: 'Biochemistry', price: 120,
    subTests: [{ name: 'Uric Acid',       unit: 'mg/dL', refMale: '3.5 – 7.2', refFemale: '2.6 – 6.0' }] },
  { id: 'electrolytes', name: 'Electrolytes (Na, K, Cl)',          category: 'Biochemistry', price: 300,
    subTests: [
      { name: 'Sodium (Na)',    unit: 'mEq/L', ref: '136 – 145' },
      { name: 'Potassium (K)', unit: 'mEq/L', ref: '3.5 – 5.1' },
      { name: 'Chloride (Cl)', unit: 'mEq/L', ref: '98 – 107' },
    ]
  },
  { id: 'calcium',  name: 'Calcium (Serum)',                    category: 'Biochemistry', price: 150,
    subTests: [{ name: 'Calcium',        unit: 'mg/dL',   ref: '8.6 – 10.2' }] },
  { id: 'psa',      name: 'PSA (Prostate Specific Antigen)',    category: 'Oncology',     price: 500,
    subTests: [{ name: 'Total PSA',      unit: 'ng/mL',   ref: '< 4.0' }] },
  { id: 'insulin',  name: 'Fasting Insulin',                    category: 'Endocrinology', price: 500,
    subTests: [{ name: 'Insulin (Fasting)', unit: 'μIU/mL', ref: '2 – 25' }] },
  { id: 'cortisol', name: 'Cortisol AM',                        category: 'Endocrinology', price: 600,
    subTests: [{ name: 'Cortisol (Morning)', unit: 'μg/dL', ref: '6.2 – 19.4' }] },
  { id: 'albumin',  name: 'Albumin (Serum)',                    category: 'Biochemistry', price: 120,
    subTests: [{ name: 'Albumin',        unit: 'g/dL',    ref: '3.5 – 5.0' }] },
  { id: 'magnesium', name: 'Magnesium (Serum)',                 category: 'Biochemistry', price: 200,
    subTests: [{ name: 'Magnesium',      unit: 'mg/dL',   ref: '1.7 – 2.4' }] },
];

const getTestById  = (id) => TEST_CATALOGUE.find(t => t.id === id) || null;
const getTestsByIds = (ids) => ids.map(id => getTestById(id)).filter(Boolean);

module.exports = { TEST_CATALOGUE, getTestById, getTestsByIds };
