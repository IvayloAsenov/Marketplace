import { ADD_TO_CART, REMOVE_ITEM } from "../actions/action-types/cart-actions";

const initState = {
    items: [],
    total: 0,
};

const cartReducer = (state = initState, action) => {
    if (action.type === ADD_TO_CART) {
        const found = state.items.find(item => item.listing_id === action.listing.listing_id);
        if (found) {
            return state;
        }

        return {
            ...state,
            items: [...state.items, action.listing],
            total: state.total + 1,
        }
    }

    if (action.type === REMOVE_ITEM) {
        console.log(action.listing_id);
        const itemsUpdated = state.items.filter((item) => item.listing_id !== action.listing_id);
        console.log(itemsUpdated);
        console.log("adad");
        return {
            ...state,
            items: itemsUpdated,
            total: state.total - 1,
        }
    }

    return state;
};

export default cartReducer;