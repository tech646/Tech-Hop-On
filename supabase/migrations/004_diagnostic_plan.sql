-- Migration 004: Add plan column to diagnostic_results_v2

alter table diagnostic_results_v2
  add column if not exists plan text not null default 'gratuito';
