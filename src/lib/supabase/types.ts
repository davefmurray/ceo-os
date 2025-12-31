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
  public: {
    Tables: {
      annual_reviews: {
        Row: {
          average_energy: number | null
          biggest_challenges: string[] | null
          biggest_surprise: string | null
          created_at: string
          end_date: string
          goals_achieved: Json | null
          gratitude: string | null
          health_summary: string | null
          id: string
          key_relationships: string | null
          lessons_learned: string[] | null
          life_map_scores: Json | null
          most_important_lesson: string | null
          next_year_intention: string | null
          next_year_word: string | null
          one_sentence_summary: string | null
          proudest_moment: string | null
          quotes_to_remember: Json | null
          relationship_changes: string | null
          skills_gained: string[] | null
          start_date: string
          top_wins: string[] | null
          updated_at: string
          user_id: string
          what_didnt_work: string | null
          what_would_do_differently: string | null
          year: number
          year_theme: string | null
        }
        Insert: {
          average_energy?: number | null
          biggest_challenges?: string[] | null
          biggest_surprise?: string | null
          created_at?: string
          end_date: string
          goals_achieved?: Json | null
          gratitude?: string | null
          health_summary?: string | null
          id?: string
          key_relationships?: string | null
          lessons_learned?: string[] | null
          life_map_scores?: Json | null
          most_important_lesson?: string | null
          next_year_intention?: string | null
          next_year_word?: string | null
          one_sentence_summary?: string | null
          proudest_moment?: string | null
          quotes_to_remember?: Json | null
          relationship_changes?: string | null
          skills_gained?: string[] | null
          start_date: string
          top_wins?: string[] | null
          updated_at?: string
          user_id: string
          what_didnt_work?: string | null
          what_would_do_differently?: string | null
          year: number
          year_theme?: string | null
        }
        Update: {
          average_energy?: number | null
          biggest_challenges?: string[] | null
          biggest_surprise?: string | null
          created_at?: string
          end_date?: string
          goals_achieved?: Json | null
          gratitude?: string | null
          health_summary?: string | null
          id?: string
          key_relationships?: string | null
          lessons_learned?: string[] | null
          life_map_scores?: Json | null
          most_important_lesson?: string | null
          next_year_intention?: string | null
          next_year_word?: string | null
          one_sentence_summary?: string | null
          proudest_moment?: string | null
          quotes_to_remember?: Json | null
          relationship_changes?: string | null
          skills_gained?: string[] | null
          start_date?: string
          top_wins?: string[] | null
          updated_at?: string
          user_id?: string
          what_didnt_work?: string | null
          what_would_do_differently?: string | null
          year?: number
          year_theme?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_check_ins: {
        Row: {
          created_at: string
          date: string
          energy_emotional: number | null
          energy_mental: number | null
          energy_physical: number | null
          energy_word: string | null
          friction_point: string | null
          id: string
          let_go: string | null
          meaningful_win: string | null
          notes: string | null
          tomorrow_priority: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          energy_emotional?: number | null
          energy_mental?: number | null
          energy_physical?: number | null
          energy_word?: string | null
          friction_point?: string | null
          id?: string
          let_go?: string | null
          meaningful_win?: string | null
          notes?: string | null
          tomorrow_priority?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_emotional?: number | null
          energy_mental?: number | null
          energy_physical?: number | null
          energy_word?: string | null
          friction_point?: string | null
          id?: string
          let_go?: string | null
          meaningful_win?: string | null
          notes?: string | null
          tomorrow_priority?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          anti_goals: string[] | null
          big_bets: string[] | null
          career: Json | null
          created_at: string
          critical_three: string[] | null
          finances: Json | null
          fun: Json | null
          goal_type: string
          habits_to_break: Json | null
          habits_to_build: Json | null
          health: Json | null
          id: string
          if_goes_well: string | null
          key_people: string | null
          meaning: Json | null
          needs_to_begin: string[] | null
          needs_to_end: string[] | null
          period_end: number | null
          period_start: number
          relationships: Json | null
          snapshot: string | null
          theme: string | null
          typical_week: string | null
          updated_at: string
          user_id: string
          what_do: string | null
          whats_different: string | null
          where_live: string | null
        }
        Insert: {
          anti_goals?: string[] | null
          big_bets?: string[] | null
          career?: Json | null
          created_at?: string
          critical_three?: string[] | null
          finances?: Json | null
          fun?: Json | null
          goal_type: string
          habits_to_break?: Json | null
          habits_to_build?: Json | null
          health?: Json | null
          id?: string
          if_goes_well?: string | null
          key_people?: string | null
          meaning?: Json | null
          needs_to_begin?: string[] | null
          needs_to_end?: string[] | null
          period_end?: number | null
          period_start: number
          relationships?: Json | null
          snapshot?: string | null
          theme?: string | null
          typical_week?: string | null
          updated_at?: string
          user_id: string
          what_do?: string | null
          whats_different?: string | null
          where_live?: string | null
        }
        Update: {
          anti_goals?: string[] | null
          big_bets?: string[] | null
          career?: Json | null
          created_at?: string
          critical_three?: string[] | null
          finances?: Json | null
          fun?: Json | null
          goal_type?: string
          habits_to_break?: Json | null
          habits_to_build?: Json | null
          health?: Json | null
          id?: string
          if_goes_well?: string | null
          key_people?: string | null
          meaning?: Json | null
          needs_to_begin?: string[] | null
          needs_to_end?: string[] | null
          period_end?: number | null
          period_start?: number
          relationships?: Json | null
          snapshot?: string | null
          theme?: string | null
          typical_week?: string | null
          updated_at?: string
          user_id?: string
          what_do?: string | null
          whats_different?: string | null
          where_live?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_responses: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          interview_type: string
          responses: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          interview_type: string
          responses?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          interview_type?: string
          responses?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      life_map: {
        Row: {
          career_note: string | null
          career_score: number | null
          career_trend: string | null
          created_at: string
          finances_note: string | null
          finances_score: number | null
          finances_trend: string | null
          fun_note: string | null
          fun_score: number | null
          fun_trend: string | null
          health_note: string | null
          health_score: number | null
          health_trend: string | null
          id: string
          meaning_note: string | null
          meaning_score: number | null
          meaning_trend: string | null
          relationships_note: string | null
          relationships_score: number | null
          relationships_trend: string | null
          snapshot_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          career_note?: string | null
          career_score?: number | null
          career_trend?: string | null
          created_at?: string
          finances_note?: string | null
          finances_score?: number | null
          finances_trend?: string | null
          fun_note?: string | null
          fun_score?: number | null
          fun_trend?: string | null
          health_note?: string | null
          health_score?: number | null
          health_trend?: string | null
          id?: string
          meaning_note?: string | null
          meaning_score?: number | null
          meaning_trend?: string | null
          relationships_note?: string | null
          relationships_score?: number | null
          relationships_trend?: string | null
          snapshot_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          career_note?: string | null
          career_score?: number | null
          career_trend?: string | null
          created_at?: string
          finances_note?: string | null
          finances_score?: number | null
          finances_trend?: string | null
          fun_note?: string | null
          fun_score?: number | null
          fun_trend?: string | null
          health_note?: string | null
          health_score?: number | null
          health_trend?: string | null
          id?: string
          meaning_note?: string | null
          meaning_score?: number | null
          meaning_trend?: string | null
          relationships_note?: string | null
          relationships_score?: number | null
          relationships_trend?: string | null
          snapshot_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_map_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memory: {
        Row: {
          blind_spots: string[] | null
          created_at: string
          drained_by: string[] | null
          energized_by: string[] | null
          executive_summary: string | null
          goal_archaeology: Json | null
          growth_edges: string[] | null
          id: string
          insights_by_year: Json | null
          lessons_life: string[] | null
          lessons_relationships: string[] | null
          lessons_self: string[] | null
          lessons_work: string[] | null
          optimal_conditions: string | null
          over_indexes: string | null
          quotes_from_past_self: Json | null
          raw_notes: string | null
          strengths: string[] | null
          under_weights: string | null
          updated_at: string
          user_id: string
          warnings_to_future_self: string[] | null
        }
        Insert: {
          blind_spots?: string[] | null
          created_at?: string
          drained_by?: string[] | null
          energized_by?: string[] | null
          executive_summary?: string | null
          goal_archaeology?: Json | null
          growth_edges?: string[] | null
          id?: string
          insights_by_year?: Json | null
          lessons_life?: string[] | null
          lessons_relationships?: string[] | null
          lessons_self?: string[] | null
          lessons_work?: string[] | null
          optimal_conditions?: string | null
          over_indexes?: string | null
          quotes_from_past_self?: Json | null
          raw_notes?: string | null
          strengths?: string[] | null
          under_weights?: string | null
          updated_at?: string
          user_id: string
          warnings_to_future_self?: string[] | null
        }
        Update: {
          blind_spots?: string[] | null
          created_at?: string
          drained_by?: string[] | null
          energized_by?: string[] | null
          executive_summary?: string | null
          goal_archaeology?: Json | null
          growth_edges?: string[] | null
          id?: string
          insights_by_year?: Json | null
          lessons_life?: string[] | null
          lessons_relationships?: string[] | null
          lessons_self?: string[] | null
          lessons_work?: string[] | null
          optimal_conditions?: string | null
          over_indexes?: string | null
          quotes_from_past_self?: Json | null
          raw_notes?: string | null
          strengths?: string[] | null
          under_weights?: string | null
          updated_at?: string
          user_id?: string
          warnings_to_future_self?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      north_star: {
        Row: {
          area_rankings: Json | null
          central_question: string | null
          company: string | null
          created_at: string
          id: string
          non_negotiables: string[] | null
          notes: string | null
          one_sentence: string
          primary_role: string
          saying_no_to: string[] | null
          stage_of_life: string
          updated_at: string
          user_id: string
          what_defines_chapter: string | null
          years_in_chapter: number | null
        }
        Insert: {
          area_rankings?: Json | null
          central_question?: string | null
          company?: string | null
          created_at?: string
          id?: string
          non_negotiables?: string[] | null
          notes?: string | null
          one_sentence?: string
          primary_role?: string
          saying_no_to?: string[] | null
          stage_of_life?: string
          updated_at?: string
          user_id: string
          what_defines_chapter?: string | null
          years_in_chapter?: number | null
        }
        Update: {
          area_rankings?: Json | null
          central_question?: string | null
          company?: string | null
          created_at?: string
          id?: string
          non_negotiables?: string[] | null
          notes?: string | null
          one_sentence?: string
          primary_role?: string
          saying_no_to?: string[] | null
          stage_of_life?: string
          updated_at?: string
          user_id?: string
          what_defines_chapter?: string | null
          years_in_chapter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "north_star_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quarterly_reviews: {
        Row: {
          average_energy: number | null
          avoiding_decision: string | null
          best_month: string | null
          best_month_why: string | null
          clearer_pattern: string | null
          continue_doing: string[] | null
          created_at: string
          direction_still_accurate: string | null
          drainers: string[] | null
          end_date: string
          energizers: string[] | null
          goal_progress: Json | null
          id: string
          key_challenges: string[] | null
          key_wins: string[] | null
          lesson_learned: string | null
          life_map_scores: Json | null
          memory_insights: string[] | null
          missed_opportunity: string | null
          needs_to_change: string | null
          new_knowledge: string | null
          next_priorities: string[] | null
          next_quarter_theme: string | null
          one_thing_easier: string | null
          persistent_problem: string | null
          quarter: string
          said_yes_shouldnt_have: string | null
          start_date: string
          start_doing: string[] | null
          stop_doing: string[] | null
          sustainable_pace: string | null
          time_gap: string | null
          unexpected_win: string | null
          updated_at: string
          user_id: string
          what_will_be_true: string | null
          working_on_what_matters: string | null
          worst_month: string | null
          worst_month_why: string | null
        }
        Insert: {
          average_energy?: number | null
          avoiding_decision?: string | null
          best_month?: string | null
          best_month_why?: string | null
          clearer_pattern?: string | null
          continue_doing?: string[] | null
          created_at?: string
          direction_still_accurate?: string | null
          drainers?: string[] | null
          end_date: string
          energizers?: string[] | null
          goal_progress?: Json | null
          id?: string
          key_challenges?: string[] | null
          key_wins?: string[] | null
          lesson_learned?: string | null
          life_map_scores?: Json | null
          memory_insights?: string[] | null
          missed_opportunity?: string | null
          needs_to_change?: string | null
          new_knowledge?: string | null
          next_priorities?: string[] | null
          next_quarter_theme?: string | null
          one_thing_easier?: string | null
          persistent_problem?: string | null
          quarter: string
          said_yes_shouldnt_have?: string | null
          start_date: string
          start_doing?: string[] | null
          stop_doing?: string[] | null
          sustainable_pace?: string | null
          time_gap?: string | null
          unexpected_win?: string | null
          updated_at?: string
          user_id: string
          what_will_be_true?: string | null
          working_on_what_matters?: string | null
          worst_month?: string | null
          worst_month_why?: string | null
        }
        Update: {
          average_energy?: number | null
          avoiding_decision?: string | null
          best_month?: string | null
          best_month_why?: string | null
          clearer_pattern?: string | null
          continue_doing?: string[] | null
          created_at?: string
          direction_still_accurate?: string | null
          drainers?: string[] | null
          end_date?: string
          energizers?: string[] | null
          goal_progress?: Json | null
          id?: string
          key_challenges?: string[] | null
          key_wins?: string[] | null
          lesson_learned?: string | null
          life_map_scores?: Json | null
          memory_insights?: string[] | null
          missed_opportunity?: string | null
          needs_to_change?: string | null
          new_knowledge?: string | null
          next_priorities?: string[] | null
          next_quarter_theme?: string | null
          one_thing_easier?: string | null
          persistent_problem?: string | null
          quarter?: string
          said_yes_shouldnt_have?: string | null
          start_date?: string
          start_doing?: string[] | null
          stop_doing?: string[] | null
          sustainable_pace?: string | null
          time_gap?: string | null
          unexpected_win?: string | null
          updated_at?: string
          user_id?: string
          what_will_be_true?: string | null
          working_on_what_matters?: string | null
          worst_month?: string | null
          worst_month_why?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quarterly_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          preferences: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          adjustment: string | null
          average_energy: number | null
          best_day: string | null
          best_day_why: string | null
          created_at: string
          end_date: string
          gratitude: string | null
          id: string
          moved_needle: string[] | null
          next_priorities: string[] | null
          should_connect: string | null
          start_date: string
          strategic_insight: string | null
          time_leaked: string | null
          updated_at: string
          user_id: string
          was_noise: string[] | null
          week: string
          who_drained: string | null
          who_energized: string | null
          wins: string[] | null
          worst_day: string | null
          worst_day_why: string | null
        }
        Insert: {
          adjustment?: string | null
          average_energy?: number | null
          best_day?: string | null
          best_day_why?: string | null
          created_at?: string
          end_date: string
          gratitude?: string | null
          id?: string
          moved_needle?: string[] | null
          next_priorities?: string[] | null
          should_connect?: string | null
          start_date: string
          strategic_insight?: string | null
          time_leaked?: string | null
          updated_at?: string
          user_id: string
          was_noise?: string[] | null
          week: string
          who_drained?: string | null
          who_energized?: string | null
          wins?: string[] | null
          worst_day?: string | null
          worst_day_why?: string | null
        }
        Update: {
          adjustment?: string | null
          average_energy?: number | null
          best_day?: string | null
          best_day_why?: string | null
          created_at?: string
          end_date?: string
          gratitude?: string | null
          id?: string
          moved_needle?: string[] | null
          next_priorities?: string[] | null
          should_connect?: string | null
          start_date?: string
          strategic_insight?: string | null
          time_leaked?: string | null
          updated_at?: string
          user_id?: string
          was_noise?: string[] | null
          week?: string
          who_drained?: string | null
          who_energized?: string | null
          wins?: string[] | null
          worst_day?: string | null
          worst_day_why?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
