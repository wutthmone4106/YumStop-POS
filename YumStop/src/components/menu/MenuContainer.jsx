import React, { useState } from 'react'
import { GrRadialSelected } from 'react-icons/gr'
import { FaShoppingCart } from 'react-icons/fa' 
import { useDispatch, useSelector } from 'react-redux' 
import { addItems } from '../../redux/slices/cartSlice'
import { useQuery } from '@tanstack/react-query'
import { getMenus } from '../../https'

const CATEGORY_THEMES = {
    "burgers":             { emoji: "🍔", bgColor: "#f6b100", order: 1 }, 
    "wraps & quick bites": { emoji: "🌯", bgColor: "#73e65b", order: 2 }, 
    "wraps and quick bites": { emoji: "🌯", bgColor: "#73e65b", order: 2 },
    "wrap and quick bites":  { emoji: "🌯", bgColor: "#73e65b", order: 2 },
    "chicken":             { emoji: "🍗", bgColor: "#ff782e", order: 3 }, 
    "fries & sides":       { emoji: "🍟", bgColor: "#ff5e5e", order: 4 }, 
    "pizza":               { emoji: "🍕", bgColor: "#ff6b4a", order: 5 }, 
    "sandwiches":          { emoji: "🥪", bgColor: "#cca26a", order: 6 }, 
    "drinks":              { emoji: "🥤", bgColor: "#2d81f7", order: 7 }, 
    "desserts":            { emoji: "🍦", bgColor: "#b57fff", order: 8 }, 
    "breakfast":               { emoji: "🍳", bgColor: "#ffc83b", order: 9 },  
    "pasta":                   { emoji: "🍝", bgColor: "#e04f5f", order: 10 }, 
    "rice bowls":              { emoji: "🍚", bgColor: "#4adbb4", order: 11 }, 
    "coffee & hot drinks":     { emoji: "☕", bgColor: "#a1704a", order: 12 }, 
    "coffee and hot drinks":   { emoji: "☕", bgColor: "#a1704a", order: 12 }, 
};

const DEFAULT_THEME = { emoji: "📁", bgColor: "#2a2a2a", order: 99 };

const MenuContainer = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [cartCounts, setCartCounts] = useState({});
    const dispatch = useDispatch();

    // Pull the live search query from your Redux search slice
    const searchQuery = useSelector((state) => state.search?.query || '');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['menu-items'],
        queryFn: getMenus,
    });

    if (isLoading) return <p className="text-white p-10 text-sm">Loading food array details...</p>;
    if (isError) return <p className="text-red-400 p-10 text-sm">Error connecting to item database tier.</p>;

    const dbItems = data?.data?.data || [];

    // Categories
    const categoryGroupMap = dbItems.reduce((acc, item) => {
        const catName = item.category?.name || "Uncategorized";
        if (!acc[catName]) {
            acc[catName] = [];
        }
        acc[catName].push(item);
        return acc;
    }, {});

    const dynamicCategories = Object.keys(categoryGroupMap).map((catName, index) => {
        const standardizedKey = catName.toLowerCase().trim();
        const theme = CATEGORY_THEMES[standardizedKey] || DEFAULT_THEME;
        
        return {
            id: `cat-${index}`,
            name: catName, 
            items: categoryGroupMap[catName],
            emoji: theme.emoji,
            bgColor: theme.bgColor,
            order: theme.order
        };
    }).sort((a, b) => a.order - b.order);

    const currentActiveCategory = dynamicCategories.find(c => c.name === selectedCategory) || dynamicCategories[0];
    const activeCategoryName = currentActiveCategory ? currentActiveCategory.name : "";

    // Search Filter Logic
    const filteredItems = dbItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (searchQuery.trim() !== "") {
            return matchesSearch; // Global match across all categories
        } else {
            return matchesSearch && (item.category?.name === activeCategoryName); // Standard active category tab fallback
        }
    });

    const increment = (id) => {
      setCartCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decrement = (id) => {
      setCartCounts(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
    };

    const handleAddToCart = (item, quantity, itemKey) => {
        if (quantity === 0) return alert("Please select a quantity using the counter first!");
        const { name, price } = item;
        const numericPrice = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, ''), 10) : price;

        const newObj = { 
          id: item._id || new Date().getTime(), 
          name, 
          pricePerQuantity: numericPrice, 
          quantity: quantity, 
          price: numericPrice * quantity 
        };
        dispatch(addItems(newObj));
        setCartCounts(prev => ({ ...prev, [itemKey]: 0 }));
    };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111111;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #333333 #111111;
        }
        
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className={`overflow-x-auto custom-scrollbar px-10 py-4 flex-shrink-0 w-full transition-opacity duration-200 ${searchQuery.trim() !== "" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
        <div className="grid grid-rows-2 grid-flow-col gap-4 auto-cols-[calc(25%-0.75rem)] min-w-full">
          {
              dynamicCategories.map((menu) => {
                  return (
                      <div 
                          key={menu.id} 
                          className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer select-none" 
                          style={{ backgroundColor : menu.bgColor }} 
                          onClick={() => { setSelectedCategory(menu.name); }}
                      >
                          <div className="flex items-center justify-between w-full">
                              <h1 className="text-[#f5f5f5] text-lg font-semibold flex items-center gap-2 select-none truncate pr-2">
                                <span>{menu.emoji}</span> {menu.name}
                              </h1>
                              {activeCategoryName === menu.name && <GrRadialSelected className="text-white flex-shrink-0" size={20} />}
                          </div>
                          <p className="text-[#f5f5f5] text-sm font-semibold select-none">{menu.items.length} Items</p>
                      </div>
                  )
              })
          }
        </div>
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-2 flex-shrink-0" />

      {/* FOOD ITEMS: Filtered dynamically */}
      <div className="flex-1 overflow-y-auto hide-scroll px-10 py-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <p className="text-neutral-500 text-lg">No menu items found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 w-full pb-10">
              {filteredItems.map((item) => {
                const itemKey = `item-${item._id}`;
                const currentCount = cartCounts[itemKey] || 0;
                const imageURL = item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_BASE_URL}/${item.image}`;

                return (
                  <div key={item._id} className="flex flex-col justify-between p-4 rounded-xl h-[160px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a] transition-all border border-transparent hover:border-[#333]">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                        <img src={imageURL} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h1 className="text-[#f5f5f5] text-lg font-semibold leading-tight line-clamp-2">{item.name}</h1>
                        {/* Display a small label badge telling the cashier what category this belongs to when running a global search */}
                        {searchQuery.trim() !== "" && (
                          <span className="text-xs text-neutral-400 font-medium mt-0.5 truncate">{item.category?.name}</span>
                        )}
                      </div>
                    </div>
                
                    <div className="flex justify-between items-center w-full mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleAddToCart(item, currentCount, itemKey)} className="p-1 rounded-md hover:bg-[#333] active:scale-95 transition-all">
                          <FaShoppingCart size={18} className={currentCount > 0 ? "text-[#f6b100]" : "text-[#555]"} />
                        </button>
                        <p className="text-[#f5f5f5] text-lg font-bold whitespace-nowrap">
                          {Number(item.price).toLocaleString()} MMK
                        </p>
                      </div>
                      
                      <div className="flex items-center bg-[#262626] px-3 py-1.5 rounded-lg gap-4 shadow-inner">
                        <button onClick={() => decrement(itemKey)} className="text-[#f6b100] text-xl font-bold hover:scale-110 active:opacity-50">&minus;</button>
                        <span className="text-white font-semibold min-w-[20px] text-center">{currentCount}</span>
                        <button onClick={() => increment(itemKey)} className="text-[#f6b100] text-xl font-bold hover:scale-110 active:opacity-50">&#43;</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>
    </div>
  )
}

export default MenuContainer
