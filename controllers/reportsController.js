// Basic Reports controller - returns simple aggregates and allows CSV export (basic)
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

exports.summary = async (req, res) => {
  try {
    // For beginners, return a simple static summary or minimal DB aggregates
    if (!dbIsUp()) {
      return res.json({ data: { totalSuppliers: 12, totalBuyers: 8, inventoryValue: 1250000, generatedAt: new Date().toISOString() }, note: 'DB offline - returning mock summary' });
    }

    // Minimal aggregation example - counts (real projects will expand this)
    const Supplier = require('../models/Supplier');
    const Buyer = require('../models/Buyer');
    const InventoryItem = require('../models/InventoryItem');

    const [suppliersCount, buyersCount, inventorySum] = await Promise.all([
      Supplier.countDocuments(),
      Buyer.countDocuments(),
      InventoryItem.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }])
    ]);

    res.json({ data: { totalSuppliers: suppliersCount, totalBuyers: buyersCount, inventoryQuantity: inventorySum[0] ? inventorySum[0].total : 0, generatedAt: new Date().toISOString() } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.exportCSV = async (req, res) => {
  try {
    // For beginners, support exporting mock CSV for inventory
    const csv = 'sku,name,quantity\nINV-002,Broken Rice 25kg,2000\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
