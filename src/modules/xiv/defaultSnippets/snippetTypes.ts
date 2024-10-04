export interface CustomAction {
    description: string;
    type: 'pick' | 'action';
    icon: string;
    options?: string[];
}

export interface Action {
    time?: number;
    action?: string;
    shortcut?: string;
}

export interface SnippetVersion {
    name: string;
    description: string;
    actions: Action[];
}

export interface Snippet {
    name: string;
    description: string;
    versions: SnippetVersion[];
}

export interface JobResources {
    customActions: Record<string, CustomAction>;
    snippets: Snippet[];
}
