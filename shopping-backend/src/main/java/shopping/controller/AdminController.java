package shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import shopping.dto.*;
import shopping.service.AdminOrderService;
import shopping.service.AdminStatsService;
import shopping.service.ProductService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ProductService productService;
    private final AdminOrderService adminOrderService;
    private final AdminStatsService adminStatsService;

    public AdminController(ProductService productService, AdminOrderService adminOrderService, AdminStatsService adminStatsService) {
        this.productService = productService;
        this.adminOrderService = adminOrderService;
        this.adminStatsService = adminStatsService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<AdminProductDto>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<AdminProductDto> getProductByIdForAdmin(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductByIdForAdmin(productId));
    }

    @PostMapping("/products")
    public ResponseEntity<AdminProductDto> addProduct(@Valid @RequestBody AddProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(request));
    }

    @PatchMapping("/products/{productId}")
    public ResponseEntity<AdminProductDto> updateProduct(@PathVariable Long productId, @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getOrdersForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(adminOrderService.getOrdersForAdmin(page, size));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminOrderService.getOrderById(orderId));
    }

    @PatchMapping("/orders/{orderId}/complete")
    public ResponseEntity<OrderDto> completeOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminOrderService.completeOrder(orderId));
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminOrderService.cancelOrder(orderId));
    }

    @GetMapping("/stats/total-sold")
    public ResponseEntity<Long> getTotalSoldItems() {
        return ResponseEntity.ok(adminStatsService.getTotalSoldItems());
    }

    @GetMapping("/stats/top-products")
    public ResponseEntity<List<ProductSalesDto>> getTop3SoldProducts() {
        return ResponseEntity.ok(adminStatsService.getTop3SoldProducts());
    }

    @GetMapping("/stats/most-profitable")
    public ResponseEntity<ProductProfitDto> getMostProfitableProduct() {
        return ResponseEntity.ok(adminStatsService.getMostProfitableProduct());
    }
}
