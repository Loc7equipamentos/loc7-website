import { createContext, useContext, useState } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  category: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: CartItem) {
    setItems(prev => [...prev, item])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart precisa estar dentro do CartProvider")
  return context
}
