import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((p) => p.price)
    maxPrice = Math.max(...maxPrice)
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice }
    }
  }
  else if (action.type === SET_GRIDVIEW) {
    return {
      ...state,
      grid_view: true
    }
  }
  else if (action.type === SET_LISTVIEW) {
    return {
      ...state,
      grid_view: false
    }
  }
  else if (action.type === UPDATE_SORT) {
    return {
      ...state,
      sort: action.payload
    }
  }
  else if (action.type === SORT_PRODUCTS) {
    const {
      sort,
      filtered_products } = state

    let tempProducts = [...filtered_products]
    if (sort === 'price-lowest') {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price)
    }
    else if (sort === 'price-highest') {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price)
    }
    else if (sort === 'name-a') {
      tempProducts = tempProducts.sort((a, b) => a.name.localeCompare(b.name))
    }
    else if (sort === 'name-z') {
      tempProducts = tempProducts.sort((a, b) => b.name.localeCompare(a.name))
    }

    return {
      ...state,
      filtered_products: tempProducts
    }
  }
  else if (action.type === UPDATE_FILTERS) {
    const {
      name,
      value } = action.payload
    return {
      ...state,
      filters: { ...state.filters, [name]: value }
    }
  }
  else if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state
    const {
      text,
      category,
      company,
      color,
      price,
      shipping } = state.filters

    let newProducts = [...all_products]

    if (text) {
      newProducts = newProducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text)
      })
    }
    if (category !== 'all') {
      newProducts = newProducts.filter((product) => {
        return product.category === category
      })
    }
    if (company !== 'all') {
      newProducts = newProducts.filter((product) => {
        return product.company === company
      })
    }
    if (color !== 'all') {
      newProducts = newProducts.filter((product) => {
        return product.colors.find(c => c === color)
      })
    }
    if (shipping) {
      newProducts = newProducts.filter((product) => {
        return product.shipping === true
      })
    }
    newProducts = newProducts.filter((product) => {
      return product.price <= price
    })
    return { ...state, filtered_products: newProducts }
  }
  else if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        company: 'all',
        category: 'all',
        color: 'all',
        price: state.filters.max_price,
        shipping: false
      }
    }
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default filter_reducer
