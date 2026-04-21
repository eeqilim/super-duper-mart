package shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import shopping.dto.*;
import shopping.service.ProductService;
import shopping.service.UserStatsService;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final UserStatsService userStatsService;

    public ProductController(ProductService productService, UserStatsService userStatsService) {
        this.productService = productService;
        this.userStatsService = userStatsService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllInStockProducts(Authentication auth) {
        if (isAdmin(auth)) {
            return ResponseEntity.ok(productService.getAllProductsForAdmin());
        }

        Long userId = extractUserId(auth);
        return ResponseEntity.ok(productService.getAllInStockProducts(userId));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductDetailById(@PathVariable Long productId, Authentication auth) {
        if (isAdmin(auth)) {
            return ResponseEntity.ok(productService.getProductDetailByIdForAdmin(productId));
        }

        return ResponseEntity.ok(productService.getProductDetailById(productId));
    }

    @PatchMapping("/{productId}")
    public ResponseEntity<AdminProductDto> updateProduct(@PathVariable Long productId, @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    @PostMapping
    public ResponseEntity<AdminProductDto> createAProduct(@RequestBody CreateAProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createAProduct(request));
    }


    @GetMapping("/frequent/{x}")
    public ResponseEntity<List<PurchasedProductDto>> getMostFrequentlyPurchasedProduct(@PathVariable int x, Authentication auth) {
        Long userId = Long.valueOf(auth.getName());
        return ResponseEntity.ok(userStatsService.getMostFrequentlyPurchasedProduct(userId, x));
    }


    @GetMapping("/recent/{x}")
    public ResponseEntity<List<PurchasedProductDto>> getMostRecentlyPurchasedProduct(@PathVariable int x, Authentication auth) {
        Long userId = Long.valueOf(auth.getName());
        return ResponseEntity.ok(userStatsService.getMostRecentlyPurchasedProduct(userId, x));
    }

    private Long extractUserId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
