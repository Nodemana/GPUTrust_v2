-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.avg_gpu_benchmarks (
  gpu_aib_partner text NOT NULL,
  gpu_model text NOT NULL,
  gpu_arch text NOT NULL,
  vram_gb bigint NOT NULL,
  avg_fp16_flops double precision,
  avg_fp32_flops double precision,
  avg_fp64_flops double precision,
  avg_tensor_flops_fp16 double precision,
  avg_tensor_flops_bf16 double precision,
  avg_tensor_flops_tf32 double precision,
  avg_d2d_mem_bandwidth double precision,
  avg_h2d_mem_bandwidth double precision,
  avg_d2h_mem_bandwidth double precision,
  avg_max_temp double precision,
  avg_avg_temp double precision,
  avg_max_pwr_draw double precision,
  avg_avg_pwr_draw double precision,
  avg_tensor_flops_int8 double precision,
  avg_tensor_flops_fp8 double precision,
  CONSTRAINT avg_gpu_benchmarks_pkey PRIMARY KEY (gpu_aib_partner, gpu_model, gpu_arch, vram_gb)
);
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  lisiting_id uuid DEFAULT gen_random_uuid(),
  buyer_id uuid DEFAULT gen_random_uuid(),
  seller_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id),
  CONSTRAINT conversations_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id)
);
CREATE TABLE public.gpu_benchmark_runtime (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  benchmark_id bigint,
  captured_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  interval_ms integer,
  metrics jsonb,
  CONSTRAINT gpu_benchmark_runtime_pkey PRIMARY KEY (id),
  CONSTRAINT gpu_benchmark_runtime_benchmark_id_fkey FOREIGN KEY (benchmark_id) REFERENCES public.gpu_benchmarks(id)
);
CREATE TABLE public.gpu_benchmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  inserted_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  uuid uuid NOT NULL,
  cuda_version text,
  driver_version text,
  gpu_model text,
  gpu_arch text,
  num_sm bigint,
  vram_gb bigint,
  fp16_flops double precision,
  fp32_flops double precision,
  fp64_flops double precision,
  tensor_flops_fp16 double precision,
  tensor_flops_bf16 double precision,
  tensor_flops_tf32 double precision,
  tensor_flops_int8 double precision,
  tensor_flops_fp8 double precision,
  d2d_mem_bandwidth double precision,
  h2d_mem_bandwidth double precision,
  d2h_mem_bandwidth double precision,
  max_temp double precision,
  avg_temp double precision,
  max_pwr_draw double precision,
  avg_pwr_draw double precision,
  user_id uuid,
  gpu_aib_partner text,
  cuda_cores bigint,
  tensor_cores bigint,
  rt_cores bigint,
  CONSTRAINT gpu_benchmarks_pkey PRIMARY KEY (id),
  CONSTRAINT gpu_benchmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.gpu_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  benchmark_id uuid NOT NULL,
  price_amount numeric NOT NULL,
  price_currency text NOT NULL DEFAULT 'SOL'::text,
  condition text NOT NULL CHECK (condition = ANY (ARRAY['new'::text, 'like-new'::text, 'used'::text, 'refurbished'::text])),
  title text NOT NULL,
  description text,
  image_urls ARRAY,
  location text,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'sold'::text, 'removed'::text])),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  user_id uuid,
  CONSTRAINT gpu_listings_pkey PRIMARY KEY (id),
  CONSTRAINT gpu_listings_benchmark_id_fkey FOREIGN KEY (benchmark_id) REFERENCES public.gpu_benchmarks(id),
  CONSTRAINT gpu_listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  username text,
  email text NOT NULL UNIQUE,
  phone_number bigint NOT NULL UNIQUE,
  id uuid NOT NULL UNIQUE,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
