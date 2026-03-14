import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let { data: settings, error } = await supabase.from('settings').select('*').limit(1).single();
    
    if (error || !settings) {
      // Return default if none found
      settings = {
        website_title: 'Metal Art & Product Design',
        admin_email: 'avrevlab@gmail.com',
        admin_phone: '8807972934'
      };
    }
    
    res.json({
      websiteTitle: settings.website_title,
      adminEmail: settings.admin_email,
      adminPhone: settings.admin_phone,
      logoUrl: settings.logo_url
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (admin)
router.put('/', authenticateAdmin, upload.single('logo'), async (req: any, res) => {
  try {
    const { websiteTitle, adminEmail, adminPhone, adminName } = req.body;
    
    let { data: settings } = await supabase.from('settings').select('*').limit(1).single();
    
    const updateData: any = {};
    if (websiteTitle) updateData.website_title = websiteTitle;
    if (adminEmail) updateData.admin_email = adminEmail;
    if (adminPhone) updateData.admin_phone = adminPhone;

    if (req.file) {
      updateData.logo_url = await uploadToCloudinary(req.file.buffer);
    }

    if (!settings) {
      // Insert
      const { data: newSettings } = await supabase.from('settings').insert([updateData]).select().single();
      settings = newSettings;
    } else {
      // Update
      const { data: updatedSettings } = await supabase.from('settings').update(updateData).eq('id', settings.id).select().single();
      settings = updatedSettings;
    }

    if (adminName) {
      await supabase.from('admins').update({ name: adminName }).eq('id', req.adminId);
    }

    res.json({
      websiteTitle: settings?.website_title,
      adminEmail: settings?.admin_email,
      adminPhone: settings?.admin_phone,
      logoUrl: settings?.logo_url
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
