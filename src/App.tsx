import React, { useRef, useState } from "react";

interface ShoppingItem {
  product: string;
  quantity: number;
  category: string;
}

const categoryPlacement: { [store: string]: { [category: string]: string } } = {
  "Sklep A": {
    "Owoce i Warzywa": "Aleja 1",
    Nabiał: "Aleja 2",
    Piekarnia: "Aleja 3",
    Konserwy: "Aleja 4",
    Mrożonki: "Aleja 5",
    Mięso: "Aleja 6",
    Inne: "Aleja 7",
  },
  "Sklep B": {
    "Owoce i Warzywa": "Sekcja A",
    Inne: "Sekcja B",
    Piekarnia: "Sekcja C",
    Konserwy: "Sekcja D",
    Mrożonki: "Sekcja E",
    Mięso: "Sekcja F",
    Nabiał: "Sekcja G",
  },
  "Sklep C": {
    "Owoce i Warzywa": "Dział 1",
    Nabiał: "Dział 2",
    Piekarnia: "Dział 3",
    Konserwy: "Dział 4",
    Mrożonki: "Dział 5",
    Mięso: "Dział 6",
    Inne: "Dział 7",
  },
};

const possibleItems: { [key: string]: string[] } = {
  "Owoce i Warzywa": ["Jabłka", "Banany", "Marchew", "Pomidory", "Sałata"],
  Nabiał: ["Mleko", "Jajka", "Ser", "Jogurt", "Masło"],
  Piekarnia: ["Chleb", "Bajgle", "Ciastka", "Ciasto", "Muffinki"],
  Konserwy: ["Fasola", "Kukurydza", "Zupa", "Tuńczyk"],
  Mrożonki: ["Pizza", "Lody", "Warzywa", "Kurczak", "Frytki"],
  Mięso: ["Pierś z Kurczaka", "Mięso Mielone", "Kotlety Schabowe", "Łosoś", "Stek"],
  Inne: ["Makaron", "Ryż", "Płatki Śniadaniowe", "Przekąski", "Sos"],
};

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [store, setStore] = useState<string>("Sklep A");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [modalItem, setModalItem] = useState<{
    visible: boolean;
    product: string;
    quantity: number;
    index: number;
  }>({ visible: false, product: "", quantity: 0, index: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const allPossibleItems = Object.values(possibleItems).flat().sort();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProduct(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = allPossibleItems.filter((item) =>
      item.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setProduct(suggestion);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getCategoryFromProduct = (productName: string) => {
    for (const category in possibleItems) {
      if (possibleItems[category].includes(productName)) {
        return category;
      }
    }
    return "Inne";
  };

  const addItem = () => {
    if (product.trim() === "") return;
    const category = getCategoryFromProduct(product);
    setItems([...items, { product, quantity, category }]);
    setProduct("");
    setQuantity(1);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const sortedAndGroupedItems = () => {
    const grouped: { [category: string]: ShoppingItem[] } = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    const sortedCategories = Object.keys(grouped).sort((a, b) =>
      categoryPlacement[store][a].localeCompare(categoryPlacement[store][b])
    );

    return sortedCategories.map((category) => ({
      category,
      items: grouped[category].sort((a, b) => a.product.localeCompare(b.product)),
      placement: categoryPlacement[store][category],
    }));
  };

  return (
    <div className="p-10 min-h-screen bg-mainMidium">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-main">Lista Zakupów</h1>
        <select
          id="store"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className="w-full border rounded-md p-3 border-gray-300"
        >
          {Object.keys(categoryPlacement).map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
        {/* <div className="flex gap-4">
          <button className="bg-error">test</button>
          <button className="bg-warning">test</button>
          <button className="bg-info">test</button> 
          <button className="bg-main">test</button>
          <button className="bg-mainMidium">test</button>
          <button className="bg-mainLight">test</button>
          <button className="bg-gray1">test</button>
          <button className="bg-gray2">test</button>
          <button className="bg-gray3">test</button>
          <button className="bg-gray4">test</button>
          <button className="bg-gray5">test</button>
        </div> */}
        <div className="flex space-x-2 my-4">
          <div className="relative flex-1">
            <input
              type="text"
              ref={inputRef}
              value={product}
              onChange={handleInputChange}
              onClick={() => setSuggestions(allPossibleItems)}
              placeholder="Wpisz produkt"
              className="w-full border rounded-md p-3 border-gray-300"
            />
            {suggestions.length > 0 && (
              <ul
                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md border-gray-300 max-h-[50svh] overflow-y-auto"
                onBlur={() => setSuggestions([])}
                tabIndex={0}
              >
                {Object.keys(possibleItems).map((category) => {
                  const categorySuggestions = suggestions.filter((suggestion) =>
                    possibleItems[category].includes(suggestion)
                  );
                  if (categorySuggestions.length === 0) return null;

                  return (
                    <li key={category} className="px-3">
                      <div className="font-semibold text-gray-700">{category}</div>
                      <ul>
                        {categorySuggestions.map((suggestion) => (
                          <li
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 cursor-pointer hover:bg-gray-100"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 border rounded-md p-3 border-gray-300"
          />

          <button
            onClick={addItem}
            className="bg-main text-white font-bold py-3 px-6 rounded-md hover:bg-mainMidium transition-colors duration-300"
          >
            Dodaj
          </button>
        </div>

        <div>
          {sortedAndGroupedItems().map((group) => (
            <div key={group.category} className="mb-4">
              <h2 className="text-lg font-semibold mb-2 text-main">
                {group.category} ({group.placement})
              </h2>
              <ul>
                {group.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span
                      onClick={() => {
                        const originalIndex = items.findIndex(
                          (originalItem) =>
                            originalItem.product === item.product &&
                            originalItem.quantity === item.quantity &&
                            originalItem.category === group.category
                        );
                        setModalItem({
                          visible: true,
                          product: item.product,
                          quantity: item.quantity,
                          index: originalIndex,
                        });
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      {item.product} ({item.quantity})
                    </span>

                    {/* Modal */}
                    {modalItem.visible && (
                      <div
                        id="quantityModal"
                        className="fixed inset-0 flex items-center justify-center bg-gray5 bg-opacity-30"
                      >
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h2 className="text-lg font-semibold mb-4">
                            Zmień ilość dla <span id="modalProductLabel">{modalItem.product}</span>:
                          </h2>
                          <input
                            id="modalQuantityInput"
                            type="number"
                            value={modalItem.quantity}
                            onChange={(e) =>
                              setModalItem({
                                ...modalItem,
                                quantity: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full border rounded-md p-3 border-gray-300 mb-4"
                          />
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => {
                                setModalItem({ ...modalItem, visible: false });
                              }}
                              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400"
                            >
                              Anuluj
                            </button>
                            <button
                              onClick={() => {
                                const newQuantity = modalItem.quantity;
                                if (
                                  !isNaN(newQuantity) &&
                                  modalItem.index >= 0 &&
                                  modalItem.index < items.length
                                ) {
                                  const updatedItems = [...items];
                                  updatedItems[modalItem.index].quantity = newQuantity;
                                  setItems(updatedItems);
                                }
                                setModalItem({ ...modalItem, visible: false });
                              }}
                              className="bg-main text-white font-bold py-2 px-4 rounded-md hover:bg-mainMidium"
                            >
                              Zapisz
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const originalIndex = items.findIndex(
                          (originalItem) =>
                            originalItem.product === item.product &&
                            originalItem.quantity === item.quantity &&
                            originalItem.category === group.category
                        );
                        removeItem(originalIndex);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
