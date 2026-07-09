import { lazy, Suspense, useMemo, useCallback, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserStore } from '../stores/useUserStore'
import { useChatsStore } from '../stores/useChatsStore'
import { usePageContent } from '../hooks/usePageContent'
import { fetchSessions, deleteSession } from '../services/chatHistoryService'

const ChatSidebar = lazy(() => import('../components/ChatSidebar'))
const Chatbot = lazy(() => import('../components/Chatbot'))

const formatTimestamp = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const MOBILE_QUERY = '(max-width: 768px)'

function ChatPage({ onNewChat, onUserTypeChange, onSignOut }) {
  // On desktop the sidebar defaults open (an in-flow rail); on mobile it
  // defaults closed (an off-canvas drawer) so it doesn't cover the chat on load.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  ))
  const queryClient = useQueryClient()

  const userType = useUserStore((state) => state.userType)
  const userName = useUserStore((state) => state.userName)

  const drafts = useChatsStore((state) => state.drafts)
  const pinnedIds = useChatsStore((state) => state.pinnedIds)
  const activeChatId = useChatsStore((state) => state.activeChatId)
  const setActiveChatId = useChatsStore((state) => state.setActiveChatId)
  const togglePinned = useChatsStore((state) => state.togglePinned)
  const removePinned = useChatsStore((state) => state.removePinned)
  const removeDraftChat = useChatsStore((state) => state.removeDraftChat)

  const { content } = usePageContent('chat')
  const sidebarContent = content?.sidebar || {}
  const chatbotContent = content?.chatbot || {}
  const loadingText = content?.loading?.components || 'Loading chat components...'
  const noChatSelectedText = chatbotContent.noChatSelected || 'Select a chat or start a new one'

  const { data: sessions = [], error: sessionsError } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })

  useEffect(() => {
    if (sessionsError) console.error('Failed to load chat sessions:', sessionsError)
  }, [sessionsError])

  const chats = useMemo(() => {
    const draftChats = drafts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      timestamp: '',
      isPinned: pinnedIds.includes(draft.id),
      isDraft: true
    }))
    const sessionChats = sessions.map((session) => ({
      id: session.id,
      title: session.title || 'Untitled chat',
      timestamp: formatTimestamp(session.updated_at),
      isPinned: pinnedIds.includes(session.id),
      isDraft: false
    }))
    return [...draftChats, ...sessionChats]
  }, [drafts, sessions, pinnedIds])

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id)
    }
  }, [activeChatId, chats, setActiveChatId])

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId), [chats, activeChatId])

  const handleSelectChat = useCallback((chatId) => {
    setActiveChatId(chatId)
    // On mobile the sidebar is an overlay drawer — close it after picking a
    // chat so the conversation is actually visible. No-op on desktop, where
    // "collapsed" just means the narrow icon rail, not hidden.
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setIsSidebarCollapsed(true)
    }
  }, [setActiveChatId])

  const handleTogglePinChat = useCallback((chatId) => {
    togglePinned(chatId)
  }, [togglePinned])

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] })
  })

  const handleDeleteChat = useCallback(async (chatId) => {
    removePinned(chatId)
    if (chatId.startsWith('draft-')) {
      removeDraftChat(chatId)
      return
    }
    try {
      await deleteMutation.mutateAsync(chatId)
      queryClient.removeQueries({ queryKey: ['messages', chatId] })
      if (activeChatId === chatId) setActiveChatId(null)
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }, [deleteMutation, queryClient, removeDraftChat, removePinned, activeChatId, setActiveChatId])

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev)
  }, [])

  return (
    <Suspense fallback={<div className="loading">{loadingText}</div>}>
      <div className="app-layout">
        {isSidebarCollapsed && (
          <button
            type="button"
            className="mobile-sidebar-trigger"
            onClick={handleToggleSidebar}
            aria-label="Open menu"
            title="Open menu"
          >
            ☰
          </button>
        )}
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={onNewChat}
          onTogglePinChat={handleTogglePinChat}
          onDeleteChat={handleDeleteChat}
          onUserTypeChange={onUserTypeChange}
          onSignOut={onSignOut}
          userType={userType}
          userName={userName}
          content={sidebarContent}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        {!isSidebarCollapsed && (
          <div className="sidebar-backdrop" onClick={handleToggleSidebar} />
        )}
        <div className="chat-panel">
          {activeChat ? (
            <Chatbot
              userType={userType}
              chatId={activeChat.id}
              content={chatbotContent}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>{noChatSelectedText}</h2>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default ChatPage
