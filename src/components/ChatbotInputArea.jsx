import React from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import './Chatbot.scss'

function ChatbotInputArea({
  inputValue,
  isLoading,
  onInputChange,
  onKeyPress,
  onSend,
  onVoice,
  isInternetEnabled,
  isPromptMode,
  onToggleInternet,
  onTogglePrompt,
  placeholder,
  sendButtonText
}) {
  return (
    <>
      <div className="input-container">
        <div className="input-left">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
          />
          <button type="button" className="mic-btn" title="Voice input" onClick={onVoice}>🎙</button>
        </div>

        <div className="toggles">
          <button type="button" className={`toggle-tab ${isInternetEnabled ? 'active' : ''}`} onClick={onToggleInternet}>Internet</button>
          <button type="button" className={`toggle-tab ${isPromptMode ? 'active' : ''}`} onClick={onTogglePrompt}>Prompts</button>
        </div>

        <Button
          onClick={onSend}
          disabled={isLoading || !inputValue.trim()}
          variant="primary"
          size="md"
        >
          {sendButtonText}
        </Button>
      </div>
    </>
  )
}

export default React.memo(ChatbotInputArea)
