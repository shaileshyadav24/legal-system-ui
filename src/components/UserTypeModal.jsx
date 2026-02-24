import './UserTypeModal.scss'

function UserTypeModal({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Legal System Chatbot</h2>
        <p>What type of user are you?</p>
        <div className="button-group">
          <button 
            className="user-type-button lawyer"
            onClick={() => onSelect('Lawyer')}
          >
            Lawyer
          </button>
          <button 
            className="user-type-button layman"
            onClick={() => onSelect('Layman')}
          >
            Layman
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTypeModal
