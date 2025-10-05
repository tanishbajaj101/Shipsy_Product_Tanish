// Fixed mapping from product enum/type to image URL
// Replace the placeholder URLs with your actual network image URLs.

const TYPE_TO_IMAGE = {
    Clothing: 'https://cdn-icons-png.flaticon.com/512/6000/6000650.png',
    Electronics: 'https://cdn-icons-png.flaticon.com/512/1555/1555401.png',
    Books: 'https://cdn-icons-png.flaticon.com/512/8832/8832880.png',
    'Home Goods': 'https://cdn-icons-png.flaticon.com/512/4717/4717718.png'
};

export function getProductTypeImage(type) {
    if (!type) return TYPE_TO_IMAGE.Clothing;
    return TYPE_TO_IMAGE[type] || TYPE_TO_IMAGE.Clothing;
}

export default TYPE_TO_IMAGE;


