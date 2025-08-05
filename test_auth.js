import dotenv from "dotenv"
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aahgnsqdalbwaprnwxbm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const { data, error } = await supabase.auth.signUp({  email: 'zachw.edwards@gmail.com',  password: 'example-password',})
if (error) {
    console.log(error);
}
