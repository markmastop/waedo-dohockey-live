export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_versions: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      beta_signups: {
        Row: {
          club_name: string
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          knhb_team_code: string | null
          name: string
          team_name: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          club_name: string
          created_at?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          knhb_team_code?: string | null
          name: string
          team_name: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          club_name?: string
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          knhb_team_code?: string | null
          name?: string
          team_name?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      clubs: {
        Row: {
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          knhb_club_id: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          knhb_club_id?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          knhb_club_id?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      formations: {
        Row: {
          created_at: string | null
          description_translations: Json | null
          id: string
          key: string
          max_players: number
          max_reserves: number | null
          name_translations: Json
          positions: Json
          type: string
        }
        Insert: {
          created_at?: string | null
          description_translations?: Json | null
          id?: string
          key: string
          max_players: number
          max_reserves?: number | null
          name_translations: Json
          positions: Json
          type: string
        }
        Update: {
          created_at?: string | null
          description_translations?: Json | null
          id?: string
          key?: string
          max_players?: number
          max_reserves?: number | null
          name_translations?: Json
          positions?: Json
          type?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_team: string
          created_at: string | null
          current_quarter: number | null
          date: string
          field: string | null
          formation_key: string | null
          home_team: string
          id: string
          is_home: boolean
          knhb_match_id: string | null
          lineup: Json | null
          location: string
          match_time: number | null
          player_stats: Json | null
          reserve_players: Json | null
          status: string | null
          substitution_schedule: Json | null
          substitutions: Json | null
          team_id: string | null
          unavailable_players: Json | null
          updated_at: string | null
        }
        Insert: {
          away_team: string
          created_at?: string | null
          current_quarter?: number | null
          date: string
          field?: string | null
          formation_key?: string | null
          home_team: string
          id?: string
          is_home?: boolean
          knhb_match_id?: string | null
          lineup?: Json | null
          location: string
          match_time?: number | null
          player_stats?: Json | null
          reserve_players?: Json | null
          status?: string | null
          substitution_schedule?: Json | null
          substitutions?: Json | null
          team_id?: string | null
          unavailable_players?: Json | null
          updated_at?: string | null
        }
        Update: {
          away_team?: string
          created_at?: string | null
          current_quarter?: number | null
          date?: string
          field?: string | null
          formation_key?: string | null
          home_team?: string
          id?: string
          is_home?: boolean
          knhb_match_id?: string | null
          lineup?: Json | null
          location?: string
          match_time?: number | null
          player_stats?: Json | null
          reserve_players?: Json | null
          status?: string | null
          substitution_schedule?: Json | null
          substitutions?: Json | null
          team_id?: string | null
          unavailable_players?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches_live: {
        Row: {
          away_score: number
          away_team: string
          created_at: string
          current_quarter: number
          home_score: number
          home_team: string
          id: string
          last_event: string | null
          last_event_time: string | null
          match_id: string | null
          match_key: string
          match_time: number
          status: string
          updated_at: string
        }
        Insert: {
          away_score?: number
          away_team: string
          created_at?: string
          current_quarter?: number
          home_score?: number
          home_team: string
          id?: string
          last_event?: string | null
          last_event_time?: string | null
          match_id?: string | null
          match_key: string
          match_time?: number
          status?: string
          updated_at?: string
        }
        Update: {
          away_score?: number
          away_team?: string
          created_at?: string
          current_quarter?: number
          home_score?: number
          home_team?: string
          id?: string
          last_event?: string | null
          last_event_time?: string | null
          match_id?: string | null
          match_key?: string
          match_time?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_live_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      news_items: {
        Row: {
          app_version: string
          created_at: string
          description: string
          id: string
          release_type: string
          title: string
          updated_at: string
        }
        Insert: {
          app_version?: string
          created_at?: string
          description: string
          id?: string
          release_type: string
          title: string
          updated_at?: string
        }
        Update: {
          app_version?: string
          created_at?: string
          description?: string
          id?: string
          release_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          language: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          language?: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          language?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          club_id: string | null
          coach: Json | null
          coaches: Json | null
          created_at: string
          default_formation_key: string | null
          id: string
          knhb_teamid: string | null
          name: string
          players: Json | null
          updated_at: string
          user_ids: Json | null
        }
        Insert: {
          club_id?: string | null
          coach?: Json | null
          coaches?: Json | null
          created_at?: string
          default_formation_key?: string | null
          id?: string
          knhb_teamid?: string | null
          name: string
          players?: Json | null
          updated_at?: string
          user_ids?: Json | null
        }
        Update: {
          club_id?: string | null
          coach?: Json | null
          coaches?: Json | null
          created_at?: string
          default_formation_key?: string | null
          id?: string
          knhb_teamid?: string | null
          name?: string
          players?: Json | null
          updated_at?: string
          user_ids?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
