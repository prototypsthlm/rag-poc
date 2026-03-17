import { createCheckboxField } from './components/checkbox';

export function getAppTemplate(): string {
  const filterCheckboxes = [
    { id: 'filter-law', label: 'Law', value: 'law' },
    { id: 'filter-oldRules', label: 'Old Rules', value: 'oldRules' },
    { id: 'filter-newRules', label: 'New Rules', value: 'newRules' }
  ];

  return `
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
              ${filterCheckboxes.map(cb => createCheckboxField(cb.id + '-mobile', cb.label, cb.value, true)).join('\n')}
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
        ${filterCheckboxes.map(cb => createCheckboxField(cb.id, cb.label, cb.value, true)).join('\n')}
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
`;
}
