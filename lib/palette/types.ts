export type ActionKind = 'nav' | 'mutation' | 'query' | 'mode';
export interface PaletteAction {
  id: string;
  kind: ActionKind;
  title: string;
  hint?: string;        // short subtitle, e.g. 'Dashboard' or 'Cmd+,'
  keywords?: string[];  // extra terms for fuzzy match
  shortcut?: string;    // visual hint like 'g h'
  perform: () => void | Promise<void>;
}