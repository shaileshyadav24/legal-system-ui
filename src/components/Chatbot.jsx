import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage, updateChat } from '../store/slices/chatsSlice'
import ChatbotMessageList from './ChatbotMessageList'
import ChatbotInputArea from './ChatbotInputArea'
import { createUserMessage, createBotMessage, createErrorMessage, buildChatHistory, queryAI } from '../services/chatbotService'
import './Chatbot.scss'

function Chatbot({ userType, chatId, chat, content }) {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResponseStopped, setIsResponseStopped] = useState(false)
  const [isInternetEnabled, setIsInternetEnabled] = useState(true)
  const [isPromptMode, setIsPromptMode] = useState(false)
  const [editableTitle, setEditableTitle] = useState('')
  const messagesEndRef = useRef(null)
  const abortRef = useRef(false)

  const messages = useMemo(() => (chat?.messages || []), [chat])

  const history = useMemo(() => buildChatHistory(messages), [messages])

  useEffect(() => {
    setEditableTitle(chat?.title || content?.newChatTitle || content?.headerTitle)
  }, [chat?.title, content?.newChatTitle, content?.headerTitle])

  useEffect(() => {
    setIsResponseStopped(false)
  }, [chatId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    abortRef.current = false
    setIsResponseStopped(false)

    dispatch(addMessage({ chatId, message: createUserMessage(inputValue) }))
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await queryAI(inputValue, userType, history)
      if (!abortRef.current) {
        dispatch(addMessage({ chatId, message: createBotMessage(response, content?.defaultResponse) }))
      }
    } catch (error) {
      if (!abortRef.current) {
        dispatch(addMessage({ chatId, message: createErrorMessage(content?.errorText) }))
      }
      console.error('Error sending message:', error)
    } finally {
      if (!abortRef.current) {
        setIsLoading(false)
      }
    }
  }, [inputValue, isLoading, dispatch, chatId, userType, history, content?.defaultResponse, content?.errorText])

  const handleStopResponse = useCallback(() => {
    if (!isLoading) return
    abortRef.current = true
    setIsResponseStopped(true)
    setIsLoading(false)
  }, [isLoading])

  const handleTitleSave = useCallback(() => {
    if (!chat?.id) return
    dispatch(updateChat({ chatId: chat.id, updates: { title: editableTitle } }))
  }, [chat?.id, editableTitle, dispatch])

  const handleTogglePin = useCallback(() => {
    if (!chat?.id) return
    dispatch(updateChat({ chatId: chat.id, updates: { isPinned: !chat.isPinned } }))
  }, [chat?.id, chat?.isPinned, dispatch])

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
        isLoading={isLoading}
      />

      <div className="response-controls">
        {isLoading && <button className="stop-response" type="button" onClick={handleStopResponse}>Stop response</button>}
        {isResponseStopped && <span className="stopped-hint">Response stopped.</span>}
      </div>

      <ChatbotInputArea
        inputValue={inputValue}
        isLoading={isLoading}
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

