import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCartItems(prevItems => {
      const variantId = selectedVariant?._id || selectedVariant?.id || null
      const existingItem = prevItems.find(item => item._id === product._id && String(item.variantId || '') === String(variantId || ''))
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item._id === product._id && String(item.variantId || '') === String(variantId || '')
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item to cart
        return [...prevItems, {
          cartItemId: `${product._id}:${variantId || 'default'}`,
          _id: product._id,
          name: product.name,
          image: product.images?.[0] || '/assets/img/products/product.jpg',
          quantity,
          sku: product.sku,
          stock: selectedVariant?.stock ?? product.stock,
          variantId,
          variantName: selectedVariant?.name || null,
          variantSnapshot: selectedVariant ? {
            strengthValue: selectedVariant.strengthValue ?? null,
            strengthUnit: selectedVariant.strengthUnit ?? null,
            dosageForm: selectedVariant.dosageForm ?? null,
            packageType: selectedVariant.packageType ?? null,
            unitsPerPack: selectedVariant.unitsPerPack ?? null,
            unitLabel: selectedVariant.unitLabel ?? null,
          } : null,
          sellerId: product.sellerId?._id || product.sellerId || null,
          price: selectedVariant?.discountPrice ?? selectedVariant?.price ?? product.discountPrice ?? product.price,
          originalPrice: selectedVariant?.price ?? product.price,
        }]
      }
    })
  }

  const removeFromCart = (productId, variantId = undefined) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId || (variantId !== undefined && String(item.variantId || '') !== String(variantId || ''))))
  }

  const updateQuantity = (productId, quantity, variantId = undefined) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId && (variantId === undefined || String(item.variantId || '') === String(variantId || '')) ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (productId, variantId = undefined) => {
    return cartItems.some(item => item._id === productId && (variantId === undefined || String(item.variantId || '') === String(variantId || '')))
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

