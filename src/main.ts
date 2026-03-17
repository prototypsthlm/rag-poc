import './style.css'
import { marked } from 'marked'

// Configuration
const CONFIG = {
  apiUrl: 'https://internal-rag-poc-open-ai-swd.openai.azure.com/openai/deployments',
  apiVersion: '2024-02-15-preview',
  searchEndpoint: 'https://internal-rag-poc-ai-search.search.windows.net',
  indexName: 'rag-poc-w-metadata-2',
  defaultModel: 'gpt-4o'
} as const;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `


<!-- Static sidebar for desktop -->
<div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
  <div class="relative flex h-16 shrink-0 items-center justify-center">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="h-8 w-auto" />
  </div>
</div>

<div class="lg:pl-20">
  <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900 dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">

    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form action="#" method="GET" class="grid flex-1 grid-cols-1">
        <input name="search" placeholder="Sök" aria-label="Search" class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500" />
        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400">
          <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" fill-rule="evenodd" />
        </svg>
      </form>
    </div>
  </div>

  <main class="xl:pl-96">
    <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
      <!-- Main area -->
      <div id="chat-history" class="space-y-6"></div>
    </div>
  </main>
</div>

<aside class="fixed top-16 bottom-0 left-20 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block dark:border-white/10">
  <!-- Secondary column (hidden on smaller screens) -->
  <div class="mb-6">
    <label for="model-select" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
      Model
    </label>
    <select id="model-select" name="model" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:text-white dark:ring-gray-700">
      <option value="gpt-4o">gpt-4o</option>
    </select>
  </div>

  <fieldset class="mb-6">
    <legend class="block text-sm/6 font-semibold text-gray-900 dark:text-white mb-4">Filter groups</legend>
    <div class="space-y-5">
      <div class="flex gap-3">
        <div class="flex h-6 shrink-0 items-center">
          <div class="group grid size-4 grid-cols-1">
            <input id="filter-law" type="checkbox" name="filter-law" value="law" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
            <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
              <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
              <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
            </svg>
          </div>
        </div>
        <div class="text-sm/6">
          <label for="filter-law" class="font-medium text-gray-900 dark:text-white">Law</label>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex h-6 shrink-0 items-center">
          <div class="group grid size-4 grid-cols-1">
            <input id="filter-oldRules" type="checkbox" name="filter-oldRules" value="oldRules" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
            <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
              <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
              <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
            </svg>
          </div>
        </div>
        <div class="text-sm/6">
          <label for="filter-oldRules" class="font-medium text-gray-900 dark:text-white">Old Rules</label>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex h-6 shrink-0 items-center">
          <div class="group grid size-4 grid-cols-1">
            <input id="filter-newRules" type="checkbox" name="filter-newRules" value="newRules" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
            <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
              <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
              <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
            </svg>
          </div>
        </div>
        <div class="text-sm/6">
          <label for="filter-newRules" class="font-medium text-gray-900 dark:text-white">New Rules</label>
        </div>
      </div>
    </div>
  </fieldset>

  <div>
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tidigare frågor</h3>
    <div id="chat-list" class="space-y-2"></div>
  </div>
</aside>

`

// Helper functions
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Types
interface Chat {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
  groups: string[];
}

// State
let chats: Chat[] = [];
let activeChat: Chat | null = null;

// Handle search form submission
const searchForm = document.querySelector('form');
const chatHistoryElement = document.querySelector<HTMLDivElement>('#chat-history');
const chatListElement = document.querySelector<HTMLDivElement>('#chat-list');

function renderChatList() {
  if (!chatListElement) return;

  chatListElement.innerHTML = chats.map(chat => {
    const truncatedQuestion = chat.question.length > 50
      ? chat.question.substring(0, 50) + '...'
      : chat.question;

    return `
      <button
        class="w-full text-left px-3 py-2 rounded-md text-sm ${activeChat?.id === chat.id
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }"
        data-chat-id="${chat.id}"
      >
        ${escapeHtml(truncatedQuestion)}
      </button>
    `;
  }).join('');

  // Add click handlers
  chatListElement.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const chatId = parseInt(button.dataset.chatId || '0');
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        activeChat = chat;
        renderChatList();
        renderActiveChat();
      }
    });
  });
}

async function renderActiveChat() {
  if (!chatHistoryElement || !activeChat) return;

  const markdownAnswer = await marked.parse(activeChat.answer);

  const groupLabels: Record<string, string> = {
    law: 'Law',
    oldRules: 'Old Rules',
    newRules: 'New Rules'
  };

  const groupBadges = activeChat.groups.map(group =>
    `<span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">${escapeHtml(groupLabels[group] || group)}</span>`
  ).join(' ');

  chatHistoryElement.innerHTML = `
    <div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${escapeHtml(activeChat.question)}</p>
      <div class="flex gap-2 mb-4">${groupBadges}</div>
      <div class="prose dark:prose-invert max-w-none">${markdownAnswer}</div>
    </div>
  `;
}

searchForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]');
  const modelSelect = document.querySelector<HTMLSelectElement>('#model-select');
  const query = searchInput?.value;
  const model = modelSelect?.value || CONFIG.defaultModel;

  if (!query) return;

  try {
    // Update UI to show loading state
    if (chatHistoryElement) chatHistoryElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Laddar...</p>';

    // Get selected groups from checkboxes
    const selectedGroups: string[] = [];
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][id^="filter-"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedGroups.push(checkbox.value);
      }
    });

    // Make API call
    const apiUrl = `${CONFIG.apiUrl}/${model}/chat/completions?api-version=${CONFIG.apiVersion}`;

    const response = await getResponseSections(query, apiUrl);

    const data = await response.json();

    // Create new chat
    const answer = data.choices?.[0]?.message?.content || JSON.stringify(data);
    const newChat: Chat = {
      id: Date.now(),
      question: query,
      answer: answer,
      timestamp: new Date(),
      groups: selectedGroups
    };

    chats.unshift(newChat); // Add to beginning
    activeChat = newChat;

    // Update UI
    renderChatList();
    renderActiveChat();

    // Clear the search box
    if (searchInput) searchInput.value = '';
  } catch (error) {
    if (chatHistoryElement) {
      chatHistoryElement.innerHTML = `<p class="text-red-600 dark:text-red-400">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
    }
  }
});

async function getResponse(query: string, apiUrl: string) {
  // Get selected groups from checkboxes
  const selectedGroups: string[] = [];
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][id^="filter-"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedGroups.push(checkbox.value);
    }
  });

  // Build filter string
  const filterString = selectedGroups.length > 0
    ? `group/any(g: search.in(g, '${selectedGroups.join(',')}', ','))`
    : undefined;

  return await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [
        {
          "role": "system",
          "content": `Use the provided sources.

                      Each source contains metadata field "group".

                      If group = law → include it in the section "Law".
                      If group = oldRules → include it in section "Old Rules".
                      If group = newRules → include it in section "New Rules".

                      Always produce all sections if information exists.
                    `
        },
        {
          "role": "user",
          "content": query
        }
      ],
      data_sources: [
        {
          type: "azure_search",
          parameters: {
            endpoint: CONFIG.searchEndpoint,
            index_name: CONFIG.indexName,
            ...(filterString && { filter: filterString }),
            authentication: {
              type: "api_key",
              key: import.meta.env.VITE_AZURE_SEARCH_API_KEY
            },
            fields_mapping: {
              content_fields: ["chunk"],
              metadata_fields: ["group"]
            },
            top_n_documents: 8
          }
        }
      ]
    })
  });
}

async function getResponseSections(query: string, searchApiUrl: string) {
  const indexApiUrl = "https://internal-rag-poc-ai-search.search.windows.net/indexes/rag-poc-w-metadata-2/docs/search?api-version=2024-03-01-preview";

  const responseLaw = await fetch(indexApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_AZURE_SEARCH_API_KEY
    },
    body: JSON.stringify({
      "search": query,
      "filter": "group/any(g: g eq 'law')",
      "top": 4
    })
  });

  const dataLaw = await responseLaw.json();
  const answerLaw = dataLaw.value?.map((doc: any) => ({
    title: doc.title,
    chunk: doc.chunk,
    group: doc.group
  })) || [];
  console.log("Answer Law:", answerLaw);

  const responseOldRules = await fetch(indexApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_AZURE_SEARCH_API_KEY
    },
    body: JSON.stringify({
      "search": query,
      "filter": "group/any(g: g eq 'oldRules')",
      "top": 4
    })
  });

  const dataOldRules = await responseOldRules.json();
  const answerOldRules = dataOldRules.value?.map((doc: any) => ({
    title: doc.title,
    chunk: doc.chunk,
    group: doc.group
  })) || [];
  console.log("Answer Old Rules:", answerOldRules);

  const responseNewRules = await fetch(indexApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_AZURE_SEARCH_API_KEY
    },
    body: JSON.stringify({
      "search": query,
      "filter": "group/any(g: g eq 'newRules')",
      "top": 4
    })
  });

  const dataNewRules = await responseNewRules.json();
  const answerNewRules = dataNewRules.value?.map((doc: any) => ({
    title: doc.title,
    chunk: doc.chunk,
    group: doc.group
  })) || [];
  console.log("Answer New Rules:", answerNewRules);

  return await fetch(searchApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": "Answer using the provided sources. Structure the answer into three sections: Law, Old Rules, and New Rules."
        },
        {
          "role": "user",
          "content": query
        },
        {
          "role": "assistant",
          "content": "Law Sources:\n\n" + answerLaw
        },
        {
          "role": "assistant",
          "content": "Old Rules Sources:\n\n" + answerOldRules
        },
        {
          "role": "assistant",
          "content": "New Rules Sources:\n\n" + answerNewRules
        }],
    })
  });

}
