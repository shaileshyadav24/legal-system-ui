import { create } from 'zustand'
import { loadPinnedChatIds, savePinnedChatIds } from '../services/chatService'

// Sessions and their messages are server-owned and cached by react-query.
// This store only holds pure client state: which chat is active, chats that
// haven't been sent yet ("drafts", not yet a real backend session), and pins.
export const useChatsStore = create((set) => ({
  activeChatId: null,
  drafts: [],
  pinnedIds: loadPinnedChatIds(),

  setActiveChatId: (id) => set({ activeChatId: id }),

  addDraftChat: (userType) => {
    const id = `draft-${Date.now()}`
    const greeting = {
      text: `Hello! You are logged in as a ${userType}. How can I help you today?`,
      sender: 'bot'
    }
    set((state) => ({
      drafts: [{ id, title: 'New Chat', messages: [greeting] }, ...state.drafts],
      activeChatId: id
    }))
    return id
  },

  addDraftMessage: (draftId, message) => set((state) => ({
    drafts: state.drafts.map((draft) => {
      if (draft.id !== draftId) return draft
      const messages = [...draft.messages, message]
      const userMessageCount = messages.filter((m) => m.sender === 'user').length
      const title = message.sender === 'user' && userMessageCount === 1
        ? message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '')
        : draft.title
      return { ...draft, messages, title }
    })
  })),

  removeDraftChat: (draftId) => set((state) => ({
    drafts: state.drafts.filter((draft) => draft.id !== draftId),
    activeChatId: state.activeChatId === draftId ? null : state.activeChatId
  })),

  togglePinned: (chatId) => set((state) => {
    const pinnedIds = state.pinnedIds.includes(chatId)
      ? state.pinnedIds.filter((id) => id !== chatId)
      : [...state.pinnedIds, chatId]
    savePinnedChatIds(pinnedIds)
    return { pinnedIds }
  }),

  removePinned: (chatId) => set((state) => {
    const pinnedIds = state.pinnedIds.filter((id) => id !== chatId)
    savePinnedChatIds(pinnedIds)
    return { pinnedIds }
  })
}))
