export interface Product {
    productId: number;
    description: string;
    name: string;
    retailPrice: number;
}

export interface AdminProduct {
    productId: number;
    description: string;
    productName: string;
    quantity: number;
    retailPrice: number;
    wholesalePrice: number;
}

export interface CreateProductRequest {
    description: string;
    name: string;
    quantity: number;
    retailPrice: number;
    wholesalePrice: number;
}

export interface UpdateProductRequest {
    description?: string;
    name?: string;
    quantity?: number;
    retailPrice?: number;
    wholesalePrice?: number;
}
