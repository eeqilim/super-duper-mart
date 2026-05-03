export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    retailPrice: number;
    wholesalePrice?: number;
}