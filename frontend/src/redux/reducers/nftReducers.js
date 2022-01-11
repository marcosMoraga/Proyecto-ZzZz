const initialState = {
    nfts: [],
    nft: {},
    userNfts: []
}

const nftReducers = (state = initialState, action) => {

    switch (action.type) {
        case 'ADD_NFT':
            return {
                ...state,
                nfts: action.payload
            }
        case 'GET_NFTS':
            return {
                ...state,
                nfts: action.payload
            }
        case 'GET_NFT':
            return {
                ...state,
                nft: action.payload
            }
        case 'DELETE_NFT':
            return {
                ...state,
                nfts: state.nfts.filter(nftId => nftId._id !== action.payload)

            }
        case 'UPDATE_NFT':
            return {
                ...state,
                nfts: state.nfts.map(nft => nft._id === action.payload.nftId ? { ...nft, ...action.payload.body } : nft)
            }
        case 'GET_USER_NFTS':
            return {
                ...state,
                userNfts: action.payload
            }
        default:
            return state
    }

}

export default nftReducers