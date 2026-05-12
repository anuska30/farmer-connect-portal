// backend/controllers/farmerController.js

const Crop = require('../models/Crop');

// ─── ADD A CROP ───────────────────────────────────────
const addCrop = async (req, res) => {
  try {
    // Step 1: Get crop details from request body
    const { name, description, price, unit, quantity, category } = req.body;

    // Step 2: Check all required fields
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Step 3: Create crop in MongoDB
    // req.user comes from our JWT middleware (logged in farmer)
    const crop = await Crop.create({
      name,
      description,
      price,
      unit,
      quantity,
      category,
      farmer: req.user.id    // automatically set to logged in farmer
    });

    res.status(201).json({
      message: '✅ Crop added successfully!',
      crop
    });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};


// ─── GET ALL CROPS ────────────────────────────────────
const getAllCrops = async (req, res) => {
  try {
    // Find all available crops and show farmer name + email
    const crops = await Crop.find({ isAvailable: true })
      .populate('farmer', 'name email');  // replaces farmer ID with name & email

    res.status(200).json({
      message: '✅ All crops fetched!',
      count: crops.length,
      crops
    });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};


// ─── GET MY CROPS (only logged in farmer's crops) ─────
const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id });

    res.status(200).json({
      message: '✅ Your crops fetched!',
      count: crops.length,
      crops
    });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};


// ─── UPDATE A CROP ────────────────────────────────────
const updateCrop = async (req, res) => {
  try {
    // Step 1: Find crop by ID
    const crop = await Crop.findById(req.params.id);

    // Step 2: Check if crop exists
    if (!crop) {
      return res.status(404).json({ message: '❌ Crop not found' });
    }

    // Step 3: Make sure only the owner can update
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Not authorized to update this crop' });
    }

    // Step 4: Update the crop
    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // returns updated version
    );

    res.status(200).json({
      message: '✅ Crop updated successfully!',
      crop: updatedCrop
    });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};


// ─── DELETE A CROP ────────────────────────────────────
const deleteCrop = async (req, res) => {
  try {
    // Step 1: Find crop by ID
    const crop = await Crop.findById(req.params.id);

    // Step 2: Check if crop exists
    if (!crop) {
      return res.status(404).json({ message: '❌ Crop not found' });
    }

    // Step 3: Make sure only the owner can delete
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Not authorized to delete this crop' });
    }

    // Step 4: Delete the crop
    await Crop.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: '✅ Crop deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};


module.exports = { addCrop, getAllCrops, getMyCrops, updateCrop, deleteCrop };
