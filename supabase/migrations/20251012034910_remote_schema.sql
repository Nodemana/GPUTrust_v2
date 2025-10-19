drop policy "Benchmarks linked to active listings are viewable" on "public"."gpu_benchmarks";

drop policy "Active listings are viewable by everyone" on "public"."gpu_listings";

alter table "public"."gpu_benchmark_runtime" drop constraint "gpu_benchmark_runtime_benchmark_id_fkey";

alter table "public"."gpu_benchmarks" drop constraint "gpu_benchmarks_user_id_fkey";

alter table "public"."gpu_listings" drop constraint "gpu_listings_user_id_fkey";

drop index if exists "public"."gpu_benchmark_runtime_benchmark_id_idx";

drop index if exists "public"."gpu_benchmark_runtime_captured_at_idx";

drop index if exists "public"."idx_gpu_listings_created_at";

drop index if exists "public"."idx_gpu_listings_status";

create table "public"."conversations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "lisiting_id" uuid default gen_random_uuid(),
    "buyer_id" uuid default gen_random_uuid(),
    "seller_id" uuid default gen_random_uuid()
);


alter table "public"."conversations" enable row level security;

alter table "public"."gpu_benchmark_runtime" alter column "benchmark_id" set data type uuid using "benchmark_id"::uuid;

alter table "public"."gpu_benchmark_runtime" alter column "id" set default gen_random_uuid();

alter table "public"."gpu_benchmark_runtime" alter column "id" drop identity;

alter table "public"."gpu_benchmark_runtime" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."gpu_benchmarks" alter column "id" set default gen_random_uuid();

alter table "public"."gpu_benchmarks" alter column "id" drop identity;

alter table "public"."gpu_benchmarks" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."gpu_listings" alter column "benchmark_id" set data type uuid using "benchmark_id"::uuid;

alter table "public"."gpu_listings" alter column "id" set default gen_random_uuid();

alter table "public"."gpu_listings" alter column "id" drop identity;

alter table "public"."gpu_listings" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."gpu_listings" alter column "price_amount" set data type numeric using "price_amount"::numeric;

alter table "public"."gpu_listings" alter column "price_currency" set default 'SOL'::text;

CREATE UNIQUE INDEX conversations_pkey ON public.conversations USING btree (id);

alter table "public"."conversations" add constraint "conversations_pkey" PRIMARY KEY using index "conversations_pkey";

alter table "public"."conversations" add constraint "conversations_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_buyer_id_fkey";

alter table "public"."conversations" add constraint "conversations_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_seller_id_fkey";

alter table "public"."gpu_benchmark_runtime" add constraint "gpu_benchmark_runtime_benchmark_id_fkey" FOREIGN KEY (benchmark_id) REFERENCES gpu_benchmarks(id) not valid;

alter table "public"."gpu_benchmark_runtime" validate constraint "gpu_benchmark_runtime_benchmark_id_fkey";

alter table "public"."gpu_benchmarks" add constraint "gpu_benchmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."gpu_benchmarks" validate constraint "gpu_benchmarks_user_id_fkey";

alter table "public"."gpu_listings" add constraint "gpu_listings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."gpu_listings" validate constraint "gpu_listings_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_gpu_benchmark_avgs()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO public.avg_gpu_benchmarks AS avg_tbl (
    gpu_aib_partner,
    gpu_model,
    gpu_arch,
    vram_gb,
    avg_fp16_flops,
    avg_fp32_flops,
    avg_fp64_flops,
    avg_tensor_flops_fp16,
    avg_tensor_flops_bf16,
    avg_tensor_flops_tf32,
    avg_d2d_mem_bandwidth,
    avg_h2d_mem_bandwidth,
    avg_d2h_mem_bandwidth,
    avg_max_temp,
    avg_avg_temp,
    avg_max_pwr_draw,
    avg_avg_pwr_draw,
    avg_tensor_flops_int8,
    avg_tensor_flops_fp8
  )
  SELECT
    b.gpu_aib_partner,
    b.gpu_model,
    b.gpu_arch,
    b.vram_gb,
    AVG(b.fp16_flops) AS avg_fp16_flops,
    AVG(b.fp32_flops) AS avg_fp32_flops,
    AVG(b.fp64_flops) AS avg_fp64_flops,
    AVG(b.tensor_flops_fp16) AS avg_tensor_flops_fp16,
    AVG(b.tensor_flops_bf16) AS avg_tensor_flops_bf16,
    AVG(b.tensor_flops_tf32) AS avg_tensor_flops_tf32,
    AVG(b.tensor_flops_int8) AS avg_tensor_flops_int8,
    AVG(b.tensor_flops_fp8) AS avg_tensor_flops_fp8,
    AVG(b.d2d_mem_bandwidth) AS avg_d2d_mem_bandwidth,
    AVG(b.h2d_mem_bandwidth) AS avg_h2d_mem_bandwidth,
    AVG(b.d2h_mem_bandwidth) AS avg_d2h_mem_bandwidth,
    AVG(b.max_temp) AS avg_max_temp,
    AVG(b.avg_temp) AS avg_avg_temp,
    AVG(b.max_pwr_draw) AS avg_max_pwr_draw,
    AVG(b.avg_pwr_draw) AS avg_avg_pwr_draw
  FROM public.gpu_benchmarks b
  GROUP BY b.gpu_aib_partner, b.gpu_model, b.gpu_arch, b.vram_gb
  ON CONFLICT (vram_gb, gpu_aib_partner, gpu_model, gpu_arch)
  DO UPDATE SET
    avg_fp16_flops = EXCLUDED.avg_fp16_flops,
    avg_fp32_flops = EXCLUDED.avg_fp32_flops,
    avg_fp64_flops = EXCLUDED.avg_fp64_flops,
    avg_tensor_flops_fp16 = EXCLUDED.avg_tensor_flops_fp16,
    avg_tensor_flops_bf16 = EXCLUDED.avg_tensor_flops_bf16,
    avg_tensor_flops_tf32 = EXCLUDED.avg_tensor_flops_tf32,
    avg_tensor_flops_int8 = EXCLUDED.avg_tensor_flops_int8,
    avg_tensor_flops_fp8 = EXCLUDED.avg_tensor_flops_fp8,
    avg_d2d_mem_bandwidth = EXCLUDED.avg_d2d_mem_bandwidth,
    avg_h2d_mem_bandwidth = EXCLUDED.avg_h2d_mem_bandwidth,
    avg_d2h_mem_bandwidth = EXCLUDED.avg_d2h_mem_bandwidth,
    avg_max_temp = EXCLUDED.avg_max_temp,
    avg_avg_temp = EXCLUDED.avg_avg_temp,
    avg_max_pwr_draw = EXCLUDED.avg_max_pwr_draw,
    avg_avg_pwr_draw = EXCLUDED.avg_avg_pwr_draw;
END;$function$
;

create policy "Enable read access for all users"
on "public"."avg_gpu_benchmarks"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."gpu_benchmark_runtime"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."gpu_benchmarks"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."gpu_listings"
as permissive
for select
to public
using (true);




