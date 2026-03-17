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

<!-- Mobile sidebar overlay -->
<div id="sidebar-overlay" class="relative z-50 lg:hidden hidden" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 opacity-0" id="sidebar-backdrop"></div>
  <div class="fixed inset-0 flex">
    <div class="relative mr-16 flex w-full max-w-xs flex-1 transition duration-300 ease-in-out -translate-x-full" id="sidebar-panel">
      <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
        <button type="button" class="-m-2.5 p-2.5" id="close-sidebar">
          <span class="sr-only">Close sidebar</span>
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
        </div>
        <nav class="flex flex-1 flex-col">
          <div class="mb-6">
            <label for="model-select-mobile" class="block text-sm/6 font-medium text-white">
              Model
            </label>
            <select id="model-select-mobile" name="model" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
              <option value="gpt-4o">gpt-4o</option>
            </select>
          </div>

          <fieldset class="mb-6">
            <legend class="block text-sm/6 font-semibold text-white mb-4">Filter groups</legend>
            <div class="space-y-5">
              <div class="flex gap-3">
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input id="filter-law-mobile" type="checkbox" name="filter-law" value="law" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
                    <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                      <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                      <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                  </div>
                </div>
                <div class="text-sm/6">
                  <label for="filter-law-mobile" class="font-medium text-white">Law</label>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input id="filter-oldRules-mobile" type="checkbox" name="filter-oldRules" value="oldRules" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
                    <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                      <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                      <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                  </div>
                </div>
                <div class="text-sm/6">
                  <label for="filter-oldRules-mobile" class="font-medium text-white">Old Rules</label>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input id="filter-newRules-mobile" type="checkbox" name="filter-newRules" value="newRules" checked class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto" />
                    <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                      <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                      <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                  </div>
                </div>
                <div class="text-sm/6">
                  <label for="filter-newRules-mobile" class="font-medium text-white">New Rules</label>
                </div>
              </div>
            </div>
          </fieldset>

          <div>
            <h3 class="text-sm font-semibold text-white mb-3">Tidigare frågor</h3>
            <div id="chat-list-mobile" class="space-y-2"></div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</div>

<!-- Static sidebar for desktop -->
<div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-96 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
  <div class="relative flex h-16 shrink-0 items-center pl-6">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="h-8 w-auto" />
  </div>

  <!-- Left panel content inside dark bar -->
  <div class="px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <label for="model-select" class="block text-sm/6 font-medium text-white">
        Model
      </label>
      <select id="model-select" name="model" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
        <option value="gpt-4o">gpt-4o</option>
      </select>
    </div>

    <fieldset class="mb-6">
      <legend class="block text-sm/6 font-semibold text-white mb-4">Filter groups</legend>
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
            <label for="filter-law" class="font-medium text-white">Law</label>
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
            <label for="filter-oldRules" class="font-medium text-white">Old Rules</label>
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
            <label for="filter-newRules" class="font-medium text-white">New Rules</label>
          </div>
        </div>
      </div>
    </fieldset>

    <div>
      <h3 class="text-sm font-semibold text-white mb-3">Tidigare frågor</h3>
      <div id="chat-list" class="space-y-2"></div>
    </div>
  </div>
</div>

<div class="lg:pl-96">
  <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900 dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
    <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" id="open-sidebar">
      <span class="sr-only">Open sidebar</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form action="#" method="GET" class="grid flex-1 grid-cols-1">
        <input name="search" placeholder="Sök" aria-label="Search" class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500" />
        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400">
          <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" fill-rule="evenodd" />
        </svg>
      </form>
    </div>
  </div>

  <main>
    <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
      <!-- Main area -->
      <div id="chat-history" class="space-y-6"></div>
    </div>
  </main>
</div>


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

// Sidebar toggle functionality
const openSidebarBtn = document.querySelector('#open-sidebar');
const closeSidebarBtn = document.querySelector('#close-sidebar');
const sidebarOverlay = document.querySelector('#sidebar-overlay');
const sidebarBackdrop = document.querySelector('#sidebar-backdrop');
const sidebarPanel = document.querySelector('#sidebar-panel');

function openSidebar() {
  sidebarOverlay?.classList.remove('hidden');
  setTimeout(() => {
    sidebarBackdrop?.classList.remove('opacity-0');
    sidebarBackdrop?.classList.add('opacity-100');
    sidebarPanel?.classList.remove('-translate-x-full');
    sidebarPanel?.classList.add('translate-x-0');
  }, 10);
}

function closeSidebar() {
  sidebarBackdrop?.classList.remove('opacity-100');
  sidebarBackdrop?.classList.add('opacity-0');
  sidebarPanel?.classList.remove('translate-x-0');
  sidebarPanel?.classList.add('-translate-x-full');
  setTimeout(() => {
    sidebarOverlay?.classList.add('hidden');
  }, 300);
}

openSidebarBtn?.addEventListener('click', openSidebar);
closeSidebarBtn?.addEventListener('click', closeSidebar);
sidebarBackdrop?.addEventListener('click', closeSidebar);

// Sync mobile and desktop selects
const modelSelect = document.querySelector<HTMLSelectElement>('#model-select');
const modelSelectMobile = document.querySelector<HTMLSelectElement>('#model-select-mobile');

modelSelect?.addEventListener('change', () => {
  if (modelSelectMobile) modelSelectMobile.value = modelSelect.value;
});

modelSelectMobile?.addEventListener('change', () => {
  if (modelSelect) modelSelect.value = modelSelectMobile.value;
});

// Handle search form submission
const searchForm = document.querySelector('form');
const chatHistoryElement = document.querySelector<HTMLDivElement>('#chat-history');
const chatListElement = document.querySelector<HTMLDivElement>('#chat-list');
const chatListElementMobile = document.querySelector<HTMLDivElement>('#chat-list-mobile');

function renderChatList() {
  const chatListHTML = chats.map(chat => {
    const truncatedQuestion = chat.question.length > 50
      ? chat.question.substring(0, 50) + '...'
      : chat.question;

    return `
      <button
        class="w-full text-left px-3 py-2 rounded-md text-sm ${activeChat?.id === chat.id
        ? 'bg-indigo-600 text-white'
        : 'bg-white text-gray-900 hover:bg-gray-100'
      }"
        data-chat-id="${chat.id}"
      >
        ${escapeHtml(truncatedQuestion)}
      </button>
    `;
  }).join('');

  // Render to both desktop and mobile
  if (chatListElement) chatListElement.innerHTML = chatListHTML;
  if (chatListElementMobile) chatListElementMobile.innerHTML = chatListHTML;

  // Add click handlers for desktop
  chatListElement?.querySelectorAll('button').forEach(button => {
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

  // Add click handlers for mobile
  chatListElementMobile?.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const chatId = parseInt(button.dataset.chatId || '0');
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        activeChat = chat;
        renderChatList();
        renderActiveChat();
        closeSidebar(); // Close sidebar when selecting a chat on mobile
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

  // Get selected groups from checkboxes
  const selectedGroups: string[] = [];
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][id^="filter-"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedGroups.push(checkbox.value);
    }
  });

  const messages: any[] = [
    {
      "role": "system",
      "content": "Answer using ONLY the provided sources. Structure the answer into sections. One section per data source",
    },
    {
      "role": "user",
      "content": query
    }
  ];
  

  // Only fetch and add Law section if checkbox is selected
  if (selectedGroups.includes('law')) {
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

    // Only add section if there is data
    if (answerLaw.length > 0) {
      messages.push({
        "role": "assistant",
        "content": "Law Sources:\n\n" + JSON.stringify(answerLaw)
      });
    }
  }

  // Only fetch and add Old Rules section if checkbox is selected
  if (selectedGroups.includes('oldRules')) {
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

    // Only add section if there is data
    if (answerOldRules.length > 0) {
      messages.push({
        "role": "assistant",
        "content": "Old Rules Sources:\n\n" + JSON.stringify(answerOldRules)
      });
    }
  }

  // Only fetch and add New Rules section if checkbox is selected
  if (selectedGroups.includes('newRules')) {
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

    // Only add section if there is data
    if (answerNewRules.length > 0) {
      messages.push({
        "role": "assistant",
        "content": "New Rules Sources:\n\n" + JSON.stringify(answerNewRules)
      });
    }
  }

  console.log("Final Messages to API:", messages);

  return await fetch(searchApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      "messages": messages
    })
  });

}
