import { createClient } from './supabase';

/** Generate a unique snippet ID */
export function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

/** Human-readable time ago */
export function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60_000)     return "just now";
  if (d < 3_600_000)  return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return `${Math.floor(d / 86_400_000)}d ago`;
}

function toSnippet(row) {
  return {
    id:        row.id,
    ownerId:   row.user_id,
    title:     row.title,
    filename:  row.filename  || '',
    language:  row.language,
    code:      row.code,
    notes:     row.notes     || '',
    createdAt: new Date(row.created_at).getTime(),
  };
}

/** Get all snippets for a user (newest first, max 80) */
export async function getAll(userId) {
  if (!userId) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(80);
  if (error) throw error;
  return (data ?? []).map(toSnippet);
}

/** Create or overwrite a snippet */
export async function persist(userId, snippet) {
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase
    .from('code_snippets')
    .upsert({
      id:       snippet.id,
      user_id:  userId,
      title:    snippet.title    || 'Untitled Snippet',
      filename: snippet.filename || '',
      language: snippet.language || 'javascript',
      code:     snippet.code,
      notes:    snippet.notes    || '',
    }, { onConflict: 'id' });
  if (error) throw error;
}

/** Direct fetch by snippet ID + owner (fast path) */
export async function getById(userId, snippetId) {
  if (!userId || !snippetId) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('id', snippetId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toSnippet(data) : null;
}

/** Find any snippet by ID across all users (for shared links) */
export async function byId(snippetId) {
  if (!snippetId) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('id', snippetId)
    .maybeSingle();
  if (error) throw error;
  return data ? toSnippet(data) : null;
}

/** Delete a snippet (owner only) */
export async function deleteById(userId, snippetId) {
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase
    .from('code_snippets')
    .delete()
    .eq('id', snippetId)
    .eq('user_id', userId);
  if (error) throw error;
}

/** Trigger a file download in the browser */
export function downloadFile(code, filename, ext) {
  const name = (filename?.trim() || 'snippet') + '.' + ext;
  const blob = new Blob([code], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  return name;
}