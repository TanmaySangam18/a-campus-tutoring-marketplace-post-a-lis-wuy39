import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const inMemoryStore = [];

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (supabase) {
    const { data, error } = await supabase.from('tutors').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch tutors' });
    }
    return res.json(data);
  } else {
    return res.json(inMemoryStore);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (supabase) {
    const { name, subject } = req.body;
    const { data, error } = await supabase.from('tutors').insert([{ name, subject }]);
    if (error) {
      return res.status(500).json({ error: 'Failed to create tutor' });
    }
    return res.json(data[0]);
  } else {
    const { name, subject } = req.body;
    const tutor = { id: inMemoryStore.length + 1, name, subject };
    inMemoryStore.push(tutor);
    return res.json(tutor);
  }
}
