export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url';
  required: boolean;
  placeholder?: string;
}

export const adapterFields: Record<string, FieldDef[]> = {
  adguard: [
    { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'http://localhost:8080' },
    { key: 'user', label: 'Username', type: 'text', required: true },
    { key: 'pass', label: 'Password', type: 'password', required: true },
  ],
  ntfy: [
    { key: 'baseUrl', label: 'Base URL', type: 'url', required: true, placeholder: 'https://ntfy.sh' },
    { key: 'defaultTopic', label: 'Default Topic', type: 'text', required: false },
    { key: 'token', label: 'Auth Token', type: 'password', required: false },
  ],
  memos: [
    { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'http://localhost:5230' },
    { key: 'token', label: 'API Token', type: 'password', required: false },
  ],
  ollama: [
    { key: 'baseUrl', label: 'Base URL', type: 'url', required: true, placeholder: 'https://ollama.com/v1' },
    { key: 'apiKey', label: 'API Key', type: 'password', required: false },
    { key: 'defaultModel', label: 'Default Model', type: 'text', required: false, placeholder: 'qwen3-coder:480b-cloud' },
  ],
};