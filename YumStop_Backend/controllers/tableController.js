const Table = require('../models/tableModel');

exports.getTables = async (req, res, next) => {
    try {
        // Find all documents and apply collation sorting so strings containing numbers sort naturally 
        const tables = await Table.find()
            .sort({ tableNumber: 1 })
            .collation({ locale: 'en', numericOrdering: true });

        res.status(200).json({ status: 'success', data: tables });

    } catch (err) { 
        next(err); 
    }
};

exports.createTable = async (req, res, next) => {
  try {
    // The request body should contain the necessary fields: tableNumber, capacity, and optionally status
    const newTable = await Table.create(req.body);

    res.status(201).json({ 
        status: 'success', 
        data: newTable 
    });

  } catch (err) { 
    next(err); 
}
};

exports.updateTable = async (req, res, next) => {
  try {
    // The request body can contain any fields that need to be updated for the specified table ID
    const updatedTable = await Table.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { 
            new: true, 
            runValidators: true 
        });

    // If no table is found with the provided ID, return a 404 error response
    if (!updatedTable) 
        return res.status(404).json({ status: 'fail', message: 'Target index entry missing' });
    
    res.status(200).json({ status: 'success', data: updatedTable });

  } catch (err) { 
    next(err); 
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    // Attempt to delete the table with the specified ID
    const deleted = await Table.findByIdAndDelete(req.params.id);

    // If no table is found with the provided ID, return a 404 error response
    if (!deleted) 
        return res.status(404).json({ status: 'fail', message: 'Target index entry missing' });

    res.status(204).json({ status: 'success', data: null });

  } catch (err) { 
    next(err); 
}
};


exports.releaseTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const clearedTable = await Table.findByIdAndUpdate(
      id,
      {
        status: 'Available', // Reset back to default
        initials: '',        // Clear out the initials string
        activeOrderId: null  // Unlink the old order reference
      },
      { new: true }
    );

    if (!clearedTable) {
      return res.status(404).json({ status: 'fail', message: 'Table not found' });
    }

    res.status(200).json({ status: 'success', data: clearedTable });
  } catch (err) {
    next(err);
  }
};
