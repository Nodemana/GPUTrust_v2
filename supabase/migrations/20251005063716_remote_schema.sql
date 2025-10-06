alter table "public"."avg_gpu_benchmarks" drop constraint "avg_gpu_benchmarks_gpu_model_key";

drop index if exists "public"."avg_gpu_benchmarks_gpu_model_key";

alter table "public"."avg_gpu_benchmarks" drop column "avg_tensor_flops_fp32";

alter table "public"."avg_gpu_benchmarks" drop column "avg_tensor_flops_fp64";

alter table "public"."avg_gpu_benchmarks" add column "avg_tensor_flops_bf16" double precision;

alter table "public"."avg_gpu_benchmarks" add column "avg_tensor_flops_fp8" double precision;

alter table "public"."avg_gpu_benchmarks" add column "avg_tensor_flops_int8" double precision;

alter table "public"."avg_gpu_benchmarks" add column "avg_tensor_flops_tf32" double precision;

alter table "public"."gpu_benchmarks" add column "cuda_cores" bigint;

alter table "public"."gpu_benchmarks" add column "rt_cores" bigint;

alter table "public"."gpu_benchmarks" add column "tensor_cores" bigint;

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



