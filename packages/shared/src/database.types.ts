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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_members: {
        Row: {
          account_id: string
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          id: string
          is_test_tenant: boolean | null
          name: string
          owner_user_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_test_tenant?: boolean | null
          name: string
          owner_user_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_test_tenant?: boolean | null
          name?: string
          owner_user_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      historical_metrics: {
        Row: {
          created_at: string | null
          custom_soft_metrics: Json | null
          flow_score: number | null
          friction_score: number | null
          id: string
          import_batch_id: string | null
          last_sprint_items_completed: number | null
          last_sprint_items_incomplete: number | null
          last_sprint_points_completed: number | null
          last_sprint_points_incomplete: number | null
          metric_date: string
          requirement_clarity_score: number | null
          safety_score: number | null
          satisfaction_score: number | null
          support_score: number | null
          team_id: string
          profile_id: string | null
          velocity_avg: number | null
          workload_balance_score: number | null
        }
        Insert: {
          created_at?: string | null
          custom_soft_metrics?: Json | null
          flow_score?: number | null
          friction_score?: number | null
          id?: string
          import_batch_id?: string | null
          last_sprint_items_completed?: number | null
          last_sprint_items_incomplete?: number | null
          last_sprint_points_completed?: number | null
          last_sprint_points_incomplete?: number | null
          metric_date?: string
          requirement_clarity_score?: number | null
          safety_score?: number | null
          satisfaction_score?: number | null
          support_score?: number | null
          team_id: string
          profile_id?: string | null
          velocity_avg?: number | null
          workload_balance_score?: number | null
        }
        Update: {
          created_at?: string | null
          custom_soft_metrics?: Json | null
          flow_score?: number | null
          friction_score?: number | null
          id?: string
          import_batch_id?: string | null
          last_sprint_items_completed?: number | null
          last_sprint_items_incomplete?: number | null
          last_sprint_points_completed?: number | null
          last_sprint_points_incomplete?: number | null
          metric_date?: string
          requirement_clarity_score?: number | null
          safety_score?: number | null
          satisfaction_score?: number | null
          support_score?: number | null
          team_id?: string
          user_id?: string | null
          velocity_avg?: number | null
          workload_balance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "historical_metrics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historical_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      integration_mappings: {
        Row: {
          id: string
          integration_id: string
          team_id: string
          project_id: string
          external_repo_id: string
          is_active: boolean
        }
        Insert: {
          id?: string
          integration_id: string
          team_id: string
          project_id: string
          external_repo_id: string
          is_active?: boolean
        }
        Update: {
          id?: string
          integration_id?: string
          team_id?: string
          project_id?: string
          external_repo_id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "integration_mappings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          }
        ]
      }
      integrations: {
        Row: {
          id: string
          account_id: string
          provider: string
          installation_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          account_id: string
          provider: string
          installation_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          account_id?: string
          provider?: string
          installation_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      kudos: {
        Row: {
          account_id: string
          category: string | null
          created_at: string | null
          id: string
          message: string
          receiver_profile_id: string | null
          sender_profile_id: string | null
          sprint_id: string | null
          team_id: string | null
        }
        Insert: {
          account_id: string
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          receiver_profile_id?: string | null
          sender_profile_id?: string | null
          sprint_id?: string | null
          team_id?: string | null
        }
        Update: {
          account_id?: string
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          receiver_profile_id?: string | null
          sender_profile_id?: string | null
          sprint_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kudos_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
          auth_user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          auth_user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          auth_user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sprint_commitments: {
        Row: {
          committed_items: number | null
          committed_points: number | null
          created_at: string | null
          id: string
          sprint_id: string
          profile_id: string | null
        }
        Insert: {
          committed_items?: number | null
          committed_points?: number | null
          created_at?: string | null
          id?: string
          sprint_id: string
          profile_id?: string | null
        }
        Update: {
          committed_items?: number | null
          committed_points?: number | null
          created_at?: string | null
          id?: string
          sprint_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprint_commitments_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprint_commitments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sprint_snapshots: {
        Row: {
          created_at: string | null
          id: string
          items_completed: number | null
          items_remaining: number | null
          points_completed: number | null
          points_remaining: number | null
          snapshot_date: string | null
          sprint_id: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          items_completed?: number | null
          items_remaining?: number | null
          points_completed?: number | null
          points_remaining?: number | null
          snapshot_date?: string | null
          sprint_id: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          items_completed?: number | null
          items_remaining?: number | null
          points_completed?: number | null
          points_remaining?: number | null
          snapshot_date?: string | null
          sprint_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprint_snapshots_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprint_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sprints: {
        Row: {
          account_id: string
          created_at: string | null
          end_date: string
          goal: string | null
          id: string
          name: string
          start_date: string
          status: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          end_date: string
          goal?: string | null
          id?: string
          name: string
          start_date: string
          status?: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          end_date?: string
          goal?: string | null
          id?: string
          name?: string
          start_date?: string
          status?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprints_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprints_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_answers: {
        Row: {
          id: string
          question_id: string | null
          response_id: string | null
          value_json: Json | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          id?: string
          question_id?: string | null
          response_id?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          id?: string
          question_id?: string | null
          response_id?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_answers_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_questions: {
        Row: {
          id: string
          is_required: boolean | null
          metric_category: string | null
          options: Json | null
          order_index: number
          question_text: string
          response_type: string
          survey_id: string | null
        }
        Insert: {
          id?: string
          is_required?: boolean | null
          metric_category?: string | null
          options?: Json | null
          order_index?: number
          question_text: string
          response_type: string
          survey_id?: string | null
        }
        Update: {
          id?: string
          is_required?: boolean | null
          metric_category?: string | null
          options?: Json | null
          order_index?: number
          question_text?: string
          response_type?: string
          survey_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string | null
          id: string
          is_confidential: boolean | null
          sprint_id: string | null
          survey_id: string | null
          responder_profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_confidential?: boolean | null
          sprint_id?: string | null
          survey_id?: string | null
          responder_profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_confidential?: boolean | null
          sprint_id?: string | null
          survey_id?: string | null
          responder_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          account_id: string
          created_at: string | null
          description: string | null
          id: string
          is_system_template: boolean | null
          team_id: string | null
          title: string
          trigger_event: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          team_id?: string | null
          title: string
          trigger_event?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          team_id?: string | null
          title?: string
          trigger_event?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surveys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          joined_at: string | null
          role: string
          team_id: string
          title: string | null
          profile_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: string
          team_id: string
          title?: string | null
          profile_id: string
        }
        Update: {
          joined_at?: string | null
          role?: string
          team_id?: string
          title?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          account_id: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      work_items: {
        Row: {
          account_id: string
          assignee_profile_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          external_url: string | null
          id: string
          project_id: string | null
          provider: string
          sprint_id: string | null
          status: string
          story_points: number
          team_id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          assignee_profile_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          project_id?: string | null
          provider?: string
          sprint_id?: string | null
          status?: string
          story_points?: number
          team_id: string
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          assignee_profile_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          project_id?: string | null
          provider?: string
          sprint_id?: string | null
          status?: string
          story_points?: number
          team_id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_items_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_items_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_survey_with_questions: {
        Args: {
          p_account_id: string
          p_is_active?: boolean
          p_questions?: Json
          p_team_id?: string
          p_title?: string
        }
        Returns: Json
      }
      is_account_member: { Args: { p_account_id: string }; Returns: boolean }
      is_team_member: { Args: { p_team_id: string }; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
