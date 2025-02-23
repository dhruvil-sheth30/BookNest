export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      book: {
        Row: {
          id: string
          name: string
          category_id: string | null
          collection_id: string | null
          launch_date: string | null
          publisher: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id?: string | null
          collection_id?: string | null
          launch_date?: string | null
          publisher?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string | null
          collection_id?: string | null
          launch_date?: string | null
          publisher?: string | null
          created_at?: string
        }
      }
      category: {
        Row: {
          id: string
          name: string
          sub_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sub_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sub_name?: string | null
          created_at?: string
        }
      }
      collection: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      issuance: {
        Row: {
          id: string
          book_id: string
          member_id: string
          issued_by: string | null
          issue_date: string
          return_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          member_id: string
          issued_by?: string | null
          issue_date?: string
          return_date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          member_id?: string
          issued_by?: string | null
          issue_date?: string
          return_date?: string
          status?: string
          created_at?: string
        }
      }
      member: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string
          created_at?: string
        }
      }
      membership: {
        Row: {
          id: string
          member_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      pending_returns: {
        Row: {
          issuance_id: string | null
          book_name: string | null
          member_name: string | null
          member_email: string | null
          issue_date: string | null
          return_date: string | null
          status: string | null
        }
      }
    }
    Functions: {}
  }
}