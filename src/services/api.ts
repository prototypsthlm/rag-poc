// Configuration
export const CONFIG = {
  apiUrl: 'https://internal-rag-poc-open-ai-swd.openai.azure.com/openai/deployments',
  apiVersion: '2024-02-15-preview',
  searchEndpoint: 'https://internal-rag-poc-ai-search.search.windows.net',
  indexName: 'rag-poc-w-metadata-2',
  indexApiUrl: 'https://internal-rag-poc-ai-search.search.windows.net/indexes/rag-poc-w-metadata-2/docs/search?api-version=2024-03-01-preview',
  defaultModel: 'gpt-4o'
} as const;

// Types
interface SearchDocument {
  title: string;
  chunk: string;
  group: string[];
}

interface SearchResponse {
  value?: SearchDocument[];
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  choices?: Array<{
    message?: {
      content: string;
    };
  }>;
}

export async function fetchGroupDocuments(query: string, group: string): Promise<SearchDocument[]> {
  const response = await fetch(CONFIG.indexApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_AZURE_SEARCH_API_KEY
    },
    body: JSON.stringify({
      search: query,
      filter: `group/any(g: g eq '${group}')`,
      top: 4
    })
  });

  const data: SearchResponse = await response.json();
  return data.value?.map(doc => ({
    title: doc.title,
    chunk: doc.chunk,
    group: doc.group
  })) || [];
}

export async function getResponseSections(query: string, selectedGroups: string[]): Promise<Response> {
  const model = CONFIG.defaultModel;
  const searchApiUrl = `${CONFIG.apiUrl}/${model}/chat/completions?api-version=${CONFIG.apiVersion}`;

  const messages: Message[] = [
    {
      role: 'system',
      content: `You will receive a query and document contexts from specific regulatory groups. Provide your answer in sections based on the available groups.

          ## Response Format

          Structure your response using ONLY the sections for which you have been provided documents:

          **Law:**
          [Answer using ONLY documents from the Law group. Skip this section entirely if no Law documents were provided.]

          **Old rules:**
          [Answer using ONLY documents from the Old rules group. Skip this section entirely if no Old rules documents were provided.]

          **New rules:**
          [Answer using ONLY documents from the New rules group. Skip this section entirely if no New rules documents were provided.]

          ## Important Rules

          1. Each section must ONLY use information from documents belonging to that specific group
          2. Do NOT combine information across groups within a single section
          3. If you have no documents from a particular group, completely omit that section - do not include the heading
          4. If none of the provided documents contain relevant information for a group, omit that section
          5. Maintain the order: Law → Old rules → New rules (for sections that exist)`
    },
    {
      role: 'user',
      content: query
    }
  ];

  const groupMapping: Record<string, { filter: string; label: string }> = {
    law: { filter: 'law', label: 'Law Sources' },
    oldRules: { filter: 'oldRules', label: 'Old Rules Sources' },
    newRules: { filter: 'newRules', label: 'New Rules Sources' }
  };

  // Fetch documents for each selected group
  for (const group of selectedGroups) {
    const mapping = groupMapping[group];
    if (mapping) {
      const documents = await fetchGroupDocuments(query, mapping.filter);

      if (documents.length > 0) {
        messages.push({
          role: 'assistant',
          content: `${mapping.label}:\n\n${JSON.stringify(documents)}`
        });
      }
    }
  }

  return await fetch(searchApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages
    })
  });
}

export async function parseResponse(response: Response): Promise<string> {
  const data: ChatResponse = await response.json();
  return data.choices?.[0]?.message?.content || JSON.stringify(data);
}
