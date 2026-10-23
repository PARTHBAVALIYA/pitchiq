import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Saves a newsletter subscriber email to Supabase.
 * Falls back safely to localStorage if Supabase credentials are not yet set.
 *
 * @param {string} email - The subscriber's email address
 * @param {string} [pitchPreview=''] - Optional brief snippet of pitch tested
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function saveSubscriberEmail(email, pitchPreview = '') {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Always cache in localStorage as resilient offline fallback
  try {
    localStorage.setItem('pitchiq_newsletter_joined', cleanEmail);
    const existing = JSON.parse(localStorage.getItem('pitchiq_subscribers') || '[]');
    if (!existing.includes(cleanEmail)) {
      existing.push(cleanEmail);
      localStorage.setItem('pitchiq_subscribers', JSON.stringify(existing));
    }
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // 2. If Supabase is configured, insert to Supabase 'subscribers' table
  if (supabase) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([
          {
            email: cleanEmail,
            pitch_preview: pitchPreview.slice(0, 150),
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        // If it's a unique constraint violation (email already exists), treat as success
        if (error.code === '23505') {
          return { success: true };
        }
        console.warn('Supabase insertion error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.warn('Network error pushing to Supabase:', err);
      return { success: false, error: err.message };
    }
  } else {
    console.info('Supabase not yet configured. Saved subscriber to localStorage fallback.');
    return { success: true };
  }
}
