import dotenv from "dotenv"
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aahgnsqdalbwaprnwxbm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const { data, error } = await supabase.from('testtable').insert({ flops: 2000, mem_bandwidth: 500 }).select()
if (error) {
    console.log(error);
}
console.log(data);
