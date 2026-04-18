package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.ProductDao;
import shopping.dto.AddProductRequest;
import shopping.dto.AdminProductDto;
import shopping.dto.ProductDto;
import shopping.dto.UpdateProductRequest;
import shopping.exception.ResourceNotFoundException;
import shopping.model.Product;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductDao productDao;

    public ProductService(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllInStockProducts() {
        return productDao.findAllInStock().stream()
                .map(this::toProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long productId) {
        Product product = productDao.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toProductDto(product);
    }

    @Transactional(readOnly = true)
    public List<AdminProductDto> getAllProductsForAdmin() {
        return productDao.findAll().stream()
                .map(this::toAdminProductDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminProductDto getProductByIdForAdmin(Long productId) {
        Product product = productDao.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return toAdminProductDto(product);
    }

    public AdminProductDto addProduct(AddProductRequest request) {
        Product product = new Product();
        product.setDescription(request.getDescription());
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setRetailPrice(request.getRetailPrice());
        product.setWholesalePrice(request.getWholesalePrice());
        return toAdminProductDto(productDao.save(product));
    }

    public AdminProductDto updateProduct(Long id, UpdateProductRequest request) {
        Product product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getName() != null) product.setName(request.getName());
        if (request.getQuantity() != null) product.setQuantity(request.getQuantity());
        if (request.getRetailPrice() != null) product.setRetailPrice(request.getRetailPrice());
        if (request.getWholesalePrice() != null) product.setWholesalePrice(request.getWholesalePrice());

        return toAdminProductDto(productDao.save(product));
    }

    private ProductDto toProductDto(Product p) {
        return new ProductDto(p.getProductId(), p.getDescription(), p.getName(), p.getRetailPrice());
    }

    private AdminProductDto toAdminProductDto(Product p) {
        return new AdminProductDto(p.getProductId(), p.getDescription(), p.getName(), p.getQuantity(), p.getRetailPrice(), p.getWholesalePrice());
    }
}
