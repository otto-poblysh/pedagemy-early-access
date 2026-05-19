-- Migration: add locale column to waiting_list
-- Run this after waiting-list.sql has been applied

alter table public.waiting_list
  add column if not exists locale text not null default 'en';
