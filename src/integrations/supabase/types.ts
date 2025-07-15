export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      collaborators: {
        Row: {
          collaborator_id: string
          created_at: string
          id: string
          permissions:
            | Database["public"]["Enums"]["collaborator_permission"][]
            | null
          pro_user_id: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          id?: string
          permissions?:
            | Database["public"]["Enums"]["collaborator_permission"][]
            | null
          pro_user_id: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          id?: string
          permissions?:
            | Database["public"]["Enums"]["collaborator_permission"][]
            | null
          pro_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "collaborators_pro_user_id_fkey"
            columns: ["pro_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean | null
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          trial_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          error_message: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          owner_id: string
          potree_path: string | null
          processing_completed_at: string | null
          processing_started_at: string | null
          progress: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string
          vps_file_path: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          error_message?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          owner_id: string
          potree_path?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          progress?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
          vps_file_path?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          error_message?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          owner_id?: string
          potree_path?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          progress?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
          vps_file_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      system_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_storage: {
        Row: {
          created_at: string
          id: string
          max_bytes: number
          updated_at: string
          used_bytes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_bytes?: number
          updated_at?: string
          used_bytes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_bytes?: number
          updated_at?: string
          used_bytes?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_storage_usage: {
        Args: { user_uuid: string }
        Returns: {
          used_bytes: number
          max_bytes: number
          available_bytes: number
          usage_percentage: number
        }[]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_collaborator_of: {
        Args: { user_uuid: string; owner_uuid: string }
        Returns: boolean
      }
      update_user_storage_usage: {
        Args: { user_uuid: string; file_size_bytes: number }
        Returns: boolean
      }
    }
    Enums: {
      collaborator_permission:
        | "read_only"
        | "upload_files"
        | "edit_projects"
        | "manage_collaborators"
      project_status: "processing" | "completed" | "failed"
      user_role: "admin" | "pro" | "trial"
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
    Enums: {
      collaborator_permission: [
        "read_only",
        "upload_files",
        "edit_projects",
        "manage_collaborators",
      ],
      project_status: ["processing", "completed", "failed"],
      user_role: ["admin", "pro", "trial"],
    },
  },
} as const
