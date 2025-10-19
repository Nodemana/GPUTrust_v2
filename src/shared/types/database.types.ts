export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      avg_gpu_benchmarks: {
        Row: {
          avg_avg_pwr_draw: number | null
          avg_avg_temp: number | null
          avg_d2d_mem_bandwidth: number | null
          avg_d2h_mem_bandwidth: number | null
          avg_fp16_flops: number | null
          avg_fp32_flops: number | null
          avg_fp64_flops: number | null
          avg_h2d_mem_bandwidth: number | null
          avg_max_pwr_draw: number | null
          avg_max_temp: number | null
          avg_tensor_flops_bf16: number | null
          avg_tensor_flops_fp16: number | null
          avg_tensor_flops_fp8: number | null
          avg_tensor_flops_int8: number | null
          avg_tensor_flops_tf32: number | null
          gpu_aib_partner: string
          gpu_arch: string
          gpu_model: string
          vram_gb: number
        }
        Insert: {
          avg_avg_pwr_draw?: number | null
          avg_avg_temp?: number | null
          avg_d2d_mem_bandwidth?: number | null
          avg_d2h_mem_bandwidth?: number | null
          avg_fp16_flops?: number | null
          avg_fp32_flops?: number | null
          avg_fp64_flops?: number | null
          avg_h2d_mem_bandwidth?: number | null
          avg_max_pwr_draw?: number | null
          avg_max_temp?: number | null
          avg_tensor_flops_bf16?: number | null
          avg_tensor_flops_fp16?: number | null
          avg_tensor_flops_fp8?: number | null
          avg_tensor_flops_int8?: number | null
          avg_tensor_flops_tf32?: number | null
          gpu_aib_partner: string
          gpu_arch: string
          gpu_model: string
          vram_gb: number
        }
        Update: {
          avg_avg_pwr_draw?: number | null
          avg_avg_temp?: number | null
          avg_d2d_mem_bandwidth?: number | null
          avg_d2h_mem_bandwidth?: number | null
          avg_fp16_flops?: number | null
          avg_fp32_flops?: number | null
          avg_fp64_flops?: number | null
          avg_h2d_mem_bandwidth?: number | null
          avg_max_pwr_draw?: number | null
          avg_max_temp?: number | null
          avg_tensor_flops_bf16?: number | null
          avg_tensor_flops_fp16?: number | null
          avg_tensor_flops_fp8?: number | null
          avg_tensor_flops_int8?: number | null
          avg_tensor_flops_tf32?: number | null
          gpu_aib_partner?: string
          gpu_arch?: string
          gpu_model?: string
          vram_gb?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          buyer_id: string | null
          created_at: string
          id: string
          lisiting_id: string | null
          seller_id: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          id?: string
          lisiting_id?: string | null
          seller_id?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          id?: string
          lisiting_id?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gpu_benchmark_runtime: {
        Row: {
          benchmark_id: string | null
          captured_at: string | null
          id: string
          interval_ms: number | null
          metrics: Json | null
        }
        Insert: {
          benchmark_id?: string | null
          captured_at?: string | null
          id?: string
          interval_ms?: number | null
          metrics?: Json | null
        }
        Update: {
          benchmark_id?: string | null
          captured_at?: string | null
          id?: string
          interval_ms?: number | null
          metrics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gpu_benchmark_runtime_benchmark_id_fkey"
            columns: ["benchmark_id"]
            isOneToOne: false
            referencedRelation: "gpu_benchmarks"
            referencedColumns: ["id"]
          },
        ]
      }
      gpu_benchmarks: {
        Row: {
          avg_pwr_draw: number | null
          avg_temp: number | null
          cuda_cores: number | null
          cuda_version: string | null
          d2d_mem_bandwidth: number | null
          d2h_mem_bandwidth: number | null
          driver_version: string | null
          fp16_flops: number | null
          fp32_flops: number | null
          fp64_flops: number | null
          gpu_aib_partner: string | null
          gpu_arch: string | null
          gpu_model: string | null
          h2d_mem_bandwidth: number | null
          id: string
          inserted_at: string
          max_pwr_draw: number | null
          max_temp: number | null
          num_sm: number | null
          rt_cores: number | null
          tensor_cores: number | null
          tensor_flops_bf16: number | null
          tensor_flops_fp16: number | null
          tensor_flops_fp8: number | null
          tensor_flops_int8: number | null
          tensor_flops_tf32: number | null
          updated_at: string
          user_id: string | null
          uuid: string
          vram_gb: number | null
        }
        Insert: {
          avg_pwr_draw?: number | null
          avg_temp?: number | null
          cuda_cores?: number | null
          cuda_version?: string | null
          d2d_mem_bandwidth?: number | null
          d2h_mem_bandwidth?: number | null
          driver_version?: string | null
          fp16_flops?: number | null
          fp32_flops?: number | null
          fp64_flops?: number | null
          gpu_aib_partner?: string | null
          gpu_arch?: string | null
          gpu_model?: string | null
          h2d_mem_bandwidth?: number | null
          id?: string
          inserted_at?: string
          max_pwr_draw?: number | null
          max_temp?: number | null
          num_sm?: number | null
          rt_cores?: number | null
          tensor_cores?: number | null
          tensor_flops_bf16?: number | null
          tensor_flops_fp16?: number | null
          tensor_flops_fp8?: number | null
          tensor_flops_int8?: number | null
          tensor_flops_tf32?: number | null
          updated_at?: string
          user_id?: string | null
          uuid: string
          vram_gb?: number | null
        }
        Update: {
          avg_pwr_draw?: number | null
          avg_temp?: number | null
          cuda_cores?: number | null
          cuda_version?: string | null
          d2d_mem_bandwidth?: number | null
          d2h_mem_bandwidth?: number | null
          driver_version?: string | null
          fp16_flops?: number | null
          fp32_flops?: number | null
          fp64_flops?: number | null
          gpu_aib_partner?: string | null
          gpu_arch?: string | null
          gpu_model?: string | null
          h2d_mem_bandwidth?: number | null
          id?: string
          inserted_at?: string
          max_pwr_draw?: number | null
          max_temp?: number | null
          num_sm?: number | null
          rt_cores?: number | null
          tensor_cores?: number | null
          tensor_flops_bf16?: number | null
          tensor_flops_fp16?: number | null
          tensor_flops_fp8?: number | null
          tensor_flops_int8?: number | null
          tensor_flops_tf32?: number | null
          updated_at?: string
          user_id?: string | null
          uuid?: string
          vram_gb?: number | null
        }
        Relationships: []
      }
      gpu_listings: {
        Row: {
          benchmark_id: string
          condition: string
          created_at: string | null
          description: string | null
          id: string
          image_urls: string[] | null
          location: string | null
          price_amount: number
          price_currency: string
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          benchmark_id: string
          condition: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          location?: string | null
          price_amount: number
          price_currency?: string
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          benchmark_id?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          location?: string | null
          price_amount?: number
          price_currency?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gpu_listings_benchmark_id_fkey"
            columns: ["benchmark_id"]
            isOneToOne: false
            referencedRelation: "gpu_benchmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpu_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          id: string
          phone_number: number
          username: string | null
        }
        Insert: {
          email: string
          id: string
          phone_number: number
          username?: string | null
        }
        Update: {
          email?: string
          id?: string
          phone_number?: number
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_gpu_benchmark_avgs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
