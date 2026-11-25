function OrderDetailsModal({ onClose }) {
  return (
    <div className="mbg" id="MOrdDtl">
      <div className="modal mlg">
        <div className="mhd">
          <div>
            <h2 id="ODTH">Order Details</h2>
            <p id="ODTS"></p>
          </div>

          <button className="mcl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mbd" id="ODTB"></div>

        <div className="mft" id="ODTF"></div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;