package shopping.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shopping.dao.ProductDao;
import shopping.dto.*;
import shopping.exception.ResourceNotFoundException;
import shopping.entity.Product;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductDao productDao;

    public ProductService(ProductDao productDao) {
        this.productDao = productDao;
    }

    // USER
    @Transactional(readOnly = true)
    public List<ProductDto> getAllInStockProducts(Long userId) {
        return productDao.findAllInStock().stream()
                .map(this::toProductDto)
                .collect(Collectors.toList());
    }

    // USER
    @Transactional(readOnly = true)
    public ProductDto getProductDetailById(Long productId) {
        Product product = productDao.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toProductDto(product);
    }

    // ADMIN
    @Transactional(readOnly = true)
    public List<AdminProductDto> getAllProductsForAdmin() {
        return productDao.findAll().stream()
                .map(this::toAdminProductDto)
                .collect(Collectors.toList());
    }

    // ADMIN
    @Transactional(readOnly = true)
    public AdminProductDto getProductDetailByIdForAdmin(Long productId) {
        Product product = productDao.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return toAdminProductDto(product);
    }

    // ADMIN
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

    // ADMIN
    public AdminProductDto createAProduct(CreateAProductRequest request) {
        Product product = new Product();
        product.setDescription(request.getDescription());
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setRetailPrice(request.getRetailPrice());
        product.setWholesalePrice(request.getWholesalePrice());
        return toAdminProductDto(productDao.save(product));
    }

    // DTO MAPPERS
    private ProductDto toProductDto(Product p) {
        return new ProductDto(p.getProductId(), p.getDescription(), p.getName(), p.getRetailPrice());
    }

    // DTO MAPPERS
    private AdminProductDto toAdminProductDto(Product p) {
        return new AdminProductDto(
                p.getProductId(),
                p.getDescription(),
                p.getName(),
                p.getQuantity(),
                p.getRetailPrice(),
                p.getWholesalePrice()
        );
    }
}
