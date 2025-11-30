import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/TaxCollection.css";

function TaxCollection() {
  const [familyId] = useState("FAM001");
  const [group] = useState("Group A");
  const [members] = useState([
    { name: "Alice", dob: "2000-01-01", tag: "Adult" },
    { name: "Bob", dob: "2010-05-12", tag: "Child" },
    { name: "Carol", dob: "1955-08-20", tag: "Senior" }
  ]);

  const [taxEntry, setTaxEntry] = useState({
    details: "",
    amount: "",
    date: ""
  });
  const [taxRecords, setTaxRecords] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleChange = (e) => {
    setTaxEntry({ ...taxEntry, [e.target.name]: e.target.value });
  };

  const handleAddTax = () => {
    if (taxEntry.details && taxEntry.amount && taxEntry.date) {
      setTaxRecords([...taxRecords, taxEntry]);
      setTaxEntry({ details: "", amount: "", date: "" });
    }
  };

  const handleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemove = () => {
    setTaxRecords(taxRecords.filter((_, i) => !selected.includes(i)));
    setSelected([]);
  };

  const handleFinish = () => {
    alert("Tax records saved. Ready to wire backend.");
  };

  return (
    <motion.div
      className="tax-collection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Tax Collection</h2>

      <div className="header">
        <div className="photo">PHOTO</div>
        <div className="meta">
          <strong>FAMILY_ID:</strong> {familyId}<br />
          <strong>GROUP:</strong> {group}
        </div>
      </div>

      <div className="members">
        <h4>MEMBERS</h4>
        <ul>
          {members.map((m, i) => (
            <li key={i}>
              {i + 1}. {m.name} — {m.dob} — {m.tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="tax-form">
        <input
          name="details"
          placeholder="DETAILS"
          value={taxEntry.details}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          placeholder="AMOUNT"
          value={taxEntry.amount}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          placeholder="DATE"
          value={taxEntry.date}
          onChange={handleChange}
        />
        <button onClick={handleAddTax}>ADD TAX</button>
      </div>

      <div className="tax-table">
        <h4>Tax Records ({taxRecords.length})</h4>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Details</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Receipt</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {taxRecords.map((t, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{t.details}</td>
                <td>{t.amount}</td>
                <td>{t.date}</td>
                <td><a href="#">Download</a></td>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => handleSelect(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button onClick={handleRemove}>REMOVE</button>
        <button onClick={handleFinish}>FINISH</button>
      </div>
    </motion.div>
  );
}

export default TaxCollection;
