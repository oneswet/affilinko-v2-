
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
      profiles: {
        Row: {
          id: string
          email: string
          role: "admin" | "editor" | "user"
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "editor" | "user"
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "editor" | "user"
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      providers: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          rating: number | null
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          rating?: number | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          rating?: number | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          featured_image: string | null
          author_id: string | null
          category_id: string | null
          status: "draft" | "published" | "archived" | null
          published_at: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: "draft" | "published" | "archived" | null
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: "draft" | "published" | "archived" | null
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      ad_placements: {
        Row: {
          id: string
          name: string
          description: string | null
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          id: string
          title: string
          type: "image" | "html" | "native"
          placement_id: string | null
          image_url: string | null
          destination_url: string | null
          html_content: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean | null
          impressions: number | null
          clicks: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: "image" | "html" | "native"
          placement_id?: string | null
          image_url?: string | null
          destination_url?: string | null
          html_content?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          impressions?: number | null
          clicks?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: "image" | "html" | "native"
          placement_id?: string | null
          image_url?: string | null
          destination_url?: string | null
          html_content?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          impressions?: number | null
          clicks?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "ad_placements"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          tags: string[] | null
          is_subscribed: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          tags?: string[] | null
          is_subscribed?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          tags?: string[] | null
          is_subscribed?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      smtp_configs: {
        Row: {
          id: string
          name: string
          host: string
          port: number
          username: string
          // In a real app we wouldn't expose password here, but this is an admin dashboard type
          password: string
          encryption: string | null
          from_email: string
          from_name: string
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          host: string
          port: number
          username: string
          password: string
          encryption?: string | null
          from_email: string
          from_name: string
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          host?: string
          port?: number
          username?: string
          password?: string
          encryption?: string | null
          from_email?: string
          from_name?: string
          is_active?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          id: string
          name: string
          subject: string
          content: string
          smtp_config_id: string | null
          status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed" | null
          scheduled_for: string | null
          sent_at: string | null
          total_recipients: number | null
          sent_count: number | null
          failed_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          content: string
          smtp_config_id?: string | null
          status?: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed" | null
          scheduled_for?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          sent_count?: number | null
          failed_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          content?: string
          smtp_config_id?: string | null
          status?: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed" | null
          scheduled_for?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          sent_count?: number | null
          failed_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_smtp_config_id_fkey"
            columns: ["smtp_config_id"]
            isOneToOne: false
            referencedRelation: "smtp_configs"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_meta: {
        Row: {
          id: string
          page_path: string
          title: string | null
          description: string | null
          keywords: string[] | null
          og_image: string | null
          no_index: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_path: string
          title?: string | null
          description?: string | null
          keywords?: string[] | null
          og_image?: string | null
          no_index?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_path?: string
          title?: string | null
          description?: string | null
          keywords?: string[] | null
          og_image?: string | null
          no_index?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
