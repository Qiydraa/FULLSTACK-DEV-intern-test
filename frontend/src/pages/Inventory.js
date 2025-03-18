import { useState, useEffect } from "react";

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });

    useEffect(() => {
        const fetchInventory = async () => {
            const token = localStorage.getItem("token");
            console.log("Token saat fetch:", token); 

            const response = await fetch("http://localhost:5000/inventory", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("Gagal mengambil data inventory");
                return;
            }

            const data = await response.json();
            setItems(data);
        };

        fetchInventory();
    }, []);

    
    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

   
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            console.log("Token saat tambah barang:", token); 

            const response = await fetch("http://localhost:5000/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error("Gagal menambahkan barang");
            }

            const data = await response.json();
            alert(data.message);
            window.location.reload(); 
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Yakin ingin menghapus barang ini?")) return;

        try {
            const token = localStorage.getItem("token");
            console.log("Token saat hapus barang:", token); 
            console.log("Menghapus barang dengan ID:", id); 

            const response = await fetch(`http://localhost:5000/inventory/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response status:", response.status); 

            if (!response.ok) {
                throw new Error("Gagal menghapus barang");
            }

            const data = await response.json();
            alert(data.message);
            window.location.reload(); 
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Inventory</h2>

            {/* Form Tambah Barang */}
            <form onSubmit={handleAddItem} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-bold mb-2">Tambah Barang</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Nama Barang"
                    value={newItem.name}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Jumlah"
                    value={newItem.quantity}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={newItem.price}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Tambah Barang
                </button>
            </form>

            {/* Tabel Inventory */}
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Jumlah</th>
                        <th className="border p-2">Harga</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="border">
                            <td className="border p-2">{item.id}</td>
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.quantity}</td>
                            <td className="border p-2">Rp{item.price}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
