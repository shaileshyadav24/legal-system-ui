import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChatsStore } from '../stores/useChatsStore'
import ChatbotMessageList from './ChatbotMessageList'
import ChatbotInputArea from './ChatbotInputArea'
import { createUserMessage, createBotMessage, createErrorMessage, messageFromHistoryEntry, queryAI } from '../services/chatbotService'
import { fetchSessionMessages } from '../services/chatHistoryService'
import './Chatbot.scss'

function Chatbot({ userType, chatId, content }) {
  const isDraft = chatId.startsWith('draft-')
  const queryClient = useQueryClient()

  const draft = useChatsStore((state) => (isDraft ? state.drafts.find((item) => item.id === chatId) : undefined))
  const addDraftMessage = useChatsStore((state) => state.addDraftMessage)
  const removeDraftChat = useChatsStore((state) => state.removeDraftChat)
  const setActiveChatId = useChatsStore((state) => state.setActiveChatId)

  const [inputValue, setInputValue] = useState('')
  const [isResponseStopped, setIsResponseStopped] = useState(false)
  const [isInternetEnabled, setIsInternetEnabled] = useState(true)
  const [isPromptMode, setIsPromptMode] = useState(false)
  const messagesEndRef = useRef(null)
  const abortRef = useRef(false)

  const { data: historyMessages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => (await fetchSessionMessages(chatId)).flatMap(messageFromHistoryEntry),
    enabled: !isDraft
  })

  const messages = useMemo(
    () => (isDraft ? (draft?.messages || []) : (historyMessages || [])),
    [isDraft, draft, historyMessages]
  )

  useEffect(() => {
    setIsResponseStopped(false)
  }, [chatId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const mutation = useMutation({
    mutationFn: (query) => queryAI(query, userType, { sessionId: isDraft ? undefined : chatId })
  })

  const appendMessage = useCallback((message) => {
    if (isDraft) {
      addDraftMessage(chatId, message)
    } else {
      queryClient.setQueryData(['messages', chatId], (old = []) => [...old, message])
    }
  }, [isDraft, chatId, addDraftMessage, queryClient])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || mutation.isPending) return

    abortRef.current = false
    setIsResponseStopped(false)

    const query = inputValue
    setInputValue('')
    appendMessage(createUserMessage(query))

    try {
      const response = await mutation.mutateAsync(query)
      if (abortRef.current) return

      const botMessage = createBotMessage(response, content?.defaultResponse)
      appendMessage(botMessage)

      // First successful message on a draft — it's now a real backend session.
      if (isDraft && response.sessionId) {
        const finalMessages = [...(draft?.messages || []), createUserMessage(query), botMessage]
        queryClient.setQueryData(['messages', response.sessionId], finalMessages)
        queryClient.invalidateQueries({ queryKey: ['sessions'] })
        removeDraftChat(chatId)
        setActiveChatId(response.sessionId)
      }
    } catch (error) {
      if (!abortRef.current) {
        appendMessage(createErrorMessage(error, content?.errorText))
      }
      console.error('Error sending message:', error)
    }
  }, [inputValue, mutation, appendMessage, isDraft, draft, chatId, queryClient, removeDraftChat, setActiveChatId, content?.defaultResponse, content?.errorText])

  const handleStopResponse = useCallback(() => {
    if (!mutation.isPending) return
    abortRef.current = true
    setIsResponseStopped(true)
  }, [mutation.isPending])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <div className="chatbot-container">
      <ChatbotMessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
        relatedLinksLabel={content?.relatedLinksLabel}
        isLoading={mutation.isPending}
      />

      <div className="response-controls">
        {mutation.isPending && <button className="stop-response" type="button" onClick={handleStopResponse}>Stop response</button>}
        {isResponseStopped && <span className="stopped-hint">Response stopped.</span>}
      </div>

      <ChatbotInputArea
        inputValue={inputValue}
        isLoading={mutation.isPending}
        onInputChange={setInputValue}
        onKeyPress={handleKeyPress}
        onSend={handleSend}
        onVoice={() => { /* placeholder voice input */ }}
        isInternetEnabled={isInternetEnabled}
        isPromptMode={isPromptMode}
        onToggleInternet={() => setIsInternetEnabled((v) => !v)}
        onTogglePrompt={() => setIsPromptMode((v) => !v)}
        placeholder={content?.inputPlaceholder}
        sendButtonText={content?.sendButton}
      />
    </div>
  )
}

export default React.memo(Chatbot)
