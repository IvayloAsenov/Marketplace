import { ADD_TO_CART, REMOVE_ITEM } from './action-types/cart-actions';

export const addToCart = (listing) => {
    return {
        type: ADD_TO_CART,
        listing
    }
};

export const removeFromCart = (listing_id) => {
    return {
        type: REMOVE_ITEM,
        listing_id
    }
};
