function ExpenseModal({ onClose, onSave }) {
  return (
    <div className="mbg" id="MExp">
      <div className="modal msm">
        <div className="mhd">
          <div>
            <h2 id="MXH">Add Expense</h2>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mbd">
          <div className="fg1">
            <div className="fg">
              <label>Date *</label>
              <input id="exDT" type="date" />
            </div>

            <div className="fg">
              <label>Description *</label>
              <input id="exDS" placeholder="Expense description" />
            </div>

            <div className="fg">
              <label>Category</label>
              <select id="exCA">
                <option>Utilities</option>
                <option>Transport</option>
                <option>Salaries</option>
                <option>Supplies</option>
                <option>Marketing</option>
                <option>Rent</option>
                <option>Equipment</option>
                <option>Other</option>
              </select>
            </div>

            <div className="fg">
              <label>Vendor</label>
              <input id="exVE" placeholder="Vendor name" />
            </div>

            <div className="fg">
              <label>Amount (PKR) *</label>
              <input id="exAM" type="number" placeholder="0" />
            </div>

            <div className="fg">
              <label>Payment Method</label>
              <select id="exPM">
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
                <option>Online</option>
              </select>
            </div>
          </div>

          <input type="hidden" id="exID" />
        </div>

        <div className="mft">
          <button className="btn bgh" onClick={onClose}>
            Cancel
          </button>

          <button className="btn bp" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;