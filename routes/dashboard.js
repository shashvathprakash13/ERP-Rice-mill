const express = require('express');
const router = express.Router();

// Simple Dashboard mock controller returning aggregated data
router.get('/', async (req, res) => {
  // If DB is available later, replace this with real aggregation queries
  const mockData = {
    warehouses: [
      { id: 'silo-1', name: 'Silo A - Premium Basmati', stockValue: 1250000 },
      { id: 'silo-2', name: 'Silo B - Non-Basmati Raw', stockValue: 820000 },
    ],
    millingBatches: [
      { id: 'B-26-089', variety: 'Sona Masuri', progress: 65, status: 'Milling' },
      { id: 'B-26-090', variety: 'Jyothi Rice', progress: 30, status: 'Drying' },
    ],
    incomingVehicles: [
      { vehicleNo: 'KA-34-F-8920', supplierType: 'Farmer', weight: '12.4 Tons', time: '19:12' },
      { vehicleNo: 'AP-21-Y-4530', supplierType: 'Dealer', weight: '18.2 Tons', time: '18:45' },
    ],
    finances: {
      receivables: 450000,
      payables: 220000,
      cash: 125000,
    },
    generatedAt: new Date().toISOString(),
  };

  res.json({ data: mockData });
});

module.exports = router;
