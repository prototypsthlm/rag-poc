import './style.css'
import { marked } from 'marked'
import { getAppTemplate } from './template'
import { getResponseSections as apiGetResponseSections, parseResponse } from './services/api'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = getAppTemplate()

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

function syncSelects(source: HTMLSelectElement, target: HTMLSelectElement | null) {
  if (target) target.value = source.value;
}

modelSelect?.addEventListener('change', () => syncSelects(modelSelect, modelSelectMobile));
modelSelectMobile?.addEventListener('change', () => syncSelects(modelSelectMobile, modelSelect));

// Sync mobile and desktop checkboxes
const checkboxPairs = [
  ['#filter-law', '#filter-law-mobile'],
  ['#filter-oldRules', '#filter-oldRules-mobile'],
  ['#filter-newRules', '#filter-newRules-mobile']
];

const filterCheckboxes = new Map<string, HTMLInputElement>();

checkboxPairs.forEach(([desktopId, mobileId]) => {
  const desktop = document.querySelector<HTMLInputElement>(desktopId);
  const mobile = document.querySelector<HTMLInputElement>(mobileId);

  if (desktop) filterCheckboxes.set(desktopId, desktop);

  desktop?.addEventListener('change', () => {
    if (mobile) mobile.checked = desktop.checked;
  });

  mobile?.addEventListener('change', () => {
    if (desktop) desktop.checked = mobile.checked;
  });
});

// Helper function to get selected groups (only from desktop checkboxes to avoid duplicates)
function getSelectedGroups(): string[] {
  const groupMap: Record<string, string> = {
    '#filter-law': 'law',
    '#filter-oldRules': 'oldRules',
    '#filter-newRules': 'newRules'
  };

  return Array.from(filterCheckboxes.entries())
    .filter(([_, checkbox]) => checkbox.checked)
    .map(([id, _]) => groupMap[id])
    .filter(Boolean);
}

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
  const query = searchInput?.value;

  if (!query) return;

  try {
    // Update UI to show loading state
    if (chatHistoryElement) chatHistoryElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Laddar...</p>';

    // Get selected groups from checkboxes
    const selectedGroups = getSelectedGroups();

    // Make API call
    const response = await apiGetResponseSections(query, selectedGroups);
    const answer = await parseResponse(response);
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
