import './style.css'
import { marked } from 'marked'

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

  <div>
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tidigare frågor</h3>
    <div id="chat-list" class="space-y-2"></div>
  </div>
</aside>

`

// Types
interface Chat {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
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

  chatListElement.innerHTML = chats.map(chat => `
    <button
      class="w-full text-left px-3 py-2 rounded-md text-sm ${
        activeChat?.id === chat.id
          ? 'bg-indigo-600 text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }"
      data-chat-id="${chat.id}"
    >
      ${chat.question.length > 50 ? chat.question.substring(0, 50) + '...' : chat.question}
    </button>
  `).join('');

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
  chatHistoryElement.innerHTML = `
    <div>
      <p class="text-lg font-semibold text-gray-900 dark:text-white mb-4">${activeChat.question}</p>
      <div class="prose dark:prose-invert max-w-none">${markdownAnswer}</div>
    </div>
  `;
}

searchForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchInput = document.querySelector<HTMLInputElement>('input[name="search"]');
  const modelSelect = document.querySelector<HTMLSelectElement>('#model-select');
  const query = searchInput?.value;
  const model = modelSelect?.value || 'gpt-4o';

  if (!query) return;

  try {
    // Update UI to show loading state
    if (chatHistoryElement) chatHistoryElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Loading...</p>';

    // Make API call
    const apiUrl = `https://internal-rag-poc-open-ai-swd.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=2024-02-15-preview`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': import.meta.env.VITE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        "messages": [
          {
            "role": "user",
            "content": query
          }
        ],
        "data_sources": [
          {
            "type": "azure_search",
            "parameters": {
              "endpoint": "https://internal-rag-poc-ai-search.search.windows.net",
              "index_name": "rag-poc",
              "authentication": {
                "type": "api_key",
                "key": import.meta.env.VITE_AZURE_SEARCH_API_KEY
              }
            }
          }
        ]
      })
    });
    const data = await response.json();

    // Create new chat
    const answer = data.choices?.[0]?.message?.content || JSON.stringify(data);
    const newChat: Chat = {
      id: Date.now(),
      question: query,
      answer: answer,
      timestamp: new Date()
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
