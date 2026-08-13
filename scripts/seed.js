const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Supplier = require('../models/Supplier');
const Buyer = require('../models/Buyer');
const PaddyEntry = require('../models/PaddyEntry');
const ProductionBatch = require('../models/ProductionBatch');
const Warehouse = require('../models/Warehouse');
const InventoryItem = require('../models/InventoryItem');
const Sale = require('../models/Sale');
const Payment = require('../models/Payment');
const LedgerEntry = require('../models/LedgerEntry');
const Worker = require('../models/Worker');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');
const SparePart = require('../models/SparePart');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new_erp_demo';

async function connect() {
  // Mongoose 6+ no longer requires or supports useNewUrlParser/useUnifiedTopology options
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to', MONGODB_URI);
}

async function seed() {
  try {
    await connect();

    // Clear existing
    await Promise.all([
      User.deleteMany({}), Farmer.deleteMany({}), Supplier.deleteMany({}), Buyer.deleteMany({}),
      PaddyEntry.deleteMany({}), ProductionBatch.deleteMany({}), Warehouse.deleteMany({}), InventoryItem.deleteMany({}),
      Sale.deleteMany({}), Payment.deleteMany({}), LedgerEntry.deleteMany({}), Worker.deleteMany({}), Attendance.deleteMany({}),
      SalaryRecord.deleteMany({}), SparePart.deleteMany({})
    ]);

    // Create admin user
    const admin = new User({ username: 'admin', email: 'admin@demo.com', password: 'Admin@123', fullName: 'Administrator', department: 'it', role: 'admin' });
    await admin.save();

    // Farmers
    const f1 = new Farmer({ farmerId: 'F-1001', name: 'Ramesh Kumar', type: 'Farmer', contact: '9876543210', address: 'Mandya, Karnataka' });
    const f2 = new Farmer({ farmerId: 'F-1002', name: 'Siva Prasad', type: 'Paik', contact: '8765432109', address: 'Kurnool, AP' });
    await f1.save(); await f2.save();

    // Suppliers
    const s1 = new Supplier({ supplierId: 'SUP-1001', name: 'Sri Balaji Traders', type: 'Dealer', phone: '9845123456', address: 'Hubli', balance: 1748500 });
    await s1.save();

    // Buyers
    const b1 = new Buyer({ buyerId: 'B-1001', name: 'Hindustan Rice Exports', address: 'Mumbai', creditLimit: 2000000 });
    await b1.save();

    // Warehouses
    const w1 = new Warehouse({ warehouseId: 'warehouse-1', name: 'Warehouse 1 - Finished Goods', type: 'Warehouse', location: 'Plant 1', capacity: 50000, currentStock: 24000 });
    await w1.save();

    // Inventory
    const inv1 = new InventoryItem({ sku: 'INV-002', name: 'Broken Rice 25kg', category: 'Finished', quantity: 2000, warehouseId: 'warehouse-2' });
    await inv1.save();

    // Paddy entry
    const pe = new PaddyEntry({ entryId: 'PE-2001', vehicleNo: 'KA-01-AA-0001', supplierId: 'F-1001', variety: 'Sona Masuri', grossWeight: 12000, tareWeight: 400, netWeight: 11600, moisture: 12.3, silo: 'silo-1', status: 'Weighed' });
    await pe.save();

    // Production batch
    const pb = new ProductionBatch({ batchId: 'PB-2001', variety: 'Sona Masuri', status: 'Milling', inputWeight: 12000, outputWeight: 8000, warehouse: 'warehouse-1' });
    await pb.save();

    // Sales
    const sale = new Sale({ saleId: 'S-2001', buyerId: 'B-2001', sku: 'INV-002', quantity: 100, rate: 40, total: 4000 });
    await sale.save();

    // Payments & ledger
    const pay = new Payment({ paymentId: 'P-2001', partyType: 'supplier', partyId: 'SUP-2001', amount: 15000, mode: 'bank', reference: 'INV-2001' });
    await pay.save();
    const led = new LedgerEntry({ entryId: 'L-2001', account: 'Cash', type: 'debit', amount: 15000, reference: 'P-2001' });
    await led.save();

    // Workers, attendance, salary
    const wrk = new Worker({ workerId: 'WRK-10', name: 'Test Worker', type: 'Daily-Waged', section: 'Packing', wage: 400, mobile: '9000000002' });
    await wrk.save();
    const att = new Attendance({ date: '2026-08-13', shift: 'Shift A', records: { 'WRK-10': { status: 'Present', ot: 2 } } });
    await att.save();
    const sal = new SalaryRecord({ salaryId: 'SAL-2026-08-WRK-10', workerId: 'WRK-10', period: '2026-08', gross: 12000, deductions: 0, ot: 2, net: 12200 });
    await sal.save();

    // Spare parts
    const sp = new SparePart({ partId: 'SP-200', name: 'Test Bolt', category: 'Hardware', stock: 50, reorderLevel: 10, unit: 'units' });
    await sp.save();

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
