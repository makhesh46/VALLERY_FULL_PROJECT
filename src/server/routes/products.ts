import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Get all published products (public)
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map snake_case to camelCase for frontend compatibility
    const formattedProducts = products.map(p => ({
      ...p,
      isPublished: p.is_published,
      imageUrl: p.image_url,
      _id: p.id // Keep _id for frontend compatibility
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products (admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedProducts = products.map(p => ({
      ...p,
      isPublished: p.is_published,
      imageUrl: p.image_url,
      _id: p.id
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    
    res.json({
      ...product,
      isPublished: product.is_published,
      imageUrl: product.image_url,
      _id: product.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, isPublished, category } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        title: name,
        price: Number(price),
        description,
        image_url: imageUrl,
        is_published: isPublished === 'true',
        category: category || 'General'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      ...product,
      isPublished: product.is_published,
      imageUrl: product.image_url,
      _id: product.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, isPublished, category } = req.body;
    const updateData: any = { 
      title: name, 
      price: Number(price), 
      description, 
      is_published: isPublished === 'true',
      category: category || 'General'
    };

    if (req.file) {
      updateData.image_url = await uploadToCloudinary(req.file.buffer);
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    
    res.json({
      ...product,
      isPublished: product.is_published,
      imageUrl: product.image_url,
      _id: product.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
